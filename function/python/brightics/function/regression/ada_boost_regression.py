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

import matplotlib
import numpy as np
import pandas as pd

matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from sklearn.ensemble import AdaBoostRegressor
from sklearn.tree import DecisionTreeRegressor
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.repr import dict2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate, greater_than_or_equal_to, greater_than
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.function.utils import _model_dict
from brightics.common.classify_input_type import check_col_type

from brightics.common.data_export import PyPlotData, PyPlotMeta


def ada_boost_regression_train(table, group_by=None, **params):
    check_required_parameters(_ada_boost_regression_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _ada_boost_regression_train)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'max_depth'),
                              greater_than_or_equal_to(params, 1, 'n_estimators'),
                              greater_than(params, 0, 'learning_rate')]
    validate(*param_validation_check)

    if group_by is not None:
        return _function_by_group(_ada_boost_regression_train, table, group_by=group_by, **params)
    else:
        return _ada_boost_regression_train(table, **params)


def _plot_feature_importance(feature_cols, classifier):
    feature_importance = classifier.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_cols)[indices]

    n_features = len(feature_cols)
    plt.barh(range(n_features), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')

    plt.yticks(np.arange(n_features), sorted_feature_cols)
    plt.xlabel("Feature importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    fig_feature_importance = plt2MD(plt)
    plt.close()
    return fig_feature_importance


def preprocess_():
    base_estimator_class = DecisionTreeRegressor
    preprocess_result = {'empty_estimator_param': {'base_estimator': base_estimator_class()},
                         'base_estimator_class': base_estimator_class,
                         'estimator_class': AdaBoostRegressor,
                         'estimator_params': ['base_estimator', 'n_estimators', 'learning_rate', 'loss',
                                              'random_state'],
                         'base_estimator_params': ['max_depth']}
    return preprocess_result


def postprocess_(table, feature_cols, regressor):
    feature_names, _ = check_col_type(table, feature_cols)

    feature_importance = regressor.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_names)[indices]
    n_features = len(feature_names)

    figs = PyPlotData()

    meta = PyPlotMeta('fig_feature_importance',
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

    postprocess_result = {'update_md': {'Feature Importance': figs.getMD('fig_feature_importance')},
                          'type': 'ada_boost_regression_model',
                          'figs': figs}
    return postprocess_result


def _ada_boost_regression_train(table, feature_cols, label_col, max_depth=3,
                                n_estimators=50, learning_rate=1.0, loss='linear', random_state=None,
                                _user_id=None):
    feature_names, x_train = check_col_type(table, feature_cols)
    y_train = table[label_col]

    base_estimator = DecisionTreeRegressor(max_depth=max_depth)
    regressor = AdaBoostRegressor(base_estimator, n_estimators, learning_rate, loss, random_state)
    regressor.fit(x_train, y_train)

    postprocess_result = postprocess_(table, feature_cols, regressor)
    fig_feature_importance = postprocess_result['update_md']['Feature Importance']

    params = {'feature_cols': feature_cols,
              'label_col': label_col,
              'feature_importance': regressor.feature_importances_,
              'n_estimators': n_estimators,
              'learning_rate': learning_rate,
              'loss': loss,
              'random_state': random_state}

    model = _model_dict('ada_boost_regression_model')
    get_param = regressor.get_params()
    model['parameters'] = get_param
    model['regressor'] = regressor
    model['params'] = params
    params = dict2MD(get_param)

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## AdaBoost Regression Train Result
    |
    | ### Feature Importance
    | {fig_feature_importance}
    |
    | ### Parameters
    | {list_parameters}
    |
    """.format(fig_feature_importance=fig_feature_importance,
               list_parameters=params)))

    model['_repr_brtc_'] = rb.get()
    feature_importance = regressor.feature_importances_
    feature_importance_table = pd.DataFrame(
        [[feature_names[i], feature_importance[i]] for i in range(len(feature_names))],
        columns=['feature_name', 'importance'])
    model['feature_importance_table'] = feature_importance_table
    model['feature_cols'] = feature_cols
    model['figures'] = postprocess_result['figs'].tojson()

    return {'model': model}


def ada_boost_regression_predict(table, model, **params):
    check_required_parameters(_ada_boost_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_ada_boost_regression_predict, table, model, **params)
    else:
        return _ada_boost_regression_predict(table, model, **params)


def _ada_boost_regression_predict(table, model, pred_col_name='prediction'):
    if (table.shape[0] == 0):
        new_cols = table.columns.tolist() + [pred_col_name]
        out_table = pd.DataFrame(columns=new_cols)
        return {'out_table': out_table}
    out_table = table.copy()
    regressor = model['regressor']
    if 'feature_cols' in model:
        _, test_data = check_col_type(table, model['feature_cols'])
    else:
        _, test_data = check_col_type(table, model['params']['feature_cols'])

    out_table[pred_col_name] = regressor.predict(test_data)
    return {'out_table': out_table}
