import pandas as pd
import numpy as np
import math


def _place(a, splits):
    for i in range(len(splits) - 1):
        if splits[i] <= float(a) < splits[i + 1]:
            return i


# table_splits는 나중에 table 2개 받을때를 대비해서 넣어둔 것.        
def bucketizer(table, input_cols, radio_splits, splits=None, splits_from=None, splits_to=None, splits_by=None, table_splits=None, new_name=None):
    check_decimal_number = None
    if table_splits is None:
        if radio_splits != 'array':
            splits = [-math.inf]
            i = splits_from
            while i <= splits_to:    
                splits += [i]
                i += splits_by
                i = round(i, 10)
            splits += [math.inf]
        else:
            splits += [-math.inf, math.inf]
            splits.sort()
    # else:
        # splits=list(table_splits[input_cols[1]])
        
    if new_name is None:
    
        # new_name=input_cols[0]+'_bucketed'
        new_name = input_cols + '_bucketed'
    out_table = table.copy()
    out_table[new_name] = out_table[input_cols].apply(_place, splits=splits)
    
    # out_table[new_name]=out_table[input_cols[0]].apply(_place,splits=splits)
    # result=out_table[list(hold_cols)+[input_cols[0]]+[new_name]]
    
    return {'out_table' : out_table}
