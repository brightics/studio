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
import platform
from brightics.common.exception import BrighticsFunctionException


def split_sentences(table, **params):
    check_required_parameters(_split_sentences, params, ['table'])
    return _split_sentences(table, **params)


def _split_sentences(table, input_col, language='kor'):
    doc_col = table[input_col].values
    os = platform.system()

    if language == 'kor':
        if os == 'Linux':
            import kss
            sent_tokenizer = kss.split_sentences
        else:  # os == 'Windows'
            from . import split_sentences_kss as kss2
            sent_tokenizer = kss2.kss.pykss.split_sentences
    else:  # language == 'eng'
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


def split_sentences2(table, **params):
    check_required_parameters(_split_sentences2, params, ['table'])
    return _split_sentences2(table, **params)


def _split_sentences2(table, input_col, language='kor', doc_id_col_name='doc_id', sentence_id_col_name='sentence_id',
                      sentence_col_name='sentence', duplicate_original=False):
    if doc_id_col_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Document ID column name {} already exists in the input table. Please choose another one."
                .format(doc_id_col_name)}])
    if sentence_id_col_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Sentence ID column name {} already exists in the input table. Please choose another one."
                .format(sentence_id_col_name)}])
    if sentence_col_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Sentence column name {} already exists in the input table. Please choose another one."
                .format(sentence_col_name)}])

    doc_col = table[input_col].values
    os = platform.system()
    if os == 'Linux':
        import kss
        sent_tokenizer_kor = kss.split_sentences
    else:  # os == 'Windows'
        from . import split_sentences_kss as kss2
        sent_tokenizer_kor = kss2.kss.pykss.split_sentences
    sent_tokenizer_eng = tokenize.sent_tokenize

    if language == 'kor':
        sent_tokenizer = sent_tokenizer_kor
    elif language == 'eng':
        sent_tokenizer = sent_tokenizer_eng
    else:  # language == 'mixed'
        def sent_tokenizer(text):
            kor_sents = sent_tokenizer_kor(text)
            sents = [sent_tokenizer_eng(sent) for sent in kor_sents]
            return [y for x in sents for y in x]  # flattened

    num_doc = len(doc_col)
    doc_id_col = list(range(1, num_doc + 1))
    sent_list_col = [sent_tokenizer(text) for text in doc_col]
    table[doc_id_col_name] = doc_id_col
    column_list = table.columns.tolist()
    table[sentence_col_name] = sent_list_col
    num_sent_col = [len(sent_list) for sent_list in sent_list_col]

    # to be shortened when pandas explode is available
    values = np.array(sent_list_col)
    values_flattened = np.concatenate(values).ravel()
    col = table[sentence_col_name]
    col_exploded = pd.Series(values_flattened, index=col.index.repeat(num_sent_col), name=col.name)
    out_table = table.drop([sentence_col_name], axis=1).join(col_exploded).reindex(columns=table.columns, copy=False)

    sent_id_col = sum([list(range(1, num_sent + 1)) for num_sent in num_sent_col], [])
    out_table[sentence_id_col_name] = sent_id_col

    if not duplicate_original:
        column_list_original = column_list.copy()
        column_list_original.remove(doc_id_col_name)
        out_table[column_list_original] = out_table[column_list_original].where(out_table[sentence_id_col_name] == 1, None)

    column_list_new = column_list + [sentence_id_col_name, sentence_col_name]
    out_table = out_table[column_list_new]

    return {'out_table': out_table}
