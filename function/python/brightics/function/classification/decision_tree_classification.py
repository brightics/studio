import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.tree import DecisionTreeClassifier
from brightics.common.report import ReportBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from sklearn.tree.export import export_graphviz
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def decision_tree_classification_train(table, group_by=None, **params):
    check_required_parameters(_decision_tree_classification_train, params, ['table'])
    if group_by is not None:
        return _function_by_group(_decision_tree_classification_train, table, group_by=group_by, **params)
    else:
        return _decision_tree_classification_train(table, **params)


def _decision_tree_classification_train(table, feature_cols, label_col,  # fig_size=np.array([6.4, 4.8]), 
                                       criterion='gini', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                       min_weight_fraction_leaf=0.0, max_features=None, random_state=None, max_leaf_nodes=None,
                                       min_impurity_decrease=0.0, min_impurity_split=None, class_weight=None, presort=False,
                                       sample_weight=None, check_input=True, X_idx_sorted=None):
    classifier = DecisionTreeClassifier(criterion, splitter, max_depth, min_samples_split, min_samples_leaf,
                                       min_weight_fraction_leaf, max_features, random_state, max_leaf_nodes,
                                       min_impurity_decrease, min_impurity_split, class_weight, presort)
    classifier.fit(table[feature_cols], table[label_col],
                   sample_weight, check_input, X_idx_sorted)
    
    from sklearn.externals.six import StringIO  
    from sklearn.tree import export_graphviz
    import pydotplus
    dot_data = StringIO()
    export_graphviz(classifier, out_file=dot_data,
                    feature_names=feature_cols, class_names=table[label_col].astype('str').unique(),
                    filled=True, rounded=True,
                    special_characters=True)
    graph = pydotplus.graph_from_dot_data(dot_data.getvalue())  
    
    from brightics.common.report import png2MD
    fig_tree = png2MD(graph.create_png())
    
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
    sorted_feature_cols = np.array(feature_cols)[indices]
    
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
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_cols).T
    
    # Add tree plot
        
    rb = ReportBuilder()
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
    model['report'] = rb.get()   
               
    return {'model' : model}


def decision_tree_classification_predict(table, model, group_by=None, **params):
    check_required_parameters(_decision_tree_classification_predict, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_decision_tree_classification_predict, table, model, group_by=group_by, **params)
    else:
        return _decision_tree_classification_predict(table, model, **params)


def _decision_tree_classification_predict(table, model, prediction_col='prediction', check_input=True):
    out_table = table.copy()
    feature_cols = model['feature_cols']
    classifier = model['classifier']
    prediction = classifier.predict(table[feature_cols], check_input)
    out_table[prediction_col] = prediction
    
    return {'out_table': out_table}
