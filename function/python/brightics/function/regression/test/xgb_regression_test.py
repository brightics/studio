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


from brightics.function.regression.xgb_regression import xgb_regression_train
from brightics.function.regression.xgb_regression import xgb_regression_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class XGBRegression(unittest.TestCase):
    
    def setUp(self):
        print("*** XGB Regression UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** XGB Regression UnitTest End ***")
    
    def test(self):
        xgb_train = xgb_regression_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width')['model']
        np.testing.assert_array_almost_equal(xgb_train['feature_importance'], [0.2591911852359772,0.2077205926179886,0.533088207244873] , 10)
        predict = xgb_regression_predict(self.testdata, xgb_train)['out_table']['prediction']
        np.testing.assert_array_almost_equal(predict[:5],[0.2634012401 ,0.1740619838 ,0.1951409280 ,0.1879036427 ,0.2634012401],10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
