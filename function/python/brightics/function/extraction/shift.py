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

from brightics.common.groupby import _function_by_group
from brightics.common.groupby2 import _function_by_group2
from brightics.common.utils import check_required_parameters
import numpy as np
import pandas as pd


def add_shift(table, group_by=None, **params):
    check_required_parameters(_add_shift, params, ['table'])
    
    columns = table.columns.tolist()

    input_col = params.get('input_col')
    shifted_col = params.get('shifted_col') if params.get('shifted_col') else input_col
    shift_list = params.get('shift_list')
    order_by = params.get('order_by')
    params['input_col'] = table.columns.get_loc(input_col)
    if order_by is not None:
        params['order_by'] = [table.columns.get_loc(order_by) for order_by in order_by]  
        
    for shift in shift_list:
        columns.append('{shifted_col}_{shift}'.format(shifted_col=shifted_col, shift=shift))
    
    if group_by is not None:
        return _function_by_group2(_add_shift, table, columns=columns, group_by=group_by, **params)
    else:
        tmp_table = table.values
    
        result = _add_shift(tmp_table, **params)
        result['out_table'] = pd.DataFrame(result['out_table'],columns=columns)
    return result

    
def _add_shift(table, input_col, shift_list, shifted_col=None, order_by=None, ordering='asc'):
     
    # always doing descending sort if ordering is not asc
    tmp_table = table.copy()
    tmp_table = np.array(tmp_table).tolist()
    
    if order_by is not None:
        tmp_table = sorted(tmp_table, key=lambda x: tuple(x[order_by] for order_by in order_by), reverse=(ordering != 'asc'))
    
    result=[]
    if shifted_col is None:
        shifted_col = input_col
        
    for shift in shift_list:
        for i, v in  enumerate(range(len(tmp_table))):
            if i >= shift and len(tmp_table) > i - shift:
                tmp_table[i].append(tmp_table[i - shift][input_col])
            else:
                tmp_table[i].append(np.NaN)
        
    result = tmp_table
    return {'out_table': result}
