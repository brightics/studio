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

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, pandasDF2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import validate, greater_than_or_equal_to, less_than_or_equal_to, greater_than, from_to
from brightics.common.classify_input_type import check_col_type
from brightics.common.data_export import PyPlotData, PyPlotMeta

import pandas as pd
import numpy as np
import seaborn as sns
import statsmodels.api as sm
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from pandas import Series
from sklearn.linear_model import Lasso, Ridge, ElasticNet
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
from sklearn.base import BaseEstimator, RegressorMixin


class PenalizedLinearRegressor(BaseEstimator, RegressorMixin):
    def __init__(self, regression_type='ridge', alpha=1.0, fit_intercept=True, max_iter=1000, tol=0.0001, l1_ratio=0.5,
                 random_state=None):
        self.regression_type = regression_type
        self.alpha = alpha
        self.fit_intercept = fit_intercept
        self.max_iter = max_iter
        self.tol = tol
        self.l1_ratio = l1_ratio
        self.random_state = random_state
        if regression_type == 'ridge':
            self.model_ = Ridge(alpha=self.alpha,
                                fit_intercept=self.fit_intercept,
                                max_iter=self.max_iter,
                                tol=self.tol,
                                random_state=self.random_state,
                                solver='auto')
        elif regression_type == 'lasso':
            self.model_ = Lasso(alpha=self.alpha,
                                fit_intercept=self.fit_intercept,
                                max_iter=self.max_iter,
                                tol=self.tol,
                                random_state=self.random_state,
                                selection='random')
        elif regression_type == 'elastic_net':
            self.model_ = ElasticNet(alpha=self.alpha,
                                     fit_intercept=self.fit_intercept,
                                     max_iter=self.max_iter,
                                     tol=self.tol,
                                     random_state=self.random_state,
                                     l1_ratio=self.l1_ratio,
                                     selection='random')
        else:
            raise_runtime_error("Please check 'regression_type'.")

    def fit(self, X, y):
        self.results_ = self.model_.fit(X, y)
        self.coef_ = self.results_.coef_
        self.intercept_ = self.results_.intercept_
        return self

    def predict(self, X):
        return self.results_.predict(X)


