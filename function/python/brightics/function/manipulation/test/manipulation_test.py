import unittest
import pandas as pd
import numpy as np
from brightics.function.manipulation import filter, sort, replace_missing_number, replace_missing_string, simple_filter
from brightics.function.test_data import get_iris

df_example1 = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                            'num2':[10, 20, 30, 40, 50],
                            'str1':['a', 'b', 'c', 'd', 'e']}) 

df_example2 = pd.DataFrame({'num1':[1, 2, 3, 4, 5, 6],
                            'num2':[10, 20, 30, np.nan, 50, 60],
                            'num3':[10.0, np.nan, np.nan, 40.0, 50.0, 60.0],
                            'str1':['a', 'b', 'c', 'd', 'e', 'f'],
                            'grp':['a', 'a', 'a', 'b', 'b', 'b']}) 

        
class ManipulationTest(unittest.TestCase):

    def filter_test1(self):
        df = df_example1.copy() 
        out_df = filter(df, 'num1 > 1 & num2 != 40')['out_table']
        print(df)
        print(out_df)
        
    def simple_filter_test1(self):
        df = df_example1.copy()
        out_df = simple_filter(df, ['num1', 'num2', 'str1'], ['>', 'not in', 'in'], ['1', '''[40]''', '''['b','e']'''], 'and')['out_table']
        print(df)
        print(out_df)
        
    def simple_filter_test2(self):
        df = df_example1.copy()
        out_df = simple_filter(df, [], [], [], 'and')['out_table']
        print(df)
        print(out_df)

        
class SortTest(unittest.TestCase):
    
    def test1(self):
        df = get_iris()
        out_df = sort(df, input_cols=['species', 'petal_length'], is_asc=['desc', 'asc'])['out_table']
        print(df)
        print(out_df)
        
    def test2(self):
        df = get_iris()
        out_df = sort(df, input_cols=[], is_asc=['desc'])['out_table']
        print(df)
        print(out_df)


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
        out = replace_missing_number(table=df_example2, group_by=['grp'], fill_method='ffill')
        print(out['out_table'])
