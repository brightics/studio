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


from brightics.function.regression.isotonic_regression import isotonic_regression_train
from brightics.function.regression.isotonic_regression import isotonic_regression_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class IsotonicRegression(unittest.TestCase):
    def setUp(self):
        print("*** Isotonic Regression Train/Predict UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Isotonic Regression Train/Predict UnitTest End ***")

    def test(self):
        isotonic_train = isotonic_regression_train(self.testdata, feature_col='sepal_length', label_col='petal_width')
        predict = isotonic_regression_predict(self.testdata, isotonic_train['model'])['out_table']['prediction']
        desired_label = [0.44, 0.44, 0.2166667, 0.2166667, 0.44]
        np.testing.assert_array_almost_equal(desired_label, [round(x,7) for x in predict.values[:5]], 7, 'incorrect prediction')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
