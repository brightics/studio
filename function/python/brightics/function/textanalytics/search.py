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


def search(table, **params):
    check_required_parameters(_search, params, ['table'])   
    return _search(table, **params)


def _search(table, user_dict=pd.DataFrame(), input_cols=[], search_words=[], synonym_dict=[], main_operator='and'):

    if len(search_words) == 0:
        raise_error('0225')

    for search_word in search_words:
        if search_word is None:
            raise_error('0225')

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
        search_words = [user_dict['value'][i] for i, key in enumerate(user_dict['key']) if key in search_words]
        print(search_words)
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
