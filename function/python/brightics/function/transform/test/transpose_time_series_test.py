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

from brightics.function.extraction.transpose_time_series import transpose_time_series
import unittest
import pandas as pd
import HtmlTestRunner
import os
from io import StringIO
from pandas.testing import assert_frame_equal


class TransposeTimeSeriesTest(unittest.TestCase):

    def setUp(self):
        print("*** Transpose time series UnitTest Start ***")
        self.test_data = pd.DataFrame({'value':[], 'value3':[], 'time':[]})
        self.test_data['value'] = [4, 5, 6, 7, 5, 7, 5, 4, 4, 5, 6, 7, 3, 2, 5, 3, 4, 5, 6, 4]
        self.test_data['value3'] = [[2], [2, 1], [2], [2], [2, 1], [2], [2], [2, 1], [2], [2], [2], [2], [2], [2], [2], [2], [2], [2], [2], [2]]
        self.test_data['time'] = [1, 2, 3, 4, 2, 4, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 1]
        self.test_result = pd.DataFrame({'value': [], 'timeseries': [], 'time': []})
        self.test_result['value'] = ['value3', 'value', 'time']
        self.test_result['timeseries'] = [[2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], [
            4, 4, 3, 4, 4, 4, 5, 5, 2, 5, 5, 5, 6, 6, 6, 5, 7, 7, 3, 7], []]
        self.test_result['time'] = [[], [], [1, 1, 1, 1, 1,
                                             1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4]]

    def tearDown(self):
        print("*** Transpose time series UnitTest End ***")

    def test(self):
        test_result = transpose_time_series(
            self.test_data,
            input_cols=['value3', 'value'],
            output_col1='value',
            output_col2='timeseries',
            sort_by='time',
            keep_sort_by=True
        )['out_table']
        assert_frame_equal(self.test_result, test_result, check_dtype=False)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(
        combine_reports=True, output=reportFoler))
