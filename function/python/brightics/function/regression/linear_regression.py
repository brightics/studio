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
import pandas as pd
import seaborn as sns
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt

import statsmodels.api as sm
from statsmodels.iolib.summary2 import _df_to_simpletable
from statsmodels.stats.outliers_influence import variance_inflation_factor
from sklearn.base import BaseEstimator, RegressorMixin

from brightics.common.repr import BrtcReprBuilder 
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils.table_converters import simple_tables2df_list
from brightics.function.utils import _model_dict
from brightics.function.extraction import one_hot_encoder
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.classify_input_type import check_col_type
from brightics.common.data_export import PyPlotData, PyPlotMeta


class LRScikitLearnWrapper(BaseEstimator, RegressorMixin):
    # Wrapped Statsmodels Linear Regression model as a Scikit model class for grid search CV
    def __init__(self, fit_intercept=True):
        self.OLS = sm.OLS
        self.fit_intercept = fit_intercept

    def add_constant_if_fit_intercept(self, X):
        if self.fit_intercept:
            X = sm.add_constant(X, has_constant='add')
        return X

    def fit(self, X, y):
        self.model_ = self.OLS(y, self.add_constant_if_fit_intercept(X))
        self.results_ = self.model_.fit()
        return self

    def predict(self, X):
        return self.results_.predict(self.add_constant_if_fit_intercept(X))


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


def preprocess_():
    preprocess_result = {'estimator_class': LRScikitLearnWrapper,
                         'estimator_params': ['fit_intercept']}
    return preprocess_result


def postprocess_(table, feature_cols, label_col, regressor, is_vif, vif_threshold, fit_intercept):
    _, features = check_col_type(table, feature_cols)
    label = table[label_col]
    lr_model_fit = regressor.results_

    predict = regressor.predict(features)
    residual = label - predict

    summary = lr_model_fit.summary()
    summary_tables = simple_tables2df_list(summary.tables, drop_index=True)
    summary0 = summary_tables[0]
    summary1 = summary_tables[1]

    if type(features) != type(table):
        features = pd.DataFrame(features)
    if fit_intercept:
        features = sm.add_constant(features, has_constant='add')

    if is_vif:
        summary1['VIF'] = [variance_inflation_factor(features.values, i) for i in range(features.shape[1])]
        summary1['VIF>{}'.format(vif_threshold)] = summary1['VIF'].apply(
            lambda _: 'true' if _ > vif_threshold else 'false')
    summary.tables[1] = _df_to_simpletable(summary1)
    summary2 = summary_tables[2]

    html_result = summary.as_html()

    figs = PyPlotData()

    meta = PyPlotMeta('fig_actual_predict',
                      xlabel = 'Predicted values for ' + label_col,
                      ylabel = 'Actual values for ' + label_col)
    p1x = np.min(predict)
    p2x = np.max(predict)
    meta.scatter(predict, label)
    meta.plot([p1x, p2x], [p1x, p2x], 'r--')
    figs.addmeta(meta)

    meta = PyPlotMeta('fig_residual_1',
                      xlabel='Predicted values for ' + label_col,
                      ylabel='Residuals')
    meta.scatter(predict, residual)
    meta.axhline(0, color='r', linestyle='--')
    figs.addmeta(meta)

    meta = PyPlotMeta('fig_residual_2', ylabel='Residuals')
    meta.qqplot_sm(residual, line='s')
    figs.addmeta(meta)

    meta = PyPlotMeta('fig_residual_3', xlabel='Residuals')
    meta.distplot_sns(residual)
    figs.addmeta(meta)

    figs.compile()

    postprocess_result = {'update_md': {'Summary': (html_result, 'html'),
                                        'Predicted vs Actual': figs.getMD('fig_actual_predict'),
                                        'Fit Diagnostics 1': figs.getMD('fig_residual_1'),
                                        'Fit Diagnostics 2': figs.getMD('fig_residual_2'),
                                        'Fit Diagnostics 3': figs.getMD('fig_residual_3')},
                          'update_model_etc': {'summary0': summary0,
                                               'summary1': summary1,
                                               'summary2': summary2},
                          'type': 'linear_regression_model',
                          'figs': figs}
    return postprocess_result


