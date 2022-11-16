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
import numexpr as ne
import numpy as np
import pandas as pd
from scipy import stats

matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from sklearn.utils.multiclass import type_of_target
from sklearn.ensemble import RandomForestClassifier
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.repr import dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import raise_error
from brightics.common.classify_input_type import check_col_type
from brightics.common.data_export import PyPlotData, PyPlotMeta


def random_forest_classification_train(table, group_by=None, **params):
    check_required_parameters(_random_forest_classification_train, params, ['table'])

    params = get_default_from_parameters_if_required(params, _random_forest_classification_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'n_estimators'),
                              greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 1, 'min_samples_split'),
                              greater_than_or_equal_to(params, 1, 'min_samples_leaf')]
    validate(*param_validation_check)

    if group_by is not None:
        return _function_by_group(_random_forest_classification_train, table, group_by=group_by, **params)
    else:
        return _random_forest_classification_train(table, **params)


def _plot_feature_importances(feature_names, classifier):
    feature_importance = classifier.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_names = np.array(feature_names)[indices]

    n_features = classifier.n_features_
    plt.barh(range(n_features), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')

    plt.yticks(np.arange(n_features), sorted_feature_names)
    plt.xlabel("Feature importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    fig_feature_importances = plt2MD(plt)
    plt.close()
    return fig_feature_importances


def preprocess_(table, label_col, class_weight, max_features):
    y_train = table[label_col]

    if type_of_target(y_train) == 'continuous':
        raise_error('0718', 'label_col')

    if max_features == "n":
        max_features = None

    class_labels = y_train.unique()
    if class_weight is not None:
        if len(class_weight) != len(class_labels):
            raise ValueError("Number of class weights should match number of labels.")
        else:
            classes = sorted(class_labels)
            class_weight = {classes[i]: class_weight[i] for i in range(len(classes))}

    preprocess_result = {'update_param': {"class_weight": class_weight,
                                          "max_features": max_features},
                         'estimator_class': RandomForestClassifier,
                         'estimator_params': ['n_estimators', 'criterion', 'max_depth', 'min_samples_split',
                                              'min_samples_leaf', 'min_weight_fraction_leaf', 'max_features',
                                              'max_leaf_nodes', 'min_impurity_decrease', 'class_weight',
                                              'random_state']}
    return preprocess_result


def preprocess_hyperparam_(max_features):
    max_features = [None if item == "n" else item for item in max_features]
    res = {'update': {'max_features': max_features}}
    return res


def postprocess_(table, feature_cols, classifier):
    feature_names, features = check_col_type(table, feature_cols)

    feature_importance = classifier.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_cols)[indices]
    n_features = classifier.n_features_

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

    postprocess_result = {'update_md': {'Feature Importance': figs.getMD('fig_feature_importances')},
                          'type': 'random_forest_classification_model',
                          'figs': figs}
    return postprocess_result


def _random_forest_classification_train(table, feature_cols, label_col, n_estimators=10, criterion="gini",
                                        max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                        min_weight_fraction_leaf=0, max_features="sqrt",
                                        max_leaf_nodes=None, min_impurity_decrease=0, class_weight=None,
                                        random_state=None, _user_id=None):
    feature_names, features_train = check_col_type(table, feature_cols)
    # X_train = table[feature_cols]
    y_train = table[label_col]

    preprocess_result = preprocess_(table, label_col, class_weight, max_features)
    class_weight = preprocess_result['update_param']['class_weight']
    max_features = preprocess_result['update_param']['max_features']

    classifier = RandomForestClassifier(n_estimators=n_estimators,
                                        criterion=criterion,
                                        max_depth=max_depth,
                                        min_samples_split=min_samples_split,
                                        min_samples_leaf=min_samples_leaf,
                                        min_weight_fraction_leaf=min_weight_fraction_leaf,
                                        max_features=max_features,
                                        max_leaf_nodes=max_leaf_nodes,
                                        min_impurity_decrease=min_impurity_decrease,
                                        class_weight=class_weight,
                                        random_state=random_state)
    classifier.fit(features_train, y_train)

    params = {'feature_cols': feature_cols,
              'label_col': label_col,
              'n_estimators': n_estimators,
              'criterion': criterion,
              'max_depth': max_depth,
              'min_samples_split': min_samples_split,
              'min_samples_leaf': min_samples_leaf,
              'min_weight_fraction_leaf': min_weight_fraction_leaf,
              'max_features': max_features,
              'max_leaf_nodes': max_leaf_nodes,
              'min_impurity_decrease': min_impurity_decrease,
              'class_weight': class_weight,
              'random_state': random_state}

    model = _model_dict('random_forest_classification_model')
    model['classifier'] = classifier
    model['params'] = params

    postprocess_result = postprocess_(table, feature_cols, classifier)
    fig_feature_importances = postprocess_result['update_md']['Feature Importance']

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Random Forest Classification Train Result
    |
    | ### Parameters
    | {params}
    |
    | ### Feature Importance
    | {fig_feature_importances}
    |
    """.format(params=dict2MD(params), fig_feature_importances=fig_feature_importances)))

    model['_repr_brtc_'] = rb.get()
    feature_importance = classifier.feature_importances_
    feature_importance_table = pd.DataFrame([[feature_cols[i], feature_importance[i]]
                                             for i in range(len(feature_cols))],
                                            columns=['feature_name', 'importance'])
    model['feature_importance_table'] = feature_importance_table
    model['feature_cols'] = feature_cols
    model['figures'] = postprocess_result['figs'].tojson()

    return {'model': model}


def random_forest_classification_predict(table, model, **params):
    check_required_parameters(_random_forest_classification_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_random_forest_classification_predict, table, model, **params)
    else:
        return _random_forest_classification_predict(table, model, **params)


def _string_make(character, index, path, start, array, split_feature_name, split_threshold):
    if index == 0:
        return ' & ({} <= {})'.format(character, split_threshold[start]) + path
    else:
        return ' & ({} > {})'.format(character, split_threshold[start]) + path


def _string_make_complex_version(character, index, path, start, split_feature_name, split_threshold,
                                 split_left_categories_values, split_right_categories_values):
    if pd.isnull(split_threshold[start]):
        if index == 0:
            result = ''
            tmp = split_left_categories_values[start]
            for i in tmp:
                result += " | ({} == '{}')".format(character, i)
            result = ' & ( ' + result[3:] + ' )'
            return result + path
        else:
            result = ''
            tmp = split_right_categories_values[start]
            for i in tmp:
                result += " | ({} == '{}')".format(character, i)
            result = ' & ( ' + result[3:] + ' )'
            return result + path
    else:
        if index == 0:
            return ' & ({} <= {})'.format(character, split_threshold[start]) + path
        else:
            return ' & ({} > {})'.format(character, split_threshold[start]) + path


def _path_find(start, children_array, array, split_feature_name, split_threshold, predict, result):
    paths = []
    start = array[start]
    for index, child in enumerate(children_array[start]):
        if child == -1:
            result.append(predict[start])
            return result, ['']
        result, tmp_paths = _path_find(child, children_array, array, split_feature_name, split_threshold, predict,
                                       result)
        for path in tmp_paths:
            paths.append(
                _string_make(split_feature_name[start], index, path, start, array, split_feature_name, split_threshold))
    return result, paths


def _path_find_complex_version(start, children_array, array, split_feature_name, split_threshold,
                               split_left_categories_values, split_right_categories_values, predict, result):
    paths = []
    start = array[start]
    for index, child in enumerate(children_array[start]):
        if child == -1:
            result.append(predict[start])
            return result, ['']
        result, tmp_paths = _path_find_complex_version(child, children_array, array, split_feature_name,
                                                       split_threshold, split_left_categories_values,
                                                       split_right_categories_values, predict, result)
        for path in tmp_paths:
            paths.append(_string_make_complex_version(split_feature_name[start], index, path, start, split_feature_name,
                                                      split_threshold, split_left_categories_values,
                                                      split_right_categories_values))
    return result, paths


def _random_forest_classification_predict(table, model, pred_col_name='prediction', prob_col_prefix='probability',
                                          display_log_prob=False, log_prob_prefix='log_probability', suffix='index'):
    out_table = table.copy()
    if 'feature_cols' in model:
        feature_cols = model['feature_cols']
    else:
        feature_cols = model['params']['feature_cols']

    if 'classifier' in model:
        feature_names, features_test = check_col_type(table, feature_cols)
        classifier = model['classifier']
        out_table[pred_col_name] = classifier.predict(features_test)
        classes = classifier.classes_
        prob = classifier.predict_proba(features_test)
        if suffix == 'index':
            suffixes = [i for i, _ in enumerate(classes)]
        else:
            suffixes = classes
        prob_col_name = ['{prob_col_prefix}_{suffix}'.format(prob_col_prefix=prob_col_prefix, suffix=suffix) for suffix
                         in suffixes]
        out_col_prob = pd.DataFrame(data=prob, columns=prob_col_name)
        if display_log_prob:
            log_prob = np.log(prob)
            logprob_cols = ['{prefix}_{suffix}'.format(prefix=log_prob_prefix, suffix=suffix)
                            for suffix in suffixes]
            logprob_df = pd.DataFrame(data=log_prob, columns=logprob_cols)
            out_table = pd.concat([out_table, out_col_prob, logprob_df], axis=1)
        else:
            out_table = pd.concat([out_table, out_col_prob], axis=1)
    else:
        if model['_type'] == 'random_forest_model':
            feature_cols = model['feature_cols']
            test_data = table[feature_cols]
            model_table = model['table_1']
            tree_indices = model_table.reset_index().groupby('tree_id').agg({'index': ['min', 'max']}).values
            node_id_full = model_table.node_id.values
            children_array_full = model_table[['left_nodeid', 'right_nodeid']].values
            predict_full = model_table.predict.values
            classes = np.unique(predict_full)
            split_feature_name_full = model_table.split_feature_name.values
            split_threshold_full = model_table.split_threshold.values
            conclusion_list = []
            for i in tree_indices:
                tmp_max = node_id_full[i[0]:i[1] + 1].max()
                array = np.empty(tmp_max + 1, dtype=np.int32)
                children_array = children_array_full[i[0]:i[1] + 1]
                predict = predict_full[i[0]:i[1] + 1]
                split_feature_name = split_feature_name_full[i[0]:i[1] + 1]
                split_threshold = split_threshold_full[i[0]:i[1] + 1]
                for index, value in enumerate(node_id_full[i[0]:i[1] + 1]):
                    array[value] = index
                result = []
                result, expr_array = _path_find(1, children_array, array, split_feature_name, split_threshold, predict,
                                                result)
                expr_array = [i[3:] for i in expr_array]
                conclusion = [None] * len(table)
                our_list = dict()
                for i in feature_cols:
                    our_list[i] = table[i].values
                for index, expr in enumerate(expr_array):
                    conclusion = np.where(ne.evaluate(expr, local_dict=our_list), result[index], conclusion)
                conclusion_list.append(conclusion)
            result = stats.mode(np.array(conclusion_list, dtype=int), axis=0)
            out_table[pred_col_name] = result[0][0]
            out_table['probability'] = result[1][0] / len(tree_indices)
        else:
            feature_cols = model['feature_cols']
            if 'gbt' in model['_type']:
                if model['auto']:
                    model_table = model['table_3']
                    classes = model['table_4']['labels'].values[-1]
                    data_type = model['table_4']['data_type'].values[-1]
                    if data_type == 'integer':
                        classes = np.array([np.int32(i) for i in classes])
                    elif data_type == 'double':
                        classes = np.array([np.float64(i) for i in classes])
                    elif data_type == 'long':
                        classes = np.array([np.int64(i) for i in classes])
                else:
                    model_table = model['table_2']
                    classes = model['table_3']['labels'].values[-1]
                    data_type = model['table_3']['data_type'].values[-1]
                    if data_type == 'integer':
                        classes = np.array([np.int32(i) for i in classes])
                    elif data_type == 'double':
                        classes = np.array([np.float64(i) for i in classes])
                    elif data_type == 'long':
                        classes = np.array([np.int64(i) for i in classes])
                tree_weight_full = model_table.tree_weight.values
            else:
                if model['auto']:
                    model_table = model['table_4']
                    classes = np.array(model['table_5']['labels'].values[-1])
                    data_type = model['table_5']['data_type'].values[-1]
                    if data_type == 'integer':
                        classes = np.array([np.int32(i) for i in classes])
                    elif data_type == 'double':
                        classes = np.array([np.float64(i) for i in classes])
                    elif data_type == 'long':
                        classes = np.array([np.int64(i) for i in classes])
                else:
                    model_table = model['table_3']
                    classes = np.array(model['table_4']['labels'].values[-1])
                    data_type = model['table_4']['data_type'].values[-1]
                    if data_type == 'integer':
                        classes = np.array([np.int32(i) for i in classes])
                    elif data_type == 'double':
                        classes = np.array([np.float64(i) for i in classes])
                    elif data_type == 'long':
                        classes = np.array([np.int64(i) for i in classes])
            tree_indices = model_table.reset_index().groupby('tree_id').agg({'index': ['min', 'max']}).values
            node_id_full = model_table.node_id.values
            children_array_full = model_table[['left_nodeid', 'right_nodeid']].values
            predict_full = model_table.predict.values
            split_feature_name_full = model_table.split_feature_name.values
            split_threshold_full = model_table.split_threshold.values
            split_left_categories_values_full = model_table.split_left_categories_values.values
            split_right_categories_values_full = model_table.split_right_categories_values.values
            conclusion_list = []
            for i in tree_indices:
                tmp_max = node_id_full[i[0]:i[1] + 1].max()
                array = np.empty(tmp_max + 1, dtype=np.int32)
                children_array = children_array_full[i[0]:i[1] + 1]
                predict = predict_full[i[0]:i[1] + 1]
                split_feature_name = split_feature_name_full[i[0]:i[1] + 1]
                split_threshold = split_threshold_full[i[0]:i[1] + 1]
                split_left_categories_values = split_left_categories_values_full[i[0]:i[1] + 1]
                split_right_categories_values = split_right_categories_values_full[i[0]:i[1] + 1]
                for index, value in enumerate(node_id_full[i[0]:i[1] + 1]):
                    array[value] = index
                result = []
                result, expr_array = _path_find_complex_version(1, children_array, array, split_feature_name,
                                                                split_threshold, split_left_categories_values,
                                                                split_right_categories_values, predict, result)
                expr_array = [i[3:] for i in expr_array]
                conclusion = [None] * len(table)
                our_list = dict()
                for j in feature_cols:
                    if table[j].dtype == 'object':
                        our_list[j] = np.array(table[j], dtype='|S')
                    else:
                        our_list[j] = table[j].values
                for index, expr in enumerate(expr_array):
                    conclusion = np.where(ne.evaluate(expr, local_dict=our_list), result[index], conclusion)
                if 'gbt' in model['_type']:
                    conclusion_list.append(conclusion * tree_weight_full[i[0]])
                else:
                    conclusion_list.append(conclusion)
            if 'gbt' in model['_type']:
                result = np.sum(np.array(conclusion_list), axis=0)
                result = np.where(result < 0, classes[0], classes[1])
                out_table[pred_col_name] = result
            else:
                result = stats.mode(np.array(conclusion_list, dtype=int), axis=0)
                out_table[pred_col_name] = classes[result[0][0]]
                out_table['probability'] = result[1][0] / len(tree_indices)
    return {'out_table': out_table}
