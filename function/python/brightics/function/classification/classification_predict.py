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
from .svm_classification import svm_classification_predict
from .logistic_regression import logistic_regression_predict
from .decision_tree_classification import decision_tree_classification_predict
from .random_forest_classification import random_forest_classification_predict
from .naive_bayes_classification import naive_bayes_predict
from .ada_boost_classification import ada_boost_classification_predict
from .mlp_classification import mlp_classification_predict
from .xgb_classification import xgb_classification_predict
import numpy as np


def classification_predict(table, model, prediction_col='prediction', prob_prefix='probability',
                                 output_log_prob=False, log_prob_prefix='log_probability', thresholds=None,
                                 suffix='index'):
    if '_grouped_data' in model:
        tmp_model = model['_grouped_data']['data']
        tmp_model = list(tmp_model.values())[0]
    else:
        tmp_model = model
    if 'logistic_regression_model' in tmp_model['_type'] or 'one_vs' in tmp_model['_type']:
        return logistic_regression_predict(table=table, model=model, prediction_col=prediction_col, prob_prefix=prob_prefix,
                                 output_log_prob=output_log_prob, log_prob_prefix=log_prob_prefix, thresholds=thresholds,
                                 suffix=suffix)
    if tmp_model['_type'] == 'svc_model':
        return svm_classification_predict(table=table, model=model, prediction_col=prediction_col, prob_prefix=prob_prefix,
                                 display_log_prob=output_log_prob, log_prob_prefix=log_prob_prefix, thresholds=thresholds,
                                 suffix=suffix)
    if tmp_model['_type'] == 'decision_tree_model':
        if 'method' in tmp_model and tmp_model['method'] == 'classification':
            return decision_tree_classification_predict(table=table, model=model, prediction_col=prediction_col)
    if 'tree_classification' in tmp_model['_type']:
        return decision_tree_classification_predict(table=table, model=model, prediction_col=prediction_col)
    if tmp_model['_type'] == 'random_forest_model':
        if 'method' in tmp_model and tmp_model['method'] == 'classification':
            return random_forest_classification_predict(table=table, model=model, pred_col_name=prediction_col)
    if 'forest_classification' in tmp_model['_type'] or 'gbt_classification' in tmp_model['_type']:
        return random_forest_classification_predict(table=table, model=model, pred_col_name=prediction_col)
    if tmp_model['_type'] == 'naive_bayes_model':
        return naive_bayes_predict(table=table, model=model, prediction_col=prediction_col, prob_prefix=prob_prefix,
                                 display_log_prob=output_log_prob, log_prob_prefix=log_prob_prefix, suffix=suffix)
    if tmp_model['_type'] == 'ada_boost_classification_model':
        return ada_boost_classification_predict(
            table=table, model=model,
            pred_col_name=prediction_col,
            prob_col_prefix=prob_prefix, suffix=suffix
        )
    if tmp_model['_type'] == 'mlp_classification_model':
        return mlp_classification_predict(
            table=table, model=model,
            prediction_col=prediction_col,
            prob_prefix=prob_prefix,
            output_log_prob=output_log_prob,
            log_prob_prefix=log_prob_prefix,
            suffix=suffix, thresholds=thresholds
        )
    if tmp_model['_type'] == 'xgb_classification_model':
        return xgb_classification_predict(
            table=table, model=model,
            prediction_col=prediction_col,
            probability_col=prob_prefix,
            suffix=suffix, thresholds=thresholds
        )
    raise_runtime_error('''It is not supported yet.''')
