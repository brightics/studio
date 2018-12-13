import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from brightics.common.validator import NumberValidator
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD
import statsmodels.api as sm
from brightics.function.utils import _model_dict
from brightics.function.evaluation import _plot_roc_pr_curve
from statsmodels.sandbox.distributions.quantize import prob_bv_rectangle
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import raise_runtime_error, raise_error
import sklearn.utils as sklearn_utils


def logistic_regression_train(table, group_by=None, **params):
    check_required_parameters(_logistic_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_logistic_regression_train, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _logistic_regression_train(table, **params)


def _logistic_regression_train(table, feature_cols, label_col, penalty='l2', dual=False, tol=0.0001, C=1.0, fit_intercept=True, intercept_scaling=1, class_weight=None, random_state=None, solver='liblinear', max_iter=100, multi_class='ovr', verbose=0, warm_start=False, n_jobs=1):
    features = table[feature_cols]
    label = table[label_col]

    if(sklearn_utils.multiclass.type_of_target(label) == 'continuous'):
        raise_runtime_error('''Label Column should not be continuous.''')
    
    lr_model = LogisticRegression(penalty, dual, tol, C, fit_intercept, intercept_scaling, class_weight, random_state, solver, max_iter, multi_class, verbose, warm_start, n_jobs)
    lr_model.fit(features, label)

    featureNames = np.append("Intercept", feature_cols)
    intercept = lr_model.intercept_
    coefficients = lr_model.coef_
    classes = lr_model.classes_
    is_binary = len(classes) == 2

    if (fit_intercept == True):
        summary = pd.DataFrame({'features': ['intercept'] + feature_cols})
        print(intercept)
        print(coefficients)
        
        coef_trans = np.concatenate(([intercept], np.transpose(coefficients)), axis=0)
        if not is_binary:
            summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=classes)), axis=1)
        elif is_binary:
            summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=[classes[0]])), axis=1)
            
    else:
        summary = pd.DataFrame({'features': feature_cols})
        coef_trans = np.transpose(coefficients)
        
        if not is_binary:
            summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=classes)), axis=1)
        elif is_binary:
            summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=[classes[0]])), axis=1)
    
    prob = lr_model.predict_proba(features)
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Logistic Regression Result
    | ### Summary
    | {table1}
    """.format(table1=pandasDF2MD(summary)
               )))

    model = dict()
    model['features'] = feature_cols
    model['label'] = label_col
    model['intercept'] = lr_model.intercept_
    model['coefficients'] = lr_model.coef_
    model['class'] = lr_model.classes_
    model['penalty'] = penalty
    model['solver'] = solver
    model['lr_model'] = lr_model
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}


def logistic_regression_predict(table, model, **params):
    check_required_parameters(_logistic_regression_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_logistic_regression_predict, table, model, group_by=group_by, **params)
    else:
        return _logistic_regression_predict(table, model, **params)


def _logistic_regression_predict(table, model, prediction_col='prediction', probability_col='probability', log_probability_col='log_probability', thresholds=None, suffix='index'):
    feature_cols = model['features']
    features = table[feature_cols]
    lr_model = model['lr_model']
    classes = lr_model.classes_
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
    
    prob = lr_model.predict_proba(features)
    prediction = pd.DataFrame(prob).apply(lambda x: classes[np.argmax(x / thresholds)], axis=1)
    
    log_prob = lr_model.predict_log_proba(features)
    
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes
        
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=probability_col, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
     
    logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_probability_col, suffix=suffix) for suffix in suffixes]
    logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
    
    result = table.copy()
    result[prediction_col] = prediction
    result = pd.concat([result, prob_df, logprob_df], axis=1)
        
    return {'out_table' : result}
