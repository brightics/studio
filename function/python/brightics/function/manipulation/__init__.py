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

from .outlier_detection import outlier_detection_lof, outlier_detection_tukey_carling, outlier_detection_tukey_carling_model, outlier_detection_lof_model
from .extend_datetime import extend_datetime

import pandas as pd
import numpy as np
import math
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to, raise_error, require_param
from .timeseries_distance import timeseries_distance

from base64 import b64encode
from os import urandom
import random
import string


def generate_colname(length, cnt, existing_cols: list = None):
    __letters = [c.encode() for c in string.ascii_letters]
    __num_to_byte = dict([(c.encode()[0], c.encode()) for c in string.digits])

    if existing_cols is None or len(existing_cols) == 0:
        existing_cols = set()
    else:
        existing_cols = set(s.encode() for s in existing_cols)

    num_generated = 0
    while num_generated < cnt:
        new_col = b64encode(urandom(((length + 1) * 3) // 4), b'//', )[:length]

        while b'/' in new_col:
            new_col = new_col.replace(b'/', random.choice(__letters), 1)

        first = new_col[0]
        if first in __num_to_byte:
            new_col = new_col.replace(
                __num_to_byte[first], random.choice(__letters), 1)

        if new_col not in existing_cols:
            existing_cols.add(new_col)
            num_generated += 1
            yield new_col.decode()


def filter(table, query):
    _table = table.copy()

    _out_table = _table.query(query, engine='python')

    return {'out_table':_out_table}


def simple_filter(table, input_cols, operators, operands, main_operator='and'):
    if len(input_cols) == 0 or not (len(input_cols) == len(operators) == len(operands)):
        validate(require_param('input_cols'))

    _column = [c.strip() for c in input_cols]
    _operator = [o.strip() for o in operators]

    _query = ""
    first_filter_list = []
    second_filter_list = []

    # remedy for column names correspond to python keyword
    _original_cols = list(table.columns)
    temp_cols = generate_colname(20, len(_original_cols), _original_cols)
    _column_map = dict((k, v) for k, v in zip(_original_cols, temp_cols))
    _column_map_rev = dict((v, k) for k, v in _column_map.items())

    table.rename(columns=_column_map, inplace=True)
    _column = [_column_map[c] for c in _column]

    for c, op, od in zip(_column, _operator, operands):
        if op in ['starts with', 'ends with', 'contain', 'not contain']:
            second_filter_list.append([c, op, od.strip('\'')])
        else:
            first_filter_list.append([c, op, od])
    _query = main_operator.join(['''({input_cols} {operators} {operands})'''.format(
        input_cols=c, operators=op, operands=od) for c, op, od in first_filter_list])

    if len(first_filter_list) == 0:
        _table = table.copy()
        cond = np.full(len(table), False)
    else:
        _table = table.query(_query, engine='python')
        cond = [
            True if i in _table.index else False for i in range(len(table))]

    table.rename(columns=_column_map_rev, inplace=True)

    if len(second_filter_list) == 0:
        out_table = _table.copy()
    else:
        if main_operator == 'and':
            cond = np.full(len(_table), True)
            for _filter in second_filter_list:
                if _filter[1] == 'starts with':
                    cond = cond & _table[_filter[0]].str.startswith(
                        _filter[2]).values
                if _filter[1] == 'ends with':
                    cond = cond & _table[_filter[0]].str.endswith(
                        _filter[2]).values
                if _filter[1] == 'contain':
                    cond = cond & _table[_filter[0]].str.contains(
                        _filter[2]).values
                if _filter[1] == 'not contain':
                    cond = cond & ~(
                        _table[_filter[0]].str.contains(_filter[2]).values)
            out_table = _table[cond]

        elif main_operator == 'or':
            for _filter in second_filter_list:
                if _filter[1] == 'starts with':
                    cond = cond | _table[_filter[0]].str.startswith(
                        _filter[2]).values
                if _filter[1] == 'ends with':
                    cond = cond | _table[_filter[0]].str.endswith(
                        _filter[2]).values
                if _filter[1] == 'contain':
                    cond = cond | _table[_filter[0]].str.contains(
                        _filter[2]).values
                if _filter[1] == 'not contain':
                    cond = cond | ~(
                        _table[_filter[0]].str.contains(_filter[2]).values)
            out_table = _table[cond]

    out_table.rename(columns=_column_map_rev, inplace=True)
    return {'out_table': out_table}


def sort(table, group_by=None, **params):
    check_required_parameters(_sort, params, ['table'])
    if group_by is not None:
        return _function_by_group(_sort, table, group_by=group_by, **params)
    else:
        return _sort(table, **params)


def _sort(table, input_cols, is_asc=None):
    if is_asc is None or is_asc == True:
        is_asc = [True for _ in input_cols]
    elif is_asc == False:
        is_asc = [False for _ in input_cols]

    if len(input_cols) == 0:
        validate(require_param('input_cols'))

    _table = table.copy()

    return {'out_table':_table.sort_values(by=input_cols, ascending=is_asc)}


def replace_missing_number(table, group_by=None, **params):
    check_required_parameters(_replace_missing_number, params, ['table'])
    params = get_default_from_parameters_if_required(params, _replace_missing_number)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'limit')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_replace_missing_number, table, group_by=group_by, **params)
    else:
        return _replace_missing_number(table, **params)


