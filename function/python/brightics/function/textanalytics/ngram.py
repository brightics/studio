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

from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
import pandas as pd
import numpy as np


def ngram(table, **params):
    check_required_parameters(_ngram, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _ngram)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'n')]
    validate(*param_validation_check)
    
    return _ngram(table, **params)


def _ngram(table, input_col, n=2):
    
    data = table[input_col]
    out_table = table.copy()
    
    ngrams_list = []
    
    for i in range(len(data)):
        ngram_list = []
        
        for j in range(len(data[i]) - n + 1):
            slice = "{}".format(' '.join(data[i][j:j + n]))            
            ngram_list.append(slice)
              
        ngrams_list.append(str(ngram_list))
    
    out_table['{}-gram'.format(n)] = ngrams_list
    
    return {'out_table': out_table}
