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

import numpy as np
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_to


def _slice(list_string, n):
    return [' '.join(list_string[i:i + n]) for i in range(len(list_string) - n + 1)]


def n_gram(table, **params):  # new function
    check_required_parameters(_n_gram, params, ['table'])
    params = get_default_from_parameters_if_required(params, _n_gram)
    
    max_len = np.max(np.vectorize(len)(table[params["input_col"]])).item() 
    param_validation_check = [from_to(params, 1, max_len, 'n')]
    
    validate(*param_validation_check)   
    return _n_gram(table, **params)


def _n_gram(table, input_col, n=2):         
    out_table = table.copy() 
    out_table['n_gram'] = np.vectorize(_slice, otypes=[object])(table[input_col], n)
    return {'out_table': out_table}


def ngram(table, **params):  # to be deprecated
    check_required_parameters(_ngram, params, ['table'])
    params = get_default_from_parameters_if_required(params, _ngram)
    
    max_len = np.max(np.vectorize(len)(table[params["input_col"]])).item() 
    param_validation_check = [from_to(params, 1, max_len, 'n')]
    
    validate(*param_validation_check)   
    return _ngram(table, **params)


def _ngram(table, input_col, n=2):         
    list_ngrams = np.vectorize(_slice, otypes=[object])(table[input_col], n)
    out_table = table.copy()
    
    out_table['{}-gram'.format(n)] = list_ngrams  
    return {'out_table': out_table}

