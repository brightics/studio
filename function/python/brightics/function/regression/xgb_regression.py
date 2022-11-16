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

from random import randint
import pandas as pd
import numpy as np
import matplotlib

matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to
from brightics.common.classify_input_type import check_col_type
from brightics.common.data_export import PyPlotData, PyPlotMeta


def xgb_regression_train(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(params, _xgb_regression_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 0.0, 'learning_rate'),
                              greater_than_or_equal_to(params, 1, 'n_estimators')]

    validate(*param_validation_check)
    check_required_parameters(_xgb_regression_train, params, ['table'])

    if group_by is not None:
        grouped_model = _function_by_group(_xgb_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _xgb_regression_train(table, **params)


def preprocess_(random_state):
    if random_state is None:
        random_state = randint(-2 ** 31, 2 ** 31 - 1)

    preprocess_result = {'update_param': {'random_state': random_state},
                         'estimator_class': XGBRegressor,
                         'estimator_params': ['max_depth', 'learning_rate', 'n_estimators', 'silent', 'objective',
                                              'booster', 'n_jobs', 'nthread', 'gamma', 'min_child_weight',
                                              'max_delta_step', 'subsample', 'colsample_bytree', 'colsample_bylevel',
                                              'reg_alpha', 'reg_lambda', 'scale_pos_weight', 'base_score',
                                              'random_state', 'seed', 'missing', 'importance_type'],
                         'param_change': {'objectibe': 'objective'}}
    return preprocess_result


def postprocess_(table, feature_cols, regressor):
    feature_names, _ = check_col_type(table, feature_cols)
    feature_importance = regressor.feature_importances_
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_names).T

    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_cols)[indices]
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
                          'type': 'xgb_regression_model',
                          'figs': figs}
    return postprocess_result


def _xgb_regression_train(table, feature_cols, label_col, max_depth=3, learning_rate=0.1, n_estimators=100,
                          silent=True, objectibe='reg:linear', booster='gbtree', n_jobs=1, nthread=None, gamma=0,
                          min_child_weight=1, max_delta_step=0, subsample=1, colsample_bytree=1, colsample_bylevel=1,
                          reg_alpha=0, reg_lambda=1, scale_pos_weight=1, base_score=0.5, random_state=None, seed=None,
                          missing=None, sample_weight=None, eval_set=None, eval_metric=None, early_stopping_rounds=None,
                          verbose=True, xgb_model=None, sample_weight_eval_set=None, importance_type='gain',
                          _user_id=None):
    preprocess_result = preprocess_(random_state)
    random_state = preprocess_result['update_param']['random_state']

    regressor = XGBRegressor(max_depth=max_depth,
                             learning_rate=learning_rate,
                             n_estimators=n_estimators,
                             silent=silent,
                             objective=objectibe,
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
    feature_names, features = check_col_type(table, feature_cols)
    label = table[label_col]
    regressor.fit(features, label,
                  sample_weight, eval_set, eval_metric, early_stopping_rounds, verbose,
                  xgb_model, sample_weight_eval_set)

    postprocess_result = postprocess_(table, feature_cols, regressor)
    update_md = postprocess_result['update_md']
    fig_plot_importance = update_md['Plot Feature Importance']
    feature_importance_df = update_md['Normalized Feature Importance Table']
    feature_importance = postprocess_result['update_model_etc']['feature_importance']

    get_param = regressor.get_params()

    out_model = _model_dict('xgb_regression_model')
    out_model['feature_cols'] = feature_cols
    out_model['label_col'] = label_col
    out_model['parameters'] = get_param
    out_model['feature_importance'] = feature_importance
    out_model['regressor'] = regressor
    out_model['plot_importance'] = fig_plot_importance
    #     out_model['plot_tree_UT'] = fig_plot_tree_UT
    #     out_model['plot_tree_LR'] = fig_plot_tree_LR
    #         out_model['to_graphviz'] = md_to_graphviz

    # report
    get_param_list = []
    get_param_list.append(['feature_cols', feature_names])
    get_param_list.append(['label_col', label_col])
    for key, value in get_param.items():
        temp = [key, value]
        get_param_list.append(temp)
    get_param_df = pd.DataFrame(data=get_param_list, columns=['parameter', 'value'])

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## XGB Regression Result
    |
    | ### Plot Feature Importance
    | {image_importance}
    |
    | ### Normalized Feature Importance Table
    | {table_feature_importance}
    |
    | ### Parameters
    | {table_parameter}
    |
    """.format(image_importance=fig_plot_importance,
               table_feature_importance=feature_importance_df,
               table_parameter=pandasDF2MD(get_param_df)
               )))
    out_model['_repr_brtc_'] = rb.get()
    feature_importance_table = pd.DataFrame(
        [[feature_cols[i], feature_importance[i]] for i in range(len(feature_cols))],
        columns=['feature_name', 'importance'])
    out_model['feature_importance_table'] = feature_importance_table
    return {'model': out_model}


def xgb_regression_predict(table, model, **params):
    check_required_parameters(_xgb_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_xgb_regression_predict, table, model, **params)
    else:
        return _xgb_regression_predict(table, model, **params)


def _xgb_regression_predict(table, model, prediction_col='prediction',
                            output_margin=False, ntree_limit=None):
    feature_cols = model['feature_cols']
    feature_names, features = check_col_type(table, feature_cols)
    regressor = model['regressor']
    prediction = regressor.predict(features, output_margin, ntree_limit)
    #         prediction_df = pd.DataFrame(data = prediction)
    #
    #         out_df = pd.concat([table.reset_index(drop=True), prediction_df], axis=1)
    #         out_df.columns = table.columns.values.tolist() + [prediction_col]
    out_table = table.copy()
    out_table[prediction_col] = prediction

    return {'out_table': out_table}


def _plot_feature_importances(feature_cols, regressor):
    feature_importance = regressor.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_cols)[indices]

    plt.barh(range(len(indices)), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')

    plt.yticks(range(len(indices)), sorted_feature_cols)
    plt.xlabel("Feature importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    fig_feature_importances = plt2MD(plt)
    plt.close()
    return fig_feature_importances
