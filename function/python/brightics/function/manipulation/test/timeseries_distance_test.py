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

from brightics.function.manipulation.timeseries_distance import timeseries_distance
import unittest
import pandas as pd
import HtmlTestRunner
import numpy as np
import os


class TimeseriesDistanceTest(unittest.TestCase):

    def setUp(self):
        print("*** Timeseries distance UnitTest Start ***")
        self.test_data = pd.DataFrame({'col1': [], 'col2': []})
        self.test_data['col1'] = [[6, 8, 8, 4], [3, 4, 6, 9], [7, 6, 6, 1], [2, 0, 8, 1], [6, 9, 2, 8]]
        self.test_data['col2'] = [[7, 6, 2, 2], [3, 2, 9, 2], [0, 0, 7, 8], [0, 0, 2, 7], [7, 3, 3, 7]]
        self.test_result = np.array([6.708203932499369, 7.874007874011811, 11.61895003862225, 8.717797887081348, 6.244997998398398])

    def tearDown(self):
        print("*** Timeseries distance UnitTest End ***")

    def test(self):
        test_result = timeseries_distance(self.test_data, input_col_1='col1', input_col_2='col2', distance_type='Euclidean')['out_table']
        test_result = test_result['distance'].values
        np.testing.assert_array_almost_equal(test_result, self.test_result, 7, 'Incorrect distance')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(
        combine_reports=True, output=reportFoler))
