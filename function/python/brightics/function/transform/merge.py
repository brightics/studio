from brightics.common.validation import raise_runtime_error
from brightics.common.utils import check_required_parameters
import pandas as pd

def bind_row_column(first_table, second_table, **params):
    check_required_parameters(_bind_row_column, params, ['first_table', 'second_table'])
    return _bind_row_column(first_table, second_table, **params)

def _bind_row_column(first_table, second_table, row_or_col):
    if row_or_col == 'row':
        table = pd.concat([first_table, second_table], ignore_index=True, sort=False)
    else:  # col
        if list(set(first_table.columns).intersection(set(second_table.columns))) != []:
            col_name_first = []
            for col_name in first_table.columns:
                col_name_first.append(col_name + '_first')
            col_name_second = []
            for col_name in second_table.columns:
                col_name_second.append(col_name + '_second')
            first_table.columns = col_name_first
            second_table.columns = col_name_second
        table = pd.concat([first_table.reset_index(drop=True), second_table.reset_index(drop=True)], axis=1)
        
    return {'table' : table}


def join(left_table, right_table, left_on, right_on, how='inner', lsuffix='_left', rsuffix='_right', sort=False):
    if sort == True or sort == 'True' or sort == 'true':
        sort = True
    else:
        sort = False
    both_on = list(set(left_on) & set(right_on))
    if len(both_on) > 0 and how in ['outer', 'left', 'right']:
        left_table = left_table.rename(columns={key:key + lsuffix for key in both_on})
        right_table = right_table.rename(columns={key:key + rsuffix for key in both_on})
        left_on = [col_name + lsuffix if col_name in both_on else col_name for col_name in left_on]
        right_on = [col_name + rsuffix if col_name in both_on else col_name for col_name in right_on]
        
    if how == 'left_exclude':
        table = pd.merge(left_table, right_table, how='outer', left_on=left_on, right_on=right_on, suffixes=(lsuffix, rsuffix), sort=sort, indicator=True)
        left_columns = left_table.columns
        col_names_left = list(set(left_columns) & set(right_table.columns) - set(right_on))
        col_names = [col_name + lsuffix if col_name in col_names_left else col_name for col_name in left_columns]
        table = table[table['_merge'] == 'left_only'][col_names]
        table = table.rename(columns={col_name + lsuffix:col_name for col_name in col_names_left})
        if table.empty:
            raise_runtime_error("The result is empty.")
    elif how == 'right_exclude':
        table = pd.merge(left_table, right_table, how='outer', left_on=left_on, right_on=right_on, suffixes=(lsuffix, rsuffix), sort=sort, indicator=True)
        right_columns = right_table.columns
        col_names_right = list(set(left_table.columns) & set(right_columns) - set(right_on))
        col_names = [col_name + rsuffix if col_name in col_names_right else col_name for col_name in right_columns]
        table = table[table['_merge'] == 'right_only'][col_names]
        table = table.rename(columns={col_name + rsuffix:col_name for col_name in col_names_right})
        if table.empty:
            raise_runtime_error("The result is empty.")
    else:
        table = pd.merge(left_table, right_table, how=how, left_on=left_on, right_on=right_on, suffixes=(lsuffix, rsuffix), sort=sort)
    
    return {'table' : table}
