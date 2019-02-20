import pandas as pd
import numpy as np


def ngram(table, input_col, n=2):
    
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
