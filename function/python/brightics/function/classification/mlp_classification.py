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
import json
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import f1_score
from sklearn.metrics import precision_score
from sklearn.metrics import recall_score
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import pandasDF2MD
from brightics.common.repr import dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import raise_error
import sklearn.utils as sklearn_utils
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than, require_param
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.classify_input_type import check_col_type


def mlp_classification_train(table, group_by=None, **params):
    check_required_parameters(_mlp_classification_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _mlp_classification_train)
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
        grouped_model = _function_by_group(_mlp_classification_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _mlp_classification_train(table, **params)


def _mlp_classification_train(table, feature_cols, label_col, hidden_layer_sizes=(100,), activation='relu', solver='adam', alpha=0.0001, batch_size_auto=True, batch_size='auto', learning_rate='constant', learning_rate_init=0.001, max_iter=200, random_state=None, tol=0.0001):

    _, features = check_col_type(table, feature_cols)
    label = table[label_col]

    if(sklearn_utils.multiclass.type_of_target(label) == 'continuous'):
        raise_error('0718', 'label_col')
    
    mlp_model = MLPClassifier(hidden_layer_sizes=hidden_layer_sizes, activation=activation, solver=solver, alpha=alpha, batch_size=batch_size, learning_rate=learning_rate, learning_rate_init=learning_rate_init, max_iter=max_iter, shuffle=True, random_state=random_state, tol=tol)
    mlp_model.fit(features, label)
    
    predict = mlp_model.predict(features)
    
    _accuracy_score = accuracy_score(label, predict)
    _f1_score = f1_score(label, predict, average='micro')
    _precision_score = precision_score(label, predict, average='micro')
    _recall_score = recall_score(label, predict, average='micro')
    
    # summary = pd.DataFrame({'features': feature_names})
    # coef_trans = np.transpose(coefficients)
    
    # summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=classes)), axis=1)
        
    result_table = pd.DataFrame.from_items([
        ['Metric', ['Accuracy Score', 'F1 Score', 'Precision Score', 'Recall Score']],
        ['Score', [_accuracy_score, _f1_score, _precision_score, _recall_score]]
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

    model = _model_dict('mlp_classification_model')
    model['features'] = feature_cols
    model['label'] = label_col
    model['intercepts'] = mlp_model.intercepts_
    model['coefficients'] = mlp_model.coefs_
    model['class'] = mlp_model.classes_
    model['loss'] = mlp_model.loss_
    model['accuracy_score'] = _accuracy_score
    model['f1_score'] = _f1_score
    model['precision_score'] = _precision_score
    model['recall_score'] = _recall_score
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
    # model['summary'] = summary

    return {'model' : model}


def mlp_classification_predict(table, model, **params):
    check_required_parameters(_mlp_classification_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_mlp_classification_predict, table, model, **params)
    else:
        return _mlp_classification_predict(table, model, **params)


def _mlp_classification_predict(table, model, prediction_col='prediction', prob_prefix='probability',
                                 output_log_prob=False, log_prob_prefix='log_probability', thresholds=None,
                                 suffix='index'):
    feature_cols = model['features']
    _, features = check_col_type(table, feature_cols)
    mlp_model = model['mlp_model']
    classes = mlp_model.classes_
    len_classes = len(classes)
    is_binary = len_classes == 2
    
    if thresholds is None:
        thresholds = np.array([1 / len_classes for _ in classes])
    elif isinstance(thresholds, list):
        if len(thresholds) == 1 and is_binary and 0 < thresholds[0] < 1:
            thresholds = np.array([thresholds[0], 1 - thresholds[0]])
        else:
            thresholds = np.array(thresholds)
    
    len_thresholds = len(thresholds)
    if len_classes > 0 and len_thresholds > 0 and len_classes != len_thresholds:
        # FN-0613='%s' must have length equal to the number of classes.
        raise_error('0613', ['thresholds'])
    
    prob = mlp_model.predict_proba(features)
    prediction = classes[np.argmax(prob / thresholds, axis=1)]
        
    out_table = table.copy()
    out_table[prediction_col] = prediction
        
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes
        
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=prob_prefix, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
    
    if output_log_prob:     
        log_prob = mlp_model.predict_log_proba(features)
        logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_prob_prefix, suffix=suffix) for suffix in suffixes]
        logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
        out_table = pd.concat([out_table, prob_df, logprob_df], axis=1)
    else:
        out_table = pd.concat([out_table, prob_df], axis=1)
        
    return {'out_table' : out_table}
