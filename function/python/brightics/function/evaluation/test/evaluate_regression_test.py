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


from brightics.function.evaluation import evaluate_regression
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class EvaluateRegression(unittest.TestCase):
    
    def setUp(self):
        print("*** Evaluate Regression UnitTest Start ***")


    def tearDown(self):
        print("*** Evaluate Regression UnitTest End ***")
    
    def test(self):
        np.random.seed(3); a=np.random.rand(100)
        np.random.seed(4); b=np.random.rand(100)
        table=pd.DataFrame([a,b]).transpose()
        table.columns=['a','b']
        result = evaluate_regression(table=table,label_col='a',prediction_col='b')['result']
        np.testing.assert_almost_equal(result['r2_score'],-0.9820165023749556,10)
        np.testing.assert_almost_equal(result['mean_absolute_error'],0.2939061622832298,10)  


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
