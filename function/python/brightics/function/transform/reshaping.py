import pandas as pd
import numpy as np
from brightics.common.groupby import _function_by_group
from brightics.function.validation import raise_runtime_error
from brightics.common.utils import check_required_parameters


def unpivot(table, group_by=None, **params):
    check_required_parameters(_unpivot, params, ['table'])
    if group_by is not None:
        return _function_by_group(_unpivot, table, group_by=group_by, **params)
    else:
        return _unpivot(table, **params)


def _unpivot(table, value_vars, var_name=None, value_name='value', col_level=None):
    id_vars = [column for column in table.columns if column not in value_vars]
    out_table = pd.melt(table, id_vars=id_vars, value_vars=value_vars, var_name=var_name, value_name=value_name, col_level=col_level)
    return {'out_table': out_table}


def pivot(table, group_by=None, **params):
    check_required_parameters(_pivot, params, ['table'])
    if group_by is not None:
        return _function_by_group(_pivot, table, group_by=group_by, **params)
    else:
        return _pivot(table, **params)

    
def _pivot(table, values, aggfunc, index=None, columns=None):  # TODO

    if index is None and columns is None:
        # TODO: assign an error code.
        raise_runtime_error('Group key value is required: Index or Columns.')

    def count(x): return len(x)

    def mean(x): return np.mean(x)

    def std(x): return np.std(x)

    def var(x): return np.var(x)

    def min(x): return np.min(x)

    def _25th(x): return np.percentile(x, 0.25)

    def median(x): return np.median(x)

    def _75th(x): return np.percentile(x, 0.75)

    def max(x): return np.max(x)

    def sum(x): return np.sum(x)
    
    def _mi2index(mi):
        return pd.Index([_replace_col(col) for col in mi.get_values()])
    
    def _replace_col(tup):
        col = '__'.join(str(elem) for elem in tup)
        
        for char in ' ,;{}()\n\t=':
            col.replace(char, '')
            
        return col
    
    func_list = []
    for func_name in aggfunc:
        if func_name == 'count':
            func_list.append(count)
        elif func_name == 'mean':
            func_list.append(mean)
        elif func_name == 'std':
            func_list.append(std)
        elif func_name == 'var':
            func_list.append(var)
        elif func_name == 'min':
            func_list.append(min)
        elif func_name == '_25th':
            func_list.append(_25th)
        elif func_name == 'median':
            func_list.append(median)
        elif func_name == '_75th':
            func_list.append(_75th)
        elif func_name == 'max':
            func_list.append(max)
        elif func_name == 'sum':
            func_list.append(sum) 
    
    pivoted = pd.pivot_table(table, values=values, index=index, columns=columns, aggfunc=func_list, fill_value=None, margins=False, margins_name='All')
    pivoted.columns = _mi2index(pivoted.columns)
    out_table = pd.concat([pivoted.index.to_frame(), pivoted], axis=1)
    return {'out_table':out_table}


def transpose(table, group_by=None, **params):
    check_required_parameters(_transpose, params, ['table'])
    if group_by is not None:
        return _function_by_group(_transpose, table, group_by=group_by, **params)
    else:
        return _transpose(table, **params)


def _transpose(table, columns, label_col=None, label_col_name='label'):

    sort_table = pd.DataFrame()
    feature_col_name = []
    
    for i in range(0, len(table.transpose())):
        if table.columns[i] in columns:
            sort_table[table.columns[i]] = table[table.columns[i]]
            feature_col_name.append(table.columns[i])

    out_table = sort_table.transpose()

    if label_col is None:
        for i in range(0, len(table)):
            out_table = out_table.rename(columns={len(table) - i - 1:'x' + str(len(table) - i)})
    else:
        for i in range(0, len(table)):
            out_table = out_table.rename(columns={i:str(table[label_col][i])})

    out_table.insert(loc=0, column=label_col_name, value=feature_col_name)

    return{'out_table':out_table}


def distinct(table, group_by=None, **params):
    check_required_parameters(_distinct, params, ['table'])
    if group_by is not None:
        return _function_by_group(_distinct, table, group_by=group_by, **params)
    else:
        return _distinct(table, **params)

        
def _distinct(table, input_cols):
    out_table = table.drop_duplicates(input_cols)
    return {'out_table': out_table}
