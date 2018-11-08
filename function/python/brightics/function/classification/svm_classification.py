import pandas as pd
import numpy as np
from sklearn import svm
from brightics.function.utils import _model_dict
from brightics.common.report import ReportBuilder, strip_margin, pandasDF2MD, dict2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def svc_train(table, group_by=None, **params):
    check_required_parameters(_svc_train, params, ['table'])
    if group_by is not None:
        return _function_by_group(_svc_train, table, group_by=group_by, **params)
    else:
        return _svc_train(table, **params)


def _svc_train(table, feature_cols, label_col, c=1.0, kernel='rbf', degree=3, gamma='auto', coef0=0.0, shrinking=True,
              probability=True, tol=1e-3, max_iter=-1, random_state=None):
    _table = table.copy()
    
    _feature_cols = _table[feature_cols]
    _label_col = _table[label_col]
    
    _svc = svm.SVC(C=c, kernel=kernel, degree=degree, gamma=gamma, coef0=coef0, shrinking=shrinking,
              probability=probability, tol=tol, max_iter=max_iter, random_state=random_state)
    _svc_model = _svc.fit(_feature_cols, _label_col)
    
    get_param = _svc.get_params()
    get_param['feature_cols'] = feature_cols
    get_param['label_col'] = label_col
    
    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | ## SVM Classification Result
    | ### Parameters
    | {table_parameter} 
    """.format(table_parameter=dict2MD(get_param))))
    
    _model = _model_dict('svc_model')
    _model['svc_model'] = _svc_model
    _model['features'] = feature_cols
    _model['report'] = rb.get()
    
    return {'model':_model}


def svc_predict(table, model, group_by=None, **params):
    check_required_parameters(_svc_predict, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_svc_predict, table, model, group_by=group_by, **params)
    else:
        return _svc_predict(table, model, **params)


def _svc_predict(table, model, prediction_col='prediction', probability_col='probability', log_probability_col='log_probability', thresholds=None, suffix='index'):
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
    
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes
    
    result = _table.copy()
    
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
