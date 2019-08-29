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

from brightics.function.statistics.summary import statistic_summary, \
    statistic_derivation, string_summary
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import random


class StatisticSummary(unittest.TestCase):
    
    def setUp(self):
        print("*** Statistic Summary UnitTest Start ***")
        d1 = [2.0, 3.0, 5.0, 7.0, 11.0, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 47.0]
        d2 = [2.5, 3.0, 5.0, 7.0, np.nan, 13.0, 17.0, 19.0, 23.0, 29.0, 31.0, 37.0, 43.0, 46.5]
        d3 = [i % 2 for i in range(14)]
        t1 = pd.DataFrame({'d1':d1, 'd2':d2, 'd3': d3})
        self.testdata = t1

    def tearDown(self):
        print("*** Statistic Summary UnitTest End ***")
    
    def test(self):
        stats = ['max', 'min', 'range', 'sum', 'avg', 'variance',
                  'stddev', 'skewness', 'kurtosis', 'nrow', 'num_of_value', 'null_count',
                  'median', 'q1', 'q3', 'iqr', 'percentile', 'trimmed_mean']
        pa_list = [0.25, 0.25]
        ta_list = [0.20, 0.20]
        out = statistic_summary(self.testdata, input_cols=['d1', 'd2'], statistics=stats, percentile_amounts=pa_list, trimmed_mean_amounts=ta_list, group_by = ['d3'])
        np.testing.assert_array_almost_equal(list(out['out_table'].values[0][2:]), [43.0, 2.0, 41.0, 132.0, 18.857142857142858, 214.80952380952385, 14.65638167521315, 0.456945126469852, -0.9637153614645078, 7, 7, 0, 17.0, 8.0, 27.0, 19.0, 2.045, 17.4], 10)
        np.testing.assert_array_almost_equal(list(out['out_table'].values[1][2:]), [43.0, 2.5, 40.5, 121.5, 20.25, 239.775, 15.484669838262617, np.nan, np.nan, 7, 6, 1, 20.0, np.nan, np.nan, np.nan, np.nan, 23.8], 10)
        np.testing.assert_array_almost_equal(list(out['out_table'].values[2][2:]), [47.0, 3.0, 44.0, 155.0, 22.142857142857142, 262.4761904761905, 16.201116951500303, 0.325040658885993, -1.2313300865139738, 7, 7, 0, 19.0, 10.0, 33.0, 23.0, 3.06, 21.0], 10)
        np.testing.assert_array_almost_equal(list(out['out_table'].values[3][2:]), [46.5, 3.0, 43.5, 154.5, 22.071428571428573, 258.36904761904765, 16.073862249597873, 0.307849200412774, -1.2556904973476417, 7, 7, 0, 19.0, 10.0, 33.0, 23.0, 3.06, 21.0], 10)


class TestStatisticDerivation(unittest.TestCase):

    def setUp(self):
        print("*** Statistic Derivation UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Statistic Derivation UnitTest End ***")

    def test_first(self):
        
        sd = statistic_derivation(self.testdata, input_cols=['sepal_length'], statistics=['max'])
        DF1 = sd['out_table'].values
        # print(DF1)
        np.testing.assert_almost_equal(DF1[0][5], 7.9, 10)
        np.testing.assert_almost_equal(DF1[1][5], 7.9, 10)
        np.testing.assert_almost_equal(DF1[2][5], 7.9, 10)
        np.testing.assert_almost_equal(DF1[3][5], 7.9, 10)
        np.testing.assert_almost_equal(DF1[4][5], 7.9, 10)
        
    def test_second(self):
        
        sd = statistic_derivation(self.testdata, input_cols=['petal_width'], statistics=['sum', 'variance', 'trimmed_mean'], trimmed_mean_amounts=[0.2])
        DF2 = sd['out_table'].values
        # print(DF2)
        np.testing.assert_array_almost_equal(DF2[0][5:8], [179.8, 0.5824143176733784, 1.2022222222222223], 10)
        np.testing.assert_array_almost_equal(DF2[1][5:8], [179.8, 0.5824143176733784, 1.2022222222222223], 10)
        np.testing.assert_array_almost_equal(DF2[2][5:8], [179.8, 0.5824143176733784, 1.2022222222222223], 10)
        np.testing.assert_array_almost_equal(DF2[3][5:8], [179.8, 0.5824143176733784, 1.2022222222222223], 10)
        np.testing.assert_array_almost_equal(DF2[4][5:8], [179.8, 0.5824143176733784, 1.2022222222222223], 10)
        
        
class StringSummary(unittest.TestCase):
    
    def setUp(self):
        print("*** String Summary UnitTest Start ***")
        t = pd.DataFrame({'s1': ['a', 'a', 'b', 'b', 'b', None, None, None, None, '', 'e', 'Z'],
                          's2': ['A', 'B', 'A', 'A', 'A', 'a', 'B', None, None, '    ', 'a', 'Z']})
        self.testdata = t

    def tearDown(self):
        print("*** String Summary UnitTest End ***")
    
    def test(self):
        t = self.testdata
        
        out = string_summary(t, input_cols=['s1', 's2'])
        np.testing.assert_array_equal(out['summary_table']['column_name'],['s1', 's2'])
        np.testing.assert_array_equal(out['summary_table']['max'],['e', 'a'])
        np.testing.assert_array_equal(out['summary_table']['min'],['', '    '])
        self.assertListEqual(out['summary_table']['mode'].tolist(),[['b'],['A']])
        np.testing.assert_array_equal(out['summary_table']['num_of_row'],[12, 12])
        np.testing.assert_array_equal(out['summary_table']['null_count'],[4, 2])
        np.testing.assert_array_equal(out['summary_table']['num_of_distinct'],[4, 5])
        np.testing.assert_array_equal(out['summary_table']['num_of_white_space'],[5, 3])
        np.testing.assert_array_equal(out['summary_table']['num_of_space_padded'],[0, 1])
        np.testing.assert_array_equal(out['count_table']['column_name'][:5],['s1', 's1', 's1', 's1', 's1'])
        np.testing.assert_array_equal(out['count_table']['value'][:5],['', 'Z', 'a', 'b', 'e'])
        np.testing.assert_array_equal(out['count_table']['counts'][:5],[1, 1, 2, 3, 1])
        np.testing.assert_array_almost_equal(out['count_table']['rate'][:5],[0.08333333333333333, 0.08333333333333333, 0.16666666666666666, 0.25, 0.08333333333333333],10)
        np.testing.assert_array_almost_equal(out['count_table']['cumulative_rate'][:5],[0.08333333333333333, 0.16666666666666666, 0.3333333333333333, 0.5833333333333333, 0.6666666666666666],10)

        
        
"""

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
"""     
