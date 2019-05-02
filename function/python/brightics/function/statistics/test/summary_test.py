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
import unittest
import random
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
        out1 = statistic_summary(t1, input_cols=['d1', 'd2'], statistics=stats1)
        print(out1['out_table'])
        out2 = statistic_summary(t1, input_cols=['d1', 'd2'], statistics=stats2, percentile_amounts=pa_list, trimmed_mean_amounts=ta_list)
        print(out2['out_table'])
        out3 = statistic_summary(t1, input_cols=['d1', 'd2'], statistics=stats3, percentile_amounts=[0.25, 0.75], trimmed_mean_amounts=[0.15, 0.45])
        print(out3['out_table'])
        print(out3['out_table'].columns.values)
        
        d_out1 = statistic_derivation(t1, input_cols=['d1', 'd2'], statistics=stats1)
        print(d_out1['out_table'])
        print(d_out1['out_table'].columns.values)
        
        d_out2 = statistic_derivation(t1, input_cols=['d1', 'd2'], statistics=stats2, percentile_amounts=pa_list, trimmed_mean_amounts=ta_list)
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
        out1 = statistic_summary(t1, input_cols=input_cols, statistics=['max', 'min'])
        print(out1['out_table'])

    def test_summary3(self):
        d1 = [random.random() * 100 for _ in range(20)]
        d2 = d1.copy()
        d2[0] = None
        table1 = pd.DataFrame({'d1':d1, 'd2':d2})
        
        input_cols = ['d1', 'd2']
        outtable1 = statistic_summary(table1, input_cols=input_cols, statistics=['avg', 'percentile', 'trimmed_mean'], 
                                      percentile_amounts=[0.5, None], trimmed_mean_amounts=[0.1, None, 0.2])['out_table']
        print(outtable1)
        
    def test_string(self):
        t = pd.DataFrame({'s1': ['a', 'a', 'b', 'b', 'b', None, None, None, None, 'e']})
        print(t)
        
        out1 = string_summary(t, input_cols=['s1'])['summary_table']
        print(out1)
        print(out1['mode'])
        
    def test_string3(self):
        t = pd.DataFrame({'s1': ['a', 'a', 'b', 'b', 'b', None, None, None, None, '', 'e', 'Z'],
                          's2': ['A', 'B', 'A', 'A', 'A', 'a', 'B', None, None, '    ', 'a', 'Z']})
        
        out = string_summary(t, input_cols=['s1', 's2'])
        
        print(out['summary_table'])
        print(out['summary_table']['num_of_white_space'])
        print(out['summary_table']['num_of_space_padded'])
        print(out['count_table'])
        
    def test_deriv1(self):
        d = {
          'd1':[2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0],
          'd2':[2.7, 3.7, 5.7, 7.7, 11.7, 13.7, 17.7, 19.7],
          'd3':[2.7, 3.7, None, 7.7, np.nan, 13.7, 17.7, 19.7],
        }
        df = pd.DataFrame(d)
        
        # out = statistic_derivation(df, ['d1','d2','d3'], ['min', 'max', 'mode', 'percentile'], [0.1, 0.75], [0.1, 0.3])['out_table']
        out = statistic_derivation(df, input_cols=['d1', 'd2', 'd3'], statistics=['min', 'mode'], percentile_amounts=[0.1, 0.75], trimmed_mean_amounts=[0.1, 0.3])['out_table']
        print(out)
        
