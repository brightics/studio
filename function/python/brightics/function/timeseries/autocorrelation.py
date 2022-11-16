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

from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to, from_under

from statsmodels.graphics.tsaplots import plot_acf
from statsmodels.graphics.tsaplots import plot_pacf
from statsmodels.tsa.stattools import acf
from statsmodels.tsa.stattools import pacf
import pandas as pd
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
from matplotlib import pyplot as plt
from brightics.common.data_export import PyPlotData, PyPlotMeta


def autocorrelation(table, group_by=None, **params):
    check_required_parameters(_autocorrelation, params, ['table'])
    params = get_default_from_parameters_if_required(params, _autocorrelation)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'nlags'),
                              from_under(params, 0.0, 1.0, 'conf_level')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_autocorrelation, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _autocorrelation(table, **params)


def _autocorrelation(table, input_col, nlags=20, conf_level=0.95):
    data = table[input_col]

    figs = PyPlotData()

    plt.figure()
    plot_acf(data, lags=nlags, alpha=1 - conf_level)
    figs.addpltfig('fig_plt_acf', plt)
    plt.clf()

    plt.figure()
    plot_pacf(data, lags=nlags, alpha=1 - conf_level)
    figs.addpltfig('fig_plt_pacf', plt)
    plt.clf()

    acf_ret = acf(data, nlags=nlags, alpha=1 - conf_level)
    pacf_ret = pacf(data, nlags=nlags, alpha=1 - conf_level)

    result_table1 = pd.DataFrame([])
    result_table1['lag'] = list(range(nlags + 1))
    result_table1['ACF'] = acf_ret[0]

    if conf_level is not None:
        result_table1['%g%% confidence Interval' % (conf_level * 100)] = [str((acf_ret[1][i][0], acf_ret[1][i][1]))  for i in range(nlags + 1)]

    result_table2 = pd.DataFrame([])
    result_table2['lag'] = list(range(nlags + 1))
    result_table2['PACF'] = pacf_ret[0]

    if conf_level is not None:
        result_table2['%g%% confidence Interval' % (conf_level * 100)] = [str((pacf_ret[1][i][0], pacf_ret[1][i][1])) for i in range(nlags + 1)]

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""# Autocorrelation / Partial Autocorrelation Result"""))
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
    """.format(image1=figs.getMD('fig_plt_acf'), result_table1=pandasDF2MD(result_table1, num_rows=nlags + 1),
               image2=figs.getMD('fig_plt_pacf'), result_table2=pandasDF2MD(result_table2, num_rows=nlags + 1))))

    model = _model_dict('autocorrelation')
    model['autocorrelation_table'] = result_table1
    model['partial_autocorrelation_table'] = result_table2
    model['_repr_brtc_'] = rb.get()
    model['figures'] = figs.tojson()

    return {'model': model}
    
