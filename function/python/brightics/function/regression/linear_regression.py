import numpy as np
import seaborn as sns
import statsmodels.api as sm
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def linear_regression_train(table, group_by=None, **params):
    check_required_parameters(_linear_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_linear_regression_train, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _linear_regression_train(table, **params)

    
def _linear_regression_train(table, feature_cols, label_col, fit_intercept=True):
    features = table[feature_cols]
    label = table[label_col]
    lr_model = LinearRegression(fit_intercept)
    lr_model.fit(features, label)

    predict = lr_model.predict(features)
    residual = label - predict

    if fit_intercept == True:
        lr_model_fit = sm.OLS(label, sm.add_constant(features)).fit()
    else:
        lr_model_fit = sm.OLS(label, features).fit()
    summary = lr_model_fit.summary().as_html()

    plt.figure()
    plt.scatter(predict, label)
    plt.xlabel('Predicted values for ' + label_col)
    plt.ylabel('Actual values for ' + label_col)
    x = predict
    y = np.array(label)
    a = x.size
    b = np.sum(x)
    c = b
    d = 0
    for i in x: d += +i * i
    e = np.sum(y)
    f = 0
    for i in range(0, x.size - 1): f += x[i] * y[i]
    det = a * d - b * c
    aa = (d * e - b * f) / det
    bb = (a * f - c * e) / det
    p1x = np.min(x)
    p1y = aa + bb * p1x
    p2x = np.max(x)
    p2y = aa + bb * p2x
    plt.plot([p1x, p2x], [p1y, p2y], 'r--')
    fig_actual_predict = plt2MD(plt)

    plt.figure()
    plt.scatter(predict, residual)
    plt.xlabel('Predicted values for ' + label_col)
    plt.ylabel('Residuals')
    plt.axhline(y=0, color='r', linestyle='--')
    fig_residual_1 = plt2MD(plt)

    plt.figure()
    sm.qqplot(residual, line='s')
    plt.ylabel('Residuals')
    fig_residual_2 = plt2MD(plt)

    plt.figure()
    sns.distplot(residual)
    plt.xlabel('Residuals')
    fig_residual_3 = plt2MD(plt)

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Linear Regression Result
    | ### Summary
    |
    """))
    rb.addHTML(summary)
    rb.addMD(strip_margin("""
    |
    | ### Predicted vs Actual
    | {image1}
    |
    | ### Fit Diagnostics
    | {image2}
    | {image3}
    | {image4}
    """.format(image1=fig_actual_predict,
               image2=fig_residual_1,
               image3=fig_residual_2,
               image4=fig_residual_3
               )))

    model = _model_dict('linear_regression_model')
    model['features'] = feature_cols
    model['label'] = label_col
    model['coefficients'] = lr_model_fit.params
    model['r2'] = lr_model_fit.rsquared
    model['adjusted_r2'] = lr_model_fit.rsquared_adj
    model['aic'] = lr_model_fit.aic
    model['bic'] = lr_model_fit.bic
    model['f_static'] = lr_model_fit.fvalue
    model['tvalues'] = lr_model_fit.tvalues
    model['pvalues'] = lr_model_fit.pvalues
    model['lr_model'] = lr_model
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}


def linear_regression_predict(table, model, **params):
    check_required_parameters(_linear_regression_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_linear_regression_predict, table, model, group_by=group_by, **params)
    else:
        return _linear_regression_predict(table, model, **params)


def _linear_regression_predict(table, model, prediction_col='prediction'):

    feature_cols = model['features']
    features = table[feature_cols]
    lr_model = model['lr_model']
    prediction = lr_model.predict(features)

    result = table.copy()
    result[prediction_col] = prediction
    
    return {'out_table' : result}
