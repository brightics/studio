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

from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from brightics.common.groupby import _function_by_group
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
import pandas as pd
from brightics.common.repr import strip_margin
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import pandasDF2MD
from brightics.function.utils import _model_dict
from sklearn.cross_decomposition import PLSRegression as PLS
from brightics.common.validation import validate
from brightics.common.classify_input_type import check_col_type


def pls_regression_train(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(
        params, _pls_regression_train)
    check_required_parameters(_pls_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(
            _pls_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _pls_regression_train(table, **params)


def _pls_regression_train(table, feature_cols, label_cols, n_components=2, scale=True, max_iter=500, tol=1e-6):
    pls_model = PLS(n_components=n_components, scale=scale, max_iter=max_iter, tol=tol)
    _, features = check_col_type(table, feature_cols)
    _, labels = check_col_type(table, label_cols)
    pls_model.fit(features, labels)
    predict = pls_model.predict(features)
    _mean_absolute_error = mean_absolute_error(labels, predict)
    _mean_squared_error = mean_squared_error(labels, predict)
    _r2_score = r2_score(labels, predict)
    result_table = pd.DataFrame.from_items([
        ['Metric', ['Mean Absolute Error', 'Mean Squared Error', 'R2 Score']],
        ['Score', [_mean_absolute_error, _mean_squared_error, _r2_score]]
    ])
    label_name = {
        'n_components': 'Number of components',
        'scale': "Scale",
        'max_iter': 'Max iteration',
        'tol': 'Tolerance'
    }
    get_param = pls_model.get_params()
    param_table = pd.DataFrame.from_items([
        ['Parameter', list(label_name.values())],
        ['Value', [get_param[x] for x in list(label_name.keys())]]
    ])
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ### PLS Regression Result
    | {result}
    | ### Parameters
    | {list_parameters}
    """.format(result=pandasDF2MD(result_table), list_parameters=pandasDF2MD(param_table)
               )))
    model = _model_dict('pls_regression_model')
    model['feature_cols'] = feature_cols
    model['label'] = label_cols
    model['mean_absolute_error'] = _mean_absolute_error
    model['mean_squared_error'] = _mean_squared_error
    model['r2_score'] = _r2_score
    model['max_iter'] = max_iter
    model['tol'] = tol
    model['pls_model'] = pls_model
    model['_repr_brtc_'] = rb.get()
    return {'model': model}

def pls_regression_predict(table, model, **params):
    check_required_parameters(_pls_regression_predict,
                              params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_pls_regression_predict, table, model, **params)
    else:
        return _pls_regression_predict(table, model, **params)


def _pls_regression_predict(table, model, prediction_col='prediction'):
    result = table.copy()
    feature_cols = model['feature_cols']
    _, features = check_col_type(result, feature_cols)
    pls_model = model['pls_model']
    prediction = pls_model.predict(features)
    for i in range(prediction.shape[-1]):
        result[prediction_col+"_{}".format(i)] = prediction[:, i]
    return {'out_table': result}
