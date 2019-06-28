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
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to


def random_sampling(table, group_by=None, **params):
    check_required_parameters(_random_sampling, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _random_sampling)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'num')]
    validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_random_sampling, table, group_by=group_by, **params)
    else:
        return _random_sampling(table, **params)


def _random_sampling(table, num_or_frac='num', num=1, frac=50, replace=False, seed=None):
    
    if num_or_frac == 'num':
        out_table = table.sample(n=num, replace=replace, random_state=seed)
    else:  # 'frac'
        out_table = table.sample(frac=frac / 100, replace=replace, random_state=seed)
    return {'table' : out_table}
