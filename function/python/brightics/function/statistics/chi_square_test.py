from brightics.common.report import ReportBuilder, strip_margin, plt2MD, \
    pandasDF2MD, keyValues2MD

from scipy.stats import bartlett
import seaborn as sns
import statsmodels.api as sm
import matplotlib.pyplot as plt
from statsmodels.formula.api import ols
from statsmodels.sandbox.stats.multicomp import TukeyHSDResults
from statsmodels.stats.anova import anova_lm
from statsmodels.stats.multicomp import pairwise_tukeyhsd
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

from scipy import stats
from scipy.stats import chisquare
import pandas as pd
import numpy as np
import math
import array

def chi_square_test_for_independence(table, group_by=None, **params):
    check_required_parameters(_chi_square_test_for_independence, params, ['table'])
    if group_by is not None:
        return _function_by_group(_chi_square_test_for_independence, table, group_by=group_by, **params)
    else:
        return _chi_square_test_for_independence(table, **params)

def _chi_square_test_for_independence(table, response_cols, factor_col, correction=False):
    label_list = []
    feature_list = []
    alternative_hypothesis_list = []
    dof_list = []
    stat_chi_list = []
    p_chi_list = []
    for response_col in response_cols:
        response = table[response_col]
        contingency_table = pd.crosstab(table[response_col], table[factor_col], margins=True)
        response_index = len(contingency_table) - 1 
        factor_index = len(contingency_table.columns) - 1
        temporary = contingency_table.iloc[0:response_index, 0:factor_index]
        f_object = np.array(temporary)
        test = stats.chi2_contingency(f_object, correction, 1)[0:3]
        label = '{factor_col}'.format(factor_col=factor_col)
        feature = '{response_col}'.format(response_col=response_col)
        if test[1] < 0.05:
            dependence = 'Reject the null hypothesis that two categorical variables are independent at 5% significance level.'
        elif test[1] >= 0.05:
            dependence = 'No association was found between two categorical variables at 5% significance level.'
        elif math.isnan(test[1]):
            dependence = 'Independence of two categorical variables cannot be decided.'
        conclusion = '{dependence}'.format(dependence=dependence)
        alternative_hypothesis = 'Two categorical variables are dependent.'
        dof = 'chi-square distribution with {dof} degrees of freedom'.format(dof=test[2])
        stat_chi = '{stat_chi}'.format(stat_chi=test[0])
        p_chi = '{p_chi}'.format(p_chi=test[1])
        label_list.append(label)
        feature_list.append(feature)
        alternative_hypothesis_list.append(alternative_hypothesis)
        dof_list.append(dof)
        stat_chi_list.append(stat_chi)
        p_chi_list.append(p_chi)

    result_table = pd.DataFrame.from_items([ 
        ['label', label_list],
        ['feature', feature_list],
        ['alternative_hypothesis', alternative_hypothesis_list],
        ['df', dof_list],
        ['estimate', stat_chi_list],
        ['p_value', p_chi_list]
    ])


    result = dict()
    result['result_table'] = result_table
    
    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | ## Chi-square Test of Independence Result
    |  - H0: the two categorical variables are independent.
    |  - H1: the two categorical variables are dependent.
    """))
    for response_col in response_cols:
        response = table[response_col]
        contingency_table = pd.crosstab(table[response_col], table[factor_col], margins=True)
        response_index = len(contingency_table) - 1 
        factor_index = len(contingency_table.columns) - 1
        temporary = contingency_table.iloc[0:response_index, 0:factor_index]
        f_object = np.array(temporary)
        test = stats.chi2_contingency(f_object, correction, 1)[0:3]
        label = '{factor_col}'.format(factor_col=factor_col)
        feature = '{response_col}'.format(response_col=response_col)
        if test[1] < 0.05:
            dependence = 'Reject the null hypothesis that two categorical variables are independent at 5% significance level.'
        elif test[1] >= 0.05:
            dependence = 'No association was found between two categorical variables at 5% significance level.'
        elif math.isnan(test[1]):
            dependence = 'Independence of two categorical variables cannot be decided.'
        dof_simplelist = []
        stat_chi_simplelist = []
        p_chi_simplelist = []
        dof = '{dof}'.format(dof=test[2])
        stat_chi = '{stat_chi}'.format(stat_chi=test[0])
        p_chi = '{p_chi}'.format(p_chi=test[1])
        stat_chi_simplelist.append(stat_chi)
        dof_simplelist.append(dof)
        p_chi_simplelist.append(p_chi)
        result_table_simple = pd.DataFrame.from_items([ 
        ['estimate', stat_chi_simplelist],
        ['df', dof_simplelist],
        ['p_value', p_chi_simplelist]
        ])

        
        # test statistic = {test_statistic}, df = {dof}, p_value = {p_value}
# test_statistic = stats.chi2_contingency(f_object,correction,lambda_)[0], dof=stats.chi2_contingency(f_object,correction,lambda_)[2], p_value=stats.chi2_contingency(f_object,correction,lambda_)[1]
        rb.addMD(strip_margin("""
        |### Label: {label}, Feature: {feature}
        |  
        |{result_table_simple}
        |
        |{dependence}
        |
        |
        """.format(label=factor_col, feature=response_col, result_table_simple=pandasDF2MD(result_table_simple), dependence=dependence)))

    model = _model_dict('Chi-square test of independence')
    
    model['report'] = rb.get()
    
    result_table = result_table.copy()
    
    return {'model':model}
    
