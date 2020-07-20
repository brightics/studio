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
import re
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.classify_input_type import check_col_type


def fill_na(list, number):
    for _ in range(number - len(list)):
        list.append(None)
    return list


def columns_to_array(table, **params):
    check_required_parameters(_columns_to_array, params, ['table'])
    return _columns_to_array(table, **params)

    
def _columns_to_array(table, input_cols, remain_cols=False, output_col_name='array'):
    _output_col_name = re.sub("[ ,;{}()\n\t=]", "_", output_col_name)
    if remain_cols:
        out_table = table.copy()
        npa = np.array(table[input_cols])
        tmp_col = table[input_cols].dtypes == 'object'
        if tmp_col.any():
            out_table[_output_col_name] = list(npa.astype(str))
        else:
            out_table[_output_col_name] = list(npa)
        return {'out_table' : out_table}
    else:
        out_table = table[list(set(table.axes[1]) - set(input_cols))].copy()
        npa = np.array(table[input_cols])
        tmp_col = table[input_cols].dtypes == 'object'
        if tmp_col.any():
            out_table[_output_col_name] = list(npa.astype(str))
        else:
            out_table[_output_col_name] = list(npa)
        return {'out_table' : out_table}


def array_to_columns(table, **params):
    check_required_parameters(_array_to_columns, params, ['table'])
    return _array_to_columns(table, **params)

    
def _array_to_columns(table, input_cols, remain_cols=False):
    if remain_cols:
        out_table = table.copy()
        for input_col in input_cols:
            _input_col = re.sub("[ ,;{}()\n\t=]", "_", input_col)
            for i in range(len(table[input_col][0])):
                out_table[_input_col + str(i)] = [x[i] for x in table[input_col]]
        return {'out_table' : out_table}
    else:
        out_table = table[list(set(table.axes[1]) - set(input_cols))].copy()
        for input_col in input_cols:
            _input_col = re.sub("[ ,;{}()\n\t=]", "_", input_col)
            length = np.max([len(i) for i in table[input_col]])
            tmp = np.array([fill_na(i, length) for i in table[input_col]])
            columns = [_input_col + '_' + str(i) for i in range(tmp.shape[1])]
            result_table = pd.DataFrame(tmp, columns=columns)
            out_table = pd.concat([out_table, result_table], axis=1)
        return {'out_table' : out_table}
