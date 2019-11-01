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
from nltk.corpus import stopwords
import pandas as pd
import numpy as np


def extract_senti_words(table, **params):
    check_required_parameters(_extract_senti_words, params, ['table'])
    return _extract_senti_words(table, **params)


def _extract_senti_words(table, input_col, user_dict=None, hold_cols=None):
    
    len_text = len(table)
    if hold_cols is None:
        hold_cols = [input_col]
    out_table = table[hold_cols]
    text_data = table[input_col].values
    
    basic_dict = dict(pd.read_csv('brightics/function/textanalytics/data/senti_words_basic_dict_kor.csv').values)
    basic_dict.update(pd.read_csv('brightics/function/textanalytics/data/senti_words_basic_dict_eng.csv').values)
    if user_dict is not None:
        basic_dict.update(user_dict.values)

    def _word_extractor(tokenized_text):
        pos_words = []
        neg_words = []
        total_score = 0
        ave_score = 0
        len_tokenized_text = len(tokenized_text)
        for word in tokenized_text:
            if word in basic_dict.keys():
                if basic_dict[word] >= 0:
                    pos_words.append(word)
                else:
                    neg_words.append(word)
                total_score += basic_dict[word]
        if len(tokenized_text) != 0:
            ave_score = total_score / len_tokenized_text
        return pos_words, neg_words, total_score, ave_score
    
    value_tables = [[_word_extractor(text_data[i])] for i in range(len_text)]
    out_data = pd.DataFrame(np.concatenate(value_tables), columns=['pos_words', 'neg_words', 'total_score', 'avg_score'])
    out_table = pd.concat([out_table, out_data], axis=1)
    
    return {'out_table':out_table}
