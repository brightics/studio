from brightics.common.report import ReportBuilder, strip_margin, plt2MD, dict2MD, \
    pandasDF2MD, keyValues2MD
from brightics.function.utils import _model_dict
from brightics.common.utils import check_required_parameters

import numpy as np
import pandas as pd
import math
from math import sqrt
import seaborn as sns
import matplotlib.pyplot as plt
import scipy.stats
from scipy.stats import t
from scipy import mean
from statsmodels.stats.weightstats import ttest_ind


def one_sample_ttest(table, input_cols, alternatives, hypothesized_mean=0, conf_level=0.95):

    n = len(table)
    degree = n - 1
    alpha = 1.0 - conf_level
    out_table = pd.DataFrame() 
        
    # statistics
    statistics = "t statistic, t distribution with %d degrees of freedom under the null hypothesis." % degree
        
    # Print model
    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    ## One Sameple T Test Result
    | - Statistics = {s}
    | - Hypothesized mean = {h} 
    | - Confidence level = {cl}
    """.format(s=statistics, h=hypothesized_mean, cl=conf_level)))
       
    for input_col in input_cols:
        # model
        alter_list = []
        p_list = []
        CI_list = []
     
        # data
        data = input_col
        
        # estimates
        result = stats.ttest_1samp(table[input_col], hypothesized_mean)
        estimates = result[0]

        cols = ['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'lower_confidence_interval', 'upper_confidence_interval']  

        for i in alternatives:            
            if (i == 'Greater'):
                # alternative hypothesis
                alternative_hypothesis = "true mean >" + str(hypothesized_mean)
                # p-values
                p_value = 1.0 - t.cdf(estimates, degree)
                # confidence interval - greater
                critical_val = t.ppf(1.0 - alpha, degree)
                width = critical_val * np.std(table[input_col]) / math.sqrt(n - 1)
                lower_conf_interval = np.mean(table[input_col]) - width
                upper_conf_interval = math.inf
                
                # model
                alter = 'true mean > {hypothesized_mean}'.format(hypothesized_mean=hypothesized_mean)
                alter_list.append(alter)
                p_list.append(p_value)
                conf_interval = '({lower_conf_interval}, {upper_conf_interval})'.format(lower_conf_interval=lower_conf_interval, upper_conf_interval=upper_conf_interval)
                CI_list.append(conf_interval)               
                # out_table
                list = []
                list.append([data, alternative_hypothesis, statistics, estimates, p_value, conf_level, lower_conf_interval, upper_conf_interval])
                out_table = out_table.append(pd.DataFrame(list, columns=cols))

            if (i == 'Less'):
                # alternative hypothesis
                alternative_hypothesis = "true mean <" + str(hypothesized_mean)
                p_value = t.cdf(estimates, degree)
                # confidence interval - less
                critical_val = t.ppf(1.0 - alpha, degree)
                width = critical_val * np.std(table[input_col]) / math.sqrt(n - 1)
                lower_conf_interval = -math.inf
                upper_conf_interval = np.mean(table[input_col]) + width
                
                # model
                alter = 'true mean < {hypothesized_mean}'.format(hypothesized_mean=hypothesized_mean)
                alter_list.append(alter)
                p_list.append(p_value)
                conf_interval = '({lower_conf_interval}, {upper_conf_interval})'.format(lower_conf_interval=lower_conf_interval, upper_conf_interval=upper_conf_interval)
                CI_list.append(conf_interval)               
                # out_table
                list = []
                list.append([data, alternative_hypothesis, statistics, estimates, p_value, conf_level, lower_conf_interval, upper_conf_interval])
                out_table = out_table.append(pd.DataFrame(list, columns=cols))

            if (i == 'Two Sided'):
                # alternative hypothesis
                alternative_hypothesis = "true mean !=" + str(hypothesized_mean)
                # p_value = (1.0 - t.cdf(abs(estimates), degree)) * 2.0
                if (estimates >= 0):
                    p_value = 2.0 * t.cdf(-estimates, degree)
                else:
                    p_value = 2.0 * t.cdf(estimates, degree) 
                # confidence interval - two-sided
                critical_val = t.ppf(1.0 - alpha / 2, degree)
                width = critical_val * np.std(table[input_col]) / math.sqrt(n - 1)
                lower_conf_interval = np.mean(table[input_col]) - width
                upper_conf_interval = np.mean(table[input_col]) + width
                
                # model
                alter = 'true mean != {hypothesized_mean}'.format(hypothesized_mean=hypothesized_mean)
                alter_list.append(alter)
                p_list.append(p_value)
                conf_interval = '({lower_conf_interval}, {upper_conf_interval})'.format(lower_conf_interval=lower_conf_interval, upper_conf_interval=upper_conf_interval)
                CI_list.append(conf_interval)               
                # out_table
                list = []
                list.append([data, alternative_hypothesis, statistics, estimates, p_value, conf_level, lower_conf_interval, upper_conf_interval])
                out_table = out_table.append(pd.DataFrame(list, columns=cols))                           
        
        # Print model     
        conf_level_percent = conf_level * 100  
        result_table = pd.DataFrame.from_items([ 
            ['alternative hypothesis', alter_list],
            ['p-value', p_list],
            ['%g%% confidence Interval' % conf_level_percent, CI_list]
        ])
        
        result = dict()
        result['result_table'] = result_table
        rb.addMD(strip_margin("""
        ### Data = {input_col}
        | - Estimates = {estimates} 
        |
        | {result_table}
        """.format(input_col=input_col, estimates=estimates, result_table=pandasDF2MD(result_table))))
        
    # print model
    result['report'] = rb.get()
        
    return {'out_table':out_table, 'model':result}


def two_sample_ttest_for_stacked_data(table, response_cols, factor_col, alternatives, first, second, hypo_diff=0, equal_vari='pooled', confi_level=0.95):

    if(type(table[factor_col][0]) == str):
        table_first = table[table[factor_col] == first]
        table_second = table[table[factor_col] == second]
    else:
        table_first = table[table[factor_col] == float(first)]
        table_second = table[table[factor_col] == float(second)]
        
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
            f_test_p_value_tmp = scipy.stats.f.cdf(1 / f_value, number1 - 1, number2 - 1)
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
                margin = t.ppf((confi_level) , df) * std_number1number2 * sqrt(1 / number1 + 1 / number2)
            if(equal_vari == 'unequal'):
                margin = t.ppf((confi_level) , df) * sqrt(std1 ** 2 / (number1) + std2 ** 2 / (number2))
            tmp_model += [['true difference in means != 0.0'] + 
            [ttestresult[1]] + [(mean1 - mean2 - margin, mean1 - mean2 + margin)]]
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] + 
            ['true difference in means != 0.0'] + 
            ['t statistic, t distribution with %f degrees of freedom under the null hypothesis' % ttestresult[2]] + 
            [ttestresult[0]] + [ttestresult[1]] + [confi_level] + [mean1 - mean2 - margin] + [mean1 - mean2 + margin]]
            
        result_model = pd.DataFrame.from_records(tmp_model)
        result_model.columns = ['alternatives', 'p values', '%g%% confidence interval' % (confi_level * 100)]
        rb.addMD(strip_margin("""
        | #### Data = {response_col}
		
        | - Statistics = t statistic, t distribution with {ttestresult2} degrees of freedom under the null hypothesis
        |
        | {result_model}
        |
        """.format(ttestresult2=ttestresult[2], response_col=response_col, ttestresult0=ttestresult[0], result_model=pandasDF2MD(result_model))))
        if(start_auto == 1):
            equal_vari = 'auto'
    result = pd.DataFrame.from_records(tmp_table)
    result.columns = ['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'lower_confidence_interval', 'upper_confidence_interval']

    model = dict()
    model['report'] = rb.get()    
    return {'out_table' : result, 'model' : model}


def paired_ttest(table, first_column, second_column, alternative, hypothesized_difference=0, confidence_level=0.95):
    df = len(table) - 1
    diff_mean = abs(table[first_column] - table[second_column]).mean()
    std_dev = np.sqrt(((diff_mean - abs(table[first_column] - table[second_column])) * (diff_mean - abs(table[first_column] - table[second_column]))).mean())
    ans = stats.ttest_rel(table[first_column], table[second_column] + hypothesized_difference)
    t_value = ans[0]
    p_value_ul = ans[1]
    p_value_u = stats.t.sf(t_value, 149)
    p_value_l = stats.t.cdf(t_value, 149)

    left_u = diff_mean - std_dev * stats.t.isf((1 - confidence_level), df) / np.sqrt(df)
    right_u = np.Infinity
    left_l = -np.Infinity
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
                 'upper_confidence_interval' : right_u}]
    result_value_l = [{'data' : first_column + " , " + second_column,
                 'alternative_hypothesis' : "true difference in means < " + str(hypothesized_difference),
                 'statistics' : "t statistics, t distribution with " + str(df) + " degrees of freedom under the null hypothesis",
                 'estimates' : t_value,
                 'p_value' : p_value_l,
                 'confidence_level' : confidence_level,
                 'low_confidence_interval' : left_l,
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

    params = {'Input columns' : first_column + ", " + second_column, 'Hypothesized difference' : str(hypothesized_difference), 'Confidence level' : str(confidence_level)}

    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | ## Paired T Test Result
    |
    |df|mean_difference|standard_deviation|t_value
    |--|--|--|--
    |{deg_f}|{dm}|{sd}|{tv}
    """.format(deg_f=df, dm=diff_mean, sd=std_dev, tv=t_value, params=dict2MD(params))))

    if 'greater' in alternative:
        rb.addMD(strip_margin("""
        | - H0 : true diffrence in means is less than or equal to {hd}.
        | - H1 : true diffrence in means is larger than {hd}.
        |
        |p_value|confidence_level|confidence_interval
        |--|--|--
        |{pvu}|{con_lv}|({l_u}, {r_u})
        |
        """.format(pvu=p_value_u, hd=str(hypothesized_difference), con_lv=str(confidence_level), l_u=left_u, r_u=right_u)))

    if 'less' in alternative:
        rb.addMD(strip_margin("""
        | - H0 : true diffrence in means is larger than or equal to {hd}.
        | - H1 : true diffrence in means is less than {hd}.
        |
        |p_value|confidence_level|confidence_interval
        |--|--|--
        |{pvl}|{con_lv}|({l_l}, {r_l})
        |
        """.format(pvl=p_value_l, hd=str(hypothesized_difference), con_lv=str(confidence_level), l_l=left_l, r_l=right_l)))
        
    if 'twosided' in alternative:
        rb.addMD(strip_margin("""
        | - H0 : true diffrence in means is equal to {hd}.
        | - H1 : true diffrence in means is not equal to {hd}.
        |
        |p_value|confidence_level|confidence_interval
        |--|--|--
        |{pvul}|{con_lv}|({l_ul}, {r_ul})
        |
        """.format(pvul=p_value_ul, hd=str(hypothesized_difference), con_lv=str(confidence_level), l_ul=left_ul, r_ul=right_ul)))

    model = dict()
    model['report'] = rb.get()

    return{'out_table':df_result, 'model':model}
