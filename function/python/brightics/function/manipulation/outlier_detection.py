from brightics.common.report import ReportBuilder, strip_margin, plt2MD, dict2MD
from brightics.function.utils import _model_dict
import numpy as np
import pandas as pd
from sklearn.neighbors import LocalOutlierFactor


def outlier_detection_tukey_carling(table, input_cols, outlier_method="tukey", multiplier=None, number_of_removal=1,
                                    choice='add_prediction', new_column_prefix='prediction_'):
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

    def _tukey(x, q1, q3, iqr, multiplier):
        return 'outlier' if x < q1 - multiplier * iqr or x > q3 + multiplier * iqr else 'inlier' 

    def _carling(x, mean, iqr, multiplier):
        return 'outlier' if x < mean - multiplier * iqr or x > mean + multiplier * iqr else 'inlier'
    
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
        
    prediction = out_table[new_column_names].apply(lambda row: np.sum(row == 'outlier') < number_of_removal, axis=1)
    
    rb = ReportBuilder()
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
    model['mean'] = mean
    model['q1'] = q1s
    model['q3'] = q3s
    model['iqr'] = iqrs
    model['multiplier'] = multiplier
    model['report'] = rb.get()
    
    return {'out_table': out_table, 'model' : model}


def outlier_detection_lof(table, input_cols, choice='add_prediction', n_neighbors=20, algorithm='auto', leaf_size=30,
                          metric='minkowski', p=2, contamination=0.1, new_column_name='prediction'):
    out_table = table.copy()
    lof_model = LocalOutlierFactor(n_neighbors, algorithm, leaf_size, metric, p, None, contamination)
    lof_model.fit_predict(out_table[input_cols])
    
    isinlier = lambda _: 'inlier' if _ == 1 else 'outlier'
    out_table[new_column_name] = [isinlier(lof_predict) for lof_predict in lof_model.fit_predict(out_table[input_cols])]
    
    if choice == 'add_prediction':
        pass
    elif choice == 'remove_outliers':
        out_table = out_table[out_table[new_column_name] == 'inlier']
        out_table = out_table.drop(new_column_name, axis=1)
    elif choice == 'both':
        out_table = out_table[out_table[new_column_name] == 'inlier']
    
    params = {
        'Input Columns': input_cols,
        'Result Type': choice,
        'Number of Neighbors': n_neighbors,
        'Algorithm': algorithm,
        'Metric': metric,
        'Contamination': contamination
    }
    
    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | ## Outlier Detection (Local Outlier Factor) Result
    | ### Parameters
    |
    | {display_params}
    """.format(display_params=dict2MD(params))))
    
    model = _model_dict('outlier_detection_lof')
    model['params'] = params
    model['lof_model'] = lof_model
    model['report'] = rb.get()
    
    return {'out_table':out_table, 'model':model}
