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
from brightics.common.utils import check_required_parameters

def synonym_converter(table, **params):
    check_required_parameters(_synonym_converter, params, ['table'])   
    return _synonym_converter(table, **params)

def _synonym_converter(table, input_cols, hold_cols=None, default_dict=True, synonym_list=None, prefix='synonym', user_dict=pd.DataFrame()):
    
    len_table = len(table)
    if synonym_list is None:
        len_synonym_list = 0
    else:
        len_synonym_list = len(synonym_list)
    len_user_dict = len(user_dict)
    out_table = pd.DataFrame()
    synonym_dict = dict()
    
    if hold_cols is not None:
        for column in hold_cols:
            out_table[column] = table[column]
        
    if (default_dict == True):
        synonym_dict.update(dict())  # To do dict() => default dictionary
    if (user_dict.empty == False):
        for i in range(len_user_dict):
            synonym_dict[user_dict[user_dict.keys()[0]][i]] = user_dict[user_dict.keys()[1]][i]
    for i in range(len_synonym_list):
        synonym_dict[synonym_list[i].split(',')[0]] = synonym_list[i].split(',')[1]
    
    for column in input_cols:
        out_table['{}_{}'.format(prefix, column)] = [[synonym_dict.get(n, n) for n in table[column][i]] for i in range(0, len_table)]
    
    return {'out_table' : out_table}
