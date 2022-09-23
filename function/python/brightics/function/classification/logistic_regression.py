
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
from brightics.function.extraction import one_hot_encoder
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


def preprocess_(table, label_col, class_weight):
    label = table[label_col]

    if sklearn_utils.multiclass.type_of_target(label) == 'continuous':
        raise_error('0718', 'label_col')

    class_labels = sorted(set(label))
    if class_weight is not None:
        if len(class_weight) != len(class_labels):
            raise ValueError("Number of class weights should match number of labels.")
        else:
            class_weight = {class_labels[i]: class_weight[i] for i in range(len(class_labels))}
    preprocess_result = {'update_param': {'class_weight': class_weight},
                         'estimator_class': LogisticRegression,
                         'estimator_params': ['penalty', 'dual', 'tol', 'C', 'fit_intercept', 'intercept_scaling',
                                              'class_weight', 'random_state', 'solver', 'max_iter', 'multi_class',
                                              'verbose', 'warm_start', 'n_jobs']}
    return preprocess_result


def postprocess_(table, feature_cols, label_col, classifier, fit_intercept):
    feature_names, features = check_col_type(table, feature_cols)
    label = table[label_col]

    intercept = classifier.intercept_
    coefficients = classifier.coef_
    classes = classifier.classes_
    is_binary = len(classes) == 2
    prob = classifier.predict_proba(features)
    prob_trans = prob.T
    classes_dict = dict()
    for i in range(len(classes)):
        classes_dict[classes[i]] = i
    tmp_label = np.array([classes_dict[i] for i in label])
    log_likelihood = 0
    for i in range(len(table)):
        log_likelihood += np.log(prob_trans[tmp_label[i]][i])
    if fit_intercept:
        k = len(feature_names) + 1
    else:
        k = len(feature_names)
    aic = 2 * k - 2 * log_likelihood
    bic = np.log(len(table)) * k - 2 * log_likelihood

    if is_binary:
        if fit_intercept:
            x_design = np.hstack([np.ones((features.shape[0], 1)), features])
        else:
            x_design = features.values
        v = np.product(prob, axis=1)
        x_design_modi = (x_design.T * v).T
        cov_logit = np.linalg.pinv(np.dot(x_design_modi.T, x_design))
        std_err = np.sqrt(np.diag(cov_logit))
        if fit_intercept:
            logit_params = np.insert(coefficients, 0, intercept)
        else:
            logit_params = coefficients[0]
        wald = (logit_params / std_err) ** 2
        p_values = 1 - chi2.cdf(wald, 1)
    else:
        if fit_intercept:
            x_design = np.hstack([np.ones((features.shape[0], 1)), features])
        else:
            x_design = features.values
        std_err = []
        for i in range(len(classes)):
            v = prob.T[i] * (1 - prob.T[i])
            x_design_modi = (x_design.T * v).T
            cov_logit = np.linalg.pinv(np.dot(x_design_modi.T, x_design))
            std_err.append(np.sqrt(np.diag(cov_logit)))
        std_err = np.array(std_err)

        # print(math.log(likelihood))

    if fit_intercept:
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
        summary = pd.concat((summary, pd.DataFrame(std_err, columns=['standard_error']),
                             pd.DataFrame(wald, columns=['wald_statistic']),
                             pd.DataFrame(p_values, columns=['p_value'])), axis=1)
    else:
        columns = ['standard_error_{}'.format(classes[i]) for i in range(len(classes))]
        summary = pd.concat((summary, pd.DataFrame(std_err.T, columns=columns)), axis=1)
        arrange_col = ['features']
        for i in range(len(classes)):
            arrange_col.append(classes[i])
            arrange_col.append('standard_error_{}'.format(classes[i]))
        summary = summary[arrange_col]

    if is_binary:
        note = "Column '{small}' is the coefficients under the assumption ({small} = 0, {big} = 1).".format(
            small=classes[0], big=classes[1]
        )
    else:
        note = """Each column whose name is one of classes of Label Column is the coefficients under the assumption it is 1 and others are 0. For example, column '{small}' is the coefficients under the assumption ({small} = 1, others = 0).""".format(
            small=classes[0]
        )

    update_model_etc = {'standard_errors': std_err}
    if is_binary:
        update_model_etc['wald_statistics'] = wald
        update_model_etc['p_values'] = p_values

    postprocess_result = {'update_md': {'Summary': summary,
                                        'Note': note,
                                        'AIC': aic,
                                        'BIC': bic},
                          'update_model_etc': update_model_etc,
                          'type': 'logistic_regression_model'}

    return postprocess_result


