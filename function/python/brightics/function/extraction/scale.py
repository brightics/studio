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

from sklearn.preprocessing import MinMaxScaler, StandardScaler, MaxAbsScaler, RobustScaler
import pandas as pd
from brightics.common.groupby import _function_by_group
from brightics.function.utils import _model_dict
from brightics.common.utils import check_required_parameters


def scale(table, group_by=None, **params):
    check_required_parameters(_scale, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_scale, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _scale(table, **params)
    
    
def _scale(table, input_cols, scaler, suffix=None):
    if scaler == 'RobustScaler':
        if suffix is None:
            suffix = '_robust'
        scale = RobustScaler()
    elif scaler == 'StandardScaler':
        if suffix is None:
            suffix = '_standard'
        scale = StandardScaler()
    elif scaler == 'MaxAbsScaler':
        if suffix is None:
            suffix = '_max_abs'
        scale = MaxAbsScaler()
    else:  # minmax
        if suffix is None:
            suffix = '_min_max'
        scale = MinMaxScaler()
        
    scaled_cols = []
    for col in input_cols:
        scaled_cols.append(col + suffix)
                
    out_table = table.copy()
    scaled_table = scale.fit_transform(out_table[input_cols])
    out_table[scaled_cols] = pd.DataFrame(data=scaled_table)
    
    out_model = _model_dict('scaler')
    out_model['input_cols'] = input_cols
    out_model['used_scaler'] = scaler
    out_model['scaler'] = scale
    out_model['suffix'] = suffix
            
    return {'out_table' : out_table, 'model' : out_model}


def scale_model(table, model, **params):
    check_required_parameters(_scale_model, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_scale_model, table, model, **params)
    else:
        return _scale_model(table, model, **params)
    
    
def _scale_model(table, model):        
    scaled_cols = []
    for col in model['input_cols']:
        scaled_cols.append(col + model['suffix'])
                
    out_table = table.copy()
    scaled_table = model['scaler'].transform(out_table[model['input_cols']])
    out_table[scaled_cols] = pd.DataFrame(data=scaled_table)
            
    return {'out_table' : out_table}
