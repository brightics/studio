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

import pandas as pd
import numpy as np
import statsmodels.tsa.filters.filtertools as sm
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import from_to


def ewma(table, group_by=None, **params):
    check_required_parameters(_ewma, params, ['table'])
    params = get_default_from_parameters_if_required(params, _ewma)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'period_number'),
                              from_to(params, 0, 1, 'custom_ratio')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_ewma, table, group_by=group_by, **params)
    else:
        return _ewma(table, **params)


def _ewma(table, input_cols, ratio_type, custom_ratio=0.5, period_number=1):
    out_table = table.copy()

    def ewma_col(column):
        result_col = []
        for i in range(0, period_number - 1):
            result_col.append(None)
        result_col.append(np.mean(out_table[column][0:period_number]))

        if ratio_type == 'custom':
            ratio = custom_ratio
        else:
            ratio = 1 / period_number

        for i in range(period_number, len(out_table)):
            result_col.append(ratio * out_table[column][i] + (1 - ratio) * result_col[i - 1])
        return result_col

    for column in input_cols:
        out_table[column + '_EWMA'] = ewma_col(column)
    return{'out_table':out_table}


def moving_average(table, group_by=None, **params):
    check_required_parameters(_moving_average, params, ['table'])
    params = get_default_from_parameters_if_required(params, _moving_average)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'window_size')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_moving_average, table, group_by=group_by, **params)
    else:
        return _moving_average(table, **params)


def _moving_average(table, input_cols, weights_array=None, window_size=1, weights='uniform_weights', mode='past_values_only'):
    out_table = table.copy()
    nsides = 1
    if mode == 'centered_moving_average':
        nsides = 2
    if weights == 'uniform_weights':
        weights_array = np.ones(window_size)
    for column in input_cols:
        out_table[column + '_MA'] = sm.convolution_filter(out_table[column], weights_array, nsides) / sum(weights_array)
    return{'out_table':out_table}
