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
import matplotlib.pyplot as plt

from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.metrics import mean_squared_error
from sklearn.metrics import r2_score
from brightics.common.repr import BrtcReprBuilder 
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.repr import pandasDF2MD
from brightics.common.repr import dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils.table_converters import simple_tables2df_list
from brightics.function.utils import _model_dict
from brightics.common.validation import validate
from brightics.common.validation import greater_than, require_param
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.utils import get_default_from_parameters_if_required


def mlp_regression_train(table, group_by=None, **params):
    check_required_parameters(_mlp_regression_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _mlp_regression_train)
    if (params['batch_size_auto']):
        param_validation_check = [greater_than(params, 0.0, 'learning_rate_init'),
                                  greater_than(params, 0.0, 'tol')]
    else:
        if not params['batch_size'] or not isinstance(params['batch_size'], int):
            param_validation_check = [require_param('batch_size')]
            validate(*param_validation_check)
        param_validation_check = [greater_than(params, 0, 'batch_size'),
                                  greater_than(params, 0.0, 'learning_rate_init'),
                                  greater_than(params, 0.0, 'tol')]
        
    validate(*param_validation_check)
    if group_by is not None:
        grouped_model = _function_by_group(_mlp_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _mlp_regression_train(table, **params)

    
def _mlp_regression_train(table, feature_cols, label_col, hidden_layer_sizes=(100, ), activation='relu', solver='adam', alpha=0.0001, batch_size_auto=True, batch_size='auto', learning_rate='constant', learning_rate_init=0.001, max_iter=200, random_state=None, tol=0.0001):
    features = table[feature_cols]
    label = table[label_col]

    mlp_model = MLPRegressor(hidden_layer_sizes=hidden_layer_sizes, activation=activation, solver=solver, alpha=alpha, batch_size=batch_size, learning_rate=learning_rate, learning_rate_init=learning_rate_init, max_iter=max_iter, shuffle=True, random_state=random_state, tol=tol)
    mlp_model.fit(features, label)
    
    predict = mlp_model.predict(features)

    intercepts = mlp_model.intercepts_
    coefficients = mlp_model.coefs_
    loss = mlp_model.loss_
    
    _mean_absolute_error = mean_absolute_error(label, predict)
    _mean_squared_error = mean_squared_error(label, predict)
    _r2_score = r2_score(label, predict)
    
    result_table = pd.DataFrame.from_items([
        ['Metric', ['Mean Absolute Error', 'Mean Squared Error', 'R2 Score']],
        ['Score', [_mean_absolute_error, _mean_squared_error, _r2_score]]
    ])

    label_name = {
        'hidden_layer_sizes': 'Hidden Layer Sizes',
        'activation': 'Activation Function',
        'solver': 'Solver',
        'alpha': 'Alpha',
        'batch_size': 'Batch Size',
        'learning_rate': 'Learning Rate',
        'learning_rate_init': 'Learning Rate Initial',
        'max_iter': 'Max Iteration',
        'random_state': 'Seed',
        'tol': 'Tolerance'}
    get_param = mlp_model.get_params()
    param_table = pd.DataFrame.from_items([
        ['Parameter', list(label_name.values())],
        ['Value', [get_param[x] for x in list(label_name.keys())]]
    ])

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ### MLP Classification Result
    | {result}
    | ### Parameters
    | {list_parameters}
    """.format(result=pandasDF2MD(result_table), list_parameters=pandasDF2MD(param_table)
               )))

    model = _model_dict('mlp_regression_model')
    model['features'] = feature_cols
    model['label'] = label_col
    model['intercepts'] = mlp_model.intercepts_
    model['coefficients'] = mlp_model.coefs_
    model['loss'] = mlp_model.loss_
    model['mean_absolute_error'] = _mean_absolute_error
    model['mean_squared_error'] = _mean_squared_error
    model['r2_score'] = _r2_score
    model['activation'] = activation
    model['solver'] = solver
    model['alpha'] = alpha
    model['batch_size'] = batch_size
    model['learning_rate'] = learning_rate
    model['learning_rate_init'] = learning_rate_init
    model['max_iter'] = max_iter
    model['random_state'] = random_state
    model['tol'] = tol
    model['mlp_model'] = mlp_model
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}


def mlp_regression_predict(table, model, **params):
    check_required_parameters(_mlp_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_mlp_regression_predict, table, model, **params)
    else:
        return _mlp_regression_predict(table, model, **params)


def _mlp_regression_predict(table, model, prediction_col='prediction'):

    result = table.copy()
    feature_cols = model['features']
    features = result[feature_cols]

    mlp_model_fit = model['mlp_model']

    prediction = mlp_model_fit.predict(features)

    result[prediction_col] = prediction

    return {'out_table' : result}
