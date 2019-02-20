from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error

import numpy as np
import pandas as pd


def cross_table(table, group_by=None, **params):
    check_required_parameters(_cross_table, params, ['table'])
    if group_by is not None:
        return _function_by_group(_cross_table, table, group_by=group_by, **params)
    else:
        return _cross_table(table, **params)


def _cross_table(table, input_cols_1, input_cols_2, result='N', margins=False):
    
    df1 = [table[col] for col in input_cols_1]
    df2 = [table[col] for col in input_cols_2]
        
    # cross table    
    if result == 'N':
        result_table = pd.crosstab(df1, df2, margins=margins)  
    elif result == 'N / Row Total':
        result_table = pd.crosstab(df1, df2, margins=margins, normalize='index')
    elif result == 'N / Column Total':   
        result_table = pd.crosstab(df1, df2, margins=margins, normalize='columns')
    elif result == 'N / Total':    
        result_table = pd.crosstab(df1, df2, margins=margins, normalize='all')
    else:
        raise_runtime_error("Please check 'result'.")
        
    # each row and column name    
    row_names = list(result_table.index)[:]    
    if len(input_cols_1) == 1:
        joined_row_name = [str(i) for i in row_names]
    else:
        joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names))]
  
    column_names = list(result_table.columns)[:]
    if len(input_cols_2) == 1:
        joined_column_name = [str(i) for i in column_names]
    else:
        joined_column_name = ['_'.join(str(s) for s in column_names[i]) for i in range(len(column_names))]

    # cross table
    if result == 'N':
        result_table.insert(loc=0, column=' ', value=joined_row_name)
        result_table.columns = np.append('N', joined_column_name)    
    # cross table normalize by row    
    elif result == 'N / Row Total':
        result_table.insert(loc=0, column=' ', value=joined_row_name)
        result_table.columns = np.append('N / Row Total', joined_column_name)
    # cross table normalize by column
    elif result == 'N / Column Total':    
        result_table.insert(loc=0, column=' ', value=joined_row_name)
        result_table.columns = np.append('N / Column Total', joined_column_name)    
    # cross table normalize by all values    
    elif result == 'N / Total':    
        result_table.insert(loc=0, column=' ', value=joined_row_name)
        result_table.columns = np.append('N / Total', joined_column_name)        
    else:
        raise_runtime_error("Please check 'result'.")
        
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Cross Table Result
    | ### Result Type : {result}
    |
    | #### Result Table
    |
    | {result_table}
    |
    """.format(result=result, result_table=pandasDF2MD(result_table, num_rows=500))))

    model = _model_dict('cross_table')
    model['result'] = result
    model['result_table'] = result_table
    model['_repr_brtc_'] = rb.get()
  
    return {'model': model}
