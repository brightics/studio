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

from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import dict2MD, plt2MD, pandasDF2MD
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to, from_to
from brightics.common.groupby import _function_by_group
from brightics.function.utils import _model_dict
from brightics.common.data_export import PyPlotData, PyPlotMeta

import numpy as np
import pandas as pd
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing


def holt_winters_train(table, group_by=None, **params):
    len_table = len(table)
    check_required_parameters(_holt_winters_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _holt_winters_train)
    param_validation_check = [from_to(params, 2, (len_table) // 2, 'period')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_holt_winters_train, table, group_by=group_by, **params)
    else:
        return _holt_winters_train(table, **params)


def _holt_winters_train(table, input_cols, period, model_type='additive'):

    rb = BrtcReprBuilder()
    model = _model_dict('holt_winters_train')
    rb.addMD(strip_margin("""
        |
        |## Holt-Winters Train Result
        |
        """.format()))

    for column in input_cols:
        hw = ExponentialSmoothing(table[column], trend=model_type, seasonal=model_type, seasonal_periods=period).fit()
        model['hw_' + str(column)] = hw
        model['origin_table'] = table

        rb.addMD(strip_margin("""
        |
        |### Column : {col}
        |
        | - Model Type : {mt}
        | - Period : {pd}
        | - SSE : {sse}
        | - AIC : {aic}
        | - BIC : {bic}
        |
        """.format(col=column,
                   mt=model_type,
                   pd=period,
                   sse=hw.sse,
                   aic=hw.aic,
                   bic=hw.bic)))
        model['sse_' + str(column)] = hw.sse
        model['aic_' + str(column)] = hw.aic
        model['bic_' + str(column)] = hw.bic

    model['input_columns'] = input_cols
    model['_repr_brtc_'] = rb.get()
    model['model_type'] = model_type
    model['period'] = period

    return{'model':model}


def holt_winters_predict(model, **params):
    check_required_parameters(_holt_winters_predict, params, ['model'])
    params = get_default_from_parameters_if_required(params, _holt_winters_predict)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'prediction_num')]
    validate(*param_validation_check)
    if '_grouped_data' in model:
        return _function_by_group(_holt_winters_predict, model=model, **params)
    else:
        return _holt_winters_predict(model, **params)


def _holt_winters_predict(model, prediction_num):

    rb = BrtcReprBuilder()

    df1 = pd.DataFrame()
    df2 = pd.DataFrame()
    df1['number'] = np.arange(1, prediction_num + 1, 1)
    for column in model['input_columns']:
        df2[column] = model['hw_' + str(column)].forecast(prediction_num)
    reindex_df2 = df2.reset_index(drop=True)
    predict_table = df1.join(reindex_df2)

    rb.addMD(strip_margin("""
        |## Holt-Winters Predict Result
        |
        """.format()))

    figs = PyPlotData()

    for idx, column in enumerate(model['input_columns']):
        plt.title(column)
        plt.plot(model['origin_table'][column].index, model['origin_table'][column], label='Train')
        plt.plot(df2[column].index, df2[column], label='Prediction')
        plt.legend(loc='best')
        figname = 'data' + str(idx)
        figs.addpltfig(figname, plt)
        rb.addMD(strip_margin("""
        |{plot}
        |
        """.format(plot=figs.getMD(figname))))
        plt.clf()

    model['_repr_brtc_'] = rb.get()
    model['predict_table'] = predict_table
    model['figure'] = figs.tojson()

    return{'model':model, 'out_table':predict_table}
