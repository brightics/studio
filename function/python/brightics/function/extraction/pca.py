from sklearn.decomposition import PCA
import pandas as pd
import matplotlib.pyplot as plt
from brightics.common.report import ReportBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def pca(table, group_by=None, **params):
    check_required_parameters(_pca, params, ['table'])
    if group_by is not None:
        return _function_by_group(_pca, table, group_by=group_by, **params)
    else:
        return _pca(table, **params)
    
    
def _pca(table, input_cols, new_column_name='projected_', n_components=None, copy=True, whiten=False, svd_solver='auto',
            tol=0.0, iterated_power='auto', random_state=None):
                    
    num_feature_cols = len(input_cols)
    if n_components is None:
        n_components = num_feature_cols
        
    pca = PCA(n_components, copy, whiten, svd_solver, tol, iterated_power, random_state)
    pca_model = pca.fit(table[input_cols])
        
    column_names = []
    for i in range(0, n_components):
        column_names.append(new_column_name + str(i))
    # print(column_names)

    pca_result = pca_model.transform(table[input_cols])
    out_df = pd.DataFrame(data=pca_result, columns=[column_names])
        
    res_components = pca_model.components_
    res_components_df = pd.DataFrame(data=res_components, columns=[input_cols])
    res_explained_variance = pca_model.explained_variance_
    res_explained_variance_ratio = pca_model.explained_variance_ratio_
    res_singular_values = pca_model.singular_values_
    res_mean = pca_model.mean_
    res_n_components = pca_model.n_components_
    res_noise_variance = pca_model.noise_variance_
    
    res_get_param = pca_model.get_params()    
    res_get_covariance = pca_model.get_covariance()
    res_get_precision = pca_model.get_precision()
            
    # visualization
    plt.figure()
    if res_n_components == 1:
        plt.scatter(pca_result[:, 0], pca_result[:, 0])
    else:
        plt.scatter(pca_result[:, 0], pca_result[:, 1])
    # plt.title('PCA result with two components')
    # plt.show()
    plt_two = plt2MD(plt)
    plt.clf()
                
    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | 
    | ### Plot
    | The x-axis and y-axis of the following plot is projected0 and projected1, respectively.    
    | {image1}
    |
    | ### Result
    | {table1}
    | only showing top 20 rows
    |
    | ### Parameters
    | {parameter1}
    |
    | ### Components
    | {table2}
    | 
    | ### Mean
    | {array1}
    | 
    | ### Explained Variance 
    | {array2}
    |
    """.format(table1=pandasDF2MD(out_df, 20),
               image1=plt_two,
               parameter1=dict2MD(res_get_param),
               table2=pandasDF2MD(res_components_df),
               array1=res_mean,
               array2=res_explained_variance            
               )))        
    
    model = _model_dict('pca')
    model['components'] = res_components
    model['explained_variance'] = res_explained_variance
    model['explained_variance_ratio'] = res_explained_variance_ratio
    model['singular_values'] = res_singular_values
    model['mean'] = res_mean
    model['n_components'] = res_n_components
    model['noise_variance'] = res_noise_variance
    model['parameters'] = res_get_param
    model['covariance'] = res_get_covariance
    model['precision'] = res_get_precision
    model['report'] = rb.get()
    model['pca_model'] = pca_model
    model['input_cols'] = input_cols
    
    out_df = pd.concat([table.reset_index(drop=True), out_df], axis=1)
    out_df.columns = table.columns.values.tolist() + column_names
        
    return {'out_table': out_df, 'model' : model}


def pca_model(table, model, group_by=None, **params):
    check_required_parameters(_pca_model, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_pca_model, table, model, group_by=group_by, **params)
    else:
        return _pca_model(table, model, **params)
    

def _pca_model(table, model, new_column_name = 'projected_'):
    new_col_names = []
    for i in range(0, model['n_components']):
        new_col_names.append(new_column_name + str(i))
    pca_result = model['pca_model'].transform(table[model['input_cols']])
    out_table = pd.concat([table.reset_index(drop=True), pd.DataFrame(data=pca_result, columns=[new_col_names])], axis=1)
    out_table.columns = table.columns.values.tolist() + new_col_names
    
    return {'out_table' : out_table}