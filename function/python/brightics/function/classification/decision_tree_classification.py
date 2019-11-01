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
import matplotlib.pyplot as plt
import numexpr as ne
from sklearn.tree import DecisionTreeClassifier
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import plt2MD
from brightics.common.repr import dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to, greater_than, from_to
from brightics.common.validation import raise_error
import sklearn.utils as sklearn_utils
from brightics.common.classify_input_type import check_col_type


def decision_tree_classification_train(table, group_by=None, **params):
    check_required_parameters(_decision_tree_classification_train, params, ['table'])

    params = get_default_from_parameters_if_required(params, _decision_tree_classification_train)

    param_validation_check = [greater_than_or_equal_to(params, 2, 'min_samples_split'),
                              greater_than_or_equal_to(params, 1, 'min_samples_leaf'),
                              from_to(params, 0.0, 0.5, 'min_weight_fraction_leaf'),
                              greater_than_or_equal_to(params, 0.0, 'min_impurity_decrease'),
                              greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 1, 'max_features'),
                              greater_than(params, 1, 'max_leaf_nodes')]

    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_decision_tree_classification_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _decision_tree_classification_train(table, **params)


def _decision_tree_classification_train(table, feature_cols, label_col,  # fig_size=np.array([6.4, 4.8]),
                                        criterion='gini', splitter='best', max_depth=None, min_samples_split=2,
                                        min_samples_leaf=1, min_weight_fraction_leaf=0.0, max_features=None,
                                        random_state=None, max_leaf_nodes=None, min_impurity_decrease=0.0,
                                        min_impurity_split=None, class_weight=None, presort=False, sample_weight=None,
                                        check_input=True, X_idx_sorted=None):

    feature_names, features = check_col_type(table, feature_cols)
    y_train = table[label_col]
    
    if(sklearn_utils.multiclass.type_of_target(y_train) == 'continuous'):
        raise_error('0718', 'label_col')

    class_labels = sorted(set(y_train))
    if class_weight is not None:
        if len(class_weight) != len(class_labels):
            raise ValueError("Number of class weights should match number of labels.")
        else:            
            class_weight = {class_labels[i] : class_weight[i] for i in range(len(class_labels))}
                        
    classifier = DecisionTreeClassifier(criterion, splitter, max_depth, min_samples_split, min_samples_leaf,
                                       min_weight_fraction_leaf, max_features, random_state, max_leaf_nodes,
                                       min_impurity_decrease, min_impurity_split, class_weight, presort)
    classifier.fit(features, table[label_col],
                   sample_weight, check_input, X_idx_sorted)

    try:
        from sklearn.externals.six import StringIO
        from sklearn.tree import export_graphviz
        import pydotplus
        dot_data = StringIO()
        export_graphviz(classifier, out_file=dot_data,
                        feature_names=feature_names, class_names=table[label_col].astype('str').unique(),
                        filled=True, rounded=True,
                        special_characters=True)
        graph = pydotplus.graph_from_dot_data(dot_data.getvalue())
        from brightics.common.repr import png2MD
        fig_tree = png2MD(graph.create_png())
    except:
        fig_tree = "Graphviz is needed to draw a Decision Tree graph. Please download it from http://graphviz.org/download/ and install it to your computer."

    # json
    model = _model_dict('decision_tree_classification_model')
    model['feature_cols'] = feature_cols
    model['label_col'] = label_col
    model['classes'] = classifier.classes_
    feature_importance = classifier.feature_importances_
    model['feature_importance'] = feature_importance
    model['max_features'] = classifier.max_features_
    model['n_classes'] = classifier.n_classes_
    model['n_features'] = classifier.n_features_
    model['n_outputs'] = classifier.n_outputs_
    model['tree'] = classifier.tree_
    get_param = classifier.get_params()
    model['parameters'] = get_param
    model['classifier'] = classifier

    # report
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_names)[indices]

    plt.title('Feature Importances')
    plt.barh(range(len(indices)), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')
    plt.yticks(range(len(indices)), sorted_feature_cols)
    plt.xlabel('Relative Importance')
    plt.xlim(0, 1.1)
    plt.tight_layout()
    fig_feature_importances = plt2MD(plt)
    plt.clf()

    params = dict2MD(get_param)

    # Add tree plot
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Decision Tree Classification Train Result
    | ### Decision Tree
    | {fig_tree}
    |
    | ### Feature Importance
    | {fig_feature_importances}
    |
    | ### Parameters
    | {list_parameters}
    |
    """.format(fig_tree=fig_tree,
               fig_feature_importances=fig_feature_importances,
               list_parameters=params
               )))
    model['_repr_brtc_'] = rb.get()
    feature_importance_table = pd.DataFrame([[feature_cols[i], feature_importance[i]] for i in range(len(feature_cols))], columns=['feature_name', 'importance'])
    model['feature_importance_table'] = feature_importance_table
    return {'model' : model}


def decision_tree_classification_predict(table, model, **params):
    check_required_parameters(_decision_tree_classification_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_decision_tree_classification_predict, table, model, **params)
    else:
        return _decision_tree_classification_predict(table, model, **params)


def _string_make(character, index, path, start, array, split_feature_name, split_threshold):
    if index == 0:
        return ' & ({} <= {})'.format(character, split_threshold[start]) + path
    else:
        return ' & ({} > {})'.format(character, split_threshold[start]) + path


def _string_make_complex_version(character, index, path, start, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values):
    if pd.isnull(split_threshold[start]):
        if index == 0:
            result = ''
            tmp = split_left_categories_values[start]
            for i in tmp:
                result += " | ({} == '{}')".format(character, i)
            result = ' & ( ' + result[3:] + ' )'
            return result+path
        else:
            result = ''
            tmp = split_right_categories_values[start]
            for i in tmp:
                result += " | ({} == '{}')".format(character, i)
            result = ' & ( ' + result[3:] + ' )'
            return result+path
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
        result, tmp_paths = _path_find(child, children_array, array, split_feature_name, split_threshold, predict, result)
        for path in tmp_paths:
            paths.append(_string_make(split_feature_name[start], index, path, start, array, split_feature_name, split_threshold))
    return result, paths


def _path_find_complex_version(start, children_array, array, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values, predict, result):
    paths = []
    start = array[start]
    for index, child in enumerate(children_array[start]):
        if child == -1:
            result.append(predict[start])
            return result, ['']
        result, tmp_paths = _path_find_complex_version(child, children_array, array, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values, predict, result)
        for path in tmp_paths:
            paths.append(_string_make_complex_version(split_feature_name[start], index, path, start, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values))
    return result, paths


def _decision_tree_classification_predict(table, model, prediction_col='prediction', prob_col_prefix='probability', suffix='index', check_input=True):
    out_table = table.copy()
    feature_cols = model['feature_cols']
    
    if 'classifier' in model:
        feature_names, features = check_col_type(table, feature_cols)
        classifier = model['classifier']
        out_table[prediction_col] = classifier.predict(features, check_input)
        classes = classifier.classes_
        prob = classifier.predict_proba(features)
        if suffix == 'index':
            suffixes = [i for i, _ in enumerate(classes)]
        else:
            suffixes = classes
        prob_col_name = ['{prob_col_prefix}_{suffix}'.format(prob_col_prefix=prob_col_prefix, suffix=suffix) for suffix in suffixes]
        out_col_prob = pd.DataFrame(data=prob, columns=prob_col_name)
        out_table = pd.concat([out_table, out_col_prob], axis=1)
    else:
        if model['_type'] == 'decision_tree_model':
            model_table = model['table_1']
            tmp_max = model_table.id.max()
            array = np.empty(tmp_max + 1, dtype=np.int32)
            for index, value in enumerate(model_table.id):
                array[value] = index
            children_array = model_table[['left_nodeid', 'right_nodeid']].values
            predict = model_table.predict.values
            split_feature_name = model_table.split_feature_name.values
            split_threshold = model_table.split_threshold.values
            result = []
            result, expr_array = _path_find(1, children_array, array, split_feature_name, split_threshold, predict, result)
            expr_array = [i[3:] for i in expr_array]
            conclusion = [None] * len(table)
            our_list = dict()
            for i in feature_cols:
                our_list[i] = table[i].values
            for index, expr in enumerate(expr_array):
                conclusion = np.where(ne.evaluate(expr, local_dict=our_list), result[index], conclusion)
            out_table[prediction_col] = conclusion
        elif 'tree_classification' in model['_type']:
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
            tmp_max = model_table.node_id.max()
            array = np.empty(tmp_max + 1, dtype=np.int32)
            for index, value in enumerate(model_table.node_id):
                array[value] = index
            children_table = model_table[['left_nodeid', 'right_nodeid']]
            children_array = children_table.values
            predict = model_table.predict.values
            split_feature_name = model_table.split_feature_name.values
            split_threshold = model_table.split_threshold.values
            split_left_categories_values = model_table['split_left_categories_values'].values
            split_right_categories_values = model_table['split_right_categories_values'].values
            result = []
            result, expr_array = _path_find_complex_version(1, children_array, array, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values, predict, result)
            expr_array = [i[3:] for i in expr_array]
            conclusion = [None] * len(table)
            our_list = dict()
            for i in feature_cols:
                if table[i].dtype == 'object':
                    our_list[i] = np.array(table[i], dtype='|S')
                else:
                    our_list[i] = table[i].values
                
            for index, expr in enumerate(expr_array):
                conclusion = np.where(ne.evaluate(expr, local_dict=our_list), result[index], conclusion)
            conclusion = classes[conclusion.astype('int')]
            out_table[prediction_col] = conclusion
    return {'out_table': out_table}
