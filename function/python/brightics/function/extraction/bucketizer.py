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

import math
import numpy as np
from brightics.common.utils import check_required_parameters

def bucketizer(table, **params):
    check_required_parameters(_bucketizer, params, ['table'])
    return _bucketizer(table, **params)

def _bucketizer(table, input_cols, radio_splits, bucket_type='left_closed', splits=[], splits_from=None, splits_to=None, splits_by=None, new_name=None):
    
    if radio_splits != 'array':
        i = splits_from
        if splits_by > 0:
            splits = [-math.inf]
            while i <= splits_to:
                splits += [i]
                i += splits_by
                i = round(i, 10)
            splits += [math.inf]
        else:
            splits = [math.inf]
            while i >= splits_to:
                splits += [i]
                i += splits_by
                i = round(i, 10)
            splits += [-math.inf]
            splits.reverse()
    else:
        splits.insert(0, -math.inf)
        splits += [math.inf]

    if new_name is None:
        new_name = input_cols + '_bucketed'
    out_table = table.copy()
    for i in range(len(splits) - 1):
        if bucket_type == 'left_closed':
            if i == 0:
                result = np.where(table[input_cols] < splits[i + 1], 0, 1)
            else:
                result += np.where(table[input_cols] < splits[i + 1], 0, 1)
        else:
            if i == 0:
                result = np.where(table[input_cols] <= splits[i + 1], 0, 1)
            else:
                result += np.where(table[input_cols] <= splits[i + 1], 0, 1)
    out_table[new_name] = result
    return {'out_table' : out_table}
