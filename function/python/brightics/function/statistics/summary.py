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

from brightics.common.groupby import _function_by_group
from brightics.common.groupby2 import _function_by_group2
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_to
from brightics.common.validation import all_elements_from_to
from brightics.common.validation import all_elements_from_under
from brightics.common.validation import raise_error

import brightics.common.statistics as brtc_stats
import scipy.stats 
import pandas as pd
import numpy as np


def _name_change(a):
    if a == 'mean':
        return 'avg'
    if a == 'nrow':
        return 'num_of_row'
    if a == 'std':
        return 'stddev'
    if a == 'var':
        return 'variance'
    if a == 'size':
        return 'nrow'
    if a == 'count':
        return 'num_of_value'
    else:
        return a


def _remove_unicode(st):
    if '\u0003' in st:
        return st[:-1]
    else:
        return st


def _amounts_colname(a): return str(a).replace('.', '_')


def _unique_list(l): return np.unique(list(filter(lambda x: x is not None and not np.isnan(x), l)))


def statistic_summary(table, group_by=None, **params):
    check_required_parameters(_statistic_summary_list, params, ['table'])
    params = get_default_from_parameters_if_required(params, _statistic_summary_original)
    param_validation_check = [all_elements_from_to(params, 0, 100, 'percentile_amounts'),
                              all_elements_from_under(params, 0, 0.5, 'trimmed_mean_amounts')]
    validate(*param_validation_check)
    if group_by is None:
        return _statistic_summary_original(table, **params)
    if True in pd.isnull(table[group_by]).values:
        group_by_unicode = [str(i) + '\u0003' for i in group_by]
        table[group_by_unicode] = table[group_by].fillna('\u0003')
        group_by = group_by_unicode
    params1 = dict()
    params1['input_cols'] = params['input_cols']
    params2 = dict()
    params1['statistics'] = []
    params2['statistics'] = []
    for st in params['statistics']:
        if st in ['max', 'min', 'range', 'sum', 'avg', 'variance', 'stddev', 'nrow', 'num_of_value', 'null_count', 'median']:
            params1['statistics'].append(st)
        else:
            params2['statistics'].append(st)
    for st in params.keys():
        if 'percentile' == st:
            params2['percentile'] = params['percentile']
        if 'trimmed_mean' == st:
            params2['trimmed_mean'] = params['trimmed_mean']
        if 'percentile_amounts' == st:
            params2['percentile_amounts'] = params['percentile_amounts']
        if 'trimmed_mean_amounts' == st:
            params2['trimmed_mean_amounts'] = params['trimmed_mean_amounts']
    if params1['statistics']:
        result1 = _statistic_summary_groupby(table, group_by=group_by, **params1)
        result1.index = result1[group_by + ['column_name']]
    else:
        result1 = None
    if params2['statistics']:
        params2['input_cols'] = params['input_cols']
        column_indices = []
        for i in params2['input_cols']:
            column_indices.append(table.columns.get_loc(i))
        params2['column_indices'] = column_indices
        columns = ['column_name'] + params2['statistics'].copy()
        columns = ['num_of_row' if x == 'nrow' else x for x in columns]
        if 'percentile' in columns:
            columns.remove('percentile')
            if params2['percentile_amounts'] is not None:
                for pa in _unique_list(params2['percentile_amounts']):
                    columns.append('percentile_{}'.format(_amounts_colname(pa)))
        if 'trimmed_mean' in columns:
            columns.remove('trimmed_mean')
            if params2['trimmed_mean_amounts'] is not None:
                for ta in _unique_list(params2['trimmed_mean_amounts']):
                    columns.append('trimmed_mean_{}'.format(_amounts_colname(ta)))
        if 'mode' in columns:
            columns.remove('mode')
            columns.append('mode')
        result2 = _function_by_group2(_statistic_summary_list, table, columns=columns, group_by=group_by, **params2)['out_table']
        result2.index = result2[group_by + ['column_name']]
        if result1 is not None:
            result2 = result2[[i for i in result2.columns if i not in group_by + ['column_name']]]
            # Update sort parameter after upgrading pandas.
            # result = pd.concat([result2,result1], axis=1, sort = False).reset_index(drop = True)
            result = pd.concat([result2, result1], axis=1).reset_index(drop=True)
        else:
            result = result2
    else:
        groups = table[group_by].drop_duplicates().values
        result2 = []
        for i in groups:
            for j in params['input_cols']:
                result2.append(list(i) + [j])
        result2 = pd.DataFrame(result2, columns=group_by + ['column_name'])
        result2.index = result2[group_by + ['column_name']]
        result1 = result1[[i for i in result1.columns if i not in group_by + ['column_name']]]
        # Update sort parameter after upgrading pandas.
        # result = pd.concat([result2,result1], axis=1, sort=False).reset_index(drop = True)
        result = pd.concat([result2, result1], axis=1).reset_index(drop=True)
    columns = ['column_name'] + params['statistics'].copy()
    if 'percentile' in columns:
        columns.remove('percentile')
        if params['percentile_amounts'] is not None:
            for pa in _unique_list(params['percentile_amounts']):
                columns.append('percentile_{}'.format(_amounts_colname(pa)))
    if 'trimmed_mean' in columns:
        columns.remove('trimmed_mean')
        if params['trimmed_mean_amounts'] is not None:
            for ta in _unique_list(params['trimmed_mean_amounts']):
                columns.append('trimmed_mean_{}'.format(_amounts_colname(ta)))
    if 'mode' in columns:
        columns.remove('mode')
        columns.append('mode')
    result = result[group_by + columns]
    if '\u0003' in result.values:
        result = result.replace('\u0003', np.nan)
        tmp_col = result.columns
        result.columns = [_remove_unicode(i) for i in tmp_col]
    return {'out_table' : result}