def penalized_linear_regression_train(table, group_by=None, **params):
    check_required_parameters(_penalized_linear_regression_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _penalized_linear_regression_train)
    param_validation_check = [greater_than_or_equal_to(params, 0.0, 'alpha'),
                              from_to(params, 0.0, 1.0, 'l1_ratio'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 0.0, 'tol')]
    validate(*param_validation_check)
    if group_by is not None:
        grouped_model = _function_by_group(_penalized_linear_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _penalized_linear_regression_train(table, **params)

    
def preprocess_():
    preprocess_result = {'estimator_class': PenalizedLinearRegressor,
                         'estimator_params': ['regression_type', 'alpha', 'fit_intercept', 'max_iter', 'tol',
                                              'l1_ratio', 'random_state']}
    return preprocess_result


def postprocess_(table, feature_cols, label_col, regressor, fit_intercept):
    feature_names, features = check_col_type(table, feature_cols)
    label = table[label_col]

    out_table = table.copy()
    out_table1 = pd.DataFrame([])
    out_table1['x_variable_name'] = [variable for variable in feature_names]
    out_table1['coefficient'] = regressor.fit(features, label).coef_
    intercept = pd.DataFrame([['intercept', regressor.fit(features, label).intercept_]],
                             columns=['x_variable_name', 'coefficient'])
    if fit_intercept:
        out_table1 = out_table1.append(intercept, ignore_index=True)

    predict = regressor.predict(features)
    residual = label - predict

    out_table['predict'] = predict
    out_table['residual'] = residual

    score = {
        'MSE': mean_squared_error(label, predict),
        'R2': r2_score(label, predict)
    }

    figs = PyPlotData()
    meta = PyPlotMeta('fig_actual_predict',
                      xlabel='Predicted values for ' + label_col,
                      ylabel='Actual values for ' + label_col)
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

    # checking the magnitude of coefficients

    coef = Series(regressor.coef_, feature_names).sort_values()
    meta = PyPlotMeta('fig_model_coefficients', title='Model Coefficients')
    meta.bar(coef.index, coef.values, color='b', align='center')
    meta.tight_layout()
    figs.addmeta(meta)

    figs.compile()


    postprocess_result = {'update_md': {'Model Parameters': pandasDF2MD(out_table1),
                                        'Regression Score': dict2MD(score),
                                        'Predicted vs Actual': figs.getMD('fig_actual_predict'),
                                        'Fit Diagnostics 1': figs.getMD('fig_residual_1'),
                                        'Fit Diagnostics 2': figs.getMD('fig_residual_2'),
                                        'Fit Diagnostics 3': figs.getMD('fig_residual_3'),
                                        'Magnitude of Coefficients': figs.getMD('fig_model_coefficients')},
                          'update_model_etc': {'out_table1': out_table1},
                          'type': 'penalized_linear_regression_model',
                          'figs': figs}

    return postprocess_result


def _penalized_linear_regression_train(table, feature_cols, label_col, regression_type='ridge', alpha=1.0, l1_ratio=0.5, fit_intercept=True, max_iter=1000, tol=0.0001, random_state=None):
    out_table = table.copy()
    feature_names, features = check_col_type(out_table, feature_cols)
    label = out_table[label_col]
    regression_model = PenalizedLinearRegressor(regression_type=regression_type, alpha=alpha,
                                                fit_intercept=fit_intercept, max_iter=max_iter, tol=tol,
                                                l1_ratio=l1_ratio, random_state=random_state)

    regression_model.fit(features, label)

    postprocess_result = postprocess_(table, feature_cols, label_col, regression_model, fit_intercept)
    update_md = postprocess_result['update_md']
    model_params = update_md['Model Parameters']
    score = update_md['Regression Score']
    fig_actual_predict = update_md['Predicted vs Actual']
    fig_residual_1 = update_md['Fit Diagnostics 1']
    fig_residual_2 = update_md['Fit Diagnostics 2']
    fig_residual_3 = update_md['Fit Diagnostics 3']
    fig_model_coefficients = update_md['Magnitude of Coefficients']

    if regression_type == 'elastic_net':
        params = {
            'Feature Columns': feature_names,
            'Label Column': label_col,
            'Regression Type': regression_type,
            'Regularization (Penalty Weight)': alpha,
            'L1 Ratio': l1_ratio,
            'Fit Intercept': fit_intercept,
            'Maximum Number of Iterations': max_iter,
            'Tolerance': tol
        }
    else:
        params = {
            'Feature Columns': feature_names,
            'Label Column': label_col,
            'Regression Type': regression_type,
            'Regularization (Penalty Weight)': alpha,
            'Fit Intercept': fit_intercept,
            'Maxium Number of Iterations': max_iter,
            'Tolerance': tol
        }

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | # Penalized Linear Regression Result
    | ### Selected Parameters: 
    | {params}
    |
    | ## Results
    | ### Model Parameters
    | {out_table1}
    |
    | ### Regression Score
    | {score}
    |
    """.format(params=dict2MD(params), out_table1=model_params, score=score)))
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
    |
    """.format(image1=fig_actual_predict,
               image2=fig_residual_1,
               image3=fig_residual_2,
               image4=fig_residual_3,
               image5=fig_model_coefficients
               )))

    model = _model_dict('penalized_linear_regression_model')
    model['feature_cols'] = feature_cols
    model['label_col'] = label_col
    model['regression_type'] = regression_type
    model['regressor'] = regression_model
    model['parameters'] = params
    model['model_parameters'] = postprocess_result['update_model_etc']['out_table1']
    model['prediction_residual'] = out_table
    model['_repr_brtc_'] = rb.get()
    model['figures'] = postprocess_result['figs'].tojson()

    return {'model': model}


def penalized_linear_regression_predict(table, model, **params):
    check_required_parameters(_penalized_linear_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_penalized_linear_regression_predict, table, model, **params)
    else:
        return _penalized_linear_regression_predict(table, model, **params)


def _penalized_linear_regression_predict(table, model, prediction_col='prediction'):
    # migration logic
    if 'regression_model' in model:
        model['regressor'] = model['regression_model']

    result = table.copy()
    feature_cols = model['feature_cols']
    feature_names, features = check_col_type(result, feature_cols)
    regression_model = model['regressor']
    prediction = regression_model.predict(features)
    
    result[prediction_col] = prediction
    
    return {'out_table' : result}
