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
from scipy.stats import chi2
from sklearn.linear_model import LogisticRegression
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import pandasDF2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import raise_error
import sklearn.utils as sklearn_utils
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.classify_input_type import check_col_type


def logistic_regression_train(table, group_by=None, **params):
    check_required_parameters(_logistic_regression_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _logistic_regression_train)
    param_validation_check = [greater_than(params, 0.0, 'C'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 0.0, 'tol')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_logistic_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _logistic_regression_train(table, **params)


def _logistic_regression_train(table, feature_cols, label_col, penalty='l2', dual=False, tol=0.0001, C=1.0,
                               fit_intercept=True, intercept_scaling=1, class_weight=None, random_state=None,
                               solver='liblinear', max_iter=100, multi_class='ovr', verbose=0, warm_start=False,
                               n_jobs=1):

    feature_names, features = check_col_type(table,feature_cols)
    label = table[label_col]

    if(sklearn_utils.multiclass.type_of_target(label) == 'continuous'):
        raise_error('0718', 'label_col')
    
    lr_model = LogisticRegression(penalty, dual, tol, C, fit_intercept, intercept_scaling, class_weight, random_state,
                                  solver, max_iter, multi_class, verbose, warm_start, n_jobs)
    lr_model.fit(features, label)
    new_features = pd.DataFrame({"Constant":np.ones(len(features))}).join(pd.DataFrame(features))
    intercept = lr_model.intercept_
    coefficients = lr_model.coef_
    classes = lr_model.classes_
    is_binary = len(classes) == 2
    prob = lr_model.predict_proba(features)
    prob_trans = prob.T
    classes_dict = dict()
    for i in range(len(classes)):
        classes_dict[classes[i]] = i
    tmp_label = np.array([classes_dict[i] for i in label])
    likelihood = 1
    for i in range(len(table)):
        likelihood*=prob_trans[tmp_label[i]][i]
    if fit_intercept:
        k = len(feature_cols)+1
    else:
        k = len(feature_cols)
    aic = 2*k-2*np.log(likelihood)
    bic = np.log(len(table))*k-2*np.log(likelihood)
    if is_binary:
        if fit_intercept:
            x_design = np.hstack([np.ones((features.shape[0], 1)), features])
        else:
            x_design = features.values
        v = np.product(prob, axis=1)
        x_design_modi = np.array([x_design[i]*v[i] for i in range(len(x_design))])
        cov_logit = np.linalg.inv(np.dot(x_design_modi.T, x_design))
        std_err = np.sqrt(np.diag(cov_logit))
        if fit_intercept:
            logit_params = np.insert(coefficients, 0, intercept)
        else:
            logit_params = coefficients
        wald = (logit_params / std_err) ** 2
        p_values = 1-chi2.cdf(wald, 1)
    else:
        if fit_intercept:
            x_design = np.hstack([np.ones((features.shape[0], 1)), features])
        else:
            x_design = features.values
        std_err = []
        for i in range(len(classes)):
            v = prob.T[i]*(1 - prob.T[i])
            x_design_modi = np.array([x_design[i]*v[i] for i in range(len(x_design))])
            cov_logit = np.linalg.inv(np.dot(x_design_modi.T, x_design))
            std_err.append(np.sqrt(np.diag(cov_logit)))
        std_err = np.array(std_err)

        #print(math.log(likelihood))

    if (fit_intercept == True):
        summary = pd.DataFrame({'features': ['intercept'] + feature_names})        
        coef_trans = np.concatenate(([intercept], np.transpose(coefficients)), axis=0)
            
    else:
        summary = pd.DataFrame({'features': feature_names})
        coef_trans = np.transpose(coefficients)
        
    if not is_binary:
            summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=classes)), axis=1)
    else:
            summary = pd.concat((summary, pd.DataFrame(coef_trans, columns=[classes[0]])), axis=1)
    if is_binary:
        summary = pd.concat((summary,pd.DataFrame(std_err,columns=['standard_error']),pd.DataFrame(wald,columns=['wald_statistic']),pd.DataFrame(p_values,columns=['p_value'])),axis=1)
    else:
        columns = ['standard_error_{}'.format(classes[i]) for i in range(len(classes))]
        summary = pd.concat((summary, pd.DataFrame(std_err.T,columns=columns)), axis=1)
        arrange_col = ['features']
        for i in range(len(classes)):
            arrange_col.append(classes[i])
            arrange_col.append('standard_error_{}'.format(classes[i]))
        summary = summary[arrange_col]
    if is_binary:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Logistic Regression Result
        | ### Summary
        | {table1}
        |
        | ##### Column '{small}' is the coefficients under the assumption ({small} = 0, {big} = 1).
        |
        | #### AIC : {aic}
        |
        | #### BIC : {bic}
        """.format(small = classes[0], big = classes[1], table1=pandasDF2MD(summary),aic=aic,bic=bic
                   )))
    else:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Logistic Regression Result
        | ### Summary
        | {table1}
        |
        | ##### Each column whose name is one of classes of Label Column is the coefficients under the assumption it is 1 and others are 0.
        |
        | ##### For example, column '{small}' is the coefficients under the assumption ({small} = 1, others = 0).
        |
        | #### AIC : {aic}
        |
        | #### BIC : {bic}
        """.format(small = classes[0], table1=pandasDF2MD(summary),aic=aic,bic=bic
                   )))

    model = _model_dict('logistic_regression_model')
    model['standard_errors'] = std_err
    model['aic'] = aic
    model['bic'] = bic
    if is_binary:
        model['wald_statistics'] = wald
        model['p_values'] = p_values
    model['features'] = feature_cols
    model['label'] = label_col
    model['intercept'] = lr_model.intercept_
    model['coefficients'] = lr_model.coef_
    model['class'] = lr_model.classes_
    model['penalty'] = penalty
    model['solver'] = solver
    model['lr_model'] = lr_model
    model['_repr_brtc_'] = rb.get()
    model['summary'] = summary
    return {'model' : model}


def logistic_regression_predict(table, model, **params):
    check_required_parameters(_logistic_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_logistic_regression_predict, table, model, **params)
    else:
        return _logistic_regression_predict(table, model, **params)


def _logistic_regression_predict(table, model, prediction_col='prediction', prob_prefix='probability',
                                 output_log_prob=False, log_prob_prefix='log_probability', thresholds=None,
                                 suffix='index'):
    feature_cols = model['features']
    feature_names, features = check_col_type(table,feature_cols)
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
    prediction = [classes[np.argmax(x / thresholds)] for x in prob]
        
    out_table = table.copy()
    out_table[prediction_col] = prediction
        
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes
        
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=prob_prefix, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
    
    if output_log_prob:     
        log_prob = lr_model.predict_log_proba(features)
        logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_prob_prefix, suffix=suffix) for suffix in suffixes]
        logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
        out_table = pd.concat([out_table, prob_df, logprob_df], axis=1)
    else:
        out_table = pd.concat([out_table, prob_df], axis=1)
        
    return {'out_table' : out_table}
