import pandas as pd
from brightics.common.repr import BrtcReprBuilder


def _function_by_group(function, table, model=None, group_by=None, **params):
    if table is not None:
        if isinstance(table, pd.DataFrame) and group_by is not None:  # table and group_by
            table, group_keys = _group(table, group_by)
        elif isinstance(table, dict) and '_grouped_data' in table:  # grouped_data
            group_keys = [*table['_grouped_data']]
            group_by = table['_group_by']
        
        elif isinstance(table, pd.DataFrame) and group_by is None:
            raise Exception('This function requires group_by')
        else:
            raise Exception('Unknown type.')
    elif model is not None:
        if isinstance(model, dict) and '_grouped_data' in model:
            group_keys = [*model['_grouped_data']]
            group_by = model['_group_by']
    else:
        raise Exception('This function requires a table or a model as an input.')
   
    sample_group = group_keys[0]
    if table is not None and model is None:
        sample_result = function(table=table['_grouped_data'][sample_group], **params)
    elif table is not None and model is not None:
        sample_result = function(table=table['_grouped_data'][sample_group],
                                  model=model['_grouped_data'][sample_group], **params)
    else:
        sample_result = function(model=model['_grouped_data'][sample_group], **params)
        
    res_keys = [*sample_result]
    df_keys = [k for k, v in sample_result.items() if isinstance(v, pd.DataFrame)]
    model_keys_containing_repr = [k for k, v in sample_result.items() if isinstance(v, dict) and '_repr_brtc_' in v]
    
    res_dict = dict()
    for res_key in res_keys:
        res_dict[res_key] = {'_grouped_data':dict(), '_group_by':group_by}
        
    for group in group_keys:
        if table is not None and model is None:
            res_group = function(table=table['_grouped_data'][group], **params)
        elif table is not None and model is not None:
            res_group = function(table=table['_grouped_data'][group],
                                        model=model['_grouped_data'][group], **params)
        else:
            res_group = function(model=model['_grouped_data'][group], **params)
        
        for res_key in res_keys:
            res_dict[res_key]['_grouped_data'][group] = res_group[res_key]
    
    for repr_key in model_keys_containing_repr:
        rb = BrtcReprBuilder()
        for group in group_keys:
            rb.addMD('{group}'.format(group=group))
            rb.merge(res_dict[repr_key]['_grouped_data'][group]['_repr_brtc_'])
        res_dict[repr_key]['_repr_brtc_'] = rb.get()    
            
    for df_key in df_keys:
        res_dict[df_key] = _flatten(res_dict[df_key])
    
    return res_dict


def _group(table, group_by):
    groups = table[group_by].apply(lambda x: '__'.join([str(item) for item in x]), axis=1)
    group_keys = groups.unique()
    
    res_dict = {'_grouped_data':dict(), '_group_by':group_by}  # column?
    for group in group_keys:
        data = table[groups == group]
        data.index = range(len(data))
        res_dict['_grouped_data'][group] = data
    
    return res_dict, group_keys


def _add_group_cols_front_if_required(table, keys, group_cols):
    out_table = table.copy()
    
    reverse_keys = keys.split('__')
    reverse_keys.reverse()
    columns = table.columns
    reverse_group_cols = group_cols.copy()
    reverse_group_cols.reverse()
    
    for group_col, key in zip(reverse_group_cols, reverse_keys):
        if group_col not in columns:
            out_table.insert(0, group_col, key)

    return out_table


def _flatten(grouped_table):
    group_cols = grouped_table['_group_by']
    return pd.concat([_add_group_cols_front_if_required(v, k, group_cols) for k, v in grouped_table['_grouped_data'].items() if v is not None], ignore_index=True, sort=False)
