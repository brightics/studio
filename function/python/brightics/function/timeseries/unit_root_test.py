from statsmodels.tsa.stattools import adfuller
from brightics.common.repr import BrtcReprBuilder, strip_margin
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

def unit_root_test(table, group_by=None, **params):
    check_required_parameters(_unit_root_test, params, ['table'])
    if group_by is not None:
        return _function_by_group(_unit_root_test, table, group_by=group_by, **params)
    else:
        return _unit_root_test(table, **params)


def _unit_root_test(table, input_col, maxlag=None, regression='c', autolag='AIC'):
    if autolag == 'None':
        autolag = None
    result = adfuller(table[input_col], maxlag, regression, autolag)
    model = dict()
    if autolag is not None:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        ## Augmented Dickey-Fuller unit root test result
        | - null hypothesis : A unit root is present in a time series sample
        | - alternative hypothesis : There is no unit root
        | - Test statistic : {adf}
        | - p-value : {p_value}
        | - Number of observations used for the ADF regression and calculation of the critical values : {nobs}
        | - Number of lags used : {usedlag}
        | - Critical values for the test statistic at the 1 %, 5 %, and 10 % levels : {critical_values}
        | - The maximized information criterion if autolag is not None : {icbest}
        |
        """.format(adf = result[0], p_value = result[1], usedlag = result[2], nobs = result[3], critical_values = result[4], icbest = result[5])))
    else:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        ## Augmented Dickey-Fuller unit root test result
        | - null hypothesis : A unit root is present in a time series sample
        | - alternative hypothesis : There is no unit root
        | - Test statistic : {adf}
        | - p-value : {p_value}
        | - Number of observations used for the ADF regression and calculation of the critical values : {nobs}
        | - Number of lags used : {usedlag}
        | - Critical values for the test statistic at the 1 %, 5 %, and 10 % levels : {critical_values}
        |
        """.format(adf = result[0], p_value = result[1], usedlag = result[2], nobs = result[3], critical_values = result[4])))
    model['adf'] = result[0]
    model['p_value'] = result[1]
    model['usedlag'] = result[2]
    model['nobs'] = result[3]
    model['critical_values'] = result[4]
    if autolag is not None:
        model['icbest'] = result[5]
    model['_repr_brtc_'] = rb.get()
    
    return{'model':model}