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
from brightics.function.transform import delete_missing_data, select_column, pivot
from brightics.function.test_data import load_iris 

df_example1 = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                            'num2':[10, 20, 30, 40, 50],
                            'str1':['a', 'b', 'c', 'd', 'e']}) 

df_example2 = pd.DataFrame({'num1':[1, 2, 3, 4, 5, 6],
                            'num2':[10, 20, 30, np.nan, 50, 60],
                            'num3':[10.0, np.nan, np.nan, 40.0, 50.0, 60.0],
                            'str1':['a', 'b', 'c', 'd', 'e', 'f']}) 


class DeleteMissingDataTest(unittest.TestCase):

    def setUp(self):
        self.input_df = pd.DataFrame({"name": ['Alfred', 'Batman', 'Catwoman', None],
                                      "toy": [np.nan, 'Batmobile', 'Bullwhip', 'G'],
                                      "born": [pd.NaT, pd.Timestamp("1940-04-25"), pd.NaT, pd.Timestamp("1944-02-27")]})
        self.example_df = pd.DataFrame({"string1":['A', 'A', None, 'A', None],
                                        "string2":['A', None, 'A', None, None],
                                        "number1":[1.1, 1.1, np.nan, np.nan, np.nan],
                                        "number2":[1.1, 1.1, 1.1, np.nan, np.nan]})
    
    def test1(self):
        # out = df.dropna()
        out = self.input_df.dropna(subset=['born'])
        print(out)
        
    def test2(self):
        print(self.input_df)
        out = delete_missing_data(self.input_df, input_cols=['born', 'name'])
        print(out['out_table'])
        
    def test3(self):
        print(self.input_df)
        out = delete_missing_data(self.input_df, input_cols=['born', 'name'], how='all')
        print(out['out_table'])
        
    def test4(self):
        print(self.input_df)
        out = delete_missing_data(self.input_df, input_cols=[], thresh=2)
        print(out['out_table'])
        
    def test_example1(self):
        print(self.example_df)


class SelectColumnTest(unittest.TestCase):
    
    def test1(self):
        df = df_example1.copy() 
        out_df = select_column(df, ['num2', 'str1'])['out_table']
        print(df)
        print(out_df)
        
    def test2(self):
        df = df_example1.copy() 
        out_df = select_column(df, ['num2'], ['num22'], ['double'])['out_table']
        print(df)
        print(df.dtypes)
        print(out_df)
        print(out_df.dtypes)
        
    def test3(self):
        df = df_example1.copy() 
        out_df = select_column(df, ['num1', 'num2', 'str1'], ['num11', 'num22'], ['int', 'string', 'double'])['out_table']
        print(df)
        print(df.dtypes)
        print(out_df)
        print(out_df.dtypes)

        
class Pivot(unittest.TestCase):
    
    def setUp(self):
        unittest.TestCase.setUp(self)
        self.iris = load_iris()
    
    def test1(self):
        out = pivot(self.iris, values=['petal_length'], aggfunc=['25th', '75th'], index=['species'])
        print(out['out_table'])
    
    def test2(self):
        out = pivot(self.iris, values=['petal_length'], aggfunc=['mean'], index=['species'])
        print(out['out_table'])  
    
    def test3(self):
        print(self.iris)
          
