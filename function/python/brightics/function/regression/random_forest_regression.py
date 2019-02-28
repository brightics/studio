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
from brightics.function.validation import validate
from brightics.function.validation import greater_than_or_equal_to


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
                                 max_leaf_nodes=None, min_impurity_decrease=0, bootstrap=True, oob_score=False,
                                 n_jobs=None, random_state=None, verbose=0, warm_start=False):   
    
    X_train = table[feature_cols]
    y_train = table[label_col]   
    
    if max_features == "None":
        max_features = None
            
    regressor = RandomForestRegressor(n_estimators, criterion, max_depth, min_samples_split, min_samples_leaf, min_weight_fraction_leaf, max_features, max_leaf_nodes, min_impurity_decrease)  # , bootstrap, oob_score, n_jobs, random_state, verbose, warm_start)
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
             'bootstrap': bootstrap,
             'oob_score': oob_score,
             'n_jobs': n_jobs,
             'random_state': random_state,
             'verbose': verbose,
             'warm_start': warm_start}
    
    model = dict()
    # get_param = regressor.get_params()
    model['regressor'] = regressor
    model['params'] = params

    fig_feature_importances = _plot_feature_importances(feature_cols, regressor)
           
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Random Forest Regression Train Result
    |
    | ### Feature Importance
    | {fig_feature_importances}
    |
    """.format(fig_feature_importances=fig_feature_importances))) 
        
    model['_repr_brtc_'] = rb.get()   
               
    return {'model' : model}


def random_forest_regression_predict(table, model, **params):
    check_required_parameters(_random_forest_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_random_forest_regression_predict, table, model, **params)
    else:
        return _random_forest_regression_predict(table, model, **params)


def _random_forest_regression_predict(table, model, prediction_col='prediction'):
    out_table = table.copy()
    regressor = model['regressor']
    test_data = table[model['params']['feature_cols']]
    
    out_table[prediction_col] = regressor.predict(test_data)    
    return {'out_table': out_table}
