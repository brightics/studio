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
from string import punctuation

from brightics.common.groupby import _function_by_group
from brightics.common.validation import raise_runtime_error
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
import brightics.common.statistics as brtc_stat


def unpivot(table, value_vars, var_name=None, value_name='value', col_level=None, id_vars=None):
    # if delete this, it is not consistent with the previous version.
    if id_vars is None:
        id_vars = [column for column in table.columns if column not in value_vars] 
    out_table = pd.melt(table, id_vars=id_vars, value_vars=value_vars, var_name=var_name, value_name=value_name, col_level=col_level)
    return {'out_table': out_table}


def pivot(table, values, aggfunc, index=None, columns=None):  # TODO

    if index is None and columns is None:
        # TODO: assign an error code.
        raise_runtime_error('Group key value is required: Index or Columns.')

    def count(x): return len(x)

    def _sum(x): return brtc_stat.sum(x)

    def mean(x): return brtc_stat.mean(x)

    def std(x): return brtc_stat.std(x)

    def var(x): return brtc_stat.var_samp(x)

    def _max(x): return brtc_stat.max(x)

    def _min(x): return brtc_stat.min(x)

    def _25th(x): return brtc_stat.percentile(x, 25)

    def median(x): return brtc_stat.median(x)

    def _75th(x): return brtc_stat.percentile(x, 75)
    
    def _distinct(x): return list(set(x))
    
    def _mi2index(mi):
        return pd.Index([_replace_col(col) for col in mi.get_values()])
    
    def _replace_col(tup):
        col = '__'.join(str(elem) for elem in tup)
        
        for char in ' ,;{}()\n\t=':
            col.replace(char, '')
            
        return col
    
    func_list = []
    for func_name in aggfunc:
        if func_name == 'count':
            func_list.append(count)
        elif func_name == 'mean':
            func_list.append(mean)
        elif func_name == 'std':
            func_list.append(std)
        elif func_name == 'var':
            func_list.append(var)
        elif func_name == 'min':
            func_list.append(_min)
        elif func_name == '_25th':
            func_list.append(_25th)
        elif func_name == 'median':
            func_list.append(median)
        elif func_name == '_75th':
            func_list.append(_75th)
        elif func_name == 'max':
            func_list.append(_max)
        elif func_name == 'sum':
            func_list.append(_sum) 
        elif func_name == 'distinct':
            func_list.append(_distinct) 
    
    pivoted = pd.pivot_table(table, values=values, index=index, columns=columns, aggfunc=func_list, fill_value=None, margins=False, margins_name='All')
    pivoted.columns = _mi2index(pivoted.columns)
    out_table = pd.concat([pivoted.index.to_frame(), pivoted], axis=1)
    return {'out_table':out_table}


def pivot2(table, values, aggfunc, index=None, columns=None):  # TODO

    if index is None and columns is None:
        # TODO: assign an error code.
        raise_runtime_error('Group key value is required: Index or Columns.')

    def _count(x): return len(x)

    def _sum(x): return brtc_stat.sum(x)

    def _mean(x): return brtc_stat.mean(x)

    def _std(x): return brtc_stat.std(x)

    def _var(x): return brtc_stat.var_samp(x)

    def _max(x): return brtc_stat.max(x)
    
    def _min(x): return brtc_stat.min(x)

    def _q1(x): return brtc_stat.percentile(x, 25)

    def _median(x): return brtc_stat.median(x)

    def _q3(x): return brtc_stat.percentile(x, 75)
    
    def _distinct(x): return list(set(x))
    
    func_list = []
    for func_name in aggfunc:
        if func_name == 'count':
            func_list.append(_count)
        elif func_name == 'mean':
            func_list.append(_mean)
        elif func_name == 'std':
            func_list.append(_std)
        elif func_name == 'var':
            func_list.append(_var)
        elif func_name == 'min':
            func_list.append(_min)
        elif func_name == 'q1':
            func_list.append(_q1)
        elif func_name == 'median':
            func_list.append(_median)
        elif func_name == 'q3':
            func_list.append(_q3)
        elif func_name == 'max':
            func_list.append(_max)
        elif func_name == 'sum':
            func_list.append(_sum) 
        elif func_name == 'distinct':
            func_list.append(_distinct) 
    
    pivoted = pd.pivot_table(table, values=values, index=index, columns=columns, aggfunc=func_list, fill_value=None, margins=False, margins_name='All')
    out_table = pd.concat([pivoted.index.to_frame(), pivoted], axis=1)
    if index is None:
        out_table = out_table.rename(index=str, columns={0: "values"})
        name_list = []
        if len(columns) == 1:
            for name in out_table.columns.tolist()[1:]:
                name_list.append(name[0][1:] + "_" + str(name[1]))
            out_table.columns = out_table.columns.tolist()[:1] + name_list
        else:
            for name in out_table.columns.tolist()[len(columns) + 1:]:
                name_list.append(name[1:])
            out_table.columns = out_table.columns.tolist()[:len(columns) + 1] + name_list
    elif index is not None:
        name_list = []
        for name in out_table.columns.tolist()[len(index):]:
            name_list.append(name[0][1:] + "_" + "_".join(str(i) for i in name[1:]))
        out_table.columns = index + name_list
    return {'out_table':out_table}

    
