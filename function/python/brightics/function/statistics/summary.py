import pandas as pd
import brightics.common.statistics as brtc_stats
import numpy as np
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def statistic_summary(table, group_by=None, **params):
    check_required_parameters(_statistic_summary, params, ['table'])
    if group_by is not None:
        return _function_by_group(_statistic_summary, table, group_by=group_by, **params)
    else:
        return _statistic_summary(table, **params)


def _statistic_summary(table, input_cols, statistics, percentile_amounts=[], trimmed_mean_amounts=[]):
    
    _table = table.copy()
    
    percentile_amounts = np.unique(percentile_amounts)
    trimmed_mean_amounts = np.unique(trimmed_mean_amounts)
     
    def _amounts_colname(a): return str(a).replace('.', '_')
    
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
            data['nrow'] = [brtc_stats.num_row(_table[x]) for x in input_cols]
        if 'num_of_value' == st:
            data['num_of_value'] = [brtc_stats.num_value(_table[x]) for x in input_cols]
    #     if 'nan_count' == st:
    #         data['nan_count'] = [brtc_stats.num_nan(_table[x]) for x in input_cols]
        if 'null_count' == st:
            data['null_count'] = [brtc_stats.num_null(_table[x]) for x in input_cols]
        if 'mode' == st:
            data['mode'] = [brtc_stats.mode(_table[x]) for x in input_cols]
        if 'median' == st:
            data['median'] = [brtc_stats.median(_table[x]) for x in input_cols]
        if 'q1' == st:
            data['q1'] = [brtc_stats.q1(_table[x]) for x in input_cols]
        if 'q3' == st:
            data['q3'] = [brtc_stats.q3(_table[x]) for x in input_cols]
        if 'iqr' == st:
            data['iqr'] = [brtc_stats.iqr(_table[x]) for x in input_cols]
        if 'percentile' == st:
            for pa in percentile_amounts:
                pa_colname = 'percentile_{}'.format(_amounts_colname(pa))
                data[pa_colname] = [brtc_stats.percentile(_table[x], pa) for x in input_cols]
        if 'trimmed_mean' == st:
            for ta in trimmed_mean_amounts:
                ta_colname = 'trimmed_mean_{}'.format(_amounts_colname(ta))
                data[ta_colname] = [brtc_stats.trimmed_mean(_table[x], ta) for x in input_cols]
            
    result = pd.DataFrame(data)
    
    return {'out_table' : result}


def statistic_derivation(table, input_cols, statistics, percentile_amounts=[], trimmed_mean_amounts=[]):
    
    _table = table.copy()
    
    _table_stat = statistic_summary(_table, input_cols, statistics, percentile_amounts, trimmed_mean_amounts)['out_table']
    
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
        col_num_of_space_padded.append(np.count_nonzero([x and len(str(x)) != len(str(x).strip()) for x in coldata]))
    
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
