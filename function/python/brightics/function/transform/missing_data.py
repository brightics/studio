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

from brightics.common.validation import validate, greater_than_or_equal_to


def delete_missing_data(table, input_cols, how='any', **params):
    
    _table = table.copy()
    
    if 'thresh' in params:
        validate(greater_than_or_equal_to(params, 1, 'thresh'))
        thresh = params['thresh']
        thresh = len(input_cols) - thresh + 1
    else:
        thresh = None
    
    _out_table = _table.dropna(subset=input_cols, how=how, axis='index', thresh=thresh)
        
    return {'out_table':_out_table}
