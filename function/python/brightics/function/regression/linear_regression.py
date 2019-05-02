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

import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt

import statsmodels.api as sm
from statsmodels.iolib.summary2 import _df_to_simpletable
from statsmodels.stats.outliers_influence import variance_inflation_factor

from brightics.common.repr import BrtcReprBuilder 
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils.table_converters import simple_tables2df_list
from brightics.function.utils import _model_dict
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required


def linear_regression_train(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params, _linear_regression_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'vif_threshold')]
        
    validate(*param_validation_check)
    check_required_parameters(_linear_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_linear_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _linear_regression_train(table, **params)

    
def _linear_regression_train(table, feature_cols, label_col, fit_intercept=True, is_vif=False, vif_threshold=10):
    features = table[feature_cols]
    label = table[label_col]

    if fit_intercept == True:
        features = sm.add_constant(features, has_constant='add')
        lr_model_fit = sm.OLS(label, features).fit()
    else:
        lr_model_fit = sm.OLS(label, features).fit()
    
    predict = lr_model_fit.predict(features)
    residual = label - predict

    summary = lr_model_fit.summary()
    summary_tables = simple_tables2df_list(summary.tables, drop_index=True)
    summary0 = summary_tables[0]
    summary1 = summary_tables[1]
    if is_vif:
        summary1['VIF'] = [variance_inflation_factor(features.values, i) for i in range(features.shape[1])]
        summary1['VIF>{}'.format(vif_threshold)] = summary1['VIF'].apply(lambda _: 'true' if _ > vif_threshold else 'false')
    summary.tables[1] = _df_to_simpletable(summary1)
    summary2 = summary_tables[2]

    html_result = summary.as_html()

    plt.figure()
    plt.scatter(predict, label)
    plt.xlabel('Predicted values for ' + label_col)
    plt.ylabel('Actual values for ' + label_col)
    x = predict
    p1x = np.min(x)
    p2x = np.max(x)
    plt.plot([p1x, p2x], [p1x, p2x], 'r--')
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
    rb.addHTML(html_result)
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
    model['fit_intercept'] = fit_intercept
    model['r2'] = lr_model_fit.rsquared
    model['adjusted_r2'] = lr_model_fit.rsquared_adj
    model['aic'] = lr_model_fit.aic
    model['bic'] = lr_model_fit.bic
    model['f_static'] = lr_model_fit.fvalue
    model['tvalues'] = lr_model_fit.tvalues
    model['pvalues'] = lr_model_fit.pvalues
    model['_repr_brtc_'] = rb.get()

    model['summary0'] = summary0
    model['summary1'] = summary1
    model['summary2'] = summary2
    lr_model_fit.remove_data()
    model['lr_model'] = lr_model_fit
    return {'model' : model}


def linear_regression_predict(table, model, **params):
    check_required_parameters(_linear_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_linear_regression_predict, table, model, **params)
    else:
        return _linear_regression_predict(table, model, **params)


def _linear_regression_predict(table, model, prediction_col='prediction'):

    result = table.copy()
    feature_cols = model['features']
    features = result[feature_cols]
    fit_intercept = model['fit_intercept']

    lr_model_fit = model['lr_model']

    if fit_intercept == True:
        features = sm.add_constant(features, has_constant='add')
        prediction = lr_model_fit.predict(features)
    else:
        prediction = lr_model_fit.predict(features)

    result[prediction_col] = prediction

    return {'out_table' : result}
