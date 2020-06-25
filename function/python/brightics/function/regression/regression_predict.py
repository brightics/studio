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

from brightics.common.validation import raise_runtime_error
from .linear_regression import linear_regression_predict
from .decision_tree_regression import decision_tree_regression_predict
from .random_forest_regression import random_forest_regression_predict
from .ada_boost_regression import ada_boost_regression_predict
from .glm import glm_predict
from .isotonic_regression import isotonic_regression_predict
from .mlp_regression import mlp_regression_predict
from .xgb_regression import xgb_regression_predict
from .pls_regression import pls_regression_predict
import numpy as np



def regression_predict(table, model, prediction_col='prediction'):
    if '_grouped_data' in model:
        tmp_model = model['_grouped_data']['data']
        tmp_model = list(tmp_model.values())[0]
    else:
        tmp_model = model
    if 'linear_regression_model' in tmp_model['_type']:
        return linear_regression_predict(table = table, model = model, prediction_col = prediction_col)
    if tmp_model['_type'] == 'decision_tree_model':
        if 'method' in tmp_model and tmp_model['method'] == 'regression':
            return decision_tree_regression_predict(table = table, model = model, prediction_col = prediction_col)
    if 'tree_regression' in tmp_model['_type']:
        return decision_tree_regression_predict(table = table, model = model, prediction_col = prediction_col)
    if tmp_model['_type'] == 'random_forest_model':
        if 'method' in tmp_model and tmp_model['method'] == 'regression':
            return random_forest_regression_predict(table = table, model = model, prediction_col = prediction_col)
    if 'forest_regression' in tmp_model['_type'] or 'gbt_regression' in tmp_model['_type']:
        return random_forest_regression_predict(table = table, model = model, prediction_col = prediction_col)
    if tmp_model['_type'] == 'ada_boost_regression_model':
        return ada_boost_regression_predict(table=table, model=model, pred_col_name=prediction_col)
    if tmp_model['_type'] == 'glm_model':
        return glm_predict(table=table, model=model, prediction_col=prediction_col)
    if tmp_model['_type'] == 'mlp_regression_model':
        return mlp_regression_predict(table=table, model=model, prediction_col=prediction_col)
    if tmp_model['_type'] == 'xgb_regression_model':
        return xgb_regression_predict(table=table, model=model, prediction_col=prediction_col)
    if tmp_model['_type'] == 'isotonic_regression_model':
        return isotonic_regression_predict(table=table, model=model, prediction_col=prediction_col)
    if tmp_model['_type'] == 'pls_regression_model':
        return pls_regression_predict(table=table, model=model, prediction_col=prediction_col)
    raise_runtime_error('''It is not supported yet.''')
