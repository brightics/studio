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

from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD, plt2MD, keyValues2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import greater_than
from brightics.common.classify_input_type import check_col_type

import numpy as np
import pandas as pd
from sklearn.mixture import GaussianMixture


def gaussian_mixture_train(table, group_by=None, **params):
    check_required_parameters(_gaussian_mixture_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _gaussian_mixture_train)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'number_of_components'),
                              greater_than(params, 0, 'tolerance'),
                              greater_than(params, 0, 'regularize_covariance'),
                              greater_than_or_equal_to(params, 1, 'max_iteration')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_gaussian_mixture_train, table, group_by=group_by, **params)
    else:
        return _gaussian_mixture_train(table, **params)


def _gaussian_mixture_train(table, input_cols, number_of_components=1, covariance_type='full', tolerance=0.001, \
                            regularize_covariance=1e-06, max_iteration=100, initial_params='kmeans', seed=None):

    gmm = GaussianMixture(n_components=number_of_components, covariance_type=covariance_type, tol=tolerance, \
                          reg_covar=regularize_covariance, max_iter=max_iteration, init_params=initial_params, random_state=seed)
    feature_names, X_train = check_col_type(table, input_cols)
    gmm.fit(X_train)
    
    out_table = pd.DataFrame()
    
    comp_num_arr = []
    for i in range(0, number_of_components):
        comp_num_arr.append(i)
    
    mean_arr = []
    for i in range(0, number_of_components):
        mean_arr.append(gmm.means_[i].tolist())
        
    covar_arr = []
    for i in range(0, number_of_components):
        covar_arr.append(gmm.covariances_[i].tolist())
        
    out_table['component_number'] = comp_num_arr
    out_table['weight'] = gmm.weights_
    out_table['mean_coordinate'] = mean_arr
    # temporary string type to covar_arr because it is array(array(array(double))) which is not supported so it causes problems
    out_table['covariance_matrix'] = str(covar_arr)
    
    rb = BrtcReprBuilder()
    params = { 
        'Input Columns': feature_names,
        'Number of Components': number_of_components,
        'Covariance Type': covariance_type,
        'Tolerance': tolerance,
        'Regularization of Covariance': regularize_covariance,
        'Number of Iteration': max_iteration,
        'Method to Initialize': initial_params
    }

    rb.addMD(strip_margin("""
    |## Gaussian Mixture Train Result 
    |
    |### Parameters
    |
    | {params}
    |
    |### Summary
    |
    |{result_table}
    |
    """.format(params=dict2MD(params), result_table=pandasDF2MD(out_table))))

    model = _model_dict('gaussian_mixture_train')
    model['input_cols'] = input_cols
    model['number_of_components'] = number_of_components
    model['covariance_type'] = covariance_type
    model['tolerance'] = tolerance
    model['regularize_covariance'] = regularize_covariance
    model['max_iteration'] = max_iteration
    model['initial_params'] = initial_params
    model['seed'] = seed
    model['summary'] = out_table
    model['gmm'] = gmm
    model['_repr_brtc_'] = rb.get()
    return {'model':model}


def gaussian_mixture_predict(table, model, **params):
    check_required_parameters(_gaussian_mixture_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_gaussian_mixture_predict, table, model, **params)
    else:
        return _gaussian_mixture_predict(table, model, **params)


def _gaussian_mixture_predict(table, model, display_probability, prediction_col_name='prediction'):
    
    out_table = table.copy()
    _, inputarr = check_col_type(table, model['input_cols'])
    out_table[prediction_col_name] = model['gmm'].predict(inputarr)
    if display_probability == True:
        for i in range (0, model['number_of_components']):
            out_table['probability_' + str(i)] = pd.DataFrame(model['gmm'].predict_proba(table[model['input_cols']]))[i]        
    return {'out_table':out_table}
