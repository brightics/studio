from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import dict2MD, plt2MD, pandasDF2MD
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_to
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.groupby import _function_by_group
from brightics.function.utils import _model_dict

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.holtwinters import ExponentialSmoothing
import pmdarima as pm


def arima_train(table, group_by=None, **params):
    check_required_parameters(_arima_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _arima_train)
    param_validation_check = [greater_than_or_equal_to(params, 0, 'p'),
                              from_to(params, 0, 2, 'd'),
                              greater_than_or_equal_to(params, 0, 'q')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_arima_train, table, group_by=group_by, **params)
    else:
        return _arima_train(table, **params)


def _arima_train(table, input_cols, p, d, q, intercept=True):

    arima = pm.ARIMA(order=(p, d, q), with_intercept=intercept)
    model = _model_dict('arima_model')
    rb = BrtcReprBuilder()
    
    rb.addMD(strip_margin("""
        |## ARIMA Train Result
        |
        """.format()))

    for column in input_cols:
        arima_fit = arima.fit(table[column])
        model['arima_' + str(column)] = arima_fit
        
        rb.addMD(strip_margin("""
        |### Column : {col}
        |
        | - (p,d,q) order : ({p_val}, {d_val}, {q_val})
        | - Intercept : {itc}
        | - Coefficients Array : {ca}
        | - AIC : {aic}
        |
        """.format(col=column, p_val=p, d_val=d, q_val=q,
                   itc=intercept, ca=str(arima_fit.params().tolist()), aic=arima_fit.aic())))
        model['coefficients_array_' + str(column)] = arima_fit.params()
        model['aic_' + str(column)] = arima_fit.aic()

    model['input_columns'] = input_cols
    # model['order'] = arima_fit.order()
    model['intercept'] = intercept
    
    model['_repr_brtc_'] = rb.get()

    return{'model':model}
    

def arima_predict(model, **params):
    check_required_parameters(_arima_predict, params, ['model'])
    params = get_default_from_parameters_if_required(params,_arima_predict)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'prediction_num')]
    validate(*param_validation_check)
    if '_grouped_data' in model:
        return _function_by_group(_arima_predict, model=model, **params)
    else:
        return _arima_predict(model, **params)

    
def _arima_predict(model, prediction_num):
    
    df1 = pd.DataFrame()
    df2 = pd.DataFrame()
    df1['number'] = np.arange(1, prediction_num + 1, 1)
    for column in model['input_columns']:
        df2[column] = model['arima_' + str(column)].predict(prediction_num)
    predict_table = df1.join(df2)
       
    model['predict_table'] = predict_table
            
    return{'table':predict_table}
    

def auto_arima_train(table, group_by=None, **params):
    check_required_parameters(_auto_arima_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _auto_arima_train)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'max_p'),
                              from_to(params, 0, 2, 'd'),
                              greater_than_or_equal_to(params, 2, 'max_q')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_auto_arima_train, table, group_by=group_by, **params)
    else:
        return _auto_arima_train(table, **params)

    
def _auto_arima_train(table, input_cols, max_p=5, d=None, max_q=5):

    model = _model_dict('auto_arima_model')
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
        |## Auto ARIMA Train Result
        |
        """.format()))
    
    for column in input_cols:
        auto_arima = pm.auto_arima(table[column], d=d, max_p=max_p, max_q=max_q, seasonal=False)
        model['auto_arima_' + str(column)] = auto_arima
        
        rb.addMD(strip_margin("""
        |### Column : {col}
        |
        | - (p,d,q) order : ({p_val}, {d_val}, {q_val})
        | - Coefficients Array : {ca}
        | - AIC : {aic}
        |
        """.format(col=column, p_val=auto_arima.order[0], d_val=auto_arima.order[1], q_val=auto_arima.order[2],
                   ca=str(auto_arima.params().tolist()), aic=auto_arima.aic())))

        model['coefficients_array_' + str(column)] = auto_arima.params()
        model['aic_' + str(column)] = auto_arima.aic()

    model['input_columns'] = input_cols
    model['order'] = auto_arima.order
    model['_repr_brtc_'] = rb.get()

    return{'model':model}
        

def auto_arima_predict(model, **params):
    check_required_parameters(_auto_arima_predict, params, ['model'])
    params = get_default_from_parameters_if_required(params,_auto_arima_predict)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'prediction_num')]
    validate(*param_validation_check)
    if '_grouped_data' in model:
        return _function_by_group(_auto_arima_predict, model=model, **params)
    else:
        return _auto_arima_predict(model, **params)

    
def _auto_arima_predict(model, prediction_num):
    
    df1 = pd.DataFrame()
    df2 = pd.DataFrame()
    df1['number'] = np.arange(1, prediction_num + 1, 1)    
    for column in model['input_columns']:
        df2[column] = model['auto_arima_' + str(column)].predict(prediction_num)
    predict_table = df1.join(df2)
       
    model['predict_table'] = predict_table
            
    return{'table':predict_table}
