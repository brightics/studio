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
from brightics.function.extraction import add_expression_column, add_expression_column_if
from brightics.common.datasets import load_iris

df_example1 = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                            'num2':[10, 20, 30, 40, 50],
                            'str1':['a', 'b', 'c', 'd', 'e']}) 


class AddFunctionColumnTest(unittest.TestCase):
    
    def setUp(self):
        self.example_df = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                                        'num2':[10, 20, 30, 40, 50],
                                        'str1':['a', 'b', 'c', 'd', 'e']})
        
    def test1(self):
        out = add_expression_column(self.example_df, ['num3', 'num4'], ['log(num1)', 'sqrt(num3)'], expr_type='python')
        print(out['out_table'])
    
    def test4(self):
        df = self.example_df
        print(df)
        out = add_expression_column(self.example_df, ['str2', 'num3', 'str3', 'num4'],
                                    [''' str1 || '_a' ''',
                                     ''' case when num1 > 2 then 100 else 0 end''',
                                     ''' cast(num1 as char)''',
                                     ''' cast(num1 as float)'''], expr_type='sqlite')['out_table']
        print(out)
        print(out.dtypes)
    
    def test6(self):
        df = self.example_df
        out = add_expression_column(df, ['str10'], ['str1 || 100'])
        print(out['out_table'])
        
    def test7(self):
        out = add_expression_column(self.example_df,
                                    ['new_num1', 'new_num2', 'new_num3', 'new_num4',
                                     'new_num5', 'new_num6', 'new_num7',
                                     'new_str1', 'new_str2'],
                                    ['log(num1)', 'exp(num1)', 'sin(num1)', 'cos(num1)',
                                     'sqrt(num1)', 'arctan(num1)', 'num1 in [1,3,5]',
                                     '''str1 in ['a', 'c']''', '''str1 in ['a', 'c'] & str1 in ['b', 'c']'''], expr_type='python')
        print(out['out_table'])
        
        
class AddFunctionColumnIfTest(unittest.TestCase):
    
    def test2(self):
        # df = df_iris.copy().query(''' species != 'setosa' ''')
        df = load_iris()
        print(df)
        out = add_expression_column_if(df,
                                     'encoded_species',
                                     ['''species == 'setosa' ''', '''species == 'virginica' '''],
                                     [1.0, 2.0],
                                     0.0)['out_table']
        print(out['encoded_species'][48:102])
        
    def test3(self):
        # df = df_iris.copy().query(''' species != 'setosa' ''')
        df = load_iris()
        print(df)
        out = add_expression_column_if(df,
                                     'encoded_species',
                                     ['''species == 'setosa' ''', '''species == 'virginica' '''],
                                     ['1.0', '2.0'],
                                     '0.0')['out_table']
        print(out['encoded_species'][48:102])
