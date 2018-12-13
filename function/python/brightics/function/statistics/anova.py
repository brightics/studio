from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, \
    pandasDF2MD, keyValues2MD

from scipy.stats import bartlett
import seaborn as sns
import statsmodels.api as sm
import matplotlib.pyplot as plt
from statsmodels.formula.api import ols
from statsmodels.sandbox.stats.multicomp import TukeyHSDResults
from statsmodels.stats.anova import anova_lm
from statsmodels.stats.multicomp import pairwise_tukeyhsd
import numpy as np
import pandas as pd
from brightics.common.exception import BrighticsFunctionException


def bartletts_test(table, response_cols, factor_col):
    groups = table[factor_col].unique()
    
    data_list = []
    stat_list = []
    p_list = []
    for response_col in response_cols:
        response = table[response_col]
        stat_bart, p_bart = bartlett(*[response[table[factor_col] == group] for group in groups])
        data = '{response_col} by {factor_col}'.format(response_col=response_col, factor_col=factor_col)
        data_list.append(data)
        stat_list.append(stat_bart)
        p_list.append(p_bart)
        
    result_table = pd.DataFrame.from_items([ 
        ['data', data_list],
        ['estimate', stat_list],
        ['p_value', p_list] 
    ])
    
    result = dict()
    result['result_table'] = result_table
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    ## Bartlett's Test Result
    | - H0: k population variances are equal.
    | - H1: at least two variances are different.
    |
    | {result_table}
    """.format(result_table=pandasDF2MD(result_table))))
    
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
    
    
def oneway_anova(table, response_cols, factor_col):
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    ## One-way Analysis of Variance Result
    """))
    groups = table[factor_col].unique()
    groups.sort()
    sum_len = np.sum([ len(str(group)) for group in groups ])
    
    result = dict()
    result['_grouped_data'] = dict()
    
    for response_col in response_cols:
        data = table[response_col]
        result['_grouped_data'][response_col] = dict()
        
        ax = sns.boxplot(x=factor_col, y=response_col, data=table, order=groups)
        if sum_len > 512:
            ax.set_xticklabels(ax.get_xticklabels(), rotation=90)
        elif sum_len > 64:
            ax.set_xticklabels(ax.get_xticklabels(), rotation=45)
            
        fig_box = plt2MD(plt)
        plt.clf()
        
        model = ols("""Q('{response_col}') ~ C(Q('{factor_col}'))""".format(response_col=response_col, factor_col=factor_col), table).fit()  # TODO factor_col = class => error
        anova = anova_lm(model)
        
        anova_df = pandasDF2MD(anova)
        
        p_value = anova["""PR(>F)"""][0]
        
        residual = model.resid
        
        sns.distplot(residual)
        distplot = plt2MD(plt)
        plt.clf()
        
        sm.qqplot(residual, line='s')
        qqplot = plt2MD(plt)
        plt.clf()
            
        rb.addMD(strip_margin("""
        | ## {response_col} by {factor_col}
        | {fig_box}
        |
        | ### ANOVA
        | {anova_df}
        | 
        | ### Diagnostics
        | {distplot}
        |
        | {qqplot}
        """.format(response_col=response_col, factor_col=factor_col, fig_box=fig_box, anova_df=anova_df, distplot=distplot, qqplot=qqplot)))
        
        result['_grouped_data'][response_col]['p_value'] = p_value
        
    result['_repr_brtc_'] = rb.get()
    return {'result': result}
    
    
def tukeys_range_test(table, response_cols, factor_col, alpha=0.05):
    if alpha < 0.001 or alpha >= 0.9: 
        raise BrighticsFunctionException("0006", ['alpha', 0.001, 0.9])
    
    rb = BrtcReprBuilder()
    rb.addMD("""## Tukey's range test Result""")
    
    for response_col in response_cols:
        data = table[response_col]
        posthoc = pairwise_tukeyhsd(data, table[factor_col], alpha=alpha)
        posthoc_html = posthoc._results_table.as_html()
        posthoc.plot_simultaneous()
        
        rb.addMD("""### {response_col}""".format(response_col=response_col))
        rb.addHTML(posthoc_html)
        rb.addPlt(plt)
        plt.clf()
    
    return {'result': {'_repr_brtc_': rb.get()}}
