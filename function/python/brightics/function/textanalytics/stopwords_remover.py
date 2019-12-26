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

import os
from nltk.corpus import stopwords
import pandas as pd
import numpy as np
from brightics.common.utils import check_required_parameters


def stopwords_remover(table, **params):
    check_required_parameters(_stopwords_remover, params, ['table'])   
    return _stopwords_remover(table, **params)


def stopwords_remover_user_dict(table, **params):
    check_required_parameters(_stopwords_remover, params, ['table'])   
    return _stopwords_remover(table, **params)


def _list_diff(first, second):
    return [element for element in first if element not in second]


def _stopwords_remover(table, input_cols, hold_cols=None, default_dict=False, stop_words=None, prefix='stopwords', user_dict=None):
    
    if hold_cols is not None:
        hold_table = pd.DataFrame()
        hold_table[hold_cols] = table[hold_cols]
    else:
        hold_table = table.copy()

    # initial dictionary
    if stop_words is not None:
        stop_words = set(stop_words)
    else:
        stop_words = set({})
        
    # default dictionary update
    if (default_dict == True):
        stop_words.update(pd.read_csv('brightics/function/textanalytics/data/stopwords_basic_dictionary_english.csv')['stopwords'].tolist())  # English
        stop_words.update(pd.read_csv('brightics/function/textanalytics/data/stopwords_basic_dictionary_korean.csv')['stopwords'].tolist())  # Korean
        
    # user_dict update
    if user_dict is not None:
        user_dict_val = set(user_dict.iloc[:, 0].values)
        stop_words.update(user_dict_val)
        
    values = [[_list_diff(word_list, stop_words) for word_list in table[column]] for column in input_cols]
    value_columns = ['{}_{}'.format(prefix, column) for column in input_cols]
    value_table = pd.DataFrame(np.transpose(values), columns=value_columns)
    
    out_table = pd.concat([hold_table, value_table.reset_index(drop=True)], axis=1)
    
#    for column in input_cols:
#        out_table['{}_{}'.format(prefix, column)] = [_list_diff(word_list, stop_words) for word_list in table[column]]
        
    return {'out_table': out_table}
