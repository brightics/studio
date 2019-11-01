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
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_under

import pandas as pd
import numpy as np
from scipy.stats import kstest, jarque_bera, anderson


def normality_test(table, group_by=None, **params):
    check_required_parameters(_normality_test, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _normality_test)
    
    if group_by is not None:
        return _function_by_group(_normality_test, table, group_by=group_by, **params)
    else:
        return _normality_test(table, **params)


def _normality_test(table, input_cols, method=['kstest', 'jarque_bera', 'anderson']):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Normality test Result""")
    
    test_name = {'kstest': "Kolmogorov-Smirnov test",
                 'jarque_bera': "Jarque-Bera test",
                 'anderson': "Anderson-Darling test"}
    stats_name = {'kstest': "KS statistic, asymptotically Kolmogorov distribution under the null hypothesis.",
                 'jarque_bera': "JB statistic, asymptotically chi-square distribution with 2 degrees of freedom under the null hypothesis.",
                 'anderson': "A^2 statistic. The p-value is computed from the adjusted statistic."}
    
    if 'kstest' in method:
        stats_res = dict()
        stats_res['data'] = []
        stats_res['estimates'] = []
        stats_res['p_value'] = []
        result['kstest'] = dict()
        for input_col in input_cols:
            stats, pval = kstest(table[input_col], 'norm', mode='asymp')
            stats_res['data'].append(input_col)
            stats_res['estimates'].append(stats)
            stats_res['p_value'].append(pval)
            result['kstest'][input_col] = {'estimates':stats, 'p_value':pval}
        rb.addMD(strip_margin("""
        | ## {method} result
        |{stats_table}
        """.format(method=test_name['kstest'], stats_table=pandasDF2MD(pd.DataFrame(stats_res)))))
    if 'jarque_bera' in method:
        stats_res = dict()
        stats_res['data'] = []
        stats_res['estimates'] = []
        stats_res['p_value'] = []
        result['jarque_bera'] = dict()
        for input_col in input_cols:
            stats, pval = jarque_bera(table[input_col])
            stats_res['data'].append(input_col)
            stats_res['estimates'].append(stats)
            stats_res['p_value'].append(pval)
            result['jarque_bera'][input_col] = {'estimates':stats, 'p_value':pval}
        rb.addMD(strip_margin("""
        | ## {method} result
        |{stats_table}
        """.format(method=test_name['jarque_bera'], stats_table=pandasDF2MD(pd.DataFrame(stats_res)))))
    if 'anderson' in method:
        stats_res = dict()
        stats_res['data'] = []
        stats_res['estimates'] = []
        stats_res['critical value'] = []
        stats_res['significance level'] = []
        result['anderson'] = dict()
        for input_col in input_cols:
            stats, critical_val, significance_lvl = anderson(table[input_col], dist='norm')
            stats_res['data'] += [input_col] * len(critical_val)
            stats_res['estimates'] += [stats] * len(critical_val)
            stats_res['critical value'] += list(critical_val)
            stats_res['significance level'] += list(significance_lvl)
            result['anderson'][input_col] = {'estimates':[stats] * len(critical_val), 'critical value':list(critical_val), 'significance level':list(significance_lvl)}
        rb.addMD(strip_margin("""
        | ## {method} result
        |{stats_table}
        """.format(method=test_name['anderson'], stats_table=pandasDF2MD(pd.DataFrame(stats_res)))))
        
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
