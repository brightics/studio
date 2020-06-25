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
import itertools


def polynomial_expansion(table, **params):
    check_required_parameters(_polynomial_expansion, params, ['table'])
    return _polynomial_expansion(table, **params)
    
def _polynomial_expansion(table, input_cols, hold_cols=False):
    if hold_cols:
        out_table = pd.DataFrame()
        out_table[input_cols] = table[input_cols]
        hold_cols = list(set(hold_cols) - set(input_cols))
        out_table[hold_cols] = table[hold_cols]
    else:
        out_table = table.copy()
    for i in range(len(input_cols)):
        for j in range(i, len(input_cols)):
            out_table[input_cols[i] + '_' + input_cols[j]] = np.array(table[input_cols[i]]) * np.array(table[input_cols[j]])
    return {'out_table' : out_table}