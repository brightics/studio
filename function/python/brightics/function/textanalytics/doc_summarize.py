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
from brightics.common.validation import greater_than, greater_than_or_equal_to, over_under
import pandas as pd
import numpy as np
from nltk import tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize
from gensim.summarization.summarizer import summarize


def doc_summarizer_kor(table, **params):
    check_required_parameters(_doc_summarizer_kor, params, ['table'])
    params = get_default_from_parameters_if_required(params, _doc_summarizer_kor)
    param_validation_check = [greater_than(params, 0, 'ratio'),
                              greater_than_or_equal_to(params, 1, 'num_sentence'),
                              over_under(params, 0, 1, 'damping_factor')]
    validate(*param_validation_check)
    return _doc_summarizer_kor(table, **params)


def doc_summarizer_eng(table, **params):
    check_required_parameters(_doc_summarizer_eng, params, ['table'])
    params = get_default_from_parameters_if_required(params, _doc_summarizer_eng)
    param_validation_check = [greater_than(params, 0, 'ratio'),
                              greater_than_or_equal_to(params, 1, 'num_sentence')]
    validate(*param_validation_check)
    return _doc_summarizer_eng(table, **params)


def _tokenizer_kor(texts, normalization=True, stemming=True, pos_extraction=None):

    from twkorean import TwitterKoreanProcessor as Tw
    
    tokenizer = Tw(normalization=normalization, stemming=stemming)
    tagged_doc_list = [tokenizer.tokenize(text) for text in texts]
    pos_doc_list = []
    
    for tagged_list in tagged_doc_list:
        pos_list = []
        for tagged in tagged_list:
            for pos in pos_extraction:
                if tagged[1] == pos:
                    pos_list = pos_list + [tagged[0]]  
        pos_doc_list.append(pos_list)
            
    return pos_doc_list


def _tokenize_for_summarize(text):
   
    # Sentence separator
    import platform
    os = platform.system()
    if os == 'Linux':
        import kss
        splitted_array = kss.split_sentences(text)
    else:
        from brightics.function.textanalytics.pykss import pykss
        splitted_array = pykss.split_sentences(text)

    # Tokenizer
    tokenized_table = _tokenizer_kor(texts=splitted_array, pos_extraction=['Noun'])
    len_doc = len(tokenized_table)
    
    # Tokenizer afterprocess
    tokenized_sentence = ([' '.join(tokenized_table[i]) for i in range(len_doc)])
    
    return tokenized_sentence, splitted_array, len_doc


def _page_rank_algorithm(corr_mat, splitted_array, damping_factor):
    
    len_mat = len(corr_mat)
    df = normalize(corr_mat - np.diag(np.diag(corr_mat)), norm='l1', axis=0) * (-damping_factor)
    df += np.identity(len_mat)
    score_col = np.linalg.solve(df, (1 - damping_factor) * np.ones((len_mat, 1))).flatten()
    data_table = np.transpose(np.array([score_col, splitted_array, range(1, len_mat + 1)], dtype=object))
    
    return data_table


def _text_summarizer(text, ratio, num_sentence, damping_factor):
    
    # Documents correlation matrix
    tokenized_sentence, splitted_array, len_doc = _tokenize_for_summarize(text=text)
    if (ratio != 2):
        num_sentence = np.maximum(int(len_doc * ratio), 1)
    else:
        num_sentence = np.minimum(len_doc, num_sentence)
    
    tfidf = TfidfVectorizer()
    tfidf_mat = tfidf.fit_transform(tokenized_sentence).toarray()
    doc_corr_mat = np.matmul(tfidf_mat, np.transpose(tfidf_mat))
    data_table = _page_rank_algorithm(corr_mat=doc_corr_mat, splitted_array=splitted_array, damping_factor=damping_factor)
    sorted_data_table = sorted(data_table, key=lambda x: x[0], reverse=True)
    result_table = sorted(sorted_data_table[0:num_sentence], key=lambda x: x[2])
    summarized_text = '. '.join(np.transpose(result_table)[1])
    
    return summarized_text, result_table, num_sentence


def _doc_summarizer_kor(table, input_col, hold_cols=None, result_type='summarized_document', new_col_name='summarized_document', ratio=2, num_sentence=1, damping_factor=0.85):
    
    doc_col = table[input_col].values
    len_doc_col = len(doc_col)
    
    if hold_cols is None:
        hold_cols = [input_col]
    out_table = table[hold_cols]
    
    if (result_type == 'summarized_document'):
        summarizer = np.vectorize(_text_summarizer)
        result_table = summarizer(doc_col, ratio=ratio, num_sentence=num_sentence, damping_factor=damping_factor)[0]
        out_table[new_col_name] = result_table
    else:

        def _sum_result(i):
            return _text_summarizer(doc_col[i], ratio=ratio, num_sentence=num_sentence, damping_factor=damping_factor)

        table_list = [np.concatenate((_sum_result(i)[1], np.transpose([(i + 1) * np.ones(_sum_result(i)[2])])), axis=1) for i in range(len_doc_col)]
        result_table = np.concatenate(table_list, axis=0)
        out_table = pd.DataFrame(result_table[:, [3, 2, 0, 1]], columns=['doc_id', 'sentence_id', 'score', 'sentence'])
        
    return {'out_table': out_table}


def _doc_summarizer_eng(table, input_col, hold_cols=None, result_type='summarized_document', new_col_name='summarized_document', ratio=2, num_sentence=1):
    
    doc_col = table[input_col].values
    len_doc_col = len(doc_col)
    
    if hold_cols is None:
        hold_cols = [input_col]
    out_table = table[hold_cols]

    table_list = []
    for i in range(len_doc_col):
        len_doc = len(summarize(doc_col[i], ratio=1, split=True))
        if (ratio != 2):
            _num_sentence = np.maximum(int(len_doc * ratio), 1)
            _ratio = ratio
        else:
            _num_sentence = np.minimum(len_doc, num_sentence)
            _ratio = (_num_sentence / len_doc if len_doc != 0 else 1)
        if (result_type == 'summarized_document'):
            summarized_col = [summarize(doc_col[i], ratio=_ratio)]
        else:
            summarized_sentences = summarize(doc_col[i], ratio=_ratio, split=True)
            summarized_col = np.insert(np.transpose([summarized_sentences[0:_num_sentence]]), 0, i + 1, axis=1)
        table_list.append(summarized_col)    
    result_table = np.concatenate(table_list, axis=0)
    
    if (result_type == 'summarized_document'):
        out_table[new_col_name] = result_table
    else:
        out_table = pd.DataFrame(result_table, columns=['doc_id', 'sentence'])
        out_table['doc_id'] = out_table['doc_id'].astype(int)
    
    return {'out_table': out_table}
        
