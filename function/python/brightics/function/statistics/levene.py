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

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, \
    pandasDF2MD, keyValues2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate, greater_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.function.utils import _model_dict

from scipy.stats import levene
import pandas as pd


def levenes_test(table, group_by=None, **params):
    check_required_parameters(_levenes_test, params, ['table'])
    params = get_default_from_parameters_if_required(params, _levenes_test)
    if (params['center'] == 'trimmed'):
        param_validation_check = [greater_than_or_equal_to(params, 0.0, 'proportiontocut')]
        validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_levenes_test, table, group_by=group_by, **params)
    else:
        return _levenes_test(table, **params)


def _levenes_test(table, response_cols, factor_col, center='median', proportiontocut=0.05):
    groups = table[factor_col].unique()

    data_list = []
    stat_list = []
    p_list = []
    for response_col in response_cols:
        response = table[response_col]
        stat_levene, p_levene = levene(*[response[table[factor_col] == group] for group in groups],
                                       center=center, proportiontocut=proportiontocut)
        data = '{response_col} by {factor_col}'.format(response_col=response_col, factor_col=factor_col)
        data_list.append(data)
        stat_list.append(stat_levene)
        p_list.append(p_levene)

    # result_table = pd.DataFrame.from_items([
    #     ['data', data_list],
    #     ['estimate', stat_list],
    #     ['p_value', p_list]
    # ])
    result_table = pd.DataFrame({
        'data': data_list,
        'estimate': stat_list,
        'p_value': p_list
    })

    result = _model_dict('levenes_test_model')
    result['result_table'] = result_table

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    ## Levene's Test Result
    | - H0: k population variances are equal.
    | - H1: at least two variances are different.
    |
    | {result_table}
    """.format(result_table=pandasDF2MD(result_table))))

    result['_repr_brtc_'] = rb.get()

    return {'result': result}
