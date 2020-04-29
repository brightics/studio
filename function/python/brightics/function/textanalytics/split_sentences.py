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
from nltk import tokenize
import pandas as pd
import numpy as np


def split_sentences(table, **params):
    check_required_parameters(_split_sentences, params, ['table'])
    return _split_sentences(table, **params)


def _split_sentences(table, input_col, language='kor'):
    
    doc_col = table[input_col].values    

    if (language == 'kor'):
        import platform
        os = platform.system()
        if os == 'Linux':
            import kss
            sent_tokenizer = kss.split_sentences
        else:
            from brightics.function.textanalytics.pykss import pykss
            sent_tokenizer = pykss.split_sentences
    elif (language == 'eng'):
        sent_tokenizer = tokenize.sent_tokenize
    
    def _splitter(doc_id, text):
        sentence_col = sent_tokenizer(text)
        len_sentence_col = len(sentence_col)
        doc_id_col = (doc_id + 1) * np.ones(len_sentence_col, dtype=int)
        sentence_id_col = range(1, len_sentence_col + 1)
        return np.array([doc_id_col, sentence_id_col, sentence_col], dtype=object)

    data_table = np.concatenate([_splitter(i, doc_col[i]) for i in range(len(doc_col))], axis=1)
    out_table = pd.DataFrame(np.transpose(data_table), columns=['doc_id', 'sentence_id', 'sentence'])
        
    return {'out_table': out_table}
