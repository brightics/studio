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

from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than, from_to
from brightics.common.utils import check_required_parameters
from brightics.common.groupby import _function_by_group


def linear_sampling(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params, _linear_sampling)
    param_validation_check = [greater_than(params, 0.0, 'train_ratio'),
                              greater_than(params, 0.0, 'test_ratio')]

    validate(*param_validation_check)
    check_required_parameters(_linear_sampling, params, ['table'])
    if group_by is not None:
        return _function_by_group(_linear_sampling, table, group_by=group_by, **params)
    else:
        return _linear_sampling(table, **params)


def _linear_sampling(table, train_ratio=0.7, test_ratio=0.3):
    index = int(table.shape[0] * train_ratio / (train_ratio + test_ratio))
    train_table = table[:index]
    test_table = table[index:]
    return {'train_table': train_table, 'test_table': test_table}
