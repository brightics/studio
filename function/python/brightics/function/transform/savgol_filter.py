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
from brightics.common.validation import greater_than_or_equal_to, greater_than
from brightics.common.validation import from_to

from scipy.signal import savgol_filter as savitzky_golay_filter


def savgol_filter(table, group_by=None, **params):
    check_required_parameters(_savgol_filter, params, ['table'])
    params = get_default_from_parameters_if_required(params, _savgol_filter)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'window_length'),
                              greater_than(params, 0.0, 'delta')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_savgol_filter, table, group_by=group_by, **params)
    else:
        return _savgol_filter(table, **params)


def _savgol_filter(table, input_cols, window_length=1, polyorder=0, deriv=0, delta=1.0, axis=-1, mode='interp',
                   cval=0.0):
    df = pd.DataFrame(table, columns=input_cols)
    sf_filter = df[input_cols].apply(
        lambda cols_data: savitzky_golay_filter(cols_data, window_length=window_length, polyorder=polyorder,
                                                deriv=deriv, delta=delta, axis=axis, mode=mode, cval=cval), axis=0)
    sf_filter.columns = sf_filter.columns + '_sf'
    out_table = pd.concat([table, sf_filter], axis=1)

    return {'out_table': out_table}
