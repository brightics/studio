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

import pandas as pd
import numpy as np
import math
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to, raise_error, require_param


def filter(table, query):
    _table = table.copy()
    
    _out_table = _table.query(query, engine='python')
    
    return {'out_table':_out_table}


def simple_filter(table, input_cols, operators, operands, main_operator='and'):
    _table = table.copy()
    _column = [c.strip() for c in input_cols]
    _operator = [o.strip() for o in operators]
    
    if len(input_cols) == 0 or not (len(input_cols) == len(operators) == len(operands)):
        validate(require_param('input_cols'))
    
    _query = ""
    first_filter_list = []
    second_filter_list = []
    for c, op, od in zip(_column, _operator, operands):
        if op in ['starts with', 'ends with', 'contain', 'not contain']:
            second_filter_list.append([c, op, od.strip('\'')])
        else:
            first_filter_list.append([c, op, od])
    _query = main_operator.join(['''({input_cols} {operators} {operands})'''.format(input_cols=c, operators=op, operands=od) for c, op, od in first_filter_list])
    
    if len(_query) == 0:
        _out_table = _table
    else:
        _out_table = _table.query(_query, engine='python')
    first_filtered_set = set(_out_table.index)
    
    if len(second_filter_list) == 0:
        _out_table = _out_table
    else:
        if main_operator == 'and':
            cond = np.full(len(_table), True).tolist()
            for _filter in second_filter_list:
                if _filter[1] == 'starts with':
                    cond = (cond) and (_table[_filter[0]].str.startswith(_filter[2]))
                if _filter[1] == 'ends with':
                    cond = (cond) and (_table[_filter[0]].str.endswith(_filter[2]))
                if _filter[1] == 'contain':
                    cond = (cond) and (_table[_filter[0]].str.contains(_filter[2]))
                if _filter[1] == 'not contain':
                    cond = (cond) and (~(_table[_filter[0]].str.contains(_filter[2])))
            _out_table = _table.loc[list(first_filtered_set.intersection(set(_table[cond].index)))]
        
        elif main_operator == 'or':
            cond = np.full(len(_table), False).tolist()
            for _filter in second_filter_list:
                if _filter[1] == 'starts with':
                    cond = (cond)or(_table[_filter[0]].str.startswith(_filter[2]))
                if _filter[1] == 'ends with':
                    cond = (cond)or(_table[_filter[0]].str.endswith(_filter[2]))
                if _filter[1] == 'contain':
                    cond = (cond) or (_table[_filter[0]].str.contains(_filter[2]))
                if _filter[1] == 'not contain':
                    cond = (cond) or (~(_table[_filter[0]].str.contains(_filter[2])))
            _out_table = _table.loc[list(first_filtered_set.union(set(_table[cond].index)))]
    return {'out_table':_out_table}


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
    
    return {'out_table':table.sort_values(by=input_cols, ascending=is_asc)}


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


def _replace_missing_string(table, input_cols, fill_method=None, fill_string='', limit=None, downcast=None):
    _table = table.copy()
    
    if input_cols is None or len(input_cols) == 0:
        _raw_input_cols = _table.columns
    else:
        _raw_input_cols = input_cols
    
    if fill_method == 'ffill' or fill_method == 'bfill':
        _out_table = _table
        _out_table[input_cols] = _table[input_cols].fillna(method=fill_method, limit=limit, downcast=downcast)
    else:
        _input_cols = [x for x in _raw_input_cols if table[x].dtype == object]
        _values = {x:fill_string for x in _input_cols}
        _out_table = _table.fillna(value=_values, limit=limit, downcast=downcast)
        
    return {'out_table':_out_table}