def _statistic_summary_list(table, input_cols, statistics, column_indices=None, percentile_amounts=None, trimmed_mean_amounts=None):
    tmp_table = table.copy()
    tmp_table = list(map(list, zip(*tmp_table)))
    result = []
    for i in range(len(input_cols)):
        data = [input_cols[i]]
        for st in statistics:
            if 'skewness' == st:
                data.append(brtc_stats.skewness(tmp_table[column_indices[i]]))
            elif 'kurtosis' == st:
                data.append(brtc_stats.kurtosis(tmp_table[column_indices[i]]))
            elif 'mode' == st:
                data.append(brtc_stats.mode(tmp_table[column_indices[i]]))
            elif 'q1' == st:
                data.append(brtc_stats.q1(tmp_table[column_indices[i]]))
            elif 'q3' == st:
                data.append(brtc_stats.q3(tmp_table[column_indices[i]]))
            elif 'iqr' == st:
                data.append(brtc_stats.iqr(tmp_table[column_indices[i]]))
            elif 'percentile' == st and percentile_amounts is not None:
                for pa in _unique_list(percentile_amounts):
                    data.append(brtc_stats.percentile(tmp_table[column_indices[i]], pa))
            elif 'trimmed_mean' == st and trimmed_mean_amounts is not None:
                for ta in _unique_list(trimmed_mean_amounts):
                    data.append(brtc_stats.trimmed_mean(tmp_table[column_indices[i]], ta))
        result.append(data)
    return {'out_table' : result}


