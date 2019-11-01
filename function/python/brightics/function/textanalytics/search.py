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

import pandas as pd
import numpy as np
import math
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to, raise_error, require_param
from itertools import product
from brightics.common.utils import check_required_parameters
from brightics.common.exception import BrighticsFunctionException


def search(table, **params):
    check_required_parameters(_search, params, ['table'])
    params = get_default_from_parameters_if_required(params, _search)
    param_validation_check = []
    validate(*param_validation_check)
    return _search(table, **params)
    
    
def search_user_dict(table, **params):
    check_required_parameters(_search, params, ['table'])
    params = get_default_from_parameters_if_required(params, _search)
    param_validation_check = []
    validate(*param_validation_check)
    return _search(table, **params)


def _search(table, user_dict=pd.DataFrame(), input_cols=[], search_words=[], synonym_dict=[], main_operator='and'):

    if len(search_words) == 0:
        raise BrighticsFunctionException('0033', 'Search Words')

    for search_word in search_words:
        if search_word is None:
            raise BrighticsFunctionException('0033', 'Search Words')

    _table = table.copy()
    
    filter_list = []
    if len(input_cols) == 0:
        validate(require_param('input_cols'))
    for _list in product(input_cols, search_words):
        c, od = _list
        filter_list.append([c, od.strip('\'')])
    _out_table = _table

    filtered_set = set(_out_table.index)

    cond = np.full(len(_table), True).tolist()
    for _filter in filter_list:
        cond = (cond) & (_table[_filter[0]].str.contains(_filter[1]))
    _out_table = _table.loc[list(filtered_set.intersection(set(_table[cond].index)))]

    if len(user_dict.index) != 0:
        filter_list = []
        
        additional_search_words = []
        for i, key in enumerate(user_dict.iloc[:, 0]):
            if key in search_words:
                additional_search_words.extend([synonym.strip() for synonym in user_dict.iloc[:, 1][i].split(',')])
        search_words = additional_search_words
        
        # search_words = [user_dict['value'][i] for i, key in enumerate(user_dict['key']) if key in search_words]
        
        for _list in product(input_cols, search_words):
            c, od = _list
            filter_list.append([c, od.strip('\'')])

        filtered_set = set()

        syno_cond = np.full(len(_table), False).tolist()
        for _filter in filter_list:
            syno_cond = (syno_cond) | (_table[_filter[0]].str.contains(_filter[1]))
            
        syno_cond = syno_cond | cond 
        _out_table = _table.loc[list(filtered_set.union(set(_table[syno_cond].index)))]

    return {'out_table': _out_table}


def search2(table, **params):
    check_required_parameters(_search2, params, ['table'])
    params = get_default_from_parameters_if_required(params, _search2)
    param_validation_check = []
    validate(*param_validation_check)
    return _search2(table, **params)


def _collect_search_text(keywords, keyword_dict):
    if keywords is None:
        search_text = keyword_dict[keyword_dict.columns[0]].values
    elif keyword_dict is None:
        search_text = keywords
    else:
        search_text = np.concatenate([keywords, keyword_dict[keyword_dict.columns[0]]])
    return list(set(search_text))


def _link_word_synonyms(word, synonyms):
    if synonyms is not None:
        parse_synonyms = [synonym.strip() for synonym in synonyms.split(",")]
        parse_synonyms.insert(0, word)
        return '|'.join(parse_synonyms)
    return word


def _find_synonyms(search_text, synonym_dict):
    columns = synonym_dict.columns
    words = synonym_dict[columns[0]]
    synonyms = synonym_dict[columns[1]]
    for idx in range(len(synonym_dict)):
        text = synonym_dict[columns[0]][idx]
        if text in search_text:
            search_idx = search_text.index(text)
            search_text[search_idx] = _link_word_synonyms(words[idx], synonyms[idx])  
    return search_text


def _search2(table, input_cols, hold_cols=None, bool_search="or", keyword_dict=None, keywords=None, synonym_dict=None, remove_na="no"):
    
    if keywords is None and keyword_dict is None:
        raise ValueError('At least one of Search Words and User Dictionary must be included.')
    
    input_table = table[input_cols]
    
    if hold_cols is None:
        hold_table = table.drop(input_cols, axis=1)
        length_ht = len(table.columns) - len(input_cols)
    else:
        hold_table = table[hold_cols]
        length_ht = len(hold_cols)
        
    search_text = _collect_search_text(keywords, keyword_dict)
    
    if synonym_dict is not None:
        search_text = _find_synonyms(search_text, synonym_dict)

    if bool_search == 'and':
        expr = '(?=.*{})'
        search_str = ''.join(expr.format(text) for text in search_text)
    else:
        search_str = '|'.join(search_text)
    
    cond = input_table.stack().str.contains(search_str).unstack() 
    
    if remove_na == "any":
        out_table = pd.concat([input_table[cond], hold_table], axis=1).dropna(thresh=len(input_cols) + length_ht).reset_index(drop=True)
    elif remove_na == "all":
        out_table = pd.concat([input_table[cond], hold_table], axis=1).dropna(thresh=length_ht + 1).reset_index(drop=True)
    else:
        out_table = pd.concat([input_table[cond], hold_table], axis=1)
    
    return {'out_table': out_table}
