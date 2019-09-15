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


from brightics.function.clustering.mean_shift import mean_shift, mean_shift_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class MeanShift(unittest.TestCase):
    
    def setUp(self):
        print("*** Mean Shift Train/Predict UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Mean Shift Train/Predict UnitTest End ***")
    
    def test(self):
        ms_train = mean_shift(self.testdata, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], bandwidth=0.85)
        ms_model = ms_train['model']['model']
        cluster_centers = ms_model.cluster_centers_
        self.assertEqual(len(cluster_centers), 3)
        np.testing.assert_array_equal([round(x, 15) for x in cluster_centers[0]], [6.059574468085108 ,2.834042553191489 ,4.587234042553192 ,1.500000000000000])
        np.testing.assert_array_equal([round(x, 15) for x in cluster_centers[1]], [4.988888888888890, 3.400000000000002, 1.482222222222222, 0.244444444444444])
        np.testing.assert_array_equal([round(x, 15) for x in cluster_centers[2]], [6.633333333333333, 3.066666666666666, 5.548148148148147, 2.100000000000000])
        
        predict = mean_shift_predict(self.testdata, ms_train['model'])['out_table']['prediction']
        np.testing.assert_array_equal(predict, [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 0])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
