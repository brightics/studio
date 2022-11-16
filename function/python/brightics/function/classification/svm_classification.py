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

import pandas as pd
import numpy as np
from sklearn import svm
from brightics.function.utils import _model_dict
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than, greater_than_or_equal_to, less_than, \
    over_to, less_than_or_equal_to, raise_runtime_error, greater_than_or_equal_to_or_equal_to
import sklearn.utils as sklearn_utils
from brightics.common.classify_input_type import check_col_type
from brightics.common.exception import BrighticsFunctionException as BFE


def svm_classification_train(table, group_by=None, **params):
    check_required_parameters(_svm_classification_train, params, ['table','gamma_val'])
    params = get_default_from_parameters_if_required(params, _svm_classification_train)

    if params['gamma'] == 'other':
        if 'gamma_val' not in params:
            raise BFE.from_errors([{'0100': 'Gamma value is mandatory when gamma is other'}])
        if params['gamma_val'] <= 0:
            raise BFE.from_errors([{'0100': 'Gamma value must be greater than 0'}])
    else:
        params['gamma_val'] = None

    param_validation_check = [over_to(params, 0.0, 1.0, 'c'),
                              greater_than_or_equal_to(params, 0, 'degree'),
                              greater_than(params, 0.0, 'tol'),
                              greater_than_or_equal_to_or_equal_to(params, 1, -1, 'max_iter')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_svm_classification_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _svm_classification_train(table, **params)


def preprocess_(table, label_col, class_weight, gamma, gamma_val):
    label = table[label_col]
    if sklearn_utils.multiclass.type_of_target(label) == 'continuous':
        raise_runtime_error('''Label Column should not be continuous.''')

    class_labels = sorted(set(label))
    if class_weight is not None:
        if len(class_weight) != len(class_labels):
            raise ValueError("Number of class weights should match number of labels.")
        else:
            class_weight = {class_labels[i]: class_weight[i] for i in range(len(class_labels))}

    if gamma == 'other':
        _gamma = gamma_val
    else:
        _gamma = gamma

    preprocess_result = {'update_param': {"class_weight": class_weight,
                                          "gamma": _gamma},
                         'estimator_class': svm.SVC,
                         'estimator_params': ['C', 'kernel', 'degree', 'gamma', 'coef0', 'shrinking', 'probability',
                                              'tol', 'max_iter', 'random_state', 'class_weight'],
                         'param_change': {'c': 'C'}}
    return preprocess_result


def preprocess_hyperparam_(gamma, gamma_val):
    if gamma_val is None:
        gamma_val = []
    if 'other' in gamma:
        gamma = list(set(gamma) - {'other'}) + gamma_val
    res = {'update': {'gamma': gamma,
                      'probability': [True]},
           'remove': ['gamma_val']}
    return res


def postprocess_(feature_cols):
    # Couldn't unify the model's key to 'feature_cols' since the older version had used 'feature_cols' already
    postprocess_result = {'update_model': {'features': feature_cols},
                          'type': 'svc_model'}
    return postprocess_result


def _svm_classification_train(table, feature_cols, label_col, gamma_val, c=1.0, kernel='rbf', degree=3, gamma='auto', coef0=0.0,
                              shrinking=True, probability=True, tol=1e-3, max_iter=-1, random_state=None, class_weight=None):
    _table = table.copy()

    feature_names, features = check_col_type(table, feature_cols)
    label = _table[label_col]

    preprocess_result = preprocess_(table, label_col, class_weight, gamma, gamma_val)
    class_weight = preprocess_result['update_param']['class_weight']
    _gamma = preprocess_result['update_param']['gamma']

    svc_model = svm.SVC(C=c, kernel=kernel, degree=degree, gamma=_gamma, coef0=coef0, shrinking=shrinking,
                        probability=probability, tol=tol, max_iter=max_iter, random_state=random_state,
                        class_weight=class_weight)
    svc_model.fit(features, label)

    get_param = svc_model.get_params()
    get_param['feature_cols'] = feature_names
    get_param['label_col'] = label_col
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## SVM Classification Result
    | ### Parameters
    | {table_parameter} 
    """.format(table_parameter=dict2MD(get_param))))
    
    model = _model_dict('svc_model')
    model['classifier'] = svc_model
    model['features'] = feature_cols
    model['_repr_brtc_'] = rb.get()

    return {'model': model}


def svm_classification_predict(table, model, **params):
    check_required_parameters(_svm_classification_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_svm_classification_predict, table, model, **params)
    else:
        return _svm_classification_predict(table, model, **params)


def _svm_classification_predict(table, model, prediction_col='prediction', prob_prefix='probability',
                                display_log_prob=True, log_prob_prefix='log_probability',
                                thresholds=None, probability_col='probability', log_probability_col='log_probability',
                                suffix='index'):
    # migration logic (grid search cv)
    if 'svc_model' in model:
        model['classifier'] = model['svc_model']

    # migration for 3.6.0.4 <- studio
    if probability_col != 'probability':
        prob_prefix = probability_col
    if log_probability_col != 'log_probability':
        log_prob_prefix = log_probability_col

    # migration for 3.6.0.4 <- studio
    _table = table.copy()
    if 'features' in model:
        feature_cols = model['features']
        feature_names, features = check_col_type(table, feature_cols)
    else: 
        feature_cols = model['feature_cols']
        features = table[feature_cols]
    
    if 'classifier' in model:
        svc_model = model['classifier']
        classes = svc_model.classes_
        len_classes = len(classes)
        is_binary = len_classes == 2
    else:
        classes = np.array([0, 1])
        len_classes = 2
        is_binary = True
    if thresholds is None:
        thresholds = np.array([1 / len_classes for _ in classes])
    elif isinstance(thresholds, list):
        if len(thresholds) == 1 and is_binary and 0 < thresholds[0] < 1:
            thresholds = np.array([thresholds[0], 1 - thresholds[0]])
        else:
            thresholds = np.array(thresholds)
    
    # validation: the lengths of classes and thresholds must be equal.
    
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes
    if 'classifier' in model:
        prob = svc_model.predict_proba(features)
    else:
        coef = model['table_1'].values[0][:-2]
        prob = 1 / (np.exp((np.sum(features.values * coef, axis=1) + model['table_1']['intercept'][0]) / np.sum(coef * coef) ** 0.5) + 1)
        prob = np.c_[prob, 1 - prob]
    
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=prob_prefix, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
    
    prediction = classes[np.argmax(prob / thresholds, axis=1)]
    
    out_table = table.copy()
    out_table[prediction_col] = prediction
    
    if display_log_prob:
        log_prob = np.log(prob)
        logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_prob_prefix, suffix=suffix)
                        for suffix in suffixes]
        logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
        out_table = pd.concat([out_table, prob_df, logprob_df], axis=1)
    else:
        out_table = pd.concat([out_table, prob_df], axis=1)

    return {'out_table': out_table}