def _statistic_summary_groupby(table, input_cols, statistics, group_by=None):
    agg_func = []
    for st in statistics:
        if 'max' == st:
            agg_func.append('max')
        if 'min' == st:
            agg_func.append('min')
        if 'range' == st:
            if 'max' not in agg_func:
                agg_func.append('max')
            if 'min' not in agg_func:
                agg_func.append('min')
        if 'sum' == st:
            agg_func.append(np.sum)
        if 'avg' == st:
            agg_func.append(np.mean)
        if 'variance' == st:
            agg_func.append(np.var)
        if 'stddev' == st:
            agg_func.append(np.std)
        if 'nrow' == st:
            agg_func.append('size')
        if 'num_of_value' == st:
            agg_func.append('count')
        if 'null_count' == st:
            if 'size' not in agg_func:
                agg_func.append('size')
            if 'count' not in agg_func:
                agg_func.append('count')
        if 'median' == st:
            agg_func.append(np.median)
    result = []
    for input_col in input_cols:
        result.append(table.groupby(group_by).agg({input_col:agg_func}))
    tmp_results = []
    tmp_list = []
    for i in range(len(input_cols)):
        tmp = result[i][input_cols[i]]
        tmp.reset_index(inplace=True)
        tmp_list += [input_cols[i] for j in range(tmp.shape[0])]
        tmp_results.append(tmp)
    result = pd.concat(tmp_results)
    if 'range' in statistics:
        result['range'] = result['max'] - result['min']
    if 'null_count' in statistics:
        result['null_count'] = result['size'] - result['count']
    result['column_name'] = tmp_list
    col_names = result.columns.tolist()
    result.columns = [_name_change(i) for i in col_names]
    return result


def _statistic_summary_original(table, input_cols, statistics, percentile_amounts=None, trimmed_mean_amounts=None):
    
    _table = table.copy()    
    data = {'column_name':input_cols}
    for st in statistics:
        if 'max' == st:
            data['max'] = [brtc_stats.max(_table[x]) for x in input_cols]
        if 'min' == st:
            data['min'] = [brtc_stats.min(_table[x]) for x in input_cols]
        if 'range' == st:
            data['range'] = [brtc_stats.range(_table[x]) for x in input_cols]
        if 'sum' == st:
            data['sum'] = [brtc_stats.sum(_table[x]) for x in input_cols]
        if 'avg' == st:
            data['avg'] = [brtc_stats.mean(_table[x]) for x in input_cols]
        if 'variance' == st:
            data['variance'] = [brtc_stats.var_samp(_table[x]) for x in input_cols]
        if 'stddev' == st:
            data['stddev'] = [brtc_stats.std(_table[x]) for x in input_cols]
        if 'skewness' == st:
            data['skewness'] = [brtc_stats.skewness(_table[x]) for x in input_cols]
        if 'kurtosis' == st:
            data['kurtosis'] = [brtc_stats.kurtosis(_table[x]) for x in input_cols]
        if 'nrow' == st:
            data['num_of_row'] = [brtc_stats.num_row(_table[x]) for x in input_cols]
        if 'num_of_value' == st:
            data['num_of_value'] = [brtc_stats.num_value(_table[x]) for x in input_cols]
        if 'null_count' == st:
            data['null_count'] = [brtc_stats.num_null(_table[x]) for x in input_cols]
        if 'mode' == st:
            data['mode'] = [list(brtc_stats.mode(_table[x])) for x in input_cols]
        if 'median' == st:
            data['median'] = [brtc_stats.median(_table[x]) for x in input_cols]
        if 'q1' == st:
            data['q1'] = [brtc_stats.q1(_table[x]) for x in input_cols]
        if 'q3' == st:
            data['q3'] = [brtc_stats.q3(_table[x]) for x in input_cols]
        if 'iqr' == st:
            data['iqr'] = [brtc_stats.iqr(_table[x]) for x in input_cols]
        if 'percentile' == st and percentile_amounts is not None:
            for pa in _unique_list(percentile_amounts):
                pa_colname = 'percentile_{}'.format(_amounts_colname(pa))
                data[pa_colname] = [brtc_stats.percentile(_table[x], pa) for x in input_cols]
        if 'trimmed_mean' == st and trimmed_mean_amounts is not None:
            for ta in _unique_list(trimmed_mean_amounts):
                ta_colname = 'trimmed_mean_{}'.format(_amounts_colname(ta))
                data[ta_colname] = [brtc_stats.trimmed_mean(_table[x], ta) for x in input_cols]
            
    result = pd.DataFrame(data)
    
    return {'out_table' : result}


