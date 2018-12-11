import pandas as pd
import matplotlib.pyplot as plt
from xgboost import XGBClassifier
from xgboost import plot_importance, plot_tree
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
import numpy as np
from brightics.function.validation import validate, greater_than_or_equal_to


def xgb_classification_train(table, group_by=None, **params):
    check_required_parameters(_xgb_classification_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_xgb_classification_train, table, group_by=group_by, **params) 
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _xgb_classification_train(table, **params)


def _xgb_classification_train(table, feature_cols, label_col, max_depth=3, learning_rate=0.1, n_estimators=100,
            silent=True, objective='binary:logistic', booster='gbtree', n_jobs=1, nthread=None, gamma=0, min_child_weight=1,
            max_delta_step=0, subsample=1, colsample_bytree=1, colsample_bylevel=1, reg_alpha=0, reg_lambda=1,
            scale_pos_weight=1, base_score=0.5, random_state=0, seed=None, missing=None,
            sample_weight=None, eval_set=None, eval_metric=None, early_stopping_rounds=None, verbose=True,
            xgb_model=None, sample_weight_eval_set=None):
    validate(greater_than_or_equal_to(max_depth, 1, 'max_depth'),
             greater_than_or_equal_to(learning_rate, 0.0, 'learning_rate'),
             greater_than_or_equal_to(n_estimators, 1, 'n_estimators'))
    
    classifier = XGBClassifier(max_depth, learning_rate, n_estimators,
                               silent, objective, booster, n_jobs, nthread, gamma, min_child_weight,
                               max_delta_step, subsample, colsample_bytree, colsample_bylevel, reg_alpha, reg_lambda,
                               scale_pos_weight, base_score, random_state, seed, missing)
    classifier.fit(table[feature_cols], table[label_col],
                   sample_weight, eval_set, eval_metric, early_stopping_rounds, verbose,
                   xgb_model, sample_weight_eval_set)
    
    # json
    get_param = classifier.get_params()
    feature_importance = classifier.feature_importances_
#     plt.rcdefaults()
    plot_importance(classifier)
    plt.tight_layout()
    fig_plot_importance = plt2MD(plt)
    plt.clf()
#     plt.rcParams['figure.dpi'] = figure_dpi
#     plot_tree(classifier)
#     fig_plot_tree_UT = plt2MD(plt)
#     plt.clf()
#     plt.rcParams['figure.dpi'] = figure_dpi
#     plot_tree(classifier, rankdir='LR')
#     fig_plot_tree_LR = plt2MD(plt)
#     plt.rcdefaults()
#     plt.clf()
    
    model = _model_dict('xgb_classification_model')
    model['feature_cols'] = feature_cols
    model['label_col'] = label_col
    model['parameters'] = get_param
    model['feature_importance'] = feature_importance
    model['classifier'] = classifier
    
    # report
#     get_param_list = []
#     get_param_list.append(['feature_cols', feature_cols])
#     get_param_list.append(['label_col', label_col])
    
    params = dict2MD(get_param)
#     for key, value in get_param.items():
#         temp = [key, value]
#         get_param_list.append(temp)
#     get_param_df = pd.DataFrame(data=get_param_list, columns=['parameter', 'value'])
    feature_importance_df = pd.DataFrame(data=feature_importance, index=feature_cols).T
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## XGB Classification Train Result
    |
    | ### Plot Importance
    | {fig_importance}
    |
    | ### Feature Importance
    | {table_feature_importance}
    |
    | ### Parameters
    | {list_parameters}
    |
    """.format(fig_importance=fig_plot_importance,
               table_feature_importance=pandasDF2MD(feature_importance_df, 20),
               list_parameters=params            
               )))     
    model['_repr_brtc_'] = rb.get()   
               
    return {'model' : model}


def xgb_classification_predict(table, model, **params):
    check_required_parameters(_xgb_classification_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_xgb_classification_predict, table, model, group_by=group_by, **params)
    else:
        return _xgb_classification_predict(table, model, **params)        


def _xgb_classification_predict(table, model, prediction_col='prediction', probability_col='probability', thresholds=None, suffix='index',
            output_margin=False, ntree_limit=None):
    feature_cols = model['feature_cols']
    classifier = model['classifier']

    # prediction = classifier.predict(table[feature_cols], output_margin, ntree_limit)
    
    classes = classifier.classes_
    len_classes = len(classes)
    is_binary = len_classes == 2
    
    if thresholds is None:
        thresholds = np.array([1 / len_classes for _ in classes])
    elif isinstance(thresholds, list):
        if len(thresholds) == 1 and is_binary and 0 < thresholds[0] < 1:
            thresholds = np.array([thresholds[0], 1 - thresholds[0]])
        else:
            thresholds = np.array(thresholds)
    
    prob = classifier.predict_proba(table[feature_cols], ntree_limit)
    prediction = pd.DataFrame(prob).apply(lambda x: classes[np.argmax(x / thresholds)], axis=1)
    
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes
        
    prob_cols = ['{probability_col}_{suffix}'.format(probability_col=probability_col, suffix=suffix) for suffix in suffixes]
    prob_df = pd.DataFrame(data=prob, columns=prob_cols)
    
    result = table.copy()
    result[prediction_col] = prediction
    result = pd.concat([result, prob_df], axis=1)
    
    return {'out_table': result}
