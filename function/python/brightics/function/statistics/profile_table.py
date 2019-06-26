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

from brightics.common.repr import BrtcReprBuilder
import pandas_profiling as pd_profiling
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate 
from brightics.common.validation import greater_than_or_equal_to, greater_than


def profile_table(table, group_by=None, **params):
    check_required_parameters(_profile_table, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _profile_table)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'bins'),
             greater_than(params, 0.0, 'correlation_threshold')]
    validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_profile_table, table, group_by=group_by, **params)
    else:
        return _profile_table(table, **params)

    
def _profile_table(table, bins=10, check_correlation=False, correlation_threshold=0.9, correlation_overrides=None):
    
    rb = BrtcReprBuilder()
    
    profile = pd_profiling.ProfileReport(table, bins=bins, check_correlation=check_correlation, correlation_threshold=correlation_threshold, correlation_overrides=correlation_overrides)
    rb.addHTML(profile.html)
    summary = dict()
    summary['_repr_brtc_'] = rb.get()
    
    return {'result': summary}
