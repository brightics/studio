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
import numpy as np
from brightics.function.transform.reshaping import unpivot, pivot2, transpose
from brightics.common.datasets import load_iris


class TestUnpivot(unittest.TestCase):
    
    def test_default(self):
        df_iris = load_iris()
        df_res = unpivot(table=df_iris, value_vars=['sepal_length', 'sepal_width'], var_name=None, value_name='value', col_level=None, id_vars=None)['out_table']
        
        self.assertListEqual([1.4, 0.2, 'setosa', 'sepal_length', 5.1], df_res.loc[0].tolist(), 'wrong result in the 1st row')
        self.assertListEqual([4.7, 1.4, 'versicolor', 'sepal_length', 7], df_res.loc[50].tolist(), 'wrong result in the 51st row')
        self.assertListEqual([6, 2.5, 'virginica', 'sepal_length', 6.3], df_res.loc[100].tolist(), 'wrong result in the 101st row')
        self.assertListEqual([1.4, 0.2, 'setosa', 'sepal_width', 3.5], df_res.loc[150].tolist(), 'wrong result in the 151st row')
        self.assertListEqual([4.7, 1.4, 'versicolor', 'sepal_width', 3.2], df_res.loc[200].tolist(), 'wrong result in the 201st row')
        self.assertListEqual([6, 2.5, 'virginica', 'sepal_width', 3.3], df_res.loc[250].tolist(), 'wrong result in the 251st row')
        
    def test_optional(self):
        df_iris = load_iris()
        df_res = unpivot(table=df_iris, value_vars=['sepal_length'], var_name=None, value_name='value', col_level=None, id_vars=['species'])['out_table']
        
        self.assertListEqual(['setosa', 'sepal_length', 5.1], df_res.loc[0].tolist(), 'wrong result in the 1st row')
        self.assertListEqual(['versicolor', 'sepal_length', 7], df_res.loc[50].tolist(), 'wrong result in the 51st row')
        self.assertListEqual(['virginica', 'sepal_length', 6.3], df_res.loc[100].tolist(), 'wrong result in the 101st row')

        
class TestPivot2(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        df_res = pivot2(table=df_iris, values=['sepal_length', 'sepal_width'], aggfunc=['mean', 'sum'], index=['species'], columns=None)['out_table']
        
        self.assertListEqual(['setosa', 'versicolor', 'virginica'], df_res['species'].tolist(), 'incorrect species')
        self.assertAlmostEqual(5.006, df_res['mean_sepal_length'].values[0], 'incorrect mean_sepal_length[0]')
        self.assertAlmostEqual(5.936, df_res['mean_sepal_length'].values[1], 'incorrect mean_sepal_length[1]')
        self.assertAlmostEqual(6.587999999999998, df_res['mean_sepal_length'].values[2], 'incorrect mean_sepal_length[2]')
        self.assertAlmostEqual(170.9, df_res['sum_sepal_width'].values[0], 'incorrect sum_sepal_width[0]')
        self.assertAlmostEqual(138.50000000000003, df_res['sum_sepal_width'].values[1], 'incorrect sum_sepal_width[1]')
        self.assertAlmostEqual(148.70000000000002, df_res['sum_sepal_width'].values[2], 'incorrect sum_sepal_width[2]')
        
    def test_optional(self):
        df_iris = load_iris()
        df_res = pivot2(table=df_iris, values=['sepal_length'], aggfunc=['max', 'min', 'var', 'std', 'count', 'median', 'q1', 'q3'],
                        index=None, columns=['species'])['out_table']
        
        self.assertEqual('sepal_length', df_res['values'].values[0], 'incorrect values')
        self.assertAlmostEqual(5.8, df_res['max_setosa'].values[0], 'incorrect max_setosa')
        self.assertAlmostEqual(4.3, df_res['min_setosa'].values[0], 'incorrect min_setosa')
        self.assertAlmostEqual(0.12424897959183677, df_res['var_setosa'].values[0], 'incorrect var_setosa')
        self.assertAlmostEqual(0.3489469873777391, df_res['std_setosa'].values[0], 'incorrect std_setosa')
        self.assertAlmostEqual(50, df_res['count_setosa'].values[0], 'incorrect count_setosa')
        self.assertAlmostEqual(5, df_res['median_setosa'].values[0], 'incorrect median_setosa')
        self.assertAlmostEqual(4.8, df_res['q1_setosa'].values[0], 'incorrect q1_setosa')
        self.assertAlmostEqual(5.2, df_res['q3_setosa'].values[0], 'incorrect q3_setosa')


class TestTranspose(unittest.TestCase):

    def setUp(self):
        print("*** Transpose UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Transpose UnitTest End ***")

    def test_first(self):
        
        tp = transpose(self.testdata, input_cols=['sepal_length', 'sepal_width'])
        DF1 = tp['out_table'].values
        # print(DF1)
        np.testing.assert_array_equal(DF1[0].tolist()[0:5], ['sepal_length', 5.1, 4.9, 4.7, 4.6])
        np.testing.assert_array_equal(DF1[1].tolist()[0:5], ['sepal_width', 3.5, 3.0, 3.2, 3.1])

    def test_second(self):
        
        tp = transpose(self.testdata, input_cols=['petal_length', 'petal_width'])
        DF2 = tp['out_table'].values
        # print(DF2)
        np.testing.assert_array_equal(DF2[0].tolist()[0:5], ['petal_length', 1.4, 1.4, 1.3, 1.5])
        np.testing.assert_array_equal(DF2[1].tolist()[0:5], ['petal_width', 0.2, 0.2, 0.2, 0.2])
