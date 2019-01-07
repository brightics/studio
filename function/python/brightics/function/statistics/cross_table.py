from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

import numpy as np
import pandas as pd


def cross_table(table, group_by=None, **params):
    check_required_parameters(_cross_table, params, ['table'])
    if group_by is not None:
        return _function_by_group(_cross_table, table, group_by=group_by, **params)
    else:
        return _cross_table(table, **params)


def _cross_table(table, input_cols_1, input_cols_2, result='N', choice=False):
    data = pd.DataFrame(table)
    num_input_cols_1 = len(input_cols_1)
    num_input_cols_2 = len(input_cols_2)
    
    input_cols1_names = []
    for i in input_cols_1:
        input_cols1_names.append(i)
        
    input_cols2_names = []
    for j in input_cols_2:
        input_cols2_names.append(j)
    
    df1 = []
    df2 = []
    for column in input_cols_1:
        df1.append(data[column])
    for column in input_cols_2:
        df2.append(data[column])
        
    # cross table
    
    out_table_count = pd.DataFrame(pd.crosstab(df1, df2, margins=choice))
    
    # # each row and column name
    
    row_names = list(out_table_count.index)[:]
    joined_row_name = []
    name1 = ""
    
    if num_input_cols_1 == 1:
        for i in row_names:
            name1 = str(i)
            joined_row_name.append(name1)
            name1 = ""
  
    elif num_input_cols_1 != 1:
        for i in range(len(row_names)):
            name1 = '_'.join(str(s) for s in row_names[i])
            joined_row_name.append(name1)
            name1 = ""
  
    column_names = list(out_table_count.columns)[:]
    joined_column_name = []
    name2 = ""
    
    if num_input_cols_2 == 1:
        for i in column_names:
            name2 = str(i)
            joined_column_name.append(name2)
            name2 = ""
    elif num_input_cols_2 != 1:
        for i in range(len(column_names)):
            name2 = '_'.join(str(s) for s in column_names[i])
            joined_column_name.append(name2)
            name2 = ""

    out_table_count.insert(loc=0, column=' ', value=joined_row_name)
    out_table_count.columns = np.append('N', joined_column_name)
    
    result_table = []
    if result == 'N':
        result_table = out_table_count
    
    # cross table normalize by row
    
    if result == 'N / Row Total':
        out_table_row_total = pd.DataFrame(pd.crosstab(df1, df2, margins=False, normalize='index'))
        out_table_row_total.insert(loc=0, column=' ', value=joined_row_name)
        out_table_row_total.columns = np.append('N / Row Total', joined_column_name)
        result_table = out_table_row_total

    # cross table normalize by column
    if result == 'N / Column Total':
    
        out_table_column_total = pd.DataFrame(pd.crosstab(df1, df2, margins=False, normalize='columns'))
        out_table_column_total.insert(loc=0, column=' ', value=joined_row_name)
        out_table_column_total.columns = np.append('N / Column Total', joined_column_name)
        result_table = out_table_column_total
    
    # cross table normalize by all values
    
    if result == 'N / Total':
    
        out_table_total = pd.DataFrame(pd.crosstab(df1, df2, margins=False, normalize='all'))
        out_table_total.insert(loc=0, column=' ', value=joined_row_name)
        out_table_total.columns = np.append('N / Total', joined_column_name)
        result_table = out_table_total
        
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Cross Table Result
    | ### Result Type : {result}
    |
    """.format(result=result)))
    rb.addMD(strip_margin("""
    | #### Result Table
    |
    | {result_table}
    |
    """.format(result_table=pandasDF2MD(result_table, num_rows=500))))

    model = _model_dict('cross_table')
    model['result'] = result_table
    model['report'] = rb.get()
  
    return {'model': model}
