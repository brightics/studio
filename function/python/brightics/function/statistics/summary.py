from brightics.common.groupby import _function_by_group
from brightics.common.groupby2 import _function_by_group2
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_to
from brightics.common.validation import all_elements_from_to
from brightics.common.validation import all_elements_from_under

import brightics.common.statistics as brtc_stats
import pandas as pd
import numpy as np

def _amounts_colname(a): return str(a).replace('.', '_')

def _unique_list(l): return np.unique(list(filter(lambda x: x is not None and not np.isnan(x), l)))

def statistic_summary(table, group_by=None, **params):
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
    check_required_parameters(_statistic_summary, params, ['table'])
    if group_by is not None:
        return _function_by_group2(_statistic_summary, table, columns=columns, group_by=group_by, **params)
    else:
        tmp_table = table.values
        result = _statistic_summary(tmp_table, **params)
        result['out_table']=pd.DataFrame(result['out_table'],columns=columns)
        return result


def _statistic_summary(table, input_cols, statistics, percentile_amounts=None, trimmed_mean_amounts=None):
    tmp_table=table.copy()
    tmp_table=list(map(list, zip(*tmp_table)))
    result=[]
    for i in range(len(input_cols)):
        data = [input_cols[i]]
        for st in statistics:
            if 'max' == st:
                data.append(brtc_stats.max(tmp_table[i]))
            elif 'min' == st:
                data.append(brtc_stats.min(tmp_table[i]))
            elif 'range' == st:
                data.append(brtc_stats.range(tmp_table[i]))
            elif 'sum' == st:
                data.append(brtc_stats.sum(tmp_table[i]))
            elif 'avg' == st:
                data.append(brtc_stats.mean(tmp_table[i]))
            elif 'variance' == st:
                data.append(brtc_stats.var_samp(tmp_table[i]))
            elif 'stddev' == st:
                data.append(brtc_stats.std(tmp_table[i]))
            elif 'skewness' == st:
                data.append(brtc_stats.skewness(tmp_table[i]))
            elif 'kurtosis' == st:
                data.append(brtc_stats.kurtosis(tmp_table[i]))
            elif 'nrow' == st:
                data.append(brtc_stats.num_row(tmp_table[i]))
            elif 'num_of_value' == st:
                data.append(brtc_stats.num_value(tmp_table[i]))
            elif 'null_count' == st:
                data.append(brtc_stats.num_null(tmp_table[i]))
            elif 'mode' == st:
                data.append(brtc_stats.mode(tmp_table[i]))
            elif 'median' == st:
                data.append(brtc_stats.median(tmp_table[i]))
            elif 'q1' == st:
                data.append(brtc_stats.q1(tmp_table[i]))
            elif 'q3' == st:
                data.append(brtc_stats.q3(tmp_table[i]))
            elif 'iqr' == st:
                data.append(brtc_stats.iqr(tmp_table[i]))
            elif 'percentile' == st and percentile_amounts is not None:
                for pa in _unique_list(percentile_amounts):
                    data.append(brtc_stats.percentile(tmp_table[i],pa))
            elif 'trimmed_mean' == st and trimmed_mean_amounts is not None:
                for ta in _unique_list(trimmed_mean_amounts):
                    data.append(brtc_stats.trimmed_mean(tmp_table[i],ta))
        result.append(data)
    return {'out_table' : result}


def statistic_derivation(table, group_by=None, **params):
    check_required_parameters(_statistic_derivation, params, ['table'])
    params = get_default_from_parameters_if_required(params,_statistic_derivation)
    param_validation_check = [all_elements_from_to(params, 0, 100, 'percentile_amounts'),
                              all_elements_from_under(params, 0, 0.5, 'trimmed_mean_amounts')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_statistic_derivation, table, group_by=group_by, **params)
    else:
        return _statistic_derivation(table, **params)


def _statistic_derivation(table, input_cols, statistics, percentile_amounts=[], trimmed_mean_amounts=[]):
    
    _table = table.copy()
    
    _table_stat = _statistic_summary(_table, input_cols, statistics, percentile_amounts, trimmed_mean_amounts)['out_table']
    
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
        col_mode.append(brtc_stats.mode(coldata))
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
