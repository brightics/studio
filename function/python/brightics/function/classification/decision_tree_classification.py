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
import matplotlib.pyplot as plt
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
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import raise_error
import sklearn.utils as sklearn_utils
from brightics.common.classify_input_type import check_col_type


def decision_tree_classification_train(table, group_by=None, **params):
    check_required_parameters(_decision_tree_classification_train, params, ['table'])

    params = get_default_from_parameters_if_required(params, _decision_tree_classification_train)

    param_validation_check = [greater_than_or_equal_to(params, 2, 'min_samples_split'),
                              greater_than_or_equal_to(params, 1, 'min_samples_leaf'),
                              greater_than_or_equal_to(params, 0.0, 'min_weight_fraction_leaf'),
                              greater_than_or_equal_to(params, 0.0, 'min_impurity_decrease'),
                              greater_than_or_equal_to(params, 1, 'max_depth'),
                              greater_than_or_equal_to(params, 1, 'max_features'),
                              greater_than_or_equal_to(params, 1, 'max_leaf_nodes')]

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
    model['feature_cols'] = feature_names
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

    return {'model' : model}


def decision_tree_classification_predict(table, model, **params):
    check_required_parameters(_decision_tree_classification_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_decision_tree_classification_predict, table, model, **params)
    else:
        return _decision_tree_classification_predict(table, model, **params)


def _decision_tree_classification_predict(table, model, prediction_col='prediction', check_input=True):
    out_table = table.copy()
    out_table[prediction_col] = model['classifier'].predict(table[model['feature_cols']], check_input)
    return {'out_table': out_table}
