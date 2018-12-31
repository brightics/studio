from brightics.common.report import ReportBuilder, strip_margin, plt2MD, dict2MD, \
    pandasDF2MD, keyValues2MD
from brightics.function.utils import _model_dict
from brightics.common.utils import check_required_parameters
from brightics.common.groupby import _function_by_group
import numpy as np
import pandas as pd
import math
from math import sqrt
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.stats import t
from scipy import mean, stats
from statsmodels.stats.weightstats import ttest_ind


def one_sample_ttest(table, group_by=None, **params):
    check_required_parameters(_one_sample_ttest, params, ['table'])
    if group_by is not None:
        return _function_by_group(_one_sample_ttest, table, group_by=group_by, **params)
    else:
        return _one_sample_ttest(table, **params)

        
def _width(col, alpha, n):
    # t.ppf(1.0 - alpha, n-1) is a t-critical value
    return stats.t.ppf(1.0 - alpha, n - 1) * col.std() / np.sqrt(n) 


def _one_sample_ttest(table, input_cols, alternatives, hypothesized_mean=0, conf_level=0.95):

    cols = ['data', 'alternative_hypothesis', 'statistics', 't_value', 'p_value', 'confidence_level', 'lower_confidence_interval', 'upper_confidence_interval']  
    out_table = pd.DataFrame(columns=cols) 
    n = len(table)   
    alpha = 1.0 - conf_level
    statistics = "T statistic, T distribution with %d degrees of freedom under the null hypothesis." % (n - 1)
        
    # ## Build model
    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    ## One Sample T Test Result
    | - Statistics = {s}
    | - Hypothesized mean = {h} 
    | - Confidence level = {cl}
    """.format(s=statistics, h=hypothesized_mean, cl=conf_level)))
       
    for input_col in input_cols:
    
        col = table[input_col]
        
        H1_list = []
        p_list = []
        CI_list = []
        
        # width of the confidence interval
        width_one_sided = _width(col, alpha, n)
        width_two_sided = _width(col, alpha / 2, n)
     
        # t-statistic, two-tailed p-value 
        t_value, p_value_two = stats.ttest_1samp(col, hypothesized_mean)
        
        # one-tailed p-value for Greater
        if t_value >= 0:
            p_value_one = p_value_two / 2
        else:
            p_value_one = 1.0 - p_value_two / 2        

        for alter in alternatives:            
            if alter == 'Greater':
                H1 = 'true mean > {hypothesized_mean}'.format(hypothesized_mean=hypothesized_mean)    
                p_value = p_value_one
                lower_conf_interval = np.mean(col) - width_one_sided
                upper_conf_interval = np.inf 
                   
            if alter == 'Less':
                H1 = 'true mean < {hypothesized_mean}'.format(hypothesized_mean=hypothesized_mean)
                p_value = 1.0 - p_value_one
                lower_conf_interval = -np.inf
                upper_conf_interval = np.mean(col) + width_one_sided
                           
            if alter == 'Two Sided':
                H1 = 'true mean != {hypothesized_mean}'.format(hypothesized_mean=hypothesized_mean)            
                p_value = p_value_two              
                lower_conf_interval = np.mean(col) - width_two_sided
                upper_conf_interval = np.mean(col) + width_two_sided
                                  
            # ## Build out_table
            out = pd.Series([input_col, H1, statistics, t_value, p_value, conf_level, lower_conf_interval, upper_conf_interval], index=cols)           
            out_table = out_table.append(out, ignore_index=True)                 
            
            # ## Build model  
            H1_list.append(H1)
            p_list.append(p_value)
            CI_list.append('({lower_conf_interval}, {upper_conf_interval})'.format(lower_conf_interval=lower_conf_interval, upper_conf_interval=upper_conf_interval))                 
        
        # ## Build model     
        result_table = pd.DataFrame.from_items([ 
            ['alternative hypothesis', H1_list],
            ['p-value', p_list],
            ['%g%% confidence Interval' % (conf_level * 100), CI_list]
        ])       
        rb.addMD(strip_margin("""
        ### Data = {input_col}
        | - T-value = {t_value} 
        |
        | {result_table}
        """.format(input_col=input_col, t_value=t_value, result_table=pandasDF2MD(result_table))))
        
    model = dict()    
    model['report'] = rb.get()
        
    return {'out_table':out_table, 'model':model}


def two_sample_ttest_for_stacked_data(table, group_by=None, **params):
    check_required_parameters(_two_sample_ttest_for_stacked_data, params, ['table'])
    if group_by is not None:
        return _function_by_group(_two_sample_ttest_for_stacked_data, table, group_by=group_by, **params)
    else:
        return _two_sample_ttest_for_stacked_data(table, **params)


def _two_sample_ttest_for_stacked_data(table, response_cols, factor_col, alternatives, first=None , second=None , hypo_diff=0, equal_vari='pooled', confi_level=0.95):

    if(type(table[factor_col][0]) != str):
        if(type(table[factor_col][0]) == bool):
            if(first != None):
                first = bool(first)
            if(second != None):
                second = bool(second)
        else:
            if(first != None):
                first = float(first)
            if(second != None):
                second = float(second)
    if(first == None or second == None):
        tmp_factors = []
        if(first != None):
            tmp_factors += [first]
        if(second != None):
            tmp_factors += [second]
        for i in range(len(table[factor_col])):
            if(table[factor_col][i] != None and table[factor_col][i] not in tmp_factors):
                if(len(tmp_factors) == 2):
                    raise Exception("There are more that 2 factors.")
                else:
                    tmp_factors += [table[factor_col][i]]
    if(first == None):    
        if(tmp_factors[0] != second):
            first = tmp_factors[0]
        else:
            first = tmp_factors[1]
    if(second == None):
        if(tmp_factors[0] != first):
            second = tmp_factors[0]
        else:
            second = tmp_factors[1]
    table_first = table[table[factor_col] == first]
    table_second = table[table[factor_col] == second]
    tmp_table = []

    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    ## Two Sample T Test for Stacked Data Result
    | - Hypothesized mean = {hypo_diff}
    | - Confidence level = {confi_level}
    """.format(hypo_diff=hypo_diff, confi_level=confi_level)))
    
    for response_col in response_cols:
        tmp_model = []
        number1 = len(table_first[response_col])
        number2 = len(table_second[response_col])
        mean1 = (table_first[response_col]).mean()
        mean2 = (table_second[response_col]).mean()
        std1 = (table_first[response_col]).std()
        std2 = (table_second[response_col]).std()
        start_auto = 0
        if(equal_vari == 'auto'):
            start_auto = 1
            f_value = (std1 ** 2) / (std2 ** 2)
            f_test_p_value_tmp = stats.f.cdf(1 / f_value, number1 - 1, number2 - 1)
            if(f_test_p_value_tmp > 0.5):
                f_test_p_value = (1 - f_test_p_value_tmp) * 2
            else:
                f_test_p_value = f_test_p_value_tmp * 2
            if(f_test_p_value < 0.05):
                equal_vari = 'unequal'
            else:
                equal_vari = 'pooled'
        ttestresult = ttest_ind(table_first[response_col], table_second[response_col], 'larger', usevar=equal_vari, value=hypo_diff)
        
        if 'larger' in alternatives:
            ttestresult = ttest_ind(table_first[response_col], table_second[response_col], 'larger', usevar=equal_vari, value=hypo_diff)
            df = ttestresult[2]
            if(equal_vari == 'pooled'):    
                std_number1number2 = sqrt(((number1 - 1) * (std1) ** 2 + (number2 - 1) * (std2) ** 2) / (number1 + number2 - 2))
                margin = t.ppf((confi_level) , df) * std_number1number2 * sqrt(1 / number1 + 1 / number2)
            if(equal_vari == 'unequal'):
                margin = t.ppf((confi_level) , df) * sqrt(std1 ** 2 / (number1) + std2 ** 2 / (number2))
            tmp_model += [['true difference in means > 0.0'] + 
            [ttestresult[1]] + [(mean1 - mean2 - margin, math.inf)]]
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] + 
            ['true difference in means > 0.0'] + 
            ['t statistic, t distribution with %f degrees of freedom under the null hypothesis' % ttestresult[2]] + 
            [ttestresult[0]] + [ttestresult[1]] + [confi_level] + [mean1 - mean2 - margin] + [math.inf]]
            
        if 'smaller' in alternatives:
            ttestresult = ttest_ind(table_first[response_col], table_second[response_col], 'smaller', usevar=equal_vari, value=hypo_diff)
            df = ttestresult[2]
            if(equal_vari == 'pooled'):    
                std_number1number2 = sqrt(((number1 - 1) * (std1) ** 2 + (number2 - 1) * (std2) ** 2) / (number1 + number2 - 2))
                margin = t.ppf((confi_level) , df) * std_number1number2 * sqrt(1 / number1 + 1 / number2)
            if(equal_vari == 'unequal'):
                margin = t.ppf((confi_level) , df) * sqrt(std1 ** 2 / (number1) + std2 ** 2 / (number2))
            tmp_model += [['true difference in means < 0.0'] + 
            [ttestresult[1]] + [(-math.inf, mean1 - mean2 + margin)]] 
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] + 
            ['true difference in means < 0.0'] + 
            ['t statistic, t distribution with %f degrees of freedom under the null hypothesis' % ttestresult[2]] + 
            [ttestresult[0]] + [ttestresult[1]] + [confi_level] + [-math.inf] + [mean1 - mean2 + margin]] 
            
        if 'two-sided' in alternatives:
            ttestresult = ttest_ind(table_first[response_col], table_second[response_col], 'two-sided', usevar=equal_vari, value=hypo_diff)
            df = ttestresult[2]
            if(equal_vari == 'pooled'):    
                std_number1number2 = sqrt(((number1 - 1) * (std1) ** 2 + (number2 - 1) * (std2) ** 2) / (number1 + number2 - 2))
                margin = t.ppf((confi_level + 1) / 2 , df) * std_number1number2 * sqrt(1 / number1 + 1 / number2)
            if(equal_vari == 'unequal'):
                margin = t.ppf((confi_level + 1) / 2 , df) * sqrt(std1 ** 2 / (number1) + std2 ** 2 / (number2))
            tmp_model += [['true difference in means != 0.0'] + 
            [ttestresult[1]] + [(mean1 - mean2 - margin, mean1 - mean2 + margin)]]
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] + 
            ['true difference in means != 0.0'] + 
            ['t statistic, t distribution with %f degrees of freedom under the null hypothesis' % ttestresult[2]] + 
            [ttestresult[0]] + [ttestresult[1]] + [confi_level] + [mean1 - mean2 - margin] + [mean1 - mean2 + margin]]
            
        result_model = pd.DataFrame.from_records(tmp_model)
        result_model.columns = ['alternatives', 'p values', '%g%% confidence interval' % (confi_level * 100)]
        rb.addMD(strip_margin("""
        | #### Data = {response_col} by {factor_col}({first},{second})
        
        | - Statistics = t statistic, t distribution with {ttestresult2} degrees of freedom under the null hypothesis
        | - T-value = {ttestresult0}
        |
        | {result_model}
        |
        """.format(ttestresult2=ttestresult[2], response_col=response_col, factor_col=factor_col, first=first, second=second, ttestresult0=ttestresult[0], result_model=pandasDF2MD(result_model))))
        if(start_auto == 1):
            equal_vari = 'auto'
    result = pd.DataFrame.from_records(tmp_table)
    result.columns = ['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'lower_confidence_interval', 'upper_confidence_interval']

    model = dict()
    model['report'] = rb.get()    
    return {'out_table' : result, 'model' : model}


def paired_ttest(table, group_by=None, **params):
    check_required_parameters(_paired_ttest, params, ['table'])
    if group_by is not None:
        return _function_by_group(_paired_ttest, table, group_by=group_by, **params)
    else:
        return _paired_ttest(table, **params)


def _paired_ttest(table, first_column, second_column, alternative = ['greater', 'less', 'twosided'], hypothesized_difference=0, confidence_level=0.95):
    df = len(table) - 1
    diff_mean = (table[first_column] - table[second_column]).mean()
    std_dev = np.std(table[first_column] - table[second_column])
    t_value = stats.ttest_rel(table[first_column], table[second_column] + hypothesized_difference)[0]
    p_value_ul = stats.ttest_rel(table[first_column], table[second_column] + hypothesized_difference)[1]
    p_value_u = stats.t.sf(t_value, df)
    p_value_l = stats.t.cdf(t_value, df)

    left_u = diff_mean - std_dev * stats.t.isf((1 - confidence_level), df) / np.sqrt(df)
    right_l = diff_mean + std_dev * stats.t.isf((1 - confidence_level), df) / np.sqrt(df)
    left_ul = diff_mean - std_dev * stats.t.isf((1 - confidence_level) / 2, df) / np.sqrt(df)
    right_ul = diff_mean + std_dev * stats.t.isf((1 - confidence_level) / 2, df) / np.sqrt(df)

    result_value_u = [{'data' : first_column + " , " + second_column,
                 'alternative_hypothesis' : "true difference in means > " + str(hypothesized_difference),
                 'statistics' : "t statistics, t distribution with " + str(df) + " degrees of freedom under the null hypothesis",
                 'estimates' : t_value,
                 'p_value' : p_value_u,
                 'confidence_level' : confidence_level,
                 'low_confidence_interval' : left_u,
                 'upper_confidence_interval' : np.Infinity}]
    result_value_l = [{'data' : first_column + " , " + second_column,
                 'alternative_hypothesis' : "true difference in means < " + str(hypothesized_difference),
                 'statistics' : "t statistics, t distribution with " + str(df) + " degrees of freedom under the null hypothesis",
                 'estimates' : t_value,
                 'p_value' : p_value_l,
                 'confidence_level' : confidence_level,
                 'low_confidence_interval' :-np.Infinity,
                 'upper_confidence_interval' : right_l}]
    result_value_ul = [{'data' : first_column + " , " + second_column,
                 'alternative_hypothesis' : "true difference in means != " + str(hypothesized_difference),
                 'statistics' : "t statistics, t distribution with " + str(df) + " degrees of freedom under the null hypothesis",
                 'estimates' : t_value,
                 'p_value' : p_value_ul,
                 'confidence_level' : confidence_level,
                 'low_confidence_interval' : left_ul,
                 'upper_confidence_interval' : right_ul}]

    df_result = pd.DataFrame()
    df_u = pd.DataFrame(result_value_u, columns=['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'low_confidence_interval', 'upper_confidence_interval'])
    df_l = pd.DataFrame(result_value_l, columns=['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'low_confidence_interval', 'upper_confidence_interval'])
    df_ul = pd.DataFrame(result_value_ul, columns=['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'low_confidence_interval', 'upper_confidence_interval'])

    if 'greater' in alternative:
        df_result = df_result.append(df_u, ignore_index=True)
    if 'less' in alternative:
        df_result = df_result.append(df_l, ignore_index=True)
    if 'twosided' in alternative:
        df_result = df_result.append(df_ul, ignore_index=True)

    result_table_ul = pd.DataFrame([{'Alternative': 'Two Sided', 'H1': 'true difference in means != ' + str(hypothesized_difference), 't_value': t_value, 'p_value': p_value_ul, str(confidence_level * 100) + '% confidence interval': '(' + str(left_ul) + ', ' + str(right_ul) + ')'}])
    result_table_u = pd.DataFrame([{'Alternative': 'Greater', 'H1': 'true difference in means > ' + str(hypothesized_difference), 't_value': t_value, 'p_value': p_value_u, str(confidence_level * 100) + '% confidence interval': '(' + str(left_u) + ', ' + str(np.Infinity) + ')'}])
    result_table_l = pd.DataFrame([{'Alternative': 'Less', 'H1': 'true difference in means < ' + str(hypothesized_difference), 't_value': t_value, 'p_value': p_value_l, str(confidence_level * 100) + '% confidence interval': '(' + str(-np.Infinity) + ', ' + str(right_l) + ')'}])
    result_table = pd.DataFrame()

    if 'greater' in alternative:
        result_table = result_table.append(result_table_u, ignore_index=True)
    if 'less' in alternative:
        result_table = result_table.append(result_table_l, ignore_index=True)
    if 'twosided' in alternative:
        result_table = result_table.append(result_table_ul, ignore_index=True)

    ordered_result_table = pd.DataFrame(result_table, columns=['Alternative', 'H1', 't_value', 'p_value', str(confidence_level * 100) + '% confidence interval'])

    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    |## Paired T Test Result
    |##### df : {deg_f}
    |##### Mean of differences : {dm}
    |##### Standard deviation : {sd}
    |
    |{result_table}
    |
    """.format(deg_f=df, dm=diff_mean, sd=std_dev, result_table=pandasDF2MD(ordered_result_table))))

    model = dict()
    model['report'] = rb.get()

    return{'out_table':df_result, 'model':model}
