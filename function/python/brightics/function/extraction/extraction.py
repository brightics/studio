from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, dict2MD, \
    pandasDF2MD, keyValues2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

import pandas as pd
import numpy as np


def add_row_number(table, group_by=None, **params):
    check_required_parameters(_add_row_number, params, ['table'])
    if group_by is not None:
        return _function_by_group(_add_row_number, table, group_by=group_by, **params)
    else:
        return _add_row_number(table, **params)

        
def _add_row_number(table, new_col='add_row_number'):

    df = pd.DataFrame()
    n = len(table)

    for i in range(1, n + 1):
        df2 = pd.DataFrame([{new_col:i}])
        df = df.append(df2, ignore_index=True)
    out_table = pd.concat([df, table], axis=1)
    return {'out_table': out_table}


def discretize_quantile(table, group_by=None, **params):
    check_required_parameters(_discretize_quantile, params, ['table'])
    if group_by is not None:
        return _function_by_group(_discretize_quantile, table, group_by=group_by, **params)
    else:
        return _discretize_quantile(table, **params)

        
def _discretize_quantile(table, input_col, num_of_buckets=2, out_col_name='bucket_number'):
    out_table = table.copy()
    out_table[out_col_name], buckets = pd.qcut(table[input_col], num_of_buckets, labels=False, retbins=True, precision=10, duplicates='drop')    
            
    # Build model
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    ## Quantile-based Discretization Result
    """))
    
    # index_list, bucket_list
    index_list = []
    bucket_list = []     
    for i, bucket in enumerate(buckets):
        if i == 1:
            index_list.append(i - 1)
            bucket_list.append("[{left}, {bucket}]".format(left=left, bucket=bucket))
        elif i > 1:
            index_list.append(i - 1)
            bucket_list.append("({left}, {bucket}]".format(left=left, bucket=bucket))
        left = bucket
        
    # cnt_array
    cnt = np.zeros(len(index_list), int)
    for i in range(len(table)):
            cnt[out_table[out_col_name][i]] += 1
   
    # Build model
    result = dict()
    result_table = pd.DataFrame.from_items([ 
        ['bucket number', index_list],
        ['buckets', bucket_list],
        ['count', cnt]
    ])
    result['result_table'] = result_table
    rb.addMD(strip_margin("""
    ### Data = {input_col}
    |
    | {result_table}
    """.format(input_col=input_col, n=num_of_buckets, result_table=pandasDF2MD(result_table))))
    result['_repr_brtc_'] = rb.get()
    
    return {'out_table': out_table, 'model': result}


def binarizer(table, column, threshold=0, threshold_type='greater', out_col_name=None):
    out_table = table.copy()
    if out_col_name is None:
        out_col_name = 'binarized_' + str(column)
    
    if threshold_type == 'greater':
        out_table[out_col_name] = np.where(table[column] > threshold, 1, 0)
    else:
        out_table[out_col_name] = np.where(table[column] >= threshold, 1, 0)
    return{'out_table':out_table}


def capitalize_variable(table, input_cols, replace, out_col_suffix=None):
    if out_col_suffix is None:
        out_col_suffix = '_' + replace
     
    out_table = table
    for input_col in input_cols: 
        out_col_name = input_col + out_col_suffix
        out_col = pd.DataFrame(columns=[out_col_name])
    
        if replace == 'upper':
            out_col[out_col_name] = table[input_col].str.upper()
        else:
            out_col[out_col_name] = table[input_col].str.lower()
    
        out_table = pd.concat([out_table, out_col], axis=1)
    return {'out_table': out_table}
