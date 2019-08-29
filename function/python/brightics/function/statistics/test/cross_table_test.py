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

from brightics.function.statistics.cross_table import cross_table
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import random


class TestCrossTable(unittest.TestCase):

    def setUp(self):
        print("*** Cross Table UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Cross Table UnitTest End ***")

    def test_first(self):
        
        ct = cross_table(self.testdata, input_cols_1 = ['sepal_length'], input_cols_2 = ['sepal_length'], result='N', margins=False)
        DF1 = ct['model']['result_table'].values
        # print(DF1)
        np.testing.assert_array_equal(DF1[0][0:3].tolist(), ['4.3', 1, 0])
        np.testing.assert_array_equal(DF1[1][0:3].tolist(), ['4.4', 0, 3])
        np.testing.assert_array_equal(DF1[2][0:3].tolist(), ['4.5', 0, 0])
        np.testing.assert_array_equal(DF1[3][0:3].tolist(), ['4.6', 0, 0])
        np.testing.assert_array_equal(DF1[4][0:3].tolist(), ['4.7', 0, 0])
        
    def test_second(self):
        
        ct = cross_table(self.testdata, input_cols_1 = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], input_cols_2 = ['species'], result='N / Total', margins=False)
        DF2 = ct['model']['result_table'].values
        # print(DF2)
        np.testing.assert_equal(DF2[0][0], '4.3_3.0_1.1_0.1')
        np.testing.assert_equal(DF2[1][0], '4.4_2.9_1.4_0.2')
        np.testing.assert_equal(DF2[2][0], '4.4_3.0_1.3_0.2')
        np.testing.assert_equal(DF2[3][0], '4.4_3.2_1.3_0.2')
        np.testing.assert_equal(DF2[4][0], '4.5_2.3_1.3_0.3')
        np.testing.assert_array_almost_equal(DF2[0][1:4], [0.006666666666666667, 0.0, 0.0], 10)
        np.testing.assert_array_almost_equal(DF2[1][1:4], [0.006666666666666667, 0.0, 0.0], 10)
        np.testing.assert_array_almost_equal(DF2[2][1:4], [0.006666666666666667, 0.0, 0.0], 10)
        np.testing.assert_array_almost_equal(DF2[3][1:4], [0.006666666666666667, 0.0, 0.0], 10)
        np.testing.assert_array_almost_equal(DF2[4][1:4], [0.006666666666666667, 0.0, 0.0], 10)