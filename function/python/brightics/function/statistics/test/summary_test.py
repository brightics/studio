import pandas as pd
import numpy as np
import unittest
from brightics.function.statistics.summary import statistic_summary, \
    statistic_derivation, string_summary


class SummaryTest(unittest.TestCase):
    
    def test(self):
        d1 = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 47.0]
        d2 = [2.5, 3.0, 5.0, 7.0, None, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 46.5]
        t1 = pd.DataFrame({'d1':d1, 'd2':d2})
        print(t1)
        
        stats1 = ['sum', 'avg', 'variance', 'std', 'max', 'min', 'range']
        stats2 = ['q1', 'percentile', 'trimmed_mean']
        stats3 = ['max', 'min', 'range', 'sum', 'avg', 'variance',
                  'stddev', 'skewness', 'kurtosis', 'nrow', 'num_of_value', 'null_count',
                  'mode', 'median', 'q1', 'q3', 'iqr', 'percentile', 'trimmed_mean']
        pa_list = [0.25, 0.25]
        ta_list = [0.20, 0.20]
        out1 = statistic_summary(t1, ['d1', 'd2'], stats1)
        print(out1['out_table'])
        out2 = statistic_summary(t1, ['d1', 'd2'], stats2, pa_list, ta_list)
        print(out2['out_table'])
        out3 = statistic_summary(t1, ['d1', 'd2'], stats3, percentile_amounts=[0.25, 0.75], trimmed_mean_amounts=[0.15, 0.45])
        print(out3['out_table'])
        print(out3['out_table'].columns.values)
        
        d_out1 = statistic_derivation(t1, ['d1', 'd2'], stats1)
        print(d_out1['out_table'])
        print(d_out1['out_table'].columns.values)
        
        d_out2 = statistic_derivation(t1, ['d1', 'd2'], stats2, pa_list, ta_list)
        print(d_out2['out_table'])
        print(d_out2['out_table'].columns.values)
    
    def test_summary2(self):
        d1 = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 47.0]
        d2 = [2.5, 3.0, 5.0, 7.0, None, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 46.5]
        d3 = [2.0, 3.0, 5.0, 7.0, None, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 47.0]
        t1 = pd.DataFrame({'d1':d1, 'd2':d2, 'd3':d3})
        print(t1)
        
        input_cols = ['d2', 'd3']
        pa_list = [0.25, 0.25]
        ta_list = [0.20, 0.20]
        out1 = statistic_summary(t1, input_cols, ['max', 'min'])
        print(out1['out_table'])

    def test_string(self):
        t = pd.DataFrame({'s1': ['a', 'a', 'b', 'b', 'b', None, None, None, None, 'e']})
        print(t)
        
        out1 = string_summary(t, ['s1'])['out_table1']
        print(out1)
        print(out1['mode'])
        
    def test_string2(self):
        t = pd.DataFrame({'s1': ['a', 'a', 'b', 'b', 'b', None, None, None, None, 'e', 'Z'],
                          's2': ['A', 'B', 'A', 'A', 'A', 'a', 'B', None, None, 'a', 'Z']})
        print(t)
        input_cols = ['s1', 's2']
        
        t_list = []
        for c in input_cols:
            
            # value & counts
            out1 = t.groupby([c]).size().reset_index(name='counts').rename(columns={c:'value'})
            out_nullcount = pd.DataFrame([[None, np.count_nonzero([x is None for x in t[c]])]], columns=['value', 'counts'])
            out1 = out1.append(out_nullcount, ignore_index=True)
            
            # column_name
            out1['column_name'] = c
            
            # rate
            _sum = np.sum(out1['counts'])
            out1['rate'] = [x / _sum for x in out1['counts']]
            out1 = out1.sort_values(by='value')
            
            # cumulative rate
            out1['cumulative_rate'] = out1['rate'].cumsum()
            
            t_list.append(out1)
        
        out = pd.concat(t_list, ignore_index=True)[['column_name', 'value', 'counts', 'rate', 'cumulative_rate']]
        print(out)
        
    def test_string3(self):
        t = pd.DataFrame({'s1': ['a', 'a', 'b', 'b', 'b', None, None, None, None, '', 'e', 'Z'],
                          's2': ['A', 'B', 'A', 'A', 'A', 'a', 'B', None, None, '    ', 'a', 'Z']})
        
        out = string_summary(t, ['s1', 's2'])
        
        print(out['out_table1'])
        print(out['out_table1']['num_of_white_space'])
        print(out['out_table1']['num_of_space_padded'])
        print(out['out_table2'])
        
    def test_deriv1(self):
        d = {
          'd1':[2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0],
          'd2':[2.7, 3.7, 5.7, 7.7, 11.7, 13.7, 17.7, 19.7],
          'd3':[2.7, 3.7, None, 7.7, np.nan, 13.7, 17.7, 19.7],
        }
        df = pd.DataFrame(d)
        
        #out = statistic_derivation(df, ['d1','d2','d3'], ['min', 'max', 'mode', 'percentile'], [0.1, 0.75], [0.1, 0.3])['out_table']
        out = statistic_derivation(df, ['d1','d2','d3'], ['min', 'mode'], [0.1, 0.75], [0.1, 0.3])['out_table']
        print(out)
        
