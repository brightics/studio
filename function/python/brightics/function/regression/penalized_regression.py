from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, pandasDF2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import raise_runtime_error

import pandas as pd
import numpy as np
import seaborn as sns
import statsmodels.api as sm
import matplotlib.pyplot as plt
from pandas import Series
from sklearn.linear_model import Lasso, Ridge, ElasticNet
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score


def penalized_regression_train(table, group_by=None, **params):
    check_required_parameters(_penalized_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_penalized_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _penalized_regression_train(table, **params)

    
def _penalized_regression_train(table, feature_cols, label_col, regression_type='ridge', alpha=1.0, l1_ratio=0.5, fit_intercept=True, max_iter=1000, tol=0.0001, random_state=None):
    out_table = table.copy()
    features = out_table[feature_cols]
    label = out_table[label_col]
    if regression_type == 'ridge':
        regression_model = Ridge(alpha=alpha, fit_intercept=fit_intercept, max_iter=None, tol=tol, solver='auto', random_state=random_state)
    elif regression_type == 'lasso':
        regression_model = Lasso(alpha=alpha, fit_intercept=fit_intercept, max_iter=max_iter, tol=tol, random_state=random_state, selection='random')
    elif regression_type == 'elastic_net':
        regression_model = ElasticNet(alpha=alpha, l1_ratio=l1_ratio, fit_intercept=fit_intercept, max_iter=max_iter, tol=tol, random_state=random_state, selection='random')
    else:
        raise_runtime_error("Please check 'regression_type'.")
    
    regression_model.fit(features, label)
    
    out_table1 = pd.DataFrame([])
    out_table1['x_variable_name'] = [variable for variable in feature_cols]
    out_table1['coefficient'] = regression_model.fit(features, label).coef_
    coefficient = pd.DataFrame([['intercept', regression_model.fit(features, label).intercept_]], columns=['x_variable_name', 'coefficient'])
    if fit_intercept == True:
        out_table1 = out_table1.append(coefficient, ignore_index=True)
        
    predict = regression_model.predict(features)
    residual = label - predict
    
    out_table['predict'] = predict
    out_table['residual'] = residual

    if regression_type=='elastic_net':
        params = {
        
        'Feature Columns' : feature_cols,
        'Label Column' : label_col,
        'Regression Type': regression_type,
        'Regularization (Penalty Weight)' : alpha,
        'L1 Ratio': l1_ratio,
        'Fit Intercept' : fit_intercept,
        'Number of Iterations' : regression_model.fit(features, label).n_iter_,
        'Tolerance' : tol
        
        }
    else:
        params = {
        
        'Feature Columns' : feature_cols,
        'Label Column' : label_col,
        'Regression Type': regression_type,
        'Regularization (Penalty Weight)' : alpha,
        'Fit Intercept' : fit_intercept,
        'Number of Iterations' : regression_model.fit(features, label).n_iter_,
        'Tolerance' : tol
        
        }
    
    score = {
        'MSE' : mean_squared_error(label, predict),
        'R2' : r2_score(label, predict)
    }

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
    plt.clf()

    plt.figure()
    plt.scatter(predict, residual)
    plt.xlabel('Predicted values for ' + label_col)
    plt.ylabel('Residuals')
    plt.axhline(y=0, color='r', linestyle='--')
    fig_residual_1 = plt2MD(plt)
    plt.clf()

    plt.figure()
    sm.qqplot(residual, line='s')
    plt.ylabel('Residuals')
    fig_residual_2 = plt2MD(plt)
    plt.clf()

    plt.figure()
    sns.distplot(residual)
    plt.xlabel('Residuals')
    fig_residual_3 = plt2MD(plt)
    plt.clf()
    
    # checking the magnitude of coefficients
    
    plt.figure()
    predictors = features.columns
    coef = Series(regression_model.coef_, predictors).sort_values()
    coef.plot(kind='bar', title='Model Coefficients')
    fig_model_coefficients = plt2MD(plt)
    plt.clf()

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Penalized Regression Result
    | #### Selected Parameters: 
    | {params}
    | ### Results
    | #### Model Parameters
    | {out_table1}
    |
    | #### Prediction and Residual
    | {out_table2}
    |
    | #### Regression Score
    | {score}
    |
    """.format(params=dict2MD(params), out_table1=pandasDF2MD(out_table1), out_table2=pandasDF2MD(out_table, num_rows=len(out_table) + 1), score=dict2MD(score))))
    rb.addMD(strip_margin("""
    |
    | ### Predicted vs Actual
    | {image1}
    |
    | ### Fit Diagnostics
    | {image2}
    | {image3}
    | {image4}
    |
    | ### Magnitude of Coefficients
    | {image5}
    """.format(image1=fig_actual_predict,
               image2=fig_residual_1,
               image3=fig_residual_2,
               image4=fig_residual_3,
               image5=fig_model_coefficients
               )))

    model = _model_dict('penalized_regression_model')
    model['feature_cols'] = feature_cols
    model['label_col'] = label_col
    model['regression_type'] = regression_type
    # model['coefficients'] = regression_model_fit.params
    model['regression_model'] = regression_model
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}


def penalized_regression_predict(table, model, **params):
    check_required_parameters(_penalized_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_penalized_regression_predict, table, model, **params)
    else:
        return _penalized_regression_predict(table, model, **params)


def _penalized_regression_predict(table, model, prediction_col='prediction'):
    result = table.copy()
    feature_cols = model['feature_cols']
    regression_model = model['regression_model']
    prediction = regression_model.predict(result[feature_cols])
    
    result[prediction_col] = prediction
    
    return {'out_table' : result}
