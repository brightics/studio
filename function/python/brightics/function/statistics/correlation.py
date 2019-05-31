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

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, pandasDF2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than, greater_than_or_equal_to

import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import pandas as pd


def correlation(table, group_by=None, **params):
    check_required_parameters(_correlation, params, ['table'])
    params = get_default_from_parameters_if_required(params, _correlation)
    param_validation_check = [greater_than(params, 0, 'height'),
                              greater_than_or_equal_to(params, 1, 'corr_prec')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_correlation, table, group_by=group_by, **params)
    else:
        return _correlation(table, **params)


def _correlation(table, vars, method='pearson', display_plt = True, height=2.5, corr_prec=2):

    size = len(vars)
    result_arr = []
    
    for i in range(size): 
        for j in range(i):
            if method == 'pearson':
                r, p = stats.pearsonr(table[vars[i]], table[vars[j]])
            elif method == 'spearman':
                r, p = stats.spearmanr(table[vars[i]], table[vars[j]])
            else:
                r, p = stats.kendalltau(table[vars[i]], table[vars[j]])
            
            result_arr.append([vars[i], vars[j], r, p])    
            
    df_result = pd.DataFrame(result_arr, columns=['x', 'y', 'corr', 'p_value'])

    rb = BrtcReprBuilder()    
    if display_plt:
        s_default = plt.rcParams['lines.markersize'] ** 2.
        scatter_kws = {"s": s_default * height / 6.4}
        
        def corr(x, y, **kwargs):
            if kwargs['method'] == 'pearson':
                r, p = stats.pearsonr(x, y)
            elif kwargs['method'] == 'spearman':
                r, p = stats.spearmanr(x, y)
            else:
                r, p = stats.kendalltau(x, y)
            
            p_stars = ''
            if p <= 0.05:
                p_stars = '*'
            if p <= 0.01:
                p_stars = '**'
            if p <= 0.001:
                p_stars = '***'
                
            corr_text = '{:.{prec}f}'.format(r, prec=corr_prec)
            font_size = abs(r) * 15 * 2 / corr_prec + 5
            ax = plt.gca()
            ax.annotate(corr_text, [.5, .5, ], xycoords="axes fraction",
                        ha='center', va='center', fontsize=font_size * height)
            ax.annotate(p_stars, xy=(0.65, 0.6), xycoords=ax.transAxes, color='red', fontsize=17 * height)
         
        g = sns.PairGrid(table, vars=vars, height=height)
        g.map_diag(sns.distplot)
        if method == 'pearson':
            g.map_lower(sns.regplot, scatter_kws=scatter_kws)
        else:
            g.map_lower(sns.regplot, lowess=True, scatter_kws=scatter_kws) 
        g.map_upper(corr, method=method)
        
        fig_corr = plt2MD(plt)
        plt.clf()
        
        rb.addMD(strip_margin(
            """ ## Correlation Results
            | ### Correlation Matrix
            | {fig_corr}
            |
            | ### Correlation Table
            | {table}
            """.format(fig_corr=fig_corr, table=pandasDF2MD(df_result))))
        
        params = {'vars':vars, 'method':method, 'height':height}
        
    else:
        rb.addMD(strip_margin(
            """ ## Correlation Results
            | ### Correlation Table
            | {table}
            """.format(table=pandasDF2MD(df_result))))
        
        params = {'vars':vars, 'method':method}       
    
    res = dict()
    res['params'] = params
    res['corr_table'] = df_result
    res['_repr_brtc_'] = rb.get()
    
    return {'result': res}