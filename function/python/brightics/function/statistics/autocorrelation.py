from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

from statsmodels.graphics.tsaplots import plot_acf
from statsmodels.graphics.tsaplots import plot_pacf
from statsmodels.tsa.stattools import acf
from statsmodels.tsa.stattools import pacf
import pandas as pd
from matplotlib import pyplot as plt


def autocorrelation(table, group_by=None, **params):
    check_required_parameters(_autocorrelation, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_autocorrelation, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _autocorrelation(table, **params)


    
def _autocorrelation(table, input_col, nlags=20, alpha=0.05):
    data = table[input_col]
    
    plt.figure()
    plot_acf(data, lags=nlags, alpha=alpha)
    fig_plt_acf = plt2MD(plt)
    plt.clf()
    
    plt.figure()
    plot_pacf(data, lags=nlags, alpha=alpha)
    fig_plt_pacf = plt2MD(plt)
    plt.clf()
    
    acf_ret = acf(data, nlags=nlags, alpha=alpha)
    pacf_ret = pacf(data, nlags=nlags, alpha=alpha)
    
    result_table1 = pd.DataFrame([])
    result_table1['lag'] = list(range(nlags+1))
    result_table1['ACF'] = acf_ret[0]
    
    if alpha is not None:
        result_table1['confidence_interval_' + str(int((1 - alpha) * 100)) + '%'] = [str([acf_ret[1][i][0], acf_ret[1][i][1]])  for i in range(nlags + 1)]
    
    result_table2 = pd.DataFrame([])
    result_table2['lag'] = [i for i in range(nlags + 1)]
    result_table2['PACF'] = pacf_ret[0]
    
    if alpha is not None:
        result_table2['confidence_interval_' + str(int((1 - alpha) * 100)) + '%'] = [str([pacf_ret[1][i][0], pacf_ret[1][i][1]]) for i in range(nlags + 1)]
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""### Auto / Partial Auto Correlation Result"""))
    rb.addMD(strip_margin("""
    |## Autocorrelation
    |
    |{image1}
    |
    |### Autocorrelation Table
    |
    |{result_table1}
    |
    |## Partial Autocorrelation
    |
    |{image2}
    |
    |### Partial Autocorrelation Table
    |
    |{result_table2}
    |
    """.format(image1=fig_plt_acf, result_table1=pandasDF2MD(result_table1, num_rows=nlags + 1), image2=fig_plt_pacf, result_table2=pandasDF2MD(result_table2, num_rows=nlags + 1))))

    model = _model_dict('autocorrelation')
    model['autocorrelation_table'] = result_table1
    model['partial_autocorrelation_table'] = result_table2
    model['_repr_brtc_'] = rb.get()
        
    return {'model':model}
    