def pivot3(table, values, aggfunc, index=None, columns=None):  # TODO

    if index is None and columns is None:
        # TODO: assign an error code.
        raise_runtime_error('Group key value is required: Index or Columns.')

    def _count(x): return len(x)

    def _sum(x): return brtc_stat.sum(x)

    def _mean(x): return brtc_stat.mean(x)

    def _std(x): return brtc_stat.std_samp(x)

    def _var(x): return brtc_stat.var_samp(x)

    def _max(x): return brtc_stat.max(x)
    
    def _min(x): return brtc_stat.min(x)

    def _q1(x): return brtc_stat.percentile(x, 25)

    def _median(x): return brtc_stat.median(x)

    def _q3(x): return brtc_stat.percentile(x, 75)
    
    def _distinct(x): return list(set(x))
    
    func_list = []
    for func_name in aggfunc:
        if func_name == 'count':
            func_list.append(_count)
        elif func_name == 'mean':
            func_list.append(_mean)
        elif func_name == 'std':
            func_list.append(_std)
        elif func_name == 'var':
            func_list.append(_var)
        elif func_name == 'min':
            func_list.append(_min)
        elif func_name == 'q1':
            func_list.append(_q1)
        elif func_name == 'median':
            func_list.append(_median)
        elif func_name == 'q3':
            func_list.append(_q3)
        elif func_name == 'max':
            func_list.append(_max)
        elif func_name == 'sum':
            func_list.append(_sum) 
        elif func_name == 'distinct':
            func_list.append(_distinct) 
    
    pivoted = pd.pivot_table(table, values=values, index=index, columns=columns, aggfunc=func_list, fill_value=None, margins=False, margins_name='All')
    out_table = pd.concat([pivoted.index.to_frame(), pivoted], axis=1)
    if index is None:
        out_table = out_table.rename(index=str, columns={0: "values"})
        name_list = []
        if len(columns) == 1:
            for name in out_table.columns.tolist()[1:]:
                name_list.append(name[0][1:] + "_" + str(name[1]))
            out_table.columns = out_table.columns.tolist()[:1] + name_list
        else:
            for name in out_table.columns.tolist()[len(columns) + 1:]:
                name_list.append(name[1:])
            out_table.columns = out_table.columns.tolist()[:len(columns) + 1] + name_list
    elif index is not None:
        name_list = []
        for name in out_table.columns.tolist()[len(index):]:
            name_list.append(name[0][1:] + "_" + "_".join(str(i) for i in name[1:]))
        out_table.columns = index + name_list
    
    special_char = str(punctuation) + ' '

    for char in special_char:
            out_table.columns = out_table.columns.str.replace(char, '_')
            
    return {'out_table':out_table}


def transpose(table, group_by=None, **params):
    check_required_parameters(_transpose, params, ['table'])
    if group_by is not None:
        return _function_by_group(_transpose, table, group_by=group_by, **params)
    else:
        return _transpose(table, **params)


def _transpose(table, input_cols, label_col=None, label_col_name='label'):

    sort_table = pd.DataFrame()
    feature_col_name = [col for col in table.columns if col in input_cols]
    sort_table = table[feature_col_name]
    
    out_table = sort_table.transpose()
    len_table = len(table)
    
    if label_col is None:
        out_table.columns = ['x' + str(i + 1) for i in range(len_table)]
    else:
        tmp = table[label_col].tolist()
        out_table.columns = [str(tmp[i]) for i in range(len_table)]
    
    out_table.insert(loc=0, column=label_col_name, value=feature_col_name)

    return{'out_table':out_table}


def distinct(table, group_by=None, **params):
    check_required_parameters(_distinct, params, ['table'])
    if group_by is not None:
        return _function_by_group(_distinct, table, group_by=group_by, **params)
    else:
        return _distinct(table, **params)

        
def _distinct(table, input_cols, hold_cols=None):
    if hold_cols is None:
        out_table = table.drop_duplicates(input_cols)
    else:
        out_table = table[list(set(input_cols + hold_cols))].drop_duplicates(input_cols)
    return {'out_table': out_table}
