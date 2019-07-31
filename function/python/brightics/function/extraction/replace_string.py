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
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.classify_input_type import check_col_type


def replace_string(table, **params):
    check_required_parameters(_replace_string, params, ['table'])
    return _replace_string(table, **params)
    
def _replace_string(table, input_cols, replace_mode='part', empty_as_null=False, target_string_null=True, target_string=None, replace_string_null=True, replace_string=None):
    out_table = table.copy()
    for input_col in input_cols:
        if replace_mode == 'part':
            if target_string and replace_string:
                out_table[input_col] = [(x.replace(target_string, replace_string) if not pd.isnull(x) else x) for x in table[input_col]]
        else:
            if target_string_null and not replace_string_null:
                out_table[input_col] = np.where(pd.isnull(table[input_col]), replace_string, table[input_col])
                if empty_as_null:
                    out_table[input_col] = np.where(out_table[input_col] == '', replace_string, out_table[input_col])
            elif not target_string_null and replace_string_null:
                out_table[input_col] = np.where(table[input_col] == target_string, None, table[input_col])
            elif not target_string_null and not replace_string_null:
                out_table[input_col] = np.where(table[input_col] == target_string, replace_string, table[input_col])
        
    return {'out_table' : out_table}