def _logistic_regression_train(table, feature_cols, label_col, penalty='l2', dual=False, tol=0.0001, C=1.0,
                               fit_intercept=True, intercept_scaling=1, class_weight=None, random_state=None,
                               solver='liblinear', max_iter=100, multi_class='ovr', verbose=0, warm_start=False,
                               n_jobs=1):

    feature_names, features = check_col_type(table, feature_cols)
    features = pd.DataFrame(features, columns=feature_names)

    label = table[label_col]

    preprocess_result = preprocess_(table, label_col, class_weight)
    class_weight = preprocess_result['update_param']['class_weight']

    classifier = LogisticRegression(penalty, dual, tol, C, fit_intercept, intercept_scaling, class_weight, random_state,
                                    solver, max_iter, multi_class, verbose, warm_start, n_jobs)
    classifier.fit(features, label)

    postprocess_result = postprocess_(table, feature_cols, label_col, classifier, fit_intercept)
    update_md = postprocess_result['update_md']
    summary = update_md['Summary']
    note = update_md['Note']
    aic = update_md['AIC']
    bic = update_md['BIC']

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Logistic Regression Result
    | ### Summary
    | {table1}
    |
    | ##### {note}
    |
    | #### AIC : {aic}
    |
    | #### BIC : {bic}
    """.format(table1=pandasDF2MD(summary, num_rows=100), note=note, aic=aic, bic=bic)))

    model = _model_dict('logistic_regression_model')
    update_model_etc = postprocess_result['update_model_etc']
    model.update(update_model_etc)
    model['aic'] = aic
    model['bic'] = bic
    model['features'] = feature_cols
    model['label'] = label_col
    model['intercept'] = classifier.intercept_
    model['coefficients'] = classifier.coef_
    model['class'] = classifier.classes_
    model['penalty'] = penalty
    model['solver'] = solver
    model['classifier'] = classifier
    model['_repr_brtc_'] = rb.get()
    model['summary'] = summary
    return {'model': model}


def logistic_regression_predict(table, model, **params):
    check_required_parameters(_logistic_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_logistic_regression_predict, table, model, **params)
    else:
        return _logistic_regression_predict(table, model, **params)


def _logistic_regression_predict(table, model, prediction_col='prediction', prob_prefix='probability',
                                 output_log_prob=False, log_prob_prefix='log_probability', thresholds=None,
                                 suffix='index'):
    # migration logic
    if 'lr_model' in model:
        model['classifier'] = model['lr_model']

    if table.shape[0] == 0:
        new_cols = table.columns.tolist() + [prediction_col]
        classes = model['classifier'].classes_
        if suffix == 'index':
            prob_cols = [prob_prefix + '_{}'.format(i) for i in range(len(classes))]
        else:
            prob_cols = [prob_prefix + '_{}'.format(i) for i in classes]
        if output_log_prob:
            if suffix == 'index':
                log_cols = [log_prob_prefix + '_{}'.format(i) for i in range(len(classes))]
            else:
                log_cols = [log_prob_prefix + '_{}'.format(i) for i in classes]
        else:
            log_cols = []
        new_cols += prob_cols + log_cols
        out_table = pd.DataFrame(columns=new_cols)
        return {'out_table': out_table}
    if 'features' in model:
        feature_cols = model['features']
    else:
        feature_cols = model['feature_cols']
    if 'classifier' in model:
        feature_names, features = check_col_type(table, feature_cols)
        features = pd.DataFrame(features, columns=feature_names)
    else:
        features = table[feature_cols]
    if 'auto' in model and 'vs' not in model['_type']:
        if model['auto']:
            one_hot_input = model['table_4'][:-1][model['table_4']['data_type'][:-1] == 'string'].index
            if len(one_hot_input != 0):
                features = one_hot_encoder(prefix='col_name', table=features, input_cols=features.columns[one_hot_input].tolist(), suffix='label')['out_table']
                features = features[model['table_2']['features']]
        else:
            one_hot_input = model['table_3'][:-1][model['table_3']['data_type'][:-1] == 'string'].index
            if len(one_hot_input != 0):
                features = one_hot_encoder(prefix='col_name', table=features, input_cols=features.columns[one_hot_input].tolist(), suffix='label')['out_table']
                features = features[model['table_1']['features']]
    elif 'auto' in model and 'vs' in model['_type']:
        if model['auto']:
            one_hot_input = model['table_3'][:-1][model['table_3']['data_type'][:-1] == 'string'].index
            if len(one_hot_input != 0):
                features = one_hot_encoder(prefix='col_name', table=features, input_cols=features.columns[one_hot_input].tolist(), suffix='label')['out_table']
                features = features[model['table_2']['features']]
        else:
            one_hot_input = model['table_2'][:-1][model['table_2']['data_type'][:-1] == 'string'].index
            if len(one_hot_input != 0):
                features = one_hot_encoder(prefix='col_name', table=features, input_cols=features.columns[one_hot_input].tolist(), suffix='label')['out_table']
                features = features[model['table_1']['features']]
    if 'classifier' in model:
        lr_model = model['classifier']
        classes = lr_model.classes_
        len_classes = len(classes)
        is_binary = len_classes == 2
    else:
        fit_intercept = model['fit_intercept']
        if 'vs' not in model['_type']:
            len_classes = 2
            is_binary = True
            if 'auto' in model:
                if model['auto']:
                    classes = model['table_4']['labels'].values[-1]
                    classes_type = model['table_4']['data_type'].values[-1]
                    if classes_type == 'integer' or classes_type == 'long':
                        classes = np.array([int(i) for i in classes])
                    elif classes_type == 'float' or classes_type == 'double':
                        classes = np.array([float(i) for i in classes])
                    coefficients = model['table_3']['coefficients'][0]
                    intercept = model['table_3']['intercept'][0]
                else:
                    classes = model['table_3']['labels'].values[-1]
                    classes_type = model['table_3']['data_type'].values[-1]
                    if classes_type == 'integer' or classes_type == 'long':
                        classes = np.array([int(i) for i in classes])
                    elif classes_type == 'float' or classes_type == 'double':
                        classes = np.array([float(i) for i in classes])
                    coefficients = model['table_2']['coefficients'][0]
                    intercept = model['table_2']['intercept'][0]
            else:
                classes = np.array([0, 1])
                coefficients = model['table_2']['coefficient'][1:]
                if fit_intercept:
                    intercept = model['table_2']['coefficient'][0]
        else:
            if 'auto' in model:
                if model['auto']:
                    classes = np.array(model['table_3']['labels'].values[-1])
                    len_classes = len(classes)
                    is_binary = len_classes == 2
                    intercept = model['table_2'].intercept
                    coefficients = model['table_2'].coefficients
                else:
                    classes = np.array(model['table_2']['labels'].values[-1])
                    len_classes = len(classes)
                    is_binary = len_classes == 2
                    intercept = model['table_1'].intercept
                    coefficients = model['table_1'].coefficients
            else:
                classes = np.array(model['table_1'].labelInfo)
                len_classes = len(classes)
                is_binary = len_classes == 2
                intercept = model['table_1'].intercept
                coefficients = (model['table_1'][[i for i in model['table_1'].columns if 'coefficient' in i]]).values
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
    
    if 'classifier' in model:
        prob = lr_model.predict_proba(features)
    else:
        features = features.values
        coefficients = np.array(coefficients)
        if is_binary:
            tmp = features * coefficients
            if fit_intercept or 'auto' in model:
                prob = 1 / (np.exp(np.sum(tmp, axis=1) + intercept) + 1)
            else:
                prob = 1 / (np.exp(np.sum(tmp, axis=1)) + 1)
            prob = np.array([[x, 1 - x] for x in prob])
        else:
            prob = []
            for i in range(len(coefficients)):
                tmp = features * coefficients[i]
                if fit_intercept:
                    prob.append(1 / (np.exp(-np.sum(tmp, axis=1) - intercept[i]) + 1))
                else:
                    prob.append(1 / (np.exp(-np.sum(tmp, axis=1)) + 1))
            prob = np.array(prob).T
            prob = np.apply_along_axis(lambda x: x / np.sum(x), 1 , prob)
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
        log_prob = np.log(prob)
        logprob_cols = ['{log_probability_col}_{suffix}'.format(log_probability_col=log_prob_prefix, suffix=suffix) for suffix in suffixes]
        logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
        out_table = pd.concat([out_table, prob_df, logprob_df], axis=1)
    else:
        out_table = pd.concat([out_table, prob_df], axis=1)
        
    return {'out_table' : out_table}