def _linear_regression_train(table, feature_cols, label_col, fit_intercept=True, is_vif=False, vif_threshold=10):
    feature_names, features = check_col_type(table, feature_cols)
    label = table[label_col]

    lr_sklearn_model = LRScikitLearnWrapper(fit_intercept=fit_intercept)
    lr_sklearn_model.fit(features, label)
    lr_model_fit = lr_sklearn_model.results_

    postprocess_result = postprocess_(table, feature_cols, label_col, lr_sklearn_model, is_vif, vif_threshold, fit_intercept)
    update_md = postprocess_result['update_md']
    html_result = update_md['Summary']
    fig_actual_predict = update_md['Predicted vs Actual']
    fig_residual_1 = update_md['Fit Diagnostics 1']
    fig_residual_2 = update_md['Fit Diagnostics 2']
    fig_residual_3 = update_md['Fit Diagnostics 3']

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
    update_model_etc = postprocess_result['update_model_etc']
    model.update(update_model_etc)
    model['features'] = feature_cols
    model['label'] = label_col
    model['coefficients'] = lr_model_fit.params.values
    model['fit_intercept'] = fit_intercept
    model['r2'] = lr_model_fit.rsquared
    model['adjusted_r2'] = lr_model_fit.rsquared_adj
    model['aic'] = lr_model_fit.aic
    model['bic'] = lr_model_fit.bic
    model['f_static'] = lr_model_fit.fvalue
    model['tvalues'] = lr_model_fit.tvalues.values
    model['pvalues'] = lr_model_fit.pvalues.values
    model['_repr_brtc_'] = rb.get()
    summaries = postprocess_result['update_model_etc']
    model['summary0'] = summaries['summary0']
    model['summary1'] = summaries['summary1']
    model['summary2'] = summaries['summary2']
    lr_model_fit.remove_data()
    model['lr_model'] = lr_model_fit
    model['regressor'] = lr_sklearn_model
    model['feature_cols'] = feature_cols
    model['figures'] = postprocess_result['figs'].tojson()

    return {'model': model}


def linear_regression_predict(table, model, **params):
    check_required_parameters(_linear_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_linear_regression_predict, table, model, **params)
    else:
        return _linear_regression_predict(table, model, **params)


def _linear_regression_predict(table, model, prediction_col='prediction'):
    result = table.copy()
    if 'features' in model:
        feature_cols = model['features']
    else:
        feature_cols = model['feature_cols']
    if 'lr_model' in model or 'regressor' in model:
        feature_names, features = check_col_type(table, feature_cols)
        features = pd.DataFrame(features, columns=feature_names)
    else:
        features = table[feature_cols]
    if 'auto' in model:
        if model['auto']:
            one_hot_input = model['table_6'][model['table_6']['data_type']=='string'].index
            if len(one_hot_input != 0):
                features = one_hot_encoder(prefix='col_name', table=features, input_cols = features.columns[one_hot_input].tolist(),suffix='label')['out_table']
            if 'intercept' in model['table_3']['x_variable_name'].values:
                features = features[model['table_3']['x_variable_name'][:-1]]
                fit_intercept = True
            else:
                features = features[model['table_3']['x_variable_name']]
                fit_intercept = False
        else:
            one_hot_input = model['table_5'][model['table_5']['data_type']=='string'].index
            if len(one_hot_input != 0):
                features = one_hot_encoder(prefix='col_name',table=features, input_cols = features.columns[one_hot_input].tolist(),suffix='label')['out_table']
            if 'intercept' in model['table_2']['x_variable_name'].values:
                features = features[model['table_2']['x_variable_name'][:-1]]
                fit_intercept = True
            else:
                features = features[model['table_2']['x_variable_name']]
                fit_intercept = False
    if 'auto' not in model and 'fit_intercept' in model:
        fit_intercept = model['fit_intercept']
    if 'lr_model' in model:
        lr_model_fit = model['lr_model']
        if fit_intercept:
            features = sm.add_constant(features, has_constant='add')
        prediction = lr_model_fit.predict(features)
    elif 'regressor' in model:  # model from Grid Search CV
        lr_sklearn_model = model['regressor']
        prediction = lr_sklearn_model.predict(features)
    else:
        if 'auto' in model and model['auto']:
            coefficients = np.array(model['table_3']['coefficient'])
        else:
            coefficients = np.array(model['table_2']['coefficient'])
        if fit_intercept:
            features['const'] = np.ones(len(features))
        prediction = np.sum(features.values*coefficients,axis=1)
    result[prediction_col] = prediction

    return {'out_table': result}
