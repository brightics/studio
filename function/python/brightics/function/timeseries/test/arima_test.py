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
import HtmlTestRunner
import os


class TestARIMA(unittest.TestCase):

    def setUp(self):
        print("*** ARIMA UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** ARIMA UnitTest End ***")

    def test(self):
        
        am_train = arima_train(self.testdata, input_cols=['sepal_length'], p=2, d=0, q=1)
        DF1 = am_train['model']['coefficients_array_sepal_length']
        self.assertAlmostEqual(DF1[0], 5.760717487025281, 6)
        self.assertAlmostEqual(DF1[1], 0.918913313858386, 6)
        self.assertAlmostEqual(DF1[2], 0.057794040267104954, 6)
        self.assertAlmostEqual(DF1[3], -0.7411708102693566, 6)
        self.assertAlmostEqual(am_train['model']['aic'], 270.67520223832514, 6)

        am_predict = arima_predict(model=am_train['model'], prediction_num=12)
        DF2 = am_predict['table'].values
        self.assertAlmostEqual(DF2[0][1], 6.283860539060273, 6)
        self.assertAlmostEqual(DF2[1][1], 6.24949030175611, 6)
        self.assertAlmostEqual(DF2[2][1], 6.240091884548244, 6)
        self.assertAlmostEqual(DF2[3][1], 6.229469158967993, 6)
        self.assertAlmostEqual(DF2[4][1], 6.219164622500279, 6)
        
        
class TestAutoARIMA(unittest.TestCase):

    def setUp(self):
        print("*** Auto ARIMA UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Auto ARIMA UnitTest End ***")

    def test(self):
        
        aam_train = auto_arima_train(self.testdata, input_cols=['sepal_length'])
        DF1 = aam_train['model']['coefficients_array_sepal_length']
        self.assertAlmostEqual(DF1[0], 0.013388460393529677, 6)
        self.assertAlmostEqual(DF1[1], 0.13279104517294207, 6)
        self.assertAlmostEqual(DF1[2], 0.24551158337400936, 6)
        self.assertAlmostEqual(DF1[3], -0.9999395975832498, 6)
        self.assertAlmostEqual(aam_train['model']['aic'], 261.0783302384515, 6)

        aam_predict = auto_arima_predict(model=aam_train['model'], prediction_num=12)
        DF2 = aam_predict['table'].values
        self.assertAlmostEqual(DF2[0][1], 6.577651925489418, 6)
        self.assertAlmostEqual(DF2[1][1], 6.602308128560872, 6)
        self.assertAlmostEqual(DF2[2][1], 6.780277219374541, 6)
        self.assertAlmostEqual(DF2[3][1], 6.81828687504269, 6)
        self.assertAlmostEqual(DF2[4][1], 6.875351260857285, 6)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
