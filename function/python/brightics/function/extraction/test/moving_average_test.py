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

from brightics.function.extraction import moving_average, ewma
from brightics.common.datasets import load_iris
import unittest
import numpy as np


class TestEWMA(unittest.TestCase):

    def setUp(self):
        print("*** EWMA UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** EWMA UnitTest End ***")

    def test_first(self):

        _ewma = ewma(self.testdata, input_cols=['sepal_length'], ratio_type='custom')
        DF1 = _ewma['out_table'].values
        # print(DF1)
        self.assertAlmostEqual(DF1[0][5], 5.1, 10)
        self.assertAlmostEqual(DF1[1][5], 5.0, 10)
        self.assertAlmostEqual(DF1[2][5], 4.85, 10)
        self.assertAlmostEqual(DF1[3][5], 4.725, 10)
        self.assertAlmostEqual(DF1[4][5], 4.8625, 10)
        
    def test_second(self):

        _ewma = ewma(self.testdata, input_cols=['sepal_length'], ratio_type='wilder', period_number=7)
        DF2 = _ewma['out_table'].values
        # print(DF2)
        np.testing.assert_almost_equal(DF2[0][5], np.nan, 10)
        np.testing.assert_almost_equal(DF2[1][5], np.nan, 10)
        np.testing.assert_almost_equal(DF2[2][5], np.nan, 10)
        np.testing.assert_almost_equal(DF2[5][5], np.nan, 10)
        np.testing.assert_almost_equal(DF2[6][5], 4.8999999999999995, 10)
        
        
class TestMovingAverage(unittest.TestCase):

    def setUp(self):
        print("*** Moving Average UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Moving Average UnitTest End ***")

    def test_first(self):

        ma = moving_average(self.testdata, input_cols=['sepal_length'])
        DF1 = ma['out_table'].values
        # print(DF1)
        self.assertAlmostEqual(DF1[0][5], 5.1, 10)
        self.assertAlmostEqual(DF1[1][5], 4.9, 10)
        self.assertAlmostEqual(DF1[2][5], 4.7, 10)
        self.assertAlmostEqual(DF1[3][5], 4.6, 10)
        self.assertAlmostEqual(DF1[4][5], 5.0, 10)
        
    def test_second(self):

        ma = moving_average(self.testdata, input_cols=['sepal_length'], weights_array=[3, 5, 7], weights='custom_weights', mode='centered_moving_average')
        DF2 = ma['out_table'].values
        # print(DF2)
        np.testing.assert_almost_equal(DF2[0][5], np.nan, 10)
        np.testing.assert_almost_equal(DF2[1][5], 4.953333333333333, 10)
        np.testing.assert_almost_equal(DF2[2][5], 4.773333333333334, 10)
        np.testing.assert_almost_equal(DF2[3][5], 4.7266666666666675, 10)
        np.testing.assert_almost_equal(DF2[4][5], 4.8933333333333335, 10)