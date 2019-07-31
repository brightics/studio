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


def string_split(table, **params):
    check_required_parameters(_string_split, params, ['table'])
    return _string_split(table, **params)
    
def _string_split(table, input_col, hold_cols=None, delimiter=',', output_col_name='split', output_col_cnt=3, output_col_type='double', start_pos=0, end_pos=0):
    out_table = pd.DataFrame()
    
    output_arr = [x[start_pos:-end_pos].split(delimiter, output_col_cnt) \
                    if not pd.isnull(x) \
                    else [x] * output_col_cnt for x in list(table[input_col])] \
                 if end_pos > 0 \
                 else [x[start_pos:].split(delimiter, output_col_cnt) \
                    if not pd.isnull(x) \
                    else [x] * output_col_cnt for x in list(table[input_col])]
    head_arr = [x[:start_pos] \
                    if not pd.isnull(x) \
                    else '' for x in list(table[input_col])]
    tail_arr = [x[-end_pos:] \
                    if not pd.isnull(x) and len(x) >= start_pos + end_pos \
                    else '' for x in list(table[input_col])] \
                if end_pos > 0 \
                else [''] * len(list(table[input_col]))
    remain_arr = [x[output_col_cnt] if len(x) > output_col_cnt else '' for x in output_arr]
    
    remain_arr = [head_arr[i] + remain_arr[i] + tail_arr[i] \
                    if not pd.isnull(table[input_col][i]) \
                    else np.nan for i in range(len(list(table[input_col])))]
                  
    for i, output in enumerate(output_arr):
        if len(output) < output_col_cnt:
            output += [np.nan] * (output_col_cnt - len(output))
        output_arr[i] = output_arr[i][:output_col_cnt]
        for j, value in enumerate(output_arr[i]):
            try:
                if output_col_type in ['integer','long','integer_arr','long_arr']:
                    output_arr[i][j] = int(value)
                elif output_col_type in ['double','float','double_arr']:
                    output_arr[i][j] = float(value)
                else:
                    output_arr[i][j] = value
            except:
                output_arr[i][j] = np.nan
    if output_col_type in ['string','double','integer','long']:
        output_arr = np.transpose(output_arr)
        for i, output in enumerate(output_arr):
            out_table[output_col_name + '_' + str(i)] = output
    else:
        out_table[output_col_name] = output_arr
    out_table[input_col] = remain_arr
    if hold_cols:
        for hold_col in hold_cols:
            out_table[hold_col] = table[hold_col]
        
    return {'out_table' : out_table}