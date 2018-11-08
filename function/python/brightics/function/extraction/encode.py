from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import OneHotEncoder
import numpy as np
import pandas as pd
from brightics.common.groupby import _function_by_group
from brightics.function.utils import _model_dict
from brightics.common.utils import check_required_parameters

def label_encode(table, group_by=None, **params):
    check_required_parameters(_label_encode, params, ['table'])
    if group_by is not None:
        return _function_by_group(_label_encode, table, group_by=group_by, **params)
    else:
        return _label_encode(table, **params)
    
    
def _label_encode(table, input_col, new_column_name='encoded_column'):
    out_table = table.copy()
    le = LabelEncoder().fit(table[input_col])
    out_model = _model_dict('label_encoder')
    out_model['label_encoder'] = le
    out_model['input_col'] = input_col
    out_model['classes'] = le.classes_
    out_table[new_column_name] = le.transform(table[input_col])
    
    return {'out_table' : out_table, 'model' : out_model}


def label_encode_with_model(table, model, group_by=None, **params):
    check_required_parameters(_label_encode_with_model, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_label_encode_with_model, table, model, group_by=group_by, **params)
    else:
        return _label_encode_with_model(table, model, **params)
    

def _label_encode_with_model(table, model, new_column_name = 'encoded_column'):
    out_table = table.copy()
    out_table[new_column_name] = model['label_encoder'].transform(out_table[model['input_col']])
    
    return {'out_table' : out_table}


def one_hot_encode(table, group_by=None, **params):
    check_required_parameters(_one_hot_encode, params, ['table'])
    if group_by is not None:
        return _function_by_group(_one_hot_encode, table, group_by=group_by, **params)
    else:
        return _one_hot_encode(table, **params)


def _one_hot_encode(table, input_cols, prefix='list', prefix_list=None, suffix='index', n_values='auto', categorical_features='all', sparse=True, handle_unknown='error'):
    out_table = table.copy()
    sparse = False
    enc_list = []
    le_list = []
    prefix_list_index = 0
    if prefix == 'list' and len(input_cols) != len(prefix_list):
        raise Exception('The number of input columns and the numnber of predix list should be equal.')
    for col_name in input_cols:
        enc = OneHotEncoder(n_values=n_values, categorical_features=categorical_features, sparse=sparse, handle_unknown=handle_unknown)
        le = LabelEncoder()
        new_col_names = []
        if suffix == 'index':
            if prefix == 'list':                
                for i in range(0,len(np.unique(out_table[col_name].values))):
                    new_col_names.append(prefix_list[prefix_list_index] + '_' + str(i))
            else:               
                for i in range(0,len(np.unique(out_table[col_name].values))):
                    new_col_names.append(col_name + '_' + str(i))
        else:
            if prefix == 'list':  
                for stri in np.unique(out_table[col_name].values):
                    new_col_names.append(prefix_list[prefix_list_index] + '_' + stri)
            else:  
                for stri in np.unique(out_table[col_name].values):
                    new_col_names.append(col_name + '_' + stri)
        out_table = pd.concat([out_table.reset_index(drop=True), pd.DataFrame(enc.fit_transform(le.fit_transform(out_table[col_name]).reshape(-1, 1)), columns=new_col_names)], axis=1)
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
    
    return {'out_table' : out_table, 'model' : out_model}


def one_hot_encode_with_model(table, model, group_by=None, **params):
    check_required_parameters(_one_hot_encode_with_model, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_one_hot_encode_with_model, table, model, group_by=group_by, **params)
    else:
        return _one_hot_encode_with_model(table, model, **params)
    

def _one_hot_encode_with_model(table, model):
    out_table = table.copy()
    for i in range(0, len(model['input_cols'])):
        new_col_names =[]
        col_name = model['input_cols'][i]
        if model['suffix'] == 'index':
            if model['prefix'] == 'list':                
                for j in range(0,len(np.unique(out_table[col_name].values))):
                    new_col_names.append(model['prefix_list'][i] + '_' + str(j))
            else:               
                for j in range(0,len(np.unique(out_table[col_name].values))):
                    new_col_names.append(col_name + '_' + str(j))
        else:
            if model['prefix'] == 'list':  
                for stri in np.unique(out_table[col_name].values):
                    new_col_names.append(model['prefix_list'][i] + '_' + stri)
            else:  
                for stri in np.unique(out_table[col_name].values):
                    new_col_names.append(col_name + '_' + stri)
        out_table = pd.concat([out_table.reset_index(drop=True), pd.DataFrame(model['one_hot_encoder_list'][i].transform(model['label_encoder_list'][i].transform(out_table[col_name]).reshape(-1, 1)), columns=new_col_names)], axis=1)
        
    return {'out_table' : out_table}