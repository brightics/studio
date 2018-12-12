import matplotlib.pyplot as plt
import seaborn as sns
from brightics.common.repr import BrtcReprBuilder
from scipy import stats
import numpy as np
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than, greater_than_or_equal_to


def correlation(table, group_by=None, **params):
    check_required_parameters(_correlation, params, ['table'])
    if group_by is not None:
        return _function_by_group(_correlation, table, group_by=group_by, **params)
    else:
        return _correlation(table, **params)


def _correlation(table, vars, method='pearson', height=2.5, corr_prec=2):
    
    validate(greater_than(height, 0, 'height'),
             greater_than_or_equal_to(corr_prec, 1, 'corr_prec'))
    
    size = len(vars)
    
    s_default = plt.rcParams['lines.markersize'] ** 2.
    scatter_kws = {"s": s_default * height / 6.4}
    
    corr_arr = np.ones((size, size))  # TODO variable name dict
    p_arr = np.zeros((size, size))
    
    for i in range(size): 
        for j in range(i):
            if method == 'pearson':
                r, p = stats.pearsonr(table[vars[i]], table[vars[j]])
            elif method == 'spearman':
                r, p = stats.spearmanr(table[vars[i]], table[vars[j]])
            elif method == 'kendal':
                r, p = stats.kendalltau(table[vars[i]], table[vars[j]])
                
            corr_arr[i][j] = r
            p_arr[i][j] = p
    
    for i in range(size):
        for j in range(i, size):
            corr_arr[i][j] = corr_arr[j][i]
            p_arr[i][j] = p_arr[j][i]
        
    def corr(x, y, **kwargs):
        if kwargs['method'] == 'pearson':
            r, p = stats.pearsonr(x, y)
        elif kwargs['method'] == 'spearman':
            r, p = stats.spearmanr(x, y)
        elif kwargs['method'] == 'kendal':
            r, p = stats.kendalltau(x, y)
        
        p_stars = ''
        if p <= 0.05:
            p_stars = '*'
        if p <= 0.01:
            p_stars = '**'
        if p <= 0.001:
            p_stars = '***'
            
        corr_text = '{:.{prec}f}'.format(r, prec=corr_prec)
        print(type(corr_prec))
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
    
    rb = BrtcReprBuilder()
    rb.addPlt(plt)
    plt.clf()
    
    params = {'vars':vars, 'method':method, 'height':height}
    
    res = dict()
    res['params'] = params
    res['corr'] = corr_arr
    res['pvalue'] = p_arr
    res['_repr_brtc_'] = rb.get()
    
    return {'result': res}
