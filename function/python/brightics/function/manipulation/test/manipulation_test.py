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
        print(df)
        print(out_df)

    def test_simple_filter_1(self):
        df = df_example1.copy()
        out_df = simple_filter(df, ['num1', 'num2', 'str1'], ['>', 'not in', 'in'], ['1', '''[40]''', '''['b','e']'''], 'and')['out_table']
        print(df)
        print(out_df)

    def test_simple_filter_2(self):
        df = df_example1.copy()
        with self.assertRaises(BrighticsFunctionException) as bfe:
            out_df = simple_filter(table=df, input_cols=[], operators=[], operands=[], main_operator='and')['out_table']
        self.assertTrue({'0033': ['input_cols']} in bfe.exception.errors)


class SortTest(unittest.TestCase):

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


class ReplaceMissingDataTest(unittest.TestCase):

    def setUp(self):
        self.input_df = pd.DataFrame([[np.nan, 2, np.nan, 0 , 'A'],
                                      [3, 4, np.nan, 1, 'B'],
                                      [np.nan, np.nan, np.nan, 5, 'C'],
                                      [np.nan, 3, np.nan, 4, None]],
                                      columns=list('ABCDE'))

    def test1(self):
        print(self.input_df)
        out1 = self.input_df.fillna(0)
        print(out1)
        out2 = self.input_df.fillna(method='ffill')
        print(out2)
        values = {'A': 0, 'B': 1, 'D': 3}
        out3 = self.input_df.fillna(value=values)
        print(out3)
        out4 = self.input_df.fillna(value=values, limit=1)
        print(out4)

    def test2(self):
        input_cols = ['A', 'B']
        input_cols_formula = {x:0.0 for x in input_cols}
        out = self.input_df.fillna(value=input_cols_formula)
        pd.DataFrame.query
        print(self.input_df)
        print(out)

    def test3(self):
        input_table = self.input_df
        input_cols = ['A', 'B', 'E']
        target_number = 1230
        target_string = 'null'
        func = replace_missing_number(table=input_table, input_cols=input_cols, fill_value_to=target_number, limit=1)
        print(func['out_table'])
        print(func['out_table'].dtypes)
        func = replace_missing_string(table=input_table, input_cols=input_cols, fill_string=target_string, limit=1)
        print(func['out_table'])
        print(func['out_table'].dtypes)

    def test_temp(self):
        d = df_example2['num2']
        out1 = replace_missing_number(table=df_example2, input_cols=['num2'], fill_value='mean')
        print(out1['out_table'])
        out2 = replace_missing_number(table=df_example2, input_cols=['num2', 'num3'], fill_value='median')
        print(out2['out_table'])
        out3 = replace_missing_number(table=df_example2, input_cols=[], fill_method='ffill')
        print(out3['out_table'])
        out4 = replace_missing_number(table=df_example2, input_cols=None, fill_method='bfill')
        print(out4['out_table'])

    def test_validation(self):
        out = replace_missing_number(table=df_example2, group_by=['grp'], input_cols=['num2'], fill_method='ffill')
        print(out['out_table'])
        with self.assertRaises(BrighticsFunctionException) as bfe:
            out = replace_missing_number(table=df_example2, group_by=['grp'], fill_method='ffill')

        test_errors = bfe.exception.errors
        self.assertTrue({'0033':['input_cols']} in test_errors)