def statistic_derivation(table, group_by=None, **params):
    check_required_parameters(_statistic_derivation, params, ['table'])
    params = get_default_from_parameters_if_required(params, _statistic_derivation)
    param_validation_check = [all_elements_from_to(params, 0, 100, 'percentile_amounts'),
                              all_elements_from_under(params, 0, 0.5, 'trimmed_mean_amounts')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_statistic_derivation, table, group_by=group_by, **params)
    else:
        return _statistic_derivation(table, **params)


def _statistic_derivation(table, input_cols, statistics, percentile_amounts=[], trimmed_mean_amounts=[]):
    
    _table = table.copy()
    
    _table_stat = _statistic_summary_original(_table, input_cols, statistics, percentile_amounts, trimmed_mean_amounts)['out_table']
    
    _statistics = _table_stat.columns.tolist()
    _statistics.remove('column_name')
    
    for col in input_cols:
        row_idx = _table_stat.index[_table_stat['column_name'] == col].tolist()[0]
        for st in _statistics:
            new_col = '{}_{}'.format(col, st)
            if st == 'mode':
                # note: the output type of mode is list.
                _table[new_col] = _table.apply(lambda x:_table_stat[st][row_idx], axis=1)
            else:
                _table[new_col] = _table_stat[st][row_idx]
    
    return {'out_table' : _table}


def string_summary(table, group_by=None, **params):
    check_required_parameters(_string_summary, params, ['table'])
    if group_by is not None:
        return _function_by_group(_string_summary, table, group_by=group_by, **params)
    else:
        return _string_summary(table, **params)


def _string_summary(table, input_cols):
    table = table.copy()
    if input_cols == []:
        input_cols = list(table.columns)
    input_cols.sort()
    
    data = {'column_name': input_cols}
    
    # first table
    col_max = []
    col_min = []
    col_mode = []
    col_num_of_row = []
    col_null_count = []
    col_num_of_distinct = []
    col_num_of_white_space = []
    col_num_of_space_padded = []
    for col in input_cols:
        coldata = table[col]
        coldata_dropped = coldata.dropna()
        col_max.append(brtc_stats.max(coldata_dropped))
        col_min.append(brtc_stats.min(coldata_dropped))
        col_mode.append(list(brtc_stats.mode(coldata)))
        col_num_of_row.append(brtc_stats.num_row(coldata))
        col_null_count.append(brtc_stats.num_null(coldata))
        col_num_of_distinct.append(brtc_stats.num_distinct(coldata_dropped))
        col_num_of_white_space.append(np.count_nonzero([not (x and str(x).strip()) for x in coldata]))
        col_num_of_space_padded.append(np.count_nonzero([x != '' and x and len(str(x)) != len(str(x).strip()) for x in coldata]))
    
    data['max'] = col_max
    data['min'] = col_min
    data['mode'] = col_mode
    data['num_of_row'] = col_num_of_row
    data['null_count'] = col_null_count
    data['num_of_distinct'] = col_num_of_distinct
    data['num_of_white_space'] = col_num_of_white_space
    data['num_of_space_padded'] = col_num_of_space_padded
    
    result1 = pd.DataFrame(data)
    
    # second table
    count_table_list = []
    for c in input_cols:
        
        # value & counts
        count_table = table.groupby([c]).size().reset_index(name='counts').rename(columns={c:'value'})
        count_null_table = pd.DataFrame([[None, np.count_nonzero([x is None for x in table[c]])]], columns=['value', 'counts'])
        count_table = count_table.append(count_null_table, ignore_index=True)
        
        # column_name
        count_table['column_name'] = c
        
        # rate
        local_sum = np.sum(count_table['counts'])
        count_table['rate'] = [x / local_sum for x in count_table['counts']]
        count_table = count_table.sort_values(by='value')
        
        # cumulative rate
        count_table['cumulative_rate'] = count_table['rate'].cumsum()
        
        count_table_list.append(count_table)
    
    result2 = pd.concat(count_table_list, ignore_index=True)[['column_name', 'value', 'counts', 'rate', 'cumulative_rate']]
    
    return {'summary_table':result1, 'count_table':result2}
