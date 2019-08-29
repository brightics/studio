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

from brightics.function.timeseries import timeseries_decomposition
from brightics.common.datasets import load_iris
import unittest
import numpy as np


class TimeseriesDecompositionTest(unittest.TestCase):

    def setUp(self):
        print("*** Timeseries Decomposition UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Timeseries Decomposition UnitTest End ***")

    def test_first(self):
        
        td = timeseries_decomposition(self.testdata, input_col = ['sepal_length'], frequency = 10, model_type='additive', filteration=None, two_sided=True, extrapolate_trend=0)
        DF1 = td['out_table'].values
        # print(DF1[0][5:8])
        # print(DF1[1][5:8])
        # print(DF1[5][5:8])
        # print(DF1[6][5:8])
        # print(DF1[7][5:8])
        np.testing.assert_almost_equal(DF1[0][5], np.nan, 10)
        np.testing.assert_almost_equal(DF1[0][6], 0.08167857142857139, 10)
        np.testing.assert_almost_equal(DF1[0][7], np.nan, 10)
        np.testing.assert_almost_equal(DF1[1][5], np.nan, 10)
        np.testing.assert_almost_equal(DF1[1][6], 0.0066785714285714755, 10)
        np.testing.assert_almost_equal(DF1[1][7], np.nan, 10)
        np.testing.assert_array_almost_equal(DF1[5][5:8], [4.875, 0.2991785714285717, 0.22582142857142867], 10)
        np.testing.assert_array_almost_equal(DF1[6][5:8], [4.885, -0.06367857142857128, -0.22132142857142886], 10)
        np.testing.assert_array_almost_equal(DF1[7][5:8], [4.885, 0.0395357142857142, 0.07546428571428601], 10)
        
    def test_second(self):
        
        td = timeseries_decomposition(self.testdata, input_col = ['sepal_width'], frequency = 5, model_type='multiplicative', filteration=[1, 2, 3], two_sided=True, extrapolate_trend=10)
        DF2 = td['out_table'].values
        # print(DF2[0][5:8])
        # print(DF2[1][5:8])
        # print(DF2[2][5:8])
        # print(DF2[3][5:8])
        # print(DF2[4][5:8])
        np.testing.assert_array_almost_equal(DF2[0][5:8], [19.75636363636364, 1.0141210519311832, 0.1746912831777005], 10)
        np.testing.assert_array_almost_equal(DF2[1][5:8], [19.7, 0.9952018506915731, 0.1530184694226276], 10)
        np.testing.assert_array_almost_equal(DF2[2][5:8], [18.5, 0.989904288778258, 0.17473706795073754], 10)
        np.testing.assert_array_almost_equal(DF2[3][5:8], [19.400000000000002, 0.9839955881778083, 0.16239281593619798], 10)
        np.testing.assert_array_almost_equal(DF2[4][5:8], [20.4, 1.016777220421178, 0.17355875475081453], 10)