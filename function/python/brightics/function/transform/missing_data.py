import numpy as np


def delete_missing_data(table, input_cols, how='any', thresh=None):
    _table = table.copy()
    
    if thresh is not None:
        thresh = len(input_cols) - thresh + 1
    
    _out_table = _table.dropna(subset=input_cols, how=how, axis='index', thresh=thresh)
        
    return {'out_table':_out_table}