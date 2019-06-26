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
    over_to, less_than_or_equal_to, raise_runtime_error
import sklearn.utils as sklearn_utils
from brightics.common.classify_input_type import check_col_type


def svm_classification_train(table, group_by=None, **params):
    check_required_parameters(_svm_classification_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _svm_classification_train)
    param_validation_check = [over_to(params, 0.0, 1.0, 'c'),
                              greater_than_or_equal_to(params, 0, 'degree'),
                              greater_than(params, 0.0, 'tol')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_svm_classification_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _svm_classification_train(table, **params)


def _svm_classification_train(table, feature_cols, label_col, c=1.0, kernel='rbf', degree=3, gamma='auto', coef0=0.0,
                              shrinking=True, probability=True, tol=1e-3, max_iter=-1, random_state=None):
    _table = table.copy()

    feature_names, features = check_col_type(table, feature_cols)
    _label_col = _table[label_col]
    
    if(sklearn_utils.multiclass.type_of_target(_label_col) == 'continuous'):
        raise_runtime_error('''Label Column should not be continuous.''')
    
    _svc = svm.SVC(C=c, kernel=kernel, degree=degree, gamma=gamma, coef0=coef0, shrinking=shrinking,
              probability=probability, tol=tol, max_iter=max_iter, random_state=random_state)
    _svc_model = _svc.fit(features, _label_col)
    
    get_param = _svc.get_params()
    get_param['feature_cols'] = feature_names
    get_param['label_col'] = label_col
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## SVM Classification Result
    | ### Parameters
    | {table_parameter} 
    """.format(table_parameter=dict2MD(get_param))))
    
    _model = _model_dict('svc_model')
    _model['svc_model'] = _svc_model
    _model['features'] = feature_names
    _model['_repr_brtc_'] = rb.get()
    
    return {'model':_model}


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
    
## migration for 3.6.0.4 <- studio

    if (probability_col != 'probability'):
        prob_prefix = probability_col
    if (log_probability_col != 'log_probability'):
        log_prob_prefix = log_probability_col

## migration for 3.6.0.4 <- studio
    
    _table = table.copy()    
    feature_cols = model['features']
    features = _table[feature_cols]
    svc_model = model['svc_model']
    
    classes = svc_model.classes_
    len_classes = len(classes)
    is_binary = len_classes == 2
    
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
    
    prob = svc_model.predict_proba(features)
    
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=prob_prefix, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
    
    prediction = [classes[np.argmax(x / thresholds)] for x in prob]
    
    out_table = table.copy()
    out_table[prediction_col] = prediction
    
    if display_log_prob == True:
        log_prob = svc_model.predict_log_proba(features)
        logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_prob_prefix, suffix=suffix)
                        for suffix in suffixes]
        logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
        out_table = pd.concat([out_table, prob_df, logprob_df], axis=1)
    else:
        out_table = pd.concat([out_table, prob_df], axis=1)

    return {'out_table' : out_table}
