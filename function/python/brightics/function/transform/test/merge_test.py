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
from brightics.function.transform import join, bind_row_column
from brightics.common.datasets import load_iris
import HtmlTestRunner
import os


class TestJoin(unittest.TestCase):

    def test_outer(self):
        df_iris = load_iris()
        df_res = join(left_table=df_iris, right_table=df_iris, left_on=['species', 'sepal_length'], right_on=['species','petal_width'],
                      how='outer', lsuffix='_left', rsuffix='_right', sort=False)['table']
                        
        self.assertListEqual(['setosa'] * 5, df_res['species_left'].tolist()[:5], 'outer: incorrect species_left')
        self.assertTrue(np.isnan(df_res['species_right'].values[0]), 'outer: incorrect species_right')
        self.assertListEqual([5.1] * 5, df_res['sepal_length_left'].tolist()[:5], 'outer: incorrect sepal_length_left')
        self.assertTrue(np.isnan(df_res['petal_width_right'].values[0]), 'outer: incorrect petal_width_right')
        
    def test_left(self):
        df_iris = load_iris()
        df_res = join(left_table=df_iris, right_table=df_iris, left_on=['species', 'sepal_length'], right_on=['species', 'petal_width'],
                      how='left', lsuffix='_left', rsuffix='_right', sort=False)['table']
        
        self.assertListEqual(['setosa'] * 5, df_res['species_left'].tolist()[:5], 'left: incorrect species_left')
        self.assertTrue(np.isnan(df_res['species_right'].values[0]), 'left: incorrect species_right')
        self.assertListEqual([5.1, 4.9, 4.7, 4.6, 5.0], df_res['sepal_length_left'].tolist()[:5], 'left: incorrect sepal_length_left')
        self.assertTrue(np.isnan(df_res['petal_width_right'].values[0]), 'left: incorrect petal_width_right')
        
    def test_inner(self):
        df_iris = load_iris()
        df_res = join(left_table=df_iris, right_table=df_iris, left_on=['species', 'sepal_length'], right_on=['species', 'petal_width'],
                      how='inner', lsuffix='_left', rsuffix='_right', sort=False)['table']
        
        self.assertTrue(df_res.empty, 'inner: incorrect result')
        
    def test_left_exclude(self):
        df_iris = load_iris()
        df_res = join(left_table=df_iris, right_table=df_iris[30:], left_on=['species', 'sepal_length'], right_on=['species', 'sepal_length'],
                      how='left_exclude', lsuffix='_left', rsuffix='_right', sort=False)['table']
        
        self.assertListEqual([4.7, 4.7, 4.3, 5.8, 5.7, 5.7], df_res['sepal_length'].tolist(), 'left exclude: incorrect sepal_length')
        self.assertListEqual(['setosa'] * 6, df_res['species'].tolist(), 'left exclude: incorrect species')
        


class TestBindRowColumn(unittest.TestCase):

    def setUp(self):
        print("*** Bind Row Column UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Bind Row Column UnitTest End ***")

    def test_first(self):
        
        brc = bind_row_column(first_table = self.testdata[0:2], second_table = self.testdata[50:53], row_or_col = 'row')
        DF1 = brc['table'].values
        # print(DF1)
        np.testing.assert_array_equal(DF1[0][0:4], [5.1, 3.5, 1.4, 0.2])
        np.testing.assert_array_equal(DF1[1][0:4], [4.9, 3.0, 1.4, 0.2])
        np.testing.assert_array_equal(DF1[2][0:4], [7.0, 3.2, 4.7, 1.4])
        np.testing.assert_array_equal(DF1[3][0:4], [6.4, 3.2, 4.5, 1.5])
        np.testing.assert_array_equal(DF1[4][0:4], [6.9, 3.1, 4.9, 1.5])

    def test_second(self):
        
        brc = bind_row_column(first_table = self.testdata, second_table = self.testdata, row_or_col = 'col')
        DF2 = brc['table'].values
        # print(DF2)
        np.testing.assert_array_equal(DF2[0][0:4], [5.1, 3.5, 1.4, 0.2])
        np.testing.assert_array_equal(DF2[0][5:9], [5.1, 3.5, 1.4, 0.2])
        np.testing.assert_array_equal(DF2[1][0:4], [4.9, 3.0, 1.4, 0.2])
        np.testing.assert_array_equal(DF2[1][5:9], [4.9, 3.0, 1.4, 0.2])
        np.testing.assert_array_equal(DF2[2][0:4], [4.7, 3.2, 1.3, 0.2])
        np.testing.assert_array_equal(DF2[2][5:9], [4.7, 3.2, 1.3, 0.2])
        np.testing.assert_array_equal(DF2[3][0:4], [4.6, 3.1, 1.5, 0.2])
        np.testing.assert_array_equal(DF2[3][5:9], [4.6, 3.1, 1.5, 0.2])
        np.testing.assert_array_equal(DF2[4][0:4], [5.0, 3.6, 1.4, 0.2])
        np.testing.assert_array_equal(DF2[4][5:9], [5.0, 3.6, 1.4, 0.2])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
