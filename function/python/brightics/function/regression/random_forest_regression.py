
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

import numexpr as ne
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor 
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
from brightics.common.classify_input_type import check_col_type


def random_forest_regression_train(table, group_by=None, **params):
    check_required_parameters(_random_forest_regression_train, params, ['table'])
    
    params = get_default_from_parameters_if_required(params,_random_forest_regression_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'n_estimators'),
                              greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 1, 'min_samples_split'),
                              greater_than_or_equal_to(params, 1, 'min_samples_leaf')]
    validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_random_forest_regression_train, table, group_by=group_by, **params)
    else:
        return _random_forest_regression_train(table, **params)


def _plot_feature_importances(feature_cols, regressor):
    
    feature_importance = regressor.feature_importances_
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_cols)[indices]
    
    n_features = regressor.n_features_
    plt.barh(range(n_features), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')
    
    plt.yticks(np.arange(n_features), sorted_feature_cols)
    plt.xlabel("Feature importance")
    plt.ylabel("Feature")
    plt.tight_layout()
    fig_feature_importances = plt2MD(plt)
    plt.close()
    return fig_feature_importances
    
    
def _random_forest_regression_train(table, feature_cols, label_col,
                                 n_estimators=10, criterion="mse", max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                 min_weight_fraction_leaf=0, max_features="None",
                                 max_leaf_nodes=None, min_impurity_decrease=0, random_state=None):   
    
    feature_names, X_train = check_col_type(table, feature_cols)
    y_train = table[label_col]   
    
    if max_features == "None":
        max_features = None
            
    regressor = RandomForestRegressor(n_estimators =n_estimators,
                                      criterion = criterion, 
                                      max_depth= max_depth, 
                                      min_samples_split = min_samples_split, 
                                      min_samples_leaf = min_samples_leaf, 
                                      min_weight_fraction_leaf = min_weight_fraction_leaf, 
                                      max_features = max_features, 
                                      max_leaf_nodes = max_leaf_nodes, 
                                      min_impurity_decrease = min_impurity_decrease, 
                                      random_state=random_state)
    regressor.fit(X_train, y_train) 

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
              'random_state': random_state}
    
    model = _model_dict('random_forest_regression_model')
    model['regressor'] = regressor
    model['params'] = params

    fig_feature_importances = _plot_feature_importances(feature_names, regressor)
           
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Random Forest Regression Train Result
    |
    | ### Feature Importance
    | {fig_feature_importances}
    |
    """.format(fig_feature_importances=fig_feature_importances))) 
        
    model['_repr_brtc_'] = rb.get()   
    feature_importance = regressor.feature_importances_
    feature_importance_table = pd.DataFrame([[feature_names[i],feature_importance[i]] for i in range(len(feature_names))],columns = ['feature_name','importance'])
    model['feature_importance_table'] = feature_importance_table
    return {'model' : model}


def random_forest_regression_predict(table, model, **params):
    check_required_parameters(_random_forest_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_random_forest_regression_predict, table, model, **params)
    else:
        return _random_forest_regression_predict(table, model, **params)

def _string_make(character, index, path, start, array, split_feature_name, split_threshold):
    if index == 0:
        return ' & ({} <= {})'.format(character,split_threshold[start])+path
    else:
        return ' & ({} > {})'.format(character,split_threshold[start])+path

def _string_make_complex_version(character, index, path, start, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values):
    if pd.isnull(split_threshold[start]):
        if index == 0:
            result = ''
            tmp = split_left_categories_values[start]
            for i in tmp:
                result += " | ({} == '{}')".format(character,i)
            result = ' & ( ' + result[3:] + ' )'
            return result+path
        else:
            result = ''
            tmp = split_right_categories_values[start]
            for i in tmp:
                result += " | ({} == '{}')".format(character,i)
            result = ' & ( ' + result[3:] + ' )'
            return result+path
    else:
        if index == 0:
            return ' & ({} <= {})'.format(character,split_threshold[start])+path
        else:
            return ' & ({} > {})'.format(character,split_threshold[start])+path    

def _path_find(start, children_array, array, split_feature_name, split_threshold,predict, result):
    paths = []
    start = array[start]
    for index, child in enumerate(children_array[start]):
        if child == -1:
            result.append(predict[start])
            return result, ['']
        result, tmp_paths = _path_find(child, children_array, array, split_feature_name, split_threshold,predict, result)
        for path in tmp_paths:
            paths.append(_string_make(split_feature_name[start], index, path, start,array, split_feature_name, split_threshold))
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
            paths.append(_string_make_complex_version(split_feature_name[start], index, path, start,split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values))
    return result, paths

def _random_forest_regression_predict(table, model, prediction_col='prediction'):
    out_table = table.copy()
    if 'regressor' in model:
        regressor = model['regressor']
        _, test_data = check_col_type(table, model['params']['feature_cols'])
        test_data = np.array(test_data)
        out_table[prediction_col] = regressor.predict(test_data)
    else:
        if model['_type'] == 'random_forest_model':
            feature_cols = model['feature_cols']
            _, test_data = check_col_type(table, feature_cols)
            model_table = model['table_1']
            tree_indices = model_table.reset_index().groupby('tree_id').agg({'index':['min','max']}).values
            node_id_full = model_table.node_id.values
            children_array_full = model_table[['left_nodeid','right_nodeid']].values
            predict_full = model_table.predict.values
            split_feature_name_full = model_table.split_feature_name.values
            split_threshold_full = model_table.split_threshold.values
            conclusion_list = []
            for i in tree_indices:
                tmp_max = node_id_full[i[0]:i[1]+1].max()
                array = np.empty(tmp_max+1,dtype = np.int32)
                children_array = children_array_full[i[0]:i[1]+1]
                predict = predict_full[i[0]:i[1]+1]
                split_feature_name = split_feature_name_full[i[0]:i[1]+1]
                split_threshold = split_threshold_full[i[0]:i[1]+1]
                for index, value in enumerate(node_id_full[i[0]:i[1]+1]):
                    array[value] = index
                result=[]
                result, expr_array = _path_find(1, children_array, array, split_feature_name, split_threshold, predict,result)
                expr_array = [i[3:] for i in expr_array]
                conclusion = [None] * len(table)
                our_list = dict()
                for i in feature_cols:
                    our_list[i] = table[i].values
                for index, expr in enumerate(expr_array):
                    conclusion = np.where(ne.evaluate(expr,local_dict=our_list),result[index],conclusion)
                conclusion_list.append(conclusion)
            result = np.mean(np.array(conclusion_list), axis=0)
            out_table[prediction_col] = result
        else:
            feature_cols = model['feature_cols']
            if 'gbt' in model['_type']:
                if model['auto']:
                    model_table = model['table_3']
                else:
                    model_table = model['table_2']
                tree_weight_full = model_table.tree_weight.values
            else:
                if model['auto']:
                    model_table = model['table_4']
                else:
                    model_table = model['table_3']
            tree_indices = model_table.reset_index().groupby('tree_id').agg({'index':['min','max']}).values
            node_id_full = model_table.node_id.values
            children_array_full = model_table[['left_nodeid','right_nodeid']].values
            predict_full = model_table.predict.values
            split_feature_name_full = model_table.split_feature_name.values
            split_threshold_full = model_table.split_threshold.values
            split_left_categories_values_full = model_table.split_left_categories_values.values
            split_right_categories_values_full = model_table.split_right_categories_values.values
            conclusion_list = []
            for i in tree_indices:
                tmp_max = node_id_full[i[0]:i[1]+1].max()
                array = np.empty(tmp_max+1,dtype = np.int32)
                children_array = children_array_full[i[0]:i[1]+1]
                predict = predict_full[i[0]:i[1]+1]
                split_feature_name = split_feature_name_full[i[0]:i[1]+1]
                split_threshold = split_threshold_full[i[0]:i[1]+1]
                split_left_categories_values = split_left_categories_values_full[i[0]:i[1]+1]
                split_right_categories_values = split_right_categories_values_full[i[0]:i[1]+1]
                for index, value in enumerate(node_id_full[i[0]:i[1]+1]):
                    array[value] = index
                result=[]
                result, expr_array = _path_find_complex_version(1, children_array, array, split_feature_name, split_threshold, split_left_categories_values, split_right_categories_values, predict, result)
                expr_array = [i[3:] for i in expr_array]
                conclusion = [None] * len(table)
                our_list = dict()
                for j in feature_cols:
                    if table[j].dtype == 'object':
                        our_list[j] = np.array(table[j],dtype='|S')
                    else:
                        our_list[j] = table[j].values
                for index, expr in enumerate(expr_array):
                    conclusion = np.where(ne.evaluate(expr,local_dict=our_list),result[index],conclusion)
                if 'gbt' in model['_type']:
                    conclusion_list.append(conclusion*tree_weight_full[i[0]])
                else:
                    conclusion_list.append(conclusion)
            if 'gbt' in model['_type']:
                result = np.sum(np.array(conclusion_list), axis=0)
            else:
                result = np.mean(np.array(conclusion_list), axis=0)
            out_table[prediction_col] = result
    return {'out_table': out_table}
