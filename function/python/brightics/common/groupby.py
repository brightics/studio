import pandas as pd
from abc import *
from brightics.common.repr import BrtcReprBuilder, strip_margin

# assuming that function takes table, model, params
def _function_by_group(function, table, model=None, group_by=None, **params):
    if isinstance(table, pd.DataFrame) and group_by is not None:
        table, group_keys = _group(table, group_by)
    else:
        group_keys = table['_grouped_data'].keys()
   
    sample_group = group_keys[0]
    if model is None:
        sample_result = function(table=table['_grouped_data'][sample_group], **params)
    else:
        sample_result = function(table=table['_grouped_data'][sample_group],
                                  model=model['_grouped_data'][sample_group], **params)
    res_keys = sample_result.keys()
    df_keys = [k for k, v in sample_result.items() if isinstance(v, pd.DataFrame)]
    model_keys_containing_repr = [k for k, v in sample_result.items() if isinstance(v, dict) and '_repr_brtc_' in v]
    
    res_dict = dict()
    for res_key in res_keys:
        res_dict[res_key] = {'_grouped_data':dict()}
        
    for group in group_keys:
        if model is None:
            res_group = function(table=table['_grouped_data'][group], **params)
        else:
            res_group = function(table=table['_grouped_data'][group],
                                        model=model['_grouped_data'][group], **params)
        
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
    
    res_dict = {'_grouped_data':dict()}
    for group in group_keys:
        data = table[groups == group]
        data.index = range(len(data))
        res_dict['_grouped_data'][group] = data
    
    return res_dict, group_keys

def _flatten(grouped_table):
    return pd.concat([v for k, v in grouped_table['_grouped_data'].items() if v is not None], ignore_index=True)
