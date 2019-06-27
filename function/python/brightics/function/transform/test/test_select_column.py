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
from brightics.function.transform import select_column
# from brightics.function.test_data import load_iris 

df_example1 = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                            'num2':[10, 20, 30, 40, 50],
                            'str1':['a', 'b', 'c', 'd', 'e']}) 

df_example2 = pd.DataFrame({'num1':[1, 2, 3, 4, 5, 6],
                            'num2':[10, 20, 30, np.nan, 50, 60],
                            'num3':[10.0, np.nan, np.nan, 40.0, 50.0, 60.0],
                            'str1':['a', 'b', 'c', 'd', 'e', 'f']}) 


class TestSelectColumn(unittest.TestCase):
    
    def test_select_column1(self):
        df = df_example1.copy() 
        out_df = select_column(table=df, input_cols=['num2', 'str1'])['out_table']
        print(df)
        print(out_df)
        
    def test_select_column2(self):
        df = df_example1.copy() 
        out_df = select_column(table=df, input_cols=['num2'], output_cols=['num22'], output_types=['double'])['out_table']
        print(df)
        print(df.dtypes)
        print(out_df)
        print(out_df.dtypes)
        
    def test_select_column3(self):
        df = df_example1.copy() 
        out_df = select_column(table=df, input_cols=['num1', 'num2', 'str1'], output_cols=['num11', 'num22'], output_types=['int', 'string', 'double'])['out_table']
        print(df)
        print(df.dtypes)
        print(out_df)
        print(out_df.dtypes)

        
if __name__ == '__main__':
    unittest.main()
