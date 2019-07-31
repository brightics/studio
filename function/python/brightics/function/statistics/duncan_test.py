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
from statsmodels.stats.anova import anova_lm
import statsmodels.api as sm
import matplotlib.pyplot as plt
from statsmodels.formula.api import ols
from statsmodels.stats.libqsturng import qsturng
from statistics import harmonic_mean

def duncan_test(table, group_by=None, **params):
    check_required_parameters(_duncan_test, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _duncan_test)
    param_validation_check = [from_under(params, 0.001, 0.9, 'alpha')]
    validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_duncan_test, table, group_by=group_by, **params)
    else:
        return _duncan_test(table, **params)

def _duncan_test(table, response_cols, factor_col, alpha=0.05):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Duncan test Result""")
    
    for response_col in response_cols:
        mean_by_factor = table.groupby(factor_col).mean()[response_col].sort_values(ascending=False)
        count_by_factor = table.groupby(factor_col).count()[response_col]
        mean_all = table[response_col].mean()
        columns = list(table.columns)
        sse = np.sum([np.square(row[columns.index(response_col)]-mean_by_factor[row[columns.index(factor_col)]]) for row in table.values])
        df = table.shape[0] - count_by_factor.shape[0]
        mse = sse/df
        n = harmonic_mean(count_by_factor)
        sigma_d = np.sqrt(mse / n)
        classes = table[factor_col].unique()
        classes_cnt = len(classes)
        critical_val = dict()
        critical_val['p'] = range(2, classes_cnt+1)
        critical_val['critical_value'] = []
        p = 1 - alpha
        for i in range(1, classes_cnt):
            if p < 0.1 or p > 0.999:
                critical_val['critical_value'].append('Not statistically meaningful')
            else:
                critical_val['critical_value'].append(sigma_d * qsturng(p, i+1, df))
            p = p * (1 - alpha)
        comp_by_factor = dict()
        comp_by_factor['compared_factors'] = []
        comp_by_factor['difference'] = []
        comp_by_factor['critical_value'] = []
        comp_by_factor['significant'] = []
        titles = mean_by_factor.index
        for i in range(classes_cnt):
            for j in range(i+1, classes_cnt):
                title = str(titles[i]) + ' - ' + str(titles[j])
                comp_by_factor['compared_factors'].append(title)
                difference = abs(mean_by_factor[titles[i]] - mean_by_factor[titles[j]])
                comp_by_factor['difference'].append(difference)
                critical_value = critical_val['critical_value'][critical_val['p'].index(j-i+1)]
                comp_by_factor['critical_value'].append(critical_value)
                if isinstance(critical_value, (float,int)):
                    if difference > critical_value:
                        comp_by_factor['significant'].append('YES')
                    else:
                        comp_by_factor['significant'].append('NO')
                else:
                    comp_by_factor['significant'].append(critical_value)
        critical_val = pd.DataFrame(critical_val)
        mean_by_factor = pd.DataFrame(mean_by_factor).reset_index()
        comp_by_factor = pd.DataFrame(comp_by_factor)
            
        rb.addMD(strip_margin("""
        | ## {response_col} by {factor_col}
        |
        | ### Critical value
        | {critical_val}
        |
        | ### Mean value by factor
        | {mean_by_factor}
        |
        | ### Difference by factor
        | {comp_by_factor}
        """.format(response_col=response_col, factor_col=factor_col, 
            critical_val=pandasDF2MD(critical_val, num_rows=critical_val.shape[0]), 
            mean_by_factor=pandasDF2MD(mean_by_factor, num_rows=mean_by_factor.shape[0]), 
            comp_by_factor=pandasDF2MD(comp_by_factor, num_rows=comp_by_factor.shape[0]))))
            
        group = response_col + '_' + factor_col
        result[group] = dict()
        result[group]['critical_val'] = critical_val
        result[group]['mean_by_factor'] = mean_by_factor
        result[group]['comp_by_factor'] = comp_by_factor
        
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}