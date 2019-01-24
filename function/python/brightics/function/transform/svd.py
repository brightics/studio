import numpy as np
import pandas as pd
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def svd(table, group_by=None, **params):
    check_required_parameters(_svd, params, ['table'])
    if group_by is not None:
        return _function_by_group(_svd, table, group_by=group_by, **params)
    else:
        return _svd(table, **params)

def _svd(table, input_cols, full_matrices=False):
    A = table[input_cols]
    u, s, vh = np.linalg.svd(A, full_matrices)
    projection = []
    for i in range(len(s)):
        projection += [(u.T[i] * s[i])]
    projection = np.array(projection).T
    s_normal = []
    for i in range(len(s)):
        if i == 0:
            s_normal += [s[i]/s.sum()]
        else:
            s_normal += [s[i]/s.sum()+s_normal[i-1]]
    s = [s]+[s_normal]
    s = np.array(s)
    v = vh.T
    column_name_u = []
    column_name_s = []
    column_name_v = []
    column_name_projection = []
    for i in range(u.shape[1]):
        column_name_u += ['u%d' %(i+1)]
    for i in range(s.shape[1]):
        column_name_s += ['s%d' %(i+1)]
    for i in range(v.shape[1]):
        column_name_v += ['v%d' %(i+1)]
    for i in range(s.shape[1]):
        column_name_projection += ['proj%d' %(i+1)]
    

    return {'out_table1':pd.DataFrame(u, columns = column_name_u), 'out_table2':pd.DataFrame(s, columns = column_name_s), 'out_table3':pd.DataFrame(v, columns = column_name_v), 'out_table4':pd.DataFrame(projection, columns = column_name_projection)}