def _replace_missing_number(table, input_cols, fill_method=None, fill_value='value', fill_value_to=0.0, limit=None, downcast=None):
    _table = table.copy()

    if input_cols is None or len(input_cols) == 0:
        _raw_input_cols = _table.columns
    else:
        _raw_input_cols = input_cols

    if fill_method == 'ffill' or fill_method == 'bfill':
        _out_table = _table
        _out_table[input_cols] = _table[input_cols].fillna(method=fill_method, limit=limit, downcast=downcast)
    else:
        _input_cols = [x for x in _raw_input_cols if np.issubdtype(table[x].dtype, np.number)]
        if fill_value == 'mean':
            _values = {x:_table[x].dtype.type(np.mean(_table[x].dropna())) for x in _input_cols}
        elif fill_value == 'median':
            _values = {x:_table[x].dtype.type(np.median(_table[x].dropna())) for x in _input_cols}
        elif fill_value == 'min':
            _values = {x:np.min(_table[x].dropna()) for x in _input_cols}
        elif fill_value == 'max':
            _values = {x:np.max(_table[x].dropna()) for x in _input_cols}
        else:
            _values = {x:fill_value_to for x in _input_cols}

        _out_table = _table.fillna(value=_values, limit=limit, downcast=downcast)
    return {'out_table':_out_table}


def replace_missing_string(table, group_by=None, **params):
    check_required_parameters(_replace_missing_string, params, ['table'])
    params = get_default_from_parameters_if_required(params, _replace_missing_string)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'limit')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_replace_missing_string, table, group_by=group_by, **params)
    else:
        return _replace_missing_string(table, **params)


def _empty_string_to_null(a):
    if a == '':
        return None
    else:
        return a


def _replace_missing_string(table, input_cols, fill_method=None, fill_string='', limit=None, downcast=None, empty_string_null=False):
    _table = table.copy()

    if input_cols is None or len(input_cols) == 0:
        _raw_input_cols = _table.columns
    else:
        _raw_input_cols = input_cols
    if empty_string_null:
        _table = _table.applymap(_empty_string_to_null)
    if fill_method == 'ffill' or fill_method == 'bfill':
        _out_table = _table
        _out_table[input_cols] = _table[input_cols].fillna(method=fill_method, limit=limit, downcast=downcast)
    else:
        _input_cols = [x for x in _raw_input_cols if table[x].dtype == object]
        _values = {x:fill_string for x in _input_cols}
        _out_table = _table.fillna(value=_values, limit=limit, downcast=downcast)

    return {'out_table':_out_table}
