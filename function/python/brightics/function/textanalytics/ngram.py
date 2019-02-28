from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
import pandas as pd
import numpy as np


def ngram(table, **params):
    check_required_parameters(_ngram, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _ngram)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'n')]
    
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
              
        ngrams_list.append(ngram_list)
    
    out_table['{}-gram'.format(n)] = ngrams_list
    
    return {'out_table': out_table}
