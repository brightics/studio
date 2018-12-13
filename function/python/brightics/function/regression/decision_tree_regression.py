import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeRegressor
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from sklearn.tree.export import export_graphviz
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than_or_equal_to


def decision_tree_regression_train(table, group_by=None, **params):
    check_required_parameters(_decision_tree_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_decision_tree_regression_train, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _decision_tree_regression_train(table, **params)


def _decision_tree_regression_train(table, feature_cols, label_col,  # fig_size=np.array([6.4, 4.8]), 
                                       criterion='mse', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                       min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None,
                                       min_impurity_decrease=0.0, min_impurity_split=None, presort=False,
                                       sample_weight=None, check_input=True, X_idx_sorted=None):
    
    param_validation_check = [greater_than_or_equal_to(min_samples_split, 2, 'min_samples_split'),
                              greater_than_or_equal_to(min_samples_leaf, 1, 'min_samples_leaf'),
                              greater_than_or_equal_to(min_weight_fraction_leaf, 0.0, 'min_weight_fraction_leaf')]
    if max_depth is not None:
        param_validation_check.append(greater_than_or_equal_to(max_depth, 1, 'max_depth'))
        
    validate(*param_validation_check)
    
    regressor = DecisionTreeRegressor(criterion, splitter, max_depth, min_samples_split,
                                       min_samples_leaf, min_weight_fraction_leaf, max_features,
                                       random_state, max_leaf_nodes, min_impurity_decrease,
                                       min_impurity_split, presort)
    regressor.fit(table[feature_cols], table[label_col],
                   sample_weight, check_input, X_idx_sorted)
    
    try:
        from sklearn.externals.six import StringIO  
        from sklearn.tree import export_graphviz
        import pydotplus
        dot_data = StringIO()
        export_graphviz(regressor, out_file=dot_data,
                        feature_names=feature_cols,
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
    sorted_feature_cols = np.array(feature_cols)[indices]
    
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
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_cols).T
    
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
               
    return {'model' : model}


def decision_tree_regression_predict(table, model, **params):
    check_required_parameters(_decision_tree_regression_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_decision_tree_regression_predict, table, model, group_by=group_by, **params)
    else:
        return _decision_tree_regression_predict(table, model, **params)         


def _decision_tree_regression_predict(table, model, prediction_col='prediction',
                                     check_input=True):
    out_table = table.copy()
    feature_cols = model['feature_cols']
    regressor = model['regressor']
    prediction = regressor.predict(table[feature_cols], check_input)
    out_table[prediction_col] = prediction
    
    return {'out_table': out_table}
