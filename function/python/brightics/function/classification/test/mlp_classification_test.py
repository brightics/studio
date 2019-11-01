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

from brightics.function.classification.mlp_classification import mlp_classification_train, mlp_classification_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class MLPClassification(unittest.TestCase):
    
    def setUp(self):
        print("*** MLP Classifcation Train/Predict UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** MLP Classifcation Train/Predict UnitTest End ***")
    
    def test(self):
        mlp_train = mlp_classification_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)
        mlp_model = mlp_train['model']['mlp_model']
        intercepts = mlp_model.intercepts_
        coefficients = mlp_model.coefs_
        self.assertAlmostEqual(intercepts[0][0], 0.1371646902)
        self.assertAlmostEqual(intercepts[0][1], -0.1963491163)
        self.assertAlmostEqual(intercepts[0][2], -0.2060454823)
        self.assertAlmostEqual(intercepts[0][97], 0.3435417865)
        self.assertAlmostEqual(intercepts[0][98], -0.2717797758)
        self.assertAlmostEqual(intercepts[0][99], 0.2289515308)
        
        predict = mlp_classification_predict(self.testdata, mlp_train['model'])['out_table']['prediction']
        np.testing.assert_array_equal(predict, ['setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'virginica', 'versicolor', 'virginica', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'virginica', 'virginica', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
