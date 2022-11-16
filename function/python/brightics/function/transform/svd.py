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

import numpy as np
import pandas as pd
from sklearn.utils.extmath import safe_sparse_dot

from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.utils import _model_dict


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
            s_normal += [s[i] / s.sum()]
        else:
            s_normal += [s[i] / s.sum() + s_normal[i - 1]]
    s = [s] + [s_normal]
    s = np.array(s)
    v = vh.T
    column_name_u = []
    column_name_s = []
    column_name_v = []
    column_name_projection = []
    for i in range(u.shape[1]):
        column_name_u += ['u%d' % (i + 1)]
    for i in range(s.shape[1]):
        column_name_s += ['s%d' % (i + 1)]
    for i in range(v.shape[1]):
        column_name_v += ['v%d' % (i + 1)]
    for i in range(s.shape[1]):
        column_name_projection += ['proj%d' % (i + 1)]

    return {'out_table1':pd.DataFrame(u, columns=column_name_u), 'out_table2':pd.DataFrame(s, columns=column_name_s), 'out_table3':pd.DataFrame(v, columns=column_name_v), 'out_table4':pd.DataFrame(projection, columns=column_name_projection)}

def svd2(table, group_by=None, **params):
    check_required_parameters(_svd2, params, ['table'])
    if group_by is not None:
        return _function_by_group(_svd2, table, group_by=group_by, **params)
    else:
        return _svd2(table, **params)


def _svd2(table, input_cols, new_column_name='projected_', full_matrices=False):
    A = table[input_cols]

    u, s, vh = np.linalg.svd(A, full_matrices=full_matrices)
    projection = []
    for i in range(len(s)):
        projection += [(u.T[i] * s[i])]
    projection = np.array(projection).T
    s_normal = []
    for i in range(len(s)):
        if i == 0:
            s_normal += [s[i] / s.sum()]
        else:
            s_normal += [s[i] / s.sum() + s_normal[i - 1]]
    s = [s] + [s_normal]
    s = np.array(s)
    v = vh.T
    column_name_u = []
    column_name_s = []
    column_name_v = []
    column_name_projection = []
    for i in range(u.shape[1]):
        column_name_u += ['u%d' % (i + 1)]
    for i in range(s.shape[1]):
        column_name_s += ['s%d' % (i + 1)]
    for i in range(v.shape[1]):
        column_name_v += ['v%d' % (i + 1)]
    for i in range(s.shape[1]):
        column_name_projection += [new_column_name + '%d' % (i + 1)]
    
    out_table4 = pd.DataFrame(data=projection, columns=[column_name_projection])
    out_table4 = pd.concat([table.reset_index(drop=True), out_table4], axis=1)
    out_table4.columns = table.columns.values.tolist() + column_name_projection

    res_param1 = {}
    res_param1['Input Columns'] = input_cols
    res_param1['full_matrices'] = full_matrices

    res_param2 = {}
    res_param2['u'] = u.shape
    res_param2['s'] = s.shape
    res_param2['v'] = v.shape
    res_param2['Projected Matrix'] = projection.shape
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## SVD Result
    |
    | ### Dimensions of Matrices
    | {parameter2}
    |
    | ### Parameters
    | {parameter1}
    """.format(parameter1=dict2MD(res_param1),
               parameter2=dict2MD(res_param2)
               )))        

    model = _model_dict('svd')
    model['right_singular_vectors'] = pd.DataFrame(v, columns=column_name_v)
    model['input_cols'] = input_cols
    model['parameters'] = res_param1
    model['_repr_brtc_'] = rb.get()

    return {'out_table1':pd.DataFrame(u, columns=column_name_u), 'out_table2':pd.DataFrame(s, columns=column_name_s), 'out_table3':pd.DataFrame(v, columns=column_name_v), 'out_table4':out_table4, 'model':model}

def svd_model(table, model, **params):
    check_required_parameters(_svd_model, params, ['table', 'model'])
    return _svd_model(table, model, **params)
    

def _svd_model(table, model, new_column_name='projected_'):
    right_singular_vectors = model['right_singular_vectors']
    input_cols = model['input_cols']

    _, col = right_singular_vectors.shape

    new_col_names = []
    for i in range(col):
        new_col_names.append(new_column_name + str(i))
    
    svd_result = safe_sparse_dot(table[input_cols].to_numpy(), right_singular_vectors.to_numpy())
    out_table = pd.concat([table.reset_index(drop=True), pd.DataFrame(data=svd_result, columns=[new_col_names])], axis=1)
    out_table.columns = table.columns.values.tolist() + new_col_names

    return {'out_table' : out_table}