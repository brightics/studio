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

import pandas as pd
import numpy as np
from brightics.common.utils import check_required_parameters


def synonym_converter(table, **params):
    check_required_parameters(_synonym_converter, params, ['table'])   
    return _synonym_converter(table, **params)
    

def synonym_converter_user_dict(table, **params):
    check_required_parameters(_synonym_converter, params, ['table'])   
    return _synonym_converter(table, **params)
    

def _synonym_converter(table, input_cols, hold_cols=None, default_dict=False, synonym_list=None, prefix='synonym', user_dict=None):
    
    hold_table = pd.DataFrame()    
    if hold_cols is not None:
        hold_table[hold_cols] = table[hold_cols]
    
    # initial dictionary
    synonym_dict = dict()
    if (synonym_list is not None):        
        for word_synonym in synonym_list:
            synonym_dict.update({synonym.strip() : word_synonym.split(',')[0] for synonym in word_synonym.split(',')[1:]})
        
    # default dictionary update
    if (default_dict == True):
        synonym_dict.update(dict())  # To do dict() => default dictionary

    # user_dict update
    if (user_dict is not None):
        user_dictionary = user_dict.values
        for word_synonym in user_dictionary:
            synonym_dict.update({synonym.strip() : word_synonym[0] for synonym in word_synonym[1].split(',')})

    values = [[[synonym_dict.get(word, word) for word in word_list] for word_list in table[column]] for column in input_cols]
    value_columns = ['{}_{}'.format(prefix, column) for column in input_cols]
    value_table = pd.DataFrame(np.transpose(values), columns=value_columns)
    
    out_table = pd.concat([hold_table, value_table.reset_index(drop=True)], axis=1)
            
    return {'out_table' : out_table}
