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

from brightics.function.timeseries import arima_train, arima_predict, auto_arima_train, auto_arima_predict
from brightics.common.datasets import load_iris
import unittest


class TestARIMA(unittest.TestCase):

    def setUp(self):
        print("*** ARIMA UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** ARIMA UnitTest End ***")

    def test(self):
        
        am_train = arima_train(self.testdata, input_cols=['sepal_length'], p=2, d=0, q=1)
        DF1 = am_train['model']['coefficients_array_sepal_length']
        # print(DF1[0])
        # print(DF1[1])
        # print(DF1[2])
        # print(DF1[3])
        self.assertAlmostEqual(DF1[0], 5.760717487025281, 10)
        self.assertAlmostEqual(DF1[1], 0.918913313858386, 10)
        self.assertAlmostEqual(DF1[2], 0.057794040267104954, 10)
        self.assertAlmostEqual(DF1[3], -0.7411708102693566, 10)
        
        # print(am_train['model']['aic'])
        self.assertAlmostEqual(am_train['model']['aic'], 270.67520223832514, 10)
 
        am_predict = arima_predict(model=am_train['model'], prediction_num=12)
        DF2 = am_predict['table'].values
        # print(DF2[0][1])
        # print(DF2[1][1])
        # print(DF2[2][1])
        # print(DF2[3][1])
        # print(DF2[4][1])
        self.assertAlmostEqual(DF2[0][1], 6.283860539060273, 10)
        self.assertAlmostEqual(DF2[1][1], 6.24949030175611, 10)
        self.assertAlmostEqual(DF2[2][1], 6.240091884548244, 10)
        self.assertAlmostEqual(DF2[3][1], 6.229469158967993, 10)
        self.assertAlmostEqual(DF2[4][1], 6.219164622500279, 10)
        
        
class TestAutoARIMA(unittest.TestCase):

    def setUp(self):
        print("*** Auto ARIMA UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Auto ARIMA UnitTest End ***")

    def test(self):
        
        aam_train = auto_arima_train(self.testdata, input_cols=['sepal_length'])
        DF1 = aam_train['model']['coefficients_array_sepal_length']
        # print(DF1[0])
        # print(DF1[1])
        # print(DF1[2])
        # print(DF1[3])
        self.assertAlmostEqual(DF1[0], 0.013388460393529677, 10)
        self.assertAlmostEqual(DF1[1], 0.13279104517294207, 10)
        self.assertAlmostEqual(DF1[2], 0.24551158337400936, 10)
        self.assertAlmostEqual(DF1[3], -0.9999395975832498, 10)
        
        # print(aam_train['model']['aic'])
        self.assertAlmostEqual(aam_train['model']['aic'], 261.0783302384515, 10)
 
        aam_predict = auto_arima_predict(model=aam_train['model'], prediction_num=12)
        DF2 = aam_predict['table'].values
        # print(DF2[0][1])
        # print(DF2[1][1])
        # print(DF2[2][1])
        # print(DF2[3][1])
        # print(DF2[4][1])
        self.assertAlmostEqual(DF2[0][1], 6.577651925489418, 10)
        self.assertAlmostEqual(DF2[1][1], 6.602308128560872, 10)
        self.assertAlmostEqual(DF2[2][1], 6.780277219374541, 10)
        self.assertAlmostEqual(DF2[3][1], 6.81828687504269, 10)
        self.assertAlmostEqual(DF2[4][1], 6.875351260857285, 10)
