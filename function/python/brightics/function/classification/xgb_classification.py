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

from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to, greater_than
from brightics.common.classify_input_type import check_col_type

from random import randint
import numpy as np
import pandas as pd
import matplotlib

matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from xgboost import XGBClassifier
from brightics.common.data_export import PyPlotData, PyPlotMeta


def xgb_classification_train(table, group_by=None, **params):
    check_required_parameters(_xgb_classification_train, params, ['table'])

    params = get_default_from_parameters_if_required(params, _xgb_classification_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 0.0, 'learning_rate'),
                              greater_than_or_equal_to(params, 1, 'n_estimators'),
                              greater_than(params, 0, 'subsample')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_xgb_classification_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _xgb_classification_train(table, **params)


def _make_sample_weight(label, class_weight):
    return class_weight[label]


def preprocess_(table, feature_cols, label_col, class_weight, random_state):
    feature_names, features = check_col_type(table, feature_cols)
    if isinstance(features, list):
        features = np.array(features)

    if random_state is None:
        random_state = randint(-2 ** 31, 2 ** 31 - 1)

    y_train = table[label_col]
    class_labels = sorted(set(y_train))
    if class_weight is None:
        sample_weight = None
    else:
        if len(class_weight) != len(class_labels):
            raise ValueError("Number of class weights should match number of labels.")
        else:
            class_weight = {class_labels[i]: class_weight[i] for i in range(len(class_labels))}
            sample_weight = np.vectorize(_make_sample_weight)(y_train, class_weight)

    preprocess_result = {'fit_param': {'sample_weight': sample_weight},
                         'update_param': {'random_state': random_state},
                         'etc': {'features': features},
                         'estimator_class': XGBClassifier,
                         'estimator_params': ['max_depth', 'learning_rate', 'n_estimators', 'silent', 'objective',
                                              'booster', 'n_jobs', 'nthread', 'gamma', 'min_child_weight',
                                              'max_delta_step', 'subsample', 'colsample_bytree', 'colsample_bylevel',
                                              'reg_alpha', 'reg_lambda', 'scale_pos_weight', 'base_score',
                                              'random_state', 'seed', 'missing', 'importance_type']}
    return preprocess_result


