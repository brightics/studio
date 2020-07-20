"""
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

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
        if margins == False:
            joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names))]
        elif margins == True:
            joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names) - 1)] + [row_names[-1][0]]
  
    column_names = list(result_table.columns)[:]
    if len(input_cols_2) == 1:
        joined_column_name = [str(i) for i in column_names]
    else:
        if margins == False:
            joined_column_name = ['_'.join(str(s) for s in column_names[i]) for i in range(len(column_names))]
        elif margins == True:
            joined_column_name = ['_'.join(str(s) for s in column_names[i]) for i in range(len(column_names) - 1)] + [column_names[-1][0]]

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
    """.format(result=result, result_table=pandasDF2MD(result_table, num_rows=len(result_table.index) + 1))))

    model = _model_dict('cross_table')
    model['result'] = result
    model['result_table'] = result_table
    model['_repr_brtc_'] = rb.get()
  
    return {'model': model}


def cross_table2(table, group_by=None, **params):
    check_required_parameters(_cross_table2, params, ['table'])
    if group_by is not None:
        return _function_by_group(_cross_table2, table, group_by=group_by, **params)
    else:
        return _cross_table2(table, **params)


def _cross_table2(table, input_cols_1, input_cols_2, result=None,
                  add_info=None, row_total_str='row_total', col_total_str='col_total', contents_col='contents'):
    df1 = [table[col] for col in input_cols_1]
    df2 = [table[col] for col in input_cols_2]
    if result is None:
        result = ['N']
    if add_info is None:
        add_info = []
    if not result:
        raise_runtime_error("Please check 'result'.")
    tables = []

    if 'N' in result:
        tmp_table1 = pd.crosstab(df1, df2, margins=False)

        if 'row_tot' in add_info:
            tmp_sum = pd.DataFrame(tmp_table1.sum(axis=1), columns=[row_total_str])
            tmp_table1[row_total_str] = tmp_sum
        if 'column_tot' in add_info:
            tmp_sum = pd.DataFrame(tmp_table1.sum(axis=0), columns=[col_total_str]).T
            tmp_table1 = pd.concat([tmp_table1, tmp_sum])

        tmp_table1[contents_col] = ['N'] * tmp_table1.shape[0]
        tables.append(tmp_table1)

    if 'N / Row Total' in result:
        tmp_table2 = pd.crosstab(df1, df2, normalize='index')
        tmp_table2[contents_col] = ['N / Row Total'] * tmp_table2.shape[0]
        tables.append(tmp_table2)

    if 'N / Column Total' in result:
        tmp_table3 = pd.crosstab(df1, df2, normalize='columns')
        tmp_table3[contents_col] = ['N / Column Total'] * tmp_table3.shape[0]
        tables.append(tmp_table3)

    if 'N / Total' in result:
        tmp_table4 = pd.crosstab(df1, df2, normalize='all')

        if 'row_tot' in add_info:
            tmp_sum = pd.DataFrame(tmp_table4.sum(axis=1), columns=[row_total_str])
            tmp_table4[row_total_str] = tmp_sum
        if 'column_tot' in add_info:
            tmp_sum = pd.DataFrame(tmp_table4.sum(axis=0), columns=[col_total_str]).T
            tmp_table4 = pd.concat([tmp_table4, tmp_sum])

        tmp_table4[contents_col] = ['N / Total'] * tmp_table4.shape[0]
        tables.append(tmp_table4)
    result_table = pd.concat(tables)

    if len(input_cols_1) == 1:
        result_table['new_index'] = result_table.index
    else:
        result_table['new_index'] = ['_'.join([str(x).replace('.', '_') for x in idx]) for idx in result_table.index]
    result_table = result_table.sort_values(by=['new_index', contents_col])
    result_table = result_table.drop(['new_index'], axis=1)

    # each row and column name
    row_names = list(result_table.index)[:]
    if len(input_cols_1) == 1:
        joined_row_name = [str(i) for i in row_names]
    else:
        if 'column_tot' in add_info:
            if ('N' not in result) and ('N / Total' not in result):
                joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names))]
            elif ('N' in result) and ('N / Total' in result):
                joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names) - 2)] + [row_names[-2]] + [row_names[-1]]
            else:
                joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names) - 1)] + [row_names[-1]]
        else:
            joined_row_name = ['_'.join(str(s) for s in row_names[i]) for i in range(len(row_names))]

    # joined_row_name = joined_row_name.astype(str)

    column_names = list(result_table.columns)[:]
    if len(input_cols_2) == 1:
        joined_column_name = [str(i).replace('.','_') for i in column_names]
    else:
        if 'row_tot' in add_info:
            if ('N' not in result) and ('N / Total' not in result):
                joined_column_name = ['_' + '_'.join(str(s) for s in column_names[i]).replace('.','_') for i in range(len(column_names))]
            else:
                joined_column_name = ['_' + '_'.join(str(s) for s in column_names[i]).replace('.','_') for i in range(len(column_names) - 1)] + [column_names[-1][0]]
        else:
            joined_column_name = ['_' + '_'.join(str(s) for s in column_names[i]).replace('.','_') for i in range(len(column_names))]

    input_cols = input_cols_1 + input_cols_2

    # cross table
    result_table.insert(loc=0, column=' ', value=joined_row_name)
    result_table.columns = np.append('_'.join(input_cols), joined_column_name)
    # result_table = result_table.rename(columns={result_table.columns[1]: contents_col})
    result_table.reset_index(drop=True, inplace=True)

    return {'out_table': result_table}