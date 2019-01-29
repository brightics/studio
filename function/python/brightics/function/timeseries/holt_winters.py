from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import dict2MD, plt2MD, pandasDF2MD
from brightics.common.utils import check_required_parameters
from brightics.common.groupby import _function_by_group
from brightics.function.utils import _model_dict

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing


def holt_winters_train(table, group_by=None, **params):
    check_required_parameters(_holt_winters_train, params, ['table'])
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
    if '_grouped_data' in model:
        return _function_by_group(_holt_winters_predict, model, **params)
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
    
    for column in model['input_columns']:
        plt.title(column)
        plt.plot(model['origin_table'][column].index, model['origin_table'][column], label='Train')
        plt.plot(df2[column].index, df2[column], label='Prediction')
        plt.legend(loc='best')
        rb.addMD(strip_margin("""
        |{plot}
        |
        """.format(plot=plt2MD(plt))))
        plt.clf()
        
    model['_repr_brtc_'] = rb.get()
    model['predict_table'] = predict_table
            
    return{'model':model, 'out_table':predict_table}
