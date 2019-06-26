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

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
import numpy as np
import pandas as pd
from brightics.common.groupby import _function_by_group
from brightics.function.utils import _model_dict
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error


def label_encoder(table, group_by=None, **params):
    check_required_parameters(_label_encoder, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_label_encoder, table, group_by=group_by, **params) 
        return grouped_model
    else:
        return _label_encoder(table, **params)
    
    
def _label_encoder(table, input_col, new_column_name='encoded_column'):
    out_table = table.copy()
    le = LabelEncoder().fit(table[input_col])
    out_model = _model_dict('label_encoder')
    out_model['label_encoder'] = le
    out_model['input_col'] = input_col
    out_model['classes'] = le.classes_
    out_table[new_column_name] = le.transform(table[input_col])
    
    return {'out_table' : out_table, 'model' : out_model}


def label_encoder_model(table, model, **params):
    check_required_parameters(_label_encoder_model, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_label_encoder_model, table, model, **params)
    else:
        return _label_encoder_model(table, model, **params)
    

def _label_encoder_model(table, model, new_column_name='encoded_column'):
    out_table = table.copy()
    out_table[new_column_name] = model['label_encoder'].transform(out_table[model['input_col']])
    
    return {'out_table' : out_table}


def one_hot_encoder(table, group_by=None, **params):
    check_required_parameters(_one_hot_encoder, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_one_hot_encoder, table, group_by=group_by, **params) 
        return grouped_model
    else:
        return _one_hot_encoder(table, **params)


def _one_hot_encoder(table, input_cols, prefix='list', prefix_list=None, suffix='index', n_values='auto', categorical_features='all', sparse=True, handle_unknown='error', drop_last=False):
    out_table = table.copy()
    sparse = False
    enc_list = []
    le_list = []
    if drop_last:
        new_col_names_list_with_true_drop_last = []
    new_col_names_list = []
    prefix_list_index = 0
    if prefix == 'list':
        len_prefix_list = 0 if prefix_list is None else len(prefix_list)
        if len(input_cols) != len_prefix_list:
            # TODO: make the error message code
            raise_runtime_error('The number of Input Columns and the number of Prefixes should be equal.')
    for col_name in input_cols:
        enc = OneHotEncoder(n_values=n_values, categorical_features=categorical_features, sparse=sparse, handle_unknown=handle_unknown)
        le = LabelEncoder()
        new_col_names = []
        if suffix == 'index':
            if prefix == 'list':                
                for i in range(0, len(np.unique(out_table[col_name].values))):
                    new_col_names.append(prefix_list[prefix_list_index] + '_' + str(i))
            else:               
                for i in range(0, len(np.unique(out_table[col_name].values))):
                    new_col_names.append(col_name + '_' + str(i))
        else:
            if prefix == 'list':  
                for i in np.unique(out_table[col_name].values):
                    new_col_names.append(prefix_list[prefix_list_index] + '_' + str(i))
            else:  
                for i in np.unique(out_table[col_name].values):
                    new_col_names.append(col_name + '_' + str(i))
         
        transformed_table = pd.DataFrame(enc.fit_transform(le.fit_transform(out_table[col_name]).reshape(-1, 1)), columns=new_col_names)
        new_col_names_list.append(new_col_names)
        if drop_last:
            new_col_names = new_col_names[:-1]
            new_col_names_list_with_true_drop_last.append(new_col_names)
        for new_col_name in new_col_names:
            out_table[new_col_name] = transformed_table[new_col_name]
            
        enc_list.append(enc)
        le_list.append(le)
        prefix_list_index = prefix_list_index + 1
    
    out_model = _model_dict('one_hot_encoder')
    out_model['one_hot_encoder_list'] = enc_list
    out_model['label_encoder_list'] = le_list
    out_model['input_cols'] = input_cols
    out_model['classes'] = le.classes_
    out_model['active_features'] = enc.active_features_
    out_model['feature_indices'] = enc.feature_indices_
    out_model['n_values'] = enc.n_values_
    out_model['prefix'] = prefix
    out_model['prefix_list'] = prefix_list
    out_model['suffix'] = suffix
    out_model['drop_last'] = drop_last
    if drop_last:
        out_model['new_col_names_list_with_true_drop_last'] = new_col_names_list_with_true_drop_last
    out_model['new_col_names_list'] = new_col_names_list
    
    return {'out_table' : out_table, 'model' : out_model}


def one_hot_encoder_model(table, model, **params):
    check_required_parameters(_one_hot_encoder_model, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_one_hot_encoder_model, table, model, **params)
    else:
        return _one_hot_encoder_model(table, model, **params)
    

def _one_hot_encoder_model(table, model):
    out_table = table.copy()
    for i in range(0, len(model['input_cols'])):
        col_name = model['input_cols'][i]
        transformed_table = pd.DataFrame(model['one_hot_encoder_list'][i].transform(model['label_encoder_list'][i].transform(out_table[col_name]).reshape(-1, 1)), columns=model['new_col_names_list'][i])
        if model['drop_last']:
            for new_col_name in model['new_col_names_list_with_true_drop_last'][i]:
                out_table[new_col_name] = transformed_table[new_col_name]
        else:
            for new_col_name in model['new_col_names_list'][i]:
                out_table[new_col_name] = transformed_table[new_col_name]
            
    return {'out_table' : out_table}
