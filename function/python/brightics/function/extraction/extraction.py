import pandas as pd
import numpy as np


def add_row_number(table, new_col='add_row_number'):

    df = pd.DataFrame()
    n = len(table)

    for i in range(1, n + 1):
        df2 = pd.DataFrame([{new_col:i}])
        df = df.append(df2, ignore_index=True)
    out_table = pd.concat([df, table], axis=1)
    return {'out_table': out_table}


def discretize_quantile(table, input_col, bucket_opt, num_of_buckets=2, out_col_name='bucket_number'):
    
    out_col = pd.DataFrame()
    if bucket_opt == 'False':
        out_col[out_col_name] = (num_of_buckets - 1) - pd.qcut((-1) * table[input_col], num_of_buckets, labels=False, duplicates='drop')
    else:
        out_col[out_col_name] = pd.qcut(table[input_col], num_of_buckets, labels=False, duplicates='drop')    
    out_table = pd.concat([table, out_col], axis=1)
    return {'out_table': out_table}


def binarizer(table, column, threshold=0, out_col_name=''):
    if len(out_col_name) == 0:
        out_col_name = 'binarized_' + str(column)
    table[out_col_name] = 0
    for t in range(0, len(table[column])):
        if table[column][t] > threshold:
            table[out_col_name][t] = 1
    return{'table':table}


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
