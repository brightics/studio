from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD
from brightics.function.utils import _model_dict
import numpy as np
from sklearn.neighbors import LocalOutlierFactor
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error


def outlier_detection_tukey_carling(table, group_by=None, **params):
    check_required_parameters(_outlier_detection_tukey_carling, params, ['table'])
    if group_by is not None:
        return _function_by_group(_outlier_detection_tukey_carling, table, group_by=group_by, **params)
    else:
        return _outlier_detection_tukey_carling(table, **params)


def _outlier_detection_tukey_carling(table, input_cols, outlier_method='tukey', multiplier=None, number_of_removal=1,
                                    result_type='add_prediction', new_column_prefix='is_outlier_'):
    out_table = table.copy()    
    median = out_table.median()
    q1s = out_table.quantile(0.25)
    q3s = out_table.quantile(0.75)
    iqrs = q3s - q1s    
    output_col_names = []

    if outlier_method == 'tukey':
        if multiplier is None:
            multiplier = 1.5
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=new_column_prefix, col=col)
            output_col_names.append(output_col_name)
            out_table[output_col_name] = out_table[col].apply(lambda _: _tukey(_, q1s[col], q3s[col], iqrs[col], multiplier))
    elif outlier_method == 'carling':
        if multiplier is None:
            multiplier = 2.3            
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=new_column_prefix, col=col)
            output_col_names.append(output_col_name)
            out_table[output_col_name] = out_table[col].apply(lambda _: _carling(_, median[col], iqrs[col], multiplier))
    else:
        raise_runtime_error("Please check 'outlier_method'.")
    
    # result_type is one of 'add_prediction', 'remove_outliers', 'both'
    if result_type == 'add_prediction':
        pass
    elif result_type == 'remove_outliers':
        prediction = out_table[output_col_names].apply(lambda row: np.sum(row == 'out') < number_of_removal, axis=1)
        out_table = out_table[prediction.values]
        out_table = out_table.drop(output_col_names, axis=1)
    elif result_type == 'both':
        prediction = out_table[output_col_names].apply(lambda row: np.sum(row == 'out') < number_of_removal, axis=1)
        out_table = out_table[prediction.values]
    else:
        raise_runtime_error("Please check 'result_type'.")
    
    params = { 
        'Input Columns': input_cols,
        'Outlier Method': outlier_method,
        'Multiplier': multiplier,
        'Number of Outliers in a Row': number_of_removal,
        'Result Type': result_type,
        'New Column Prefix': new_column_prefix
    }
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Outlier Detection (Tukey/Carling) Result
    | ### Parameters
    |
    | {display_params}
    |
    """.format(display_params=dict2MD(params))))
    
    model = _model_dict('outlier_detection_tukey_carling')
    model['params'] = params
    model['input_cols'] = input_cols
    model['outlier_method'] = outlier_method
    model['multiplier'] = multiplier
    model['number_of_removal'] = number_of_removal
    model['result_type'] = result_type
    model['median'] = median
    model['q1'] = q1s
    model['q3'] = q3s
    model['iqr'] = iqrs
    model['_repr_brtc_'] = rb.get()
    
    return {'out_table': out_table, 'model' : model}


def outlier_detection_tukey_carling_model(table, model, **params):
    check_required_parameters(_outlier_detection_tukey_carling_model, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_outlier_detection_tukey_carling_model, table, model, **params)
    else:
        return _outlier_detection_tukey_carling_model(table, model, **params)
    

def _outlier_detection_tukey_carling_model(table, model, new_column_prefix='is_outlier_'):
    out_table = table.copy()
    input_cols = model['input_cols']
    outlier_method = model['outlier_method']
    result_type = model['result_type']
    output_col_names = []
    
    if outlier_method == 'tukey':
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=new_column_prefix, col=col)
            output_col_names.append(output_col_name)
            out_table[output_col_name] = out_table[col].apply(lambda _: _tukey(_, model['q1'][col], model['q3'][col], model['iqr'][col], model['multiplier']))
    elif outlier_method == 'carling':
        for col in input_cols:
            output_col_name = '{prefix}{col}'.format(prefix=new_column_prefix, col=col)
            output_col_names.append(output_col_name)
            out_table[output_col_name] = out_table[col].apply(lambda _: _carling(_, model['median'][col], model['iqr'][col], model['multiplier']))
    else:
        raise_runtime_error("Please check 'outlier_method'.")
        
    # result_type is one of 'add_prediction', 'remove_outliers', 'both'
    if result_type == 'add_prediction':
        pass
    elif result_type == 'remove_outliers':
        prediction = out_table[output_col_names].apply(lambda row: np.sum(row == 'out') < model['number_of_removal'], axis=1)
        out_table = out_table[prediction.values]
        out_table = out_table.drop(output_col_names, axis=1)
    elif result_type == 'both':
        prediction = out_table[output_col_names].apply(lambda row: np.sum(row == 'out') < model['number_of_removal'], axis=1)
        out_table = out_table[prediction.values]
    else:
        raise_runtime_error("Please check 'result_type'.")
    
    return {'out_table':out_table}


def _tukey(x, q1, q3, iqr, multiplier):
    return 'out' if x < q1 - multiplier * iqr or x > q3 + multiplier * iqr else 'in' 


def _carling(x, median, iqr, multiplier):
    return 'out' if x < median - multiplier * iqr or x > median + multiplier * iqr else 'in'

    
def outlier_detection_lof(table, group_by=None, **params):
    check_required_parameters(_outlier_detection_lof, params, ['table'])
    if group_by is not None:
        return _function_by_group(_outlier_detection_lof, table, group_by=group_by, **params)
    else:
        return _outlier_detection_lof(table, **params)


def _outlier_detection_lof(table, input_cols, n_neighbors=20, result_type='add_prediction', new_column_name='is_outlier'): 
    out_table = table.copy()
    features = out_table[input_cols]
    lof_model = LocalOutlierFactor(n_neighbors, algorithm='auto', leaf_size=30, metric='minkowski', p=2, novelty=True, contamination=0.1)
    lof_model.fit(features)
    
    isinlier = lambda _: 'in' if _ == 1 else 'out'
    out_table[new_column_name] = [isinlier(lof_predict) for lof_predict in lof_model.predict(features)]
    
    if result_type == 'add_prediction':
        pass
    elif result_type == 'remove_outliers':
        out_table = out_table[out_table[new_column_name] == 'in']
        out_table = out_table.drop(new_column_name, axis=1)
    elif result_type == 'both':
        out_table = out_table[out_table[new_column_name] == 'in']
    else:
        raise_runtime_error("Please check 'result_type'.")        
    
    params = {
        'Input Columns': input_cols,
        'Result Type': result_type,
        'Number of Neighbors': n_neighbors,
    }
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Outlier Detection (Local Outlier Factor) Result
    | ### Parameters
    |
    | {display_params}
    |
    """.format(display_params=dict2MD(params))))
    
    model = _model_dict('outlier_detection_lof')
    model['params'] = params
    model['lof_model'] = lof_model
    model['input_cols'] = input_cols
    model['result_type'] = result_type
    model['num_neighbors'] = n_neighbors
    model['_repr_brtc_'] = rb.get()
    
    return {'out_table': out_table, 'model': model}


def outlier_detection_lof_model(table, model, **params):
    check_required_parameters(_outlier_detection_lof_model, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_outlier_detection_lof_model, table, model, **params)
    else:
        return _outlier_detection_lof_model(table, model, **params)

    
def _outlier_detection_lof_model(table, model, new_column_name='is_outlier'):
    out_table = table.copy()
    result_type = model['result_type']

    isinlier = lambda _: 'in' if _ == 1 else 'out'
    out_table[new_column_name] = [isinlier(lof_predict) for lof_predict in model['lof_model'].predict(out_table[model['input_cols']])]
    
    # result_type is one of 'add_prediction', 'remove_outliers', 'both'
    
    if result_type == 'add_prediction':
        pass
    elif result_type == 'remove_outliers':
        out_table = out_table[out_table[new_column_name] == 'in']
        out_table = out_table.drop(new_column_name, axis=1)
    elif result_type == 'both':
        out_table = out_table[out_table[new_column_name] == 'in']
    else:
        raise_runtime_error("Please check 'result_type'.")      
        
    return {'out_table' : out_table}
    
