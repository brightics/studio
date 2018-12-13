import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBRegressor
from xgboost import plot_importance, plot_tree
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than_or_equal_to


def xgb_regression_train(table, group_by=None, **params):
    check_required_parameters(_xgb_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_xgb_regression_train, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _xgb_regression_train(table, **params)


def _xgb_regression_train(table, feature_cols, label_col, max_depth=3, learning_rate=0.1, n_estimators=100,
            silent=True, objectibe='reg:linear', booster='gbtree', n_jobs=1, nthread=None, gamma=0, min_child_weight=1,
            max_delta_step=0, subsample=1, colsample_bytree=1, colsample_bylevel=1, reg_alpha=0, reg_lambda=1,
            scale_pos_weight=1, base_score=0.5, random_state=0, seed=None, missing=None,
            sample_weight=None, eval_set=None, eval_metric=None, early_stopping_rounds=None, verbose=True,
            xgb_model=None, sample_weight_eval_set=None):

    validate(greater_than_or_equal_to(max_depth, 1, 'max_depth'),
             greater_than_or_equal_to(learning_rate, 0.0, 'learning_rate'),
             greater_than_or_equal_to(n_estimators, 1, 'n_estimators'))
        
    regressor = XGBRegressor(max_depth, learning_rate, n_estimators,
                             silent, objectibe, booster, n_jobs, nthread, gamma, min_child_weight,
                             max_delta_step, subsample, colsample_bytree, colsample_bylevel, reg_alpha, reg_lambda,
                             scale_pos_weight, base_score, random_state, seed, missing)
    regressor.fit(table[feature_cols], table[label_col],
                  sample_weight, eval_set, eval_metric, early_stopping_rounds, verbose,
                  xgb_model, sample_weight_eval_set)
    
    # json
    get_param = regressor.get_params()
    feature_importance = regressor.feature_importances_
#     plt.rcdefaults()
    plot_importance(regressor)
    plt.tight_layout()
    fig_plot_importance = plt2MD(plt)
    plt.clf()
#     plt.rcParams['figure.dpi'] = figure_dpi
#     plot_tree(regressor)
#     fig_plot_tree_UT = plt2MD(plt)
#     plt.clf()
#     plt.rcParams['figure.dpi'] = figure_dpi
#     plot_tree(regressor, rankdir='LR')
#     fig_plot_tree_LR = plt2MD(plt)
#     plt.rcdefaults()
#     plt.clf()
    
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
    get_param_list.append(['feature_cols', feature_cols])
    get_param_list.append(['label_col', label_col])
    for key, value in get_param.items():
        temp = [key, value]
        get_param_list.append(temp)
    get_param_df = pd.DataFrame(data=get_param_list, columns=['parameter', 'value'])
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_cols).T
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## XGB Regression Result
    |
    | ### Plot Importance
    | {image_importance}
    |
    | ### Feature Importance
    | {table_feature_importance}
    |
    | ### Parameters
    | {table_parameter}
    |
    """.format(image_importance=fig_plot_importance,
               table_feature_importance=pandasDF2MD(feature_importance_df, 20),
               table_parameter=pandasDF2MD(get_param_df)            
               )))     
    out_model['_repr_brtc_'] = rb.get()
               
    return {'model' : out_model}


def xgb_regression_predict(table, model, **params):
    check_required_parameters(_xgb_regression_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_xgb_regression_predict, table, model, group_by=group_by, **params)
    else:
        return _xgb_regression_predict(table, model, **params)        


def _xgb_regression_predict(table, model, prediction_col='prediction',
            output_margin=False, ntree_limit=None):
        
    feature_cols = model['feature_cols']
    regressor = model['regressor']
    prediction = regressor.predict(table[feature_cols], output_margin, ntree_limit)
#         prediction_df = pd.DataFrame(data = prediction)
#         
#         out_df = pd.concat([table.reset_index(drop=True), prediction_df], axis=1)
#         out_df.columns = table.columns.values.tolist() + [prediction_col]
    out_table = table.copy()
    out_table[prediction_col] = prediction
    
    return {'out_table': out_table}
