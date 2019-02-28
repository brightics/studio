import math
import pandas as pd
import scipy.stats
import numpy as np
from brightics.common.repr import BrtcReprBuilder, strip_margin, \
    pandasDF2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import less_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required

def ftest_for_stacked_data(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params,_ftest_for_stacked_data)
    param_validation_check = [greater_than_or_equal_to(params, 0, 'confi_level'),
                              less_than_or_equal_to(params, 1, 'confi_level')]
        
    validate(*param_validation_check)
    
    check_required_parameters(_ftest_for_stacked_data, params, ['table'])
    if group_by is not None:
        return _function_by_group(_ftest_for_stacked_data, table, group_by=group_by, **params)
    else:
        return _ftest_for_stacked_data(table, **params)

def _ftest_for_stacked_data(table, response_cols, factor_col, alternatives, first = None, second = None, confi_level=0.95):
   
    if first is not None or second is not None:
        check_table = np.array(table[factor_col])
        for element in check_table:
            if element is not None:
                if type(element) != str:
                    if type(element) == bool:
                        if first is not None and second is not None:
                            first = bool(first)
                            second = bool(second)
                            break
                        if first is not None:
                            first = bool(first)
                            break
                        second = bool(second)
                        break
                    else:
                        if first is not None and second is not None:
                            first = float(first)
                            second = float(second)
                            break
                        if first is not None:
                            first = float(first)
                            break
                        second = float(second)
                        break
                else:
                    break
    if first is None or second is None:
        tmp_factors = []
        if first is not None:
            tmp_factors += [first]
        if second is not None:
            tmp_factors += [second]
        for i in range(len(table[factor_col])):
            if table[factor_col][i] is not None and table[factor_col][i] not in tmp_factors:
                if len(tmp_factors) == 2:
                    raise Exception("There are more that 2 factors.")
                else:
                    tmp_factors += [table[factor_col][i]]
    if first is None:
        if tmp_factors[0] != second:
            first = tmp_factors[0]
        else:
            first = tmp_factors[1]
    if second is None:
        if tmp_factors[0] != first:
            second = tmp_factors[0]
        else:
            second = tmp_factors[1]
    table_first = table[table[factor_col] == first]
    table_second = table[table[factor_col] == second]
    tmp_table = []
    number1 = len(table_first[factor_col])
    number2 = len(table_second[factor_col])
    d_num = number1 - 1
    d_denum = number2 - 1
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    ## F Test for Stacked Data Result
    | - Confidence level = {confi_level}
    | - Statistics = F statistic, F distribution with {d_num} numerator degrees of freedom and {d_denum} degrees of freedom under the null hypothesis
    """.format(confi_level=confi_level, d_num=d_num, d_denum=d_denum)))

    for response_col in response_cols:
        tmp_model = []
        std1 = (table_first[response_col]).std()
        std2 = (table_second[response_col]).std()
        f_value = (std1 ** 2) / (std2 ** 2)

        if 'larger' in alternatives:
            p_value = scipy.stats.f.cdf(1 / f_value, d_num, d_denum)
            tmp_model += [['true ratio > 1'] + 
            [p_value] + [(f_value / (scipy.stats.f.ppf(confi_level, d_num, d_denum)), math.inf)]]
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] + 
            ['true ratio of variances > 1'] + 
            ['F statistic, F distribution with %d numerator degrees of freedom and %d degrees of freedom under the null hypothesis.' % (d_num, d_denum)] + 
            [f_value] + [p_value] + [confi_level] + [f_value / (scipy.stats.f.ppf(confi_level, d_num, d_denum))] + [math.inf]]

        if 'smaller' in alternatives:
            p_value = scipy.stats.f.cdf(f_value, d_num, d_denum)
            tmp_model += [['true ratio < 1'] + 
            [p_value] + [(0.0, f_value * (scipy.stats.f.ppf(confi_level, d_denum, d_num)))]]
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] + 
            ['true ratio of variances < 1'] + 
            ['F statistic, F distribution with %d numerator degrees of freedom and %d degrees of freedom under the null hypothesis.' % (d_num, d_denum)] + 
            [f_value] + [p_value] + [confi_level] + [0.0] + [f_value * (scipy.stats.f.ppf(confi_level, d_denum, d_num))]]

        if 'two-sided' in alternatives:
            p_value_tmp = scipy.stats.f.cdf(1 / f_value, d_num, d_denum)
            if p_value_tmp > 0.5:
                p_value = (1 - p_value_tmp) * 2
            else:
                p_value = p_value_tmp * 2
            tmp_model += [['true ratio != 1'] + 
            [p_value] + [(f_value / (scipy.stats.f.ppf((1 + confi_level) / 2, d_num, d_denum)), f_value * (scipy.stats.f.ppf((1 + confi_level) / 2, d_denum, d_num)))]]
            tmp_table += [['%s by %s(%s,%s)' % (response_col, factor_col, first, second)] +
            ['true ratio of variances != 1'] + 
            ['F statistic, F distribution with %d numerator degrees of freedom and %d degrees of freedom under the null hypothesis.' % (d_num, d_denum)] + 
            [f_value] + [p_value] + [confi_level] + [f_value / (scipy.stats.f.ppf((1 + confi_level) / 2, d_num, d_denum))] + [f_value * (scipy.stats.f.ppf((1 + confi_level) / 2, d_denum, d_num))]]

        result_model = pd.DataFrame.from_records(tmp_model)
        result_model.columns = ['alternative_hypothesis', 'p-value', '%g%% confidence interval' % (confi_level * 100)]
        rb.addMD(strip_margin("""
        | #### Data = {response_col} by {factor_col}({first},{second})
        | - F-value = {f_value}
        |
        | {result_model}
        |
        """.format(response_col=response_col, factor_col=factor_col, first=first, second=second, f_value=f_value, result_model=pandasDF2MD(result_model))))

    result = pd.DataFrame.from_records(tmp_table)
    result.columns = ['data', 'alternative_hypothesis', 'statistics', 'estimates', 'p_value', 'confidence_level', 'lower_confidence_interval', 'upper_confidence_interval']

    model = dict()
    model['_repr_brtc_'] = rb.get()
    return {'out_table' : result, 'model' : model}