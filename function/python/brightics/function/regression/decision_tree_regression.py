
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
from brightics.common.validation import validate, greater_than_or_equal_to, greater_than, from_to 
from brightics.common.classify_input_type import check_col_type
import numexpr as ne
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeRegressor
from sklearn.tree import export_graphviz


def decision_tree_regression_train(table, group_by=None, **params):
    check_required_parameters(_decision_tree_regression_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _decision_tree_regression_train)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'min_samples_split'),
                              greater_than_or_equal_to(params, 1, 'min_samples_leaf'),
                              from_to(params, 0.0, 0.5, 'min_weight_fraction_leaf'),
                              greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 1, 'max_features'),
                              greater_than(params, 1, 'max_leaf_nodes'),
                              greater_than_or_equal_to(params, 0.0, 'min_impurity_split')]
    
    validate(*param_validation_check)
    if group_by is not None:
        grouped_model = _function_by_group(_decision_tree_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _decision_tree_regression_train(table, **params)


def _decision_tree_regression_train(table, feature_cols, label_col,  # fig_size=np.array([6.4, 4.8]), 
                                       criterion='mse', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                       min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None,
                                       min_impurity_decrease=0.0, min_impurity_split=None, presort=False,
                                       sample_weight=None, check_input=True, X_idx_sorted=None):
    
    regressor = DecisionTreeRegressor(criterion, splitter, max_depth, min_samples_split,
                                       min_samples_leaf, min_weight_fraction_leaf, max_features,
                                       random_state, max_leaf_nodes, min_impurity_decrease,
                                       min_impurity_split, presort)
    feature_names, features = check_col_type(table,feature_cols)
    regressor.fit(features, table[label_col],
                   sample_weight, check_input, X_idx_sorted)
    
    try:
        from six import StringIO  
        from sklearn.tree import export_graphviz
        import pydotplus
        dot_data = StringIO()
        export_graphviz(regressor, out_file=dot_data,
                        feature_names=feature_names,
                        filled=True, rounded=True,
                        special_characters=True)
        graph = pydotplus.graph_from_dot_data(dot_data.getvalue())  
        
        from brightics.common.repr import png2MD
        fig_tree = png2MD(graph.create_png())
    except:
        fig_tree = "Graphviz is needed to draw a Decision Tree graph. Please download it from http://graphviz.org/download/ and install it to your computer."
    
    # json
    model = _model_dict('decision_tree_regression_model')
    model['feature_cols'] = feature_cols
    model['label_col'] = label_col    
    feature_importance = regressor.feature_importances_
    model['feature_importance'] = feature_importance
    model['max_features'] = regressor.max_features_
    model['n_features'] = regressor.n_features_
    model['n_outputs'] = regressor.n_outputs_
    model['tree'] = regressor.tree_
    get_param = regressor.get_params()
    model['parameters'] = get_param
    model['regressor'] = regressor
    
    # report    
    
    indices = np.argsort(feature_importance)
    sorted_feature_cols = np.array(feature_names)[indices]
    
    plt.title('Feature Importances')
    plt.barh(range(len(indices)), feature_importance[indices], color='b', align='center')
    for i, v in enumerate(feature_importance[indices]):
        plt.text(v, i, " {:.2f}".format(v), color='b', va='center', fontweight='bold')
    plt.yticks(range(len(indices)), sorted_feature_cols)
    plt.xlabel('Relative Importance')
    plt.tight_layout()
    fig_feature_importances = plt2MD(plt)
    plt.clf()
    
    params = dict2MD(get_param)
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_names).T
    
    # Add tree plot
        
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Decision Tree Regression Train Result
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
    feature_importance_table = pd.DataFrame([[feature_cols[i],feature_importance[i]] for i in range(len(feature_cols))],columns = ['feature_name','importance'])
    model['feature_importance_table'] = feature_importance_table
    return {'model' : model}


def decision_tree_regression_predict(table, model, **params):
    check_required_parameters(_decision_tree_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_decision_tree_regression_predict, table, model, **params)
    else:
        return _decision_tree_regression_predict(table, model, **params)         

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

def _decision_tree_regression_predict(table, model, prediction_col='prediction',
                                     check_input=True):
    out_table = table.copy()
    feature_cols = model['feature_cols']
    
    if 'regressor' in model:
        feature_names, features = check_col_type(table,feature_cols)
        regressor = model['regressor']
        prediction = regressor.predict(features, check_input)
        out_table[prediction_col] = prediction
    else:
        if model['_type'] == 'decision_tree_model':
            model_table = model['table_1']
            tmp_max = model_table.id.max()
            array = np.empty(tmp_max+1,dtype = np.int32)
            for index, value in enumerate(model_table.id):
                array[value] = index
            children_array = model_table[['left_nodeid','right_nodeid']].values
            predict = model_table.predict.values
            split_feature_name = model_table.split_feature_name.values
            split_threshold = model_table.split_threshold.values
            result=[]
            result, expr_array = _path_find(1, children_array, array, split_feature_name, split_threshold, predict,result)
            expr_array = [i[3:] for i in expr_array]
            conclusion = [None] * len(table)
            our_list = dict()
            for i in feature_cols:
                our_list[i] = table[i].values
            for index, expr in enumerate(expr_array):
                conclusion = np.where(ne.evaluate(expr,local_dict=our_list),result[index],conclusion)
            out_table[prediction_col] = conclusion
        elif 'tree_regression' in model['_type']:
            if model['auto']:
                model_table = model['table_4']
            else:
                model_table = model['table_3']
            tmp_max=model_table.node_id.max()
            array=np.empty(tmp_max+1,dtype = np.int32)
            for index, value in enumerate(model_table.node_id):
                array[value] = index
            children_table=model_table[['left_nodeid','right_nodeid']]
            children_array=children_table.values
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
                    our_list[i] = np.array(table[i],dtype='|S')
                else:
                    our_list[i] = table[i].values
                
            for index, expr in enumerate(expr_array):
                conclusion = np.where(ne.evaluate(expr,local_dict=our_list),result[index],conclusion)
            out_table[prediction_col] = conclusion
    return {'out_table': out_table}
