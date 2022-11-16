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

from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error
import pandas as pd
import numpy as np


def select_column(table, **params):
    check_required_parameters(_select_column, params, ['table'])
    return _select_column(table, **params)


def _select_column(table, input_cols, output_cols=None, output_types=None):
    type_dict = {
        'int': 'int32',
        'long': 'int64',
        'double': 'float64',
        'boolean': 'bool',
        'string': 'str',
        'int[]': 'int32[]',
        'long[]': 'int64[]',
        'double[]': 'float64[]',
        'boolean[]': 'bool[]',
        'string[]': 'str[]'
    }

    out_table = pd.DataFrame({})
    
    if output_cols is None:
        _output_cols = input_cols
    else:
        _output_cols = output_cols
        
    if output_types is None:
        _output_types = [table[x].dtype for x in input_cols]
    else:
        _output_types = [type_dict.get(x) for x in output_types]

    _input_size = min(len(input_cols), len(_output_cols), len(_output_types))
    _input_cols = input_cols[:_input_size]
    _output_cols = _output_cols[:_input_size]
    _output_types = _output_types[:_input_size]

    for i, c in enumerate(_input_cols):
        if output_types is None:
            out_table[_output_cols[i]] = table[c]
        else:
            col_type = _output_types[i]
            if col_type[-2:] != '[]':
                if table[c].map(lambda x: isinstance(x, (list, np.ndarray))).all():
                    raise_runtime_error(
                        "Array type column {} cannot be cast to a non-array type column {}.".format(c, col_type))
                out_table[_output_cols[i]] = table[c].astype(col_type)
            else:
                if not table[c].map(lambda x: isinstance(x, (list, np.ndarray))).all():
                    raise_runtime_error(
                        "Non-array type column {} cannot be cast to an array type column {}.".format(c, col_type))
                col = [np.array(arr).astype(col_type[:-2]) for arr in table[c]]
                out_table[_output_cols[i]] = col

    return {'out_table': out_table}
