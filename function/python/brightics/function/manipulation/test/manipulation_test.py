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


import unittest
import pandas as pd
import numpy as np
from brightics.function.manipulation import filter, sort, replace_missing_number, replace_missing_string, simple_filter
from brightics.common.datasets import load_iris
from brightics.common.exception import BrighticsFunctionException
import HtmlTestRunner
import os


df_example1 = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                            'num2':[10, 20, 30, 40, 50],
                            'str1':['a', 'b', 'c', 'd', 'e']})

df_example2 = pd.DataFrame({'num1':[1, 2, 3, 4, 5, 6],
                            'num2':[10, 20, 30, np.nan, 50, 60],
                            'num3':[10.0, np.nan, np.nan, 40.0, 50.0, 60.0],
                            'str1':['a', 'b', 'c', 'd', 'e', 'f'],
                            'grp':['a', 'a', 'a', 'b', 'b', 'b']})


class ManipulationTest(unittest.TestCase):

    def test_filter(self):
        df = df_example1.copy()
        out_df = filter(df, 'num1 > 1 & num2 != 40')['out_table']

    def test_simple_filter_1(self):
        df = df_example1.copy()
        out_df = simple_filter(df, ['num1', 'num2', 'str1'], ['>', 'not in', 'in'], ['1', '''[40]''', '''['b','e']'''], 'and')['out_table']

    def test_simple_filter_2(self):
        df = df_example1.copy()
        with self.assertRaises(BrighticsFunctionException) as bfe:
            out_df = simple_filter(table=df, input_cols=[], operators=[], operands=[], main_operator='and')['out_table']
        self.assertTrue({'0033': ['input_cols']} in bfe.exception.errors)


class SortTest(unittest.TestCase):

    def setUp(self):
        print("*** Sort UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Sort UnitTest End ***")
        
    def test_first(self):
        
        st = sort(self.testdata, input_cols = ['sepal_length', 'sepal_width'], is_asc=True)
        DF1 = st['out_table'].values
        # print(DF1)
        np.testing.assert_array_equal(DF1[0][0:4], [4.3, 3.0, 1.1, 0.1])
        np.testing.assert_array_equal(DF1[1][0:4], [4.4, 2.9, 1.4, 0.2])
        np.testing.assert_array_equal(DF1[2][0:4], [4.4, 3.0, 1.3, 0.2])
        np.testing.assert_array_equal(DF1[3][0:4], [4.4, 3.2, 1.3, 0.2])
        np.testing.assert_array_equal(DF1[4][0:4], [4.5, 2.3, 1.3, 0.3])
        
    def test_second(self):
        
        st = sort(self.testdata, input_cols = ['petal_length', 'species'], is_asc=False)
        DF2 = st['out_table'].values
        # print(DF2)
        np.testing.assert_array_equal(DF2[0][0:4], [7.7, 2.6, 6.9, 2.3])
        np.testing.assert_array_equal(DF2[1][0:4], [7.7, 3.8, 6.7, 2.2])
        np.testing.assert_array_equal(DF2[2][0:4], [7.7, 2.8, 6.7, 2.0])
        np.testing.assert_array_equal(DF2[3][0:4], [7.6, 3.0, 6.6, 2.1])
        np.testing.assert_array_equal(DF2[4][0:4], [7.9, 3.8, 6.4, 2.0])

'''
    def test_default(self):
        df = load_iris()
        out_df = sort(df, input_cols=['species', 'petal_length'], is_asc=['desc', 'asc'])['out_table']
        print(df)
        print(out_df)

    def test_validation(self):
        df = load_iris()
        with self.assertRaises(BrighticsFunctionException) as bfe:
            out_df = sort(df, input_cols=[], is_asc=['desc'])['out_table']
            
        test_errors = bfe.exception.errors
        self.assertTrue({'0033': ['input_cols']} in test_errors)
'''


class ReplaceMissingNumber(unittest.TestCase):

    def setUp(self):
        print("*** Replace Missing Number UnitTest Start ***")
        self.input_df = pd.DataFrame([[np.nan, 2, np.nan, 0 , 'A'],
                                      [3, 4, np.nan, 1, 'B'],
                                      [np.nan, np.nan, np.nan, 5, 'C'],
                                      [np.nan, 3, np.nan, 4, None]],
                                      columns=list('ABCDE'))

    def tearDown(self):
        print("*** Replace Missing Number UnitTest End ***")

    def test(self):
        input_table = self.input_df
        input_cols = ['A', 'B', 'E']
        target_number = 1230
        func = replace_missing_number(table=input_table, input_cols=input_cols, fill_value_to=target_number, limit=1)
        np.testing.assert_almost_equal(func['out_table']['A'].values, np.array([1230.0, 3.0, np.nan, np.nan]),10)
        np.testing.assert_almost_equal(func['out_table']['B'].values, np.array([2.0, 4.0, 1230.0, 3.0]),10)
        np.testing.assert_almost_equal(func['out_table']['C'].values, np.array([np.nan, np.nan, np.nan, np.nan]),10)
        np.testing.assert_almost_equal(func['out_table']['D'].values, np.array([0,1,5,4]),10)
        np.testing.assert_equal(func['out_table']['E'].values, np.array(['A','B','C',None]),10)
        


class ReplaceMissingString(unittest.TestCase):

    def setUp(self):
        print("*** Replace Missing String UnitTest Start ***")
        self.input_df = pd.DataFrame([[np.nan, 2, np.nan, 0 , 'A'],
                                      [3, 4, np.nan, 1, 'B'],
                                      [np.nan, np.nan, np.nan, 5, 'C'],
                                      [np.nan, 3, np.nan, 4, None]],
                                      columns=list('ABCDE'))

    def tearDown(self):
        print("*** Replace Missing String UnitTest End ***")

    def test(self):
        input_table = self.input_df
        input_cols = ['A', 'B', 'E']
        target_string = 'null'
        func = replace_missing_string(table=input_table, input_cols=input_cols, fill_string=target_string, limit=1)
        np.testing.assert_almost_equal(func['out_table']['A'].values, np.array([np.nan, 3.0, np.nan, np.nan]),10)
        np.testing.assert_almost_equal(func['out_table']['B'].values, np.array([2.0, 4.0, np.nan, 3.0]),10)
        np.testing.assert_almost_equal(func['out_table']['C'].values, np.array([np.nan, np.nan, np.nan, np.nan]),10)
        np.testing.assert_almost_equal(func['out_table']['D'].values, np.array([0,1,5,4]),10)
        np.testing.assert_equal(func['out_table']['E'].values, np.array(['A','B','C','null']),10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