def postprocess_(table, feature_cols, classifier):
    feature_names, _ = check_col_type(table, feature_cols)
    feature_importance = classifier.feature_importances_
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_names).T

    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_names)[indices]
    n_features = len(indices)
    figs = PyPlotData()

    meta = PyPlotMeta('fig_feature_importances',
                      xlabel='Feature importance',
                      ylabel='Feature',
                      yticks={'ticks': np.arange(n_features), 'labels': sorted_feature_cols})
    meta.barh(range(n_features),
              feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        meta.text(v, i, " {:.2f}".format(v), color='b',
                  va='center', fontweight='bold')
    meta.tight_layout()

    figs.addmeta(meta)
    figs.compile()

    postprocess_result = {'update_md': {'Plot Feature Importance': figs.getMD('fig_feature_importances'),
                                        'Normalized Feature Importance Table': pandasDF2MD(feature_importance_df, 20)},
                          'update_model_etc': {'feature_importance': feature_importance},
                          'type': 'xgb_classification_model',
                          'figs': figs}

    return postprocess_result


def _xgb_classification_train(table, feature_cols, label_col, max_depth=3, learning_rate=0.1, n_estimators=100,
                              silent=True, objective='binary:logistic', booster='gbtree', n_jobs=1, nthread=None,
                              gamma=0, min_child_weight=1, max_delta_step=0, subsample=1, colsample_bytree=1,
                              colsample_bylevel=1, reg_alpha=0, reg_lambda=1, scale_pos_weight=1, base_score=0.5,
                              random_state=None, seed=None, missing=None, importance_type='gain',
                              class_weight=None, eval_set=None, eval_metric=None, early_stopping_rounds=None,
                              verbose=True, xgb_model=None, sample_weight_eval_set=None,
                              _user_id=None):
    feature_names, features = check_col_type(table, feature_cols)

    preprocess_result = preprocess_(table, feature_cols, label_col, class_weight, random_state)
    sample_weight = preprocess_result['fit_param']['sample_weight']
    features = preprocess_result['etc']['features']
    random_state = preprocess_result['update_param']['random_state']

    classifier = XGBClassifier(max_depth=max_depth,
                               learning_rate=learning_rate,
                               n_estimators=n_estimators,
                               silent=silent,
                               objective=objective,
                               booster=booster,
                               n_jobs=n_jobs,
                               nthread=nthread,
                               gamma=gamma,
                               min_child_weight=min_child_weight,
                               max_delta_step=max_delta_step,
                               subsample=subsample,
                               colsample_bytree=colsample_bytree,
                               colsample_bylevel=colsample_bylevel,
                               reg_alpha=reg_alpha,
                               reg_lambda=reg_lambda,
                               scale_pos_weight=scale_pos_weight,
                               base_score=base_score,
                               random_state=random_state,
                               seed=seed,
                               missing=missing,
                               importance_type=importance_type)

    classifier.fit(features, table[label_col],
                   sample_weight, eval_set, eval_metric, early_stopping_rounds, verbose,
                   xgb_model, sample_weight_eval_set)

    postprocess_result = postprocess_(table, feature_cols, classifier)
    update_md = postprocess_result['update_md']
    fig_plot_importance = update_md['Plot Feature Importance']
    feature_importance_df = update_md['Normalized Feature Importance Table']
    feature_importance = postprocess_result['update_model_etc']['feature_importance']

    get_param = classifier.get_params()
    params = dict2MD(get_param)

    model = _model_dict('xgb_classification_model')
    model['feature_cols'] = feature_cols
    model['label_col'] = label_col
    model['parameters'] = get_param
    model['feature_importance'] = feature_importance
    model['classifier'] = classifier
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## XGB Classification Train Result
    |
    | ### Plot Feature Importance
    | {fig_importance}
    |
    | ### Normalized Feature Importance Table
    | {table_feature_importance}
    |
    | ### Parameters
    | {list_parameters}
    |
    """.format(fig_importance=fig_plot_importance,
               table_feature_importance=feature_importance_df,
               list_parameters=params
               )))
    model['_repr_brtc_'] = rb.get()
    feature_importance_table = pd.DataFrame([[feature_names[i], feature_importance[i]]
                                             for i in range(len(feature_names))],
                                            columns=['feature_name', 'importance'])
    model['feature_importance_table'] = feature_importance_table
    model['figures'] = postprocess_result['figs'].tojson()

    return {'model': model}


def xgb_classification_predict(table, model, **params):
    check_required_parameters(_xgb_classification_predict, params, ['table', 'model'])

    if '_grouped_data' in model:
        return _function_by_group(_xgb_classification_predict, table, model, **params)
    else:
        return _xgb_classification_predict(table, model, **params)


def _xgb_classification_predict(table, model, prediction_col='prediction', probability_col='probability',
                                thresholds=None, suffix='index', output_margin=False, ntree_limit=None):
    feature_cols = model['feature_cols']
    classifier = model['classifier']

    # prediction = classifier.predict(table[feature_cols], output_margin, ntree_limit)
    _, features = check_col_type(table, feature_cols)
    classes = classifier.classes_
    len_classes = len(classes)
    is_binary = len_classes == 2

    if thresholds is None:
        thresholds = np.array([1 / len_classes for _ in classes])
    elif isinstance(thresholds, list):
        if len(thresholds) == 1 and is_binary and 0 < thresholds[0] < 1:
            thresholds = np.array([thresholds[0], 1 - thresholds[0]])
        else:
            thresholds = np.array(thresholds)

    prob = classifier.predict_proba(features, ntree_limit)
    prediction = classes[np.argmax(prob / thresholds, axis=1)]

    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes

    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=probability_col, suffix=suffix)
                 for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)

    result = table.copy()
    result[prediction_col] = prediction
    result = pd.concat([result, prob_df], axis=1)

    return {'out_table': result}


def _plot_feature_importances(feature_names, classifier):
    feature_importance = classifier.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_names = np.array(feature_names)[indices]

    plt.barh(range(len(indices)), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')

    plt.yticks(range(len(indices)), sorted_feature_names)
    plt.xlabel("Feature importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    fig_feature_importances = plt2MD(plt)
    plt.close()
    return fig_feature_importances
