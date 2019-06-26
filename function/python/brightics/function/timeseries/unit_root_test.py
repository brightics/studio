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

from statsmodels.tsa.stattools import adfuller
from brightics.common.repr import BrtcReprBuilder, strip_margin
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to

def unit_root_test(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params,_unit_root_test)
    param_validation_check = [greater_than_or_equal_to(params, 0, 'maxlag')]
        
    validate(*param_validation_check)
    check_required_parameters(_unit_root_test, params, ['table'])
    if group_by is not None:
        return _function_by_group(_unit_root_test, table, group_by=group_by, **params)
    else:
        return _unit_root_test(table, **params)


def _unit_root_test(table, input_col, maxlag=None, regression='c', autolag='AIC'):
    if autolag == 'None':
        autolag = None
    result = adfuller(table[input_col], maxlag, regression, autolag)
    model = dict()
    if autolag is not None:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        ## Augmented Dickey-Fuller unit root test result
        | - null hypothesis : A unit root is present in a time series sample
        | - alternative hypothesis : There is no unit root
        | - Test statistic : {adf}
        | - p-value : {p_value}
        | - Number of observations used for the ADF regression and calculation of the critical values : {nobs}
        | - Number of lags used : {usedlag}
        | - Critical values for the test statistic at the 1 %, 5 %, and 10 % levels : {critical_values}
        | - The maximized information criterion if autolag is not None : {icbest}
        |
        """.format(adf = result[0], p_value = result[1], usedlag = result[2], nobs = result[3], critical_values = result[4], icbest = result[5])))
    else:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        ## Augmented Dickey-Fuller unit root test result
        | - null hypothesis : A unit root is present in a time series sample
        | - alternative hypothesis : There is no unit root
        | - Test statistic : {adf}
        | - p-value : {p_value}
        | - Number of observations used for the ADF regression and calculation of the critical values : {nobs}
        | - Number of lags used : {usedlag}
        | - Critical values for the test statistic at the 1 %, 5 %, and 10 % levels : {critical_values}
        |
        """.format(adf = result[0], p_value = result[1], usedlag = result[2], nobs = result[3], critical_values = result[4])))
    model['adf'] = result[0]
    model['p_value'] = result[1]
    model['usedlag'] = result[2]
    model['nobs'] = result[3]
    model['critical_values'] = result[4]
    if autolag is not None:
        model['icbest'] = result[5]
    model['_repr_brtc_'] = rb.get()
    
    return{'model':model}