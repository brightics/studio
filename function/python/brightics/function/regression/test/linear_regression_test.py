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


from brightics.function.regression.linear_regression import linear_regression_train
from brightics.function.regression.linear_regression import linear_regression_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class LinearRegression(unittest.TestCase):
    
    def setUp(self):
        print("*** Linear Regression UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Linear Regression UnitTest End ***")
    
    def test(self):
        linear_train = linear_regression_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width')['model']
        np.testing.assert_array_almost_equal(linear_train['coefficients'], [-0.2487235860 ,-0.2102713288 ,0.2287772140 ,0.5260881801] , 10)
        predict = linear_regression_predict(self.testdata, linear_train)['out_table']['prediction']
        np.testing.assert_array_almost_equal(predict[:5],[0.2161363378 ,0.1438019966 ,0.1790028872 ,0.2823699347 ,0.2600411921],10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
