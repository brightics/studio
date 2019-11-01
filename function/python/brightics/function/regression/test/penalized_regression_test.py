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

from brightics.function.regression.penalized_linear_regression import penalized_linear_regression_train
from brightics.function.regression.penalized_linear_regression import penalized_linear_regression_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class PenalizedRegression(unittest.TestCase):
    
    def setUp(self):
        print("*** Penalized Regression UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Penalized Regression UnitTest End ***")
    
    def test(self):
        train = penalized_linear_regression_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', regression_type='lasso', alpha=1.3, l1_ratio=0.6, fit_intercept=True, max_iter=100, tol=0.0005, random_state=1)['model']
        np.testing.assert_array_almost_equal(train['model_parameters']['coefficient'], [0.0, -0.0, 0.0, 1.1986666666666668] , 10)
        predict = penalized_linear_regression_predict(self.testdata, train)['out_table']['prediction']
        np.testing.assert_array_almost_equal(predict[:5],[1.1986666666666668,1.1986666666666668,1.1986666666666668,1.1986666666666668,1.1986666666666668],10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
