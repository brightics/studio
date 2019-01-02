from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
import pandas as pd


def bind_row_column(first_table, second_table, row_or_col):
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

#def merge(table, group_by=None, **params):
#    check_required_parameters(_merge, params, ['table'])
#    if group_by is not None:
#        return _function_by_group(_merge, table, group_by=group_by, **params)
#    else:
#        return _merge(table, **params)


def merge(left_table, right_table, left_on, right_on, how='inner', lsuffix='_left', rsuffix='_right', sort=False):
    return {'table' : pd.merge(left_table, right_table, how=how, left_on=left_on, right_on=right_on, suffixes=(lsuffix, rsuffix), sort=sort)}