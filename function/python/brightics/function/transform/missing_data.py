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


def delete_missing_data(table, **params):
    check_required_parameters(_delete_missing_data, params, ['table'])
    return _delete_missing_data(table, **params)


def _delete_missing_data(table, input_cols, how='any', row_or_column="index", missing_ratio=0):
    if row_or_column == 'index':
        subset = input_cols
        length = len(input_cols)
    else:
        subset = None
        length = table.shape[0]
    if missing_ratio != 0:
        max_na = missing_ratio * length
        if max_na != int(max_na):
            thresh = length - int(max_na)
        else:
            thresh = length - int(max_na) + 1
    else:
        thresh = length
    out_table = table.dropna(subset=subset, how=how, axis=row_or_column, thresh=thresh)
    return {'out_table': out_table}
