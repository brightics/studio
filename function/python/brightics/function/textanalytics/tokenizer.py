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
import pandas as pd
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize, word_tokenize
import nltk
from bs4 import BeautifulSoup
import re
from random import randint

from brightics.common.utils import check_required_parameters

LEAF_KEY = True
REPLACE_NO_SPACE = re.compile("[.;:!\'?,\"()\[\]]")
REPLACE_WITH_SPACE = re.compile("(<br\s*/><br\s*/>)|(\-)|(\/)")
POS_ENG_DEFAULT = ["CC", "CD", "DT", "EX", "FW", "IN", "JJ", "JJR", "JJS", "LS", "MD",
                   "NN", "NNS", "NNP", "NNPS", "PDT", "POS", "PRP", "PRP$", "RB", "RBR", "RBS",
                   "RP", "TO", "UH", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ", "WDT", "WP", "WP$", "WRB"]

"""
Handling compound words: replace every compound words in the given text to numbers which is not contained in the
text, apply the tokenizer, and replace the numbers back to the corresponding compound words.
"""


def _encode(text_table, user_dict, lower_case):
    encode_ind = randint(1000, 10000)  # a random integer
    encode_list = []
    decode_dict = {}
    if user_dict is not None:
        user_dict_arr = user_dict.values.tolist()
        texts_arr = text_table.values.tolist()
        whole_text = ' '.join([' '.join(row) for row in texts_arr])
        numbers_in_text = [int(item) for item in re.compile(r'\d+').findall(whole_text)]
        for row in user_dict_arr:
            compound_word = row[0]
            if len(row) > 1 and row[1] is not None and row[1] != np.nan and row[1] != "":
                pos = row[1]
            else:
                pos = None
            while encode_ind in numbers_in_text:
                encode_ind += 1
            encode_word = ' {} '.format(encode_ind)
            encode_list.append((compound_word, encode_word))
            decode_dict[str(encode_ind)] = (compound_word, pos)
            encode_ind += 1
        table_encoded = text_table.applymap(lambda text: _substitution(text, encode_list, lower_case))
    else:
        table_encoded = text_table
    return table_encoded, decode_dict


def _substitution(text, encode_list, lower_case):
    if lower_case:
        text = text.lower()
    for compound_word, encode_word in encode_list:
        text = re.compile(compound_word).sub(encode_word, text)
    return text


def _extract_kor(list_tokens_tagged, is_tagged, decode_dict, *pos_extraction):
    list_tokens_tagged_decoded = []
    for token_tagged in list_tokens_tagged:
        if token_tagged[0] in decode_dict:
            compound_word, pos = decode_dict[token_tagged[0]]
            if pos is None:
                pos = 'Noun'
            list_tokens_tagged_decoded.append([compound_word, pos])
        else:
            list_tokens_tagged_decoded.append(token_tagged)

    if pos_extraction:
        list_tokens_tagged_filtered = [token_tagged for token_tagged in list_tokens_tagged_decoded
                                       if token_tagged[1] in set(pos_extraction)]
    else:
        list_tokens_tagged_filtered = list_tokens_tagged_decoded

    if is_tagged is False:
        res = [token_tagged[0] for token_tagged in list_tokens_tagged_filtered]
    else:
        res = ['{text}/{pos}'.format(text=token_tagged[0], pos=token_tagged[1])
               for token_tagged in list_tokens_tagged_filtered]
    return res


def tokenizer_kor(table, **params):
    check_required_parameters(_tokenizer_kor, params, ['table'])
    return _tokenizer_kor(table, **params)


def _tokenizer_kor(table, input_cols, hold_cols=None, new_col_prefix='tokenized',
                   normalization=True, stemming=True, pos_extraction=None, is_tagged=False, user_dict=None):
    from twkorean import TwitterKoreanProcessor as Tw  # import here since twkorean cannot be loaded in Enterprise ver.

    if pos_extraction is None:
        pos_extraction = []

    table_encoded, decode_dict = _encode(table[input_cols], user_dict, False)

    tokenizer = Tw(normalization=normalization, stemming=stemming)
    tokenize_vec = np.vectorize(tokenizer.tokenize, otypes=[object])(table_encoded)

    columns = ['{prefix}_{col}'.format(prefix=new_col_prefix, col=col) for col in input_cols]
    tokenized_table = pd.DataFrame(np.vectorize(_extract_kor, otypes=[object])(
        tokenize_vec, is_tagged, decode_dict, *pos_extraction), columns=columns)

    if hold_cols is None:
        out_table = pd.concat([table, tokenized_table], axis=1)
    else:
        out_table = pd.concat([table[hold_cols], tokenized_table], axis=1)

    return {'out_table': out_table}


def doc_list_stemming_eng(word_tok_list):
    ps = PorterStemmer()
    return [ps.stem(word_tok) for word_tok in word_tok_list]


def preprocess_reviews_eng(text, lower_case):
    if lower_case:
        text = REPLACE_NO_SPACE.sub("", text.lower())
    else:
        text = REPLACE_NO_SPACE.sub("", text)
    return text


def _extract_pos_eng(tagged, pos_extraction, is_tagged, decode_dict):
    token, pos = tagged
    if token in decode_dict:
        token, pos = decode_dict[token]
        if pos is None:
            pos = 'NN'

    if pos in pos_extraction:
        if is_tagged:
            return '{token}({pos})'.format(token=token, pos=pos)
        else:
            return '{token}'.format(token=token)
    else:
        return None


def _transform_tagged_list_eng(tagged_list, pos_extraction, is_tagged, decode_dict):
    tagged_list_transformed = [_extract_pos_eng(tagged, pos_extraction, is_tagged, decode_dict)
                               for tagged in tagged_list]
    return [item for item in tagged_list_transformed if item is not None]


def tokenizer_eng(table, **params):
    check_required_parameters(_tokenizer_eng, params, ['table'])
    return _tokenizer_eng(table, **params)


def _tokenizer_eng(table, input_cols, hold_cols=None, new_col_prefix='tokenized',
                   lower_case=True, stemming=True, pos_extraction=None, is_tagged=False, user_dict=None):
    if hold_cols is None:
        out_table = table.copy()
    else:
        out_table = table[hold_cols]

    if pos_extraction is None:
        pos_extraction = POS_ENG_DEFAULT

    table_encoded, decode_dict = _encode(table[input_cols], user_dict, lower_case)

    def _process(text):
        text_filtered_html = BeautifulSoup(text).get_text()
        text_preprocessed = preprocess_reviews_eng(text_filtered_html, lower_case)
        text_tokenized = word_tokenize(text_preprocessed)
        if stemming:
            text_tokenized = doc_list_stemming_eng(text_tokenized)
        text_tagged = nltk.pos_tag(text_tokenized)
        text_result = _transform_tagged_list_eng(text_tagged, pos_extraction, is_tagged, decode_dict)
        return text_result

    for col in input_cols:
        docs = table_encoded[col]
        docs_result = docs.apply(_process)
        out_table['{prefix}_{col}'.format(prefix=new_col_prefix, col=col)] = docs_result

    return {'out_table': out_table}
