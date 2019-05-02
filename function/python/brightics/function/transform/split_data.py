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

from sklearn.model_selection import train_test_split as sktrain_test_split
from brightics.common.validation import validate, greater_than
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required


def split_data(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params,_split_data)
    param_validation_check = [greater_than(params, 0.0, 'train_ratio'),
                              greater_than(params, 0.0, 'test_ratio')]
        
    validate(*param_validation_check)
    check_required_parameters(_split_data, params, ['table'])
    if group_by is not None:
        return _function_by_group(_split_data, table, group_by=group_by, **params)
    else:
        return _split_data(table, **params)


def _split_data(table, train_ratio=7.0, test_ratio=3.0, random_state=None, shuffle=True, stratify=None):

    
    ratio = test_ratio / (train_ratio + test_ratio)
    out_table_train, out_table_test = sktrain_test_split(table, test_size=ratio, random_state=random_state, shuffle=shuffle, stratify=stratify)
  
    return {'train_table' : out_table_train.reset_index(drop=True), 'test_table' : out_table_test.reset_index(drop=True)}
