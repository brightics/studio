from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD
from brightics.function.utils import _model_dict
import numpy as np
import pandas as pd
from sklearn.neighbors import LocalOutlierFactor
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def outlier_detection_tukey_carling(table, group_by=None, **params):
    check_required_parameters(_outlier_detection_tukey_carling, params, ['table'])
    if group_by is not None:
        return _function_by_group(_outlier_detection_tukey_carling, table, group_by=group_by, **params)
    else:
        return _outlier_detection_tukey_carling(table, **params)


def _outlier_detection_tukey_carling(table, input_cols, outlier_method="tukey", multiplier=None, number_of_removal=1,
                                    choice='add_prediction', new_column_prefix='is_outlier_'):
    out_table = table.copy()

    if multiplier is None and outlier_method == "tukey":
        multiplier = 1.5
    elif multiplier is None and outlier_method == "carling":
        multiplier = 2.3
    
    mean = table.mean()
    q1s = table.quantile(0.25)
    q3s = table.quantile(0.75)
    iqrs = q3s - q1s
    
    new_column_names = ['{prefix}{col}'.format(prefix=new_column_prefix, col=col) for col in input_cols]

    if outlier_method == "tukey":
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=new_column_prefix, col=col)
            out_table[output_col_name] = table[col].apply(lambda _: _tukey(_, q1s[col], q3s[col], iqrs[col], multiplier))
            
    elif outlier_method == "carling":
        if multiplier is None:
            multiplier = 2.3
            
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=new_column_prefix, col=col)
            out_table[output_col_name] = table[col].apply(lambda _: _carling(_, mean[col], iqrs[col], multiplier))
        
    prediction = out_table[new_column_names].apply(lambda row: np.sum(row == 'out') < number_of_removal, axis=1)
    
    rb = BrtcReprBuilder()
    params = { 
        'Input Columns': input_cols,
        'Outlier Method': outlier_method,
        'Multiplier': multiplier,
        'Number of Outliers in a Row': number_of_removal,
        'Result Type': choice,
        'New Column Prefix': new_column_prefix
    }
    rb.addMD(strip_margin("""
    | ## Outlier Detection (Tukey/Carling) Result
    | ### Parameters
    |
    | {display_params}
    """.format(display_params=dict2MD(params))))
    
    if choice == 'add_prediction':
        pass
    elif choice == 'remove_outliers':
        out_table = out_table.drop(new_column_names, axis=1)
        out_table = out_table[prediction.values]
    elif choice == 'both':
        out_table = out_table[prediction.values]
    
    model = _model_dict('outlier_detection_tukey_carling')
    model['params'] = params
    model['input_cols'] = input_cols
    model['mean'] = mean
    model['q1'] = q1s
    model['q3'] = q3s
    model['iqr'] = iqrs
    model['multiplier'] = multiplier
    model['outlier_method'] = outlier_method
    model['number_of_removal'] = number_of_removal
    model['report'] = rb.get()
    
    return {'out_table': out_table, 'model' : model}


def outlier_detection_tukey_carling_model(table, model, group_by=None, **params):
    check_required_parameters(_outlier_detection_tukey_carling_model, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_outlier_detection_tukey_carling_model, table, model, group_by=group_by, **params)
    else:
        return _outlier_detection_tukey_carling_model(table, model, **params)
    

def _outlier_detection_tukey_carling_model(table, model, prediction_col='is_outlier_'):
    out_table = table.copy()
    params = model['params']
    input_cols = model['input_cols']
    mean = model['mean']
    q1s = model['q1']
    q3s = model['q3']
    iqrs = model['iqr']
    multiplier = model['multiplier']
    outlier_method = model['outlier_method']
    number_of_removal = model['number_of_removal']
    
    if outlier_method == "tukey":
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=prediction_col, col=col)
            out_table[output_col_name] = table[col].apply(lambda _: _tukey(_, q1s[col], q3s[col], iqrs[col], multiplier))
            
    elif outlier_method == "carling":
        if multiplier is None:
            multiplier = 2.3
            
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=prediction_col, col=col)
            out_table[output_col_name] = table[col].apply(lambda _: _carling(_, mean[col], iqrs[col], multiplier))
    
    return {'out_table':out_table}


def _tukey(x, q1, q3, iqr, multiplier):
    return 'out' if x < q1 - multiplier * iqr or x > q3 + multiplier * iqr else 'in' 


def _carling(x, mean, iqr, multiplier):
    return 'out' if x < mean - multiplier * iqr or x > mean + multiplier * iqr else 'in'

    
def outlier_detection_lof(table, group_by=None, **params):
    check_required_parameters(_outlier_detection_lof, params, ['table'])
    if group_by is not None:
        return _function_by_group(_outlier_detection_lof, table, group_by=group_by, **params)
    else:
        return _outlier_detection_lof(table, **params)


def _outlier_detection_lof(table, input_cols, choice='add_prediction', n_neighbors=20, new_column_name='is_outlier'): 
    out_table = table.copy()
    train_data = out_table[input_cols]
    lof_model = LocalOutlierFactor(n_neighbors, algorithm='auto', leaf_size=30, metric='minkowski', p=2, novelty=True, contamination=0.1)
    lof_model.fit(train_data)
    
    isinlier = lambda _: 'in' if _ == 1 else 'out'
    out_table[new_column_name] = [isinlier(lof_predict) for lof_predict in lof_model.predict(train_data)]
    
    if choice == 'add_prediction':
        pass
    elif choice == 'remove_outliers':
        out_table = out_table[out_table[new_column_name] == 'in']
        out_table = out_table.drop(new_column_name, axis=1)
    elif choice == 'both':
        out_table = out_table[out_table[new_column_name] == 'in']
    
    params = {
        'Input Columns': input_cols,
        'Result Type': choice,
        'Number of Neighbors': n_neighbors,
    }
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Outlier Detection (Local Outlier Factor) Result
    | ### Parameters
    |
    | {display_params}
    """.format(display_params=dict2MD(params))))
    
    model = _model_dict('outlier_detection_lof')
    model['lof_model'] = lof_model
    model['input_cols'] = input_cols
    model['report'] = rb.get()
    
    return {'out_table':out_table, 'model':model}


def outlier_detection_lof_model(table, model, group_by=None, **params):
    check_required_parameters(_outlier_detection_lof_model, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_outlier_detection_lof_model, table, model, group_by=group_by, **params)
    else:
        return _outlier_detection_lof_model(table, model, **params)

    
def _outlier_detection_lof_model(table, model, prediction_col='is_outlier'):
    result = table.copy()
    lof_model = model['lof_model']
    input_cols = model['input_cols']
    features = result[input_cols]

    isinlier = lambda _: 'in' if _ == 1 else 'out'
    result[prediction_col] = [isinlier(lof_predict) for lof_predict in lof_model.predict(features)]
    
    return {'out_table' : result}
    
