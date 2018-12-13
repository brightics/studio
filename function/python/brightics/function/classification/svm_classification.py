import pandas as pd
import numpy as np
from sklearn import svm
from brightics.function.utils import _model_dict
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than, \
    raise_runtime_error
import sklearn.utils as sklearn_utils


def svm_classification_train(table, group_by=None, **params):
    check_required_parameters(_svm_classification_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_svm_classification_train, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _svm_classification_train(table, **params)


def _svm_classification_train(table, feature_cols, label_col, c=1.0, kernel='rbf', degree=3, gamma='auto', coef0=0.0, shrinking=True,
              probability=True, tol=1e-3, max_iter=-1, random_state=None):
    validate(greater_than(c, 0.0, 'c'))
    
    _table = table.copy()
    
    _feature_cols = _table[feature_cols]
    _label_col = _table[label_col]
    
    if(sklearn_utils.multiclass.type_of_target(_label_col) == 'continuous'):
        raise_runtime_error('''Label Column should not be continuous.''')
    
    _svc = svm.SVC(C=c, kernel=kernel, degree=degree, gamma=gamma, coef0=coef0, shrinking=shrinking,
              probability=probability, tol=tol, max_iter=max_iter, random_state=random_state)
    _svc_model = _svc.fit(_feature_cols, _label_col)
    
    get_param = _svc.get_params()
    get_param['feature_cols'] = feature_cols
    get_param['label_col'] = label_col
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## SVM Classification Result
    | ### Parameters
    | {table_parameter} 
    """.format(table_parameter=dict2MD(get_param))))
    
    _model = _model_dict('svc_model')
    _model['svc_model'] = _svc_model
    _model['features'] = feature_cols
    _model['_repr_brtc_'] = rb.get()
    
    return {'model':_model}


def svm_classification_predict(table, model, **params):
    check_required_parameters(_svm_classification_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_svm_classification_predict, table, model, group_by=group_by, **params)
    else:
        return _svm_classification_predict(table, model, **params)


def _svm_classification_predict(table, model, prediction_col='prediction', probability_col='probability', log_probability_col='log_probability', thresholds=None, suffix='index'):
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
    
    log_prob = svc_model.predict_log_proba(features)
    prob = svc_model.predict_proba(features)
    
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=probability_col, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
     
    logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_probability_col, suffix=suffix) for suffix in suffixes]
    logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
    
    prediction = pd.DataFrame(prob).apply(lambda x: classes[np.argmax(x / thresholds)], axis=1)
    
    result = table.copy()
    result[prediction_col] = prediction
    result = pd.concat([result, prob_df, logprob_df], axis=1)
    
    return {'out_table' : result}
