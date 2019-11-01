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
from brightics.function.extraction import add_row_number, discretize_quantile, capitalize_variable, binarizer
from brightics.function.extraction import add_expression_column, add_expression_column_if
from brightics.common.datasets import load_iris
import HtmlTestRunner
import os


class TestAddRowNumber(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        df_res = add_row_number(table=df_iris, new_col='add_row_number')['out_table']
        
        self.assertListEqual(list(range(10)), df_res['add_row_number'].tolist()[:10], 'incorrect row index')


class TestDiscretizeQuantile(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        res = discretize_quantile(table=df_iris, input_col='sepal_length',
                                     num_of_buckets=2, out_col_name='bucket_number')
        df_res = res['out_table']
        model_res = res['model']
        
        self.assertListEqual([0, 1, 1, 1, 0, 1, 0, 1, 0, 1], df_res['bucket_number'].tolist()[49:59], 'incorrect quantization') 
        self.assertListEqual([0, 1], list(model_res['result']['bucket number']), 'incorrect bucket number')      
        self.assertListEqual(['[4.3, 5.8]', '(5.8, 7.9]'], list(model_res['result']['buckets']), 'incorrect buckets') 
        self.assertListEqual([80, 70], list(model_res['result']['count']), 'incorrect count')  

        
class TestCapitalizeVariable(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        df_res = capitalize_variable(table=df_iris, input_cols=['species'], replace='upper', out_col_suffix=None)['out_table']
        
        self.assertEqual('SETOSA', df_res['species_upper'].values[0], 'setosa: incorrect uppercase')
        self.assertEqual('VERSICOLOR', df_res['species_upper'].values[50], 'versicolor: incorrect uppercase')
        self.assertEqual('VIRGINICA', df_res['species_upper'].values[100], 'virginica: incorrect uppercase')
        
    def test_optional(self):
        df_iris = load_iris()
        df_res = capitalize_variable(table=df_iris, input_cols=['species'], replace='lower', out_col_suffix=None)['out_table']
        
        self.assertEqual('setosa', df_res['species_lower'].values[0], 'setosa: incorrect lowercase')
        self.assertEqual('versicolor', df_res['species_lower'].values[50], 'versicolor: incorrect lowercase')
        self.assertEqual('virginica', df_res['species_lower'].values[100], 'virginica: incorrect lowercase')

        
class TestBinarizer(unittest.TestCase):

    def setUp(self):
        print("*** Binarizer UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Binarizer UnitTest End ***")

    def test_first(self):
        
        bin = binarizer(self.testdata, column=['sepal_length'], threshold=5.1)
        DF1 = bin['out_table'].values
        # print(DF1)
        np.testing.assert_equal(DF1[0][5], 0)
        np.testing.assert_equal(DF1[1][5], 0)
        np.testing.assert_equal(DF1[2][5], 0)
        np.testing.assert_equal(DF1[3][5], 0)
        np.testing.assert_equal(DF1[4][5], 0)
        np.testing.assert_equal(DF1[5][5], 1)
        
    def test_second(self):
        
        bin = binarizer(self.testdata, column=['sepal_width'], threshold=3.4, threshold_type='abc', out_col_name='result')
        DF2 = bin['out_table'].values
        # print(DF2)
        np.testing.assert_equal(DF2[0][5], 1)
        np.testing.assert_equal(DF2[1][5], 0)
        np.testing.assert_equal(DF2[2][5], 0)
        np.testing.assert_equal(DF2[3][5], 0)
        np.testing.assert_equal(DF2[4][5], 1)


class AddFunctionColumnTest(unittest.TestCase):
    
    def setUp(self):
        self.example_df = pd.DataFrame({'num1':[1, 2, 3, 4, 5],
                                        'num2':[10, 20, 30, 40, 50],
                                        'str1':['a', 'b', 'c', 'd', 'e']})
        
    def test1(self):
        out = add_expression_column(self.example_df, ['num3', 'num4'], ['log(num1)', 'sqrt(num3)'], expr_type='python')
    
    def test4(self):
        df = self.example_df
        out = add_expression_column(self.example_df, ['str2', 'num3', 'str3', 'num4'],
                                    [''' str1 || '_a' ''',
                                     ''' case when num1 > 2 then 100 else 0 end''',
                                     ''' cast(num1 as char)''',
                                     ''' cast(num1 as float)'''], expr_type='sqlite')['out_table']
    
    def test6(self):
        df = self.example_df
        out = add_expression_column(df, ['str10'], ['str1 || 100'])
        
    def test7(self):
        out = add_expression_column(self.example_df,
                                    ['new_num1', 'new_num2', 'new_num3', 'new_num4',
                                     'new_num5', 'new_num6', 'new_num7',
                                     'new_str1', 'new_str2'],
                                    ['log(num1)', 'exp(num1)', 'sin(num1)', 'cos(num1)',
                                     'sqrt(num1)', 'arctan(num1)', 'num1 in [1,3,5]',
                                     '''str1 in ['a', 'c']''', '''str1 in ['a', 'c'] & str1 in ['b', 'c']'''], expr_type='python')

"""
class AddFunctionColumnIfTest(unittest.TestCase):
    
    def test2(self):
        # df = df_iris.copy().query(''' species != 'setosa' ''')
        df = load_iris()
        out = add_expression_column_if(df,
                                     'encoded_species',
                                     ['''species == 'setosa' ''', '''species == 'virginica' '''],
                                     [1.0, 2.0],
                                     0.0)['out_table']
        
    def test3(self):
        # df = df_iris.copy().query(''' species != 'setosa' ''')
        df = load_iris()
        out = add_expression_column_if(df,
                                     'encoded_species',
                                     ['''species == 'setosa' ''', '''species == 'virginica' '''],
                                     ['1.0', '2.0'],
                                     '0.0')['out_table']
"""

if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
