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

from brightics.function.extraction.datetime_formatter import datetime_formatter
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os
from io import StringIO


class DatetimeFormatter(unittest.TestCase):

    def setUp(self):
        print("*** Datetime formatter UnitTest Start ***")
        self.test_data = pd.DataFrame({'time':[]})
        self.test_data['time'] = [
        '20130511153413',
        '20091229121242',
        '20081231131658',
        '20160317001000',
        '20100101000000',
        '20091227000000']

    def tearDown(self):
        print("*** Datetime formatter UnitTest End ***")

    def test(self):
        test_result = datetime_formatter(
            self.test_data, input_cols=['time'], display_mode='replace',
            in_format="%Y%m%d%H%M%S", out_format="%Y-%m-%d %H:%M:%S",
            in_language="en", out_language="en")['out_table']
        np.testing.assert_array_equal(test_result['time'], [
        '2013-05-11 15:34:13',
        '2009-12-29 12:12:42',
        '2008-12-31 13:16:58',
        '2016-03-17 00:10:00',
        '2010-01-01 00:00:00',
        '2009-12-27 00:00:00'])
        test_result1 = datetime_formatter(
            test_result, input_cols=['time'], display_mode='replace',
            in_format="%Y-%m-%d %H:%M:%S", out_format="%Y-%b-%d",
            in_language="en", out_language="ko")['out_table']
        np.testing.assert_array_equal(test_result1['time'], [
        '2013-5-11',
        '2009-12-29',
        '2008-12-31',
        '2016-3-17',
        '2010-1-01',
        '2009-12-27'])
        test_result2 = datetime_formatter(
            test_result1, input_cols=['time'], display_mode='replace',
            in_format="%Y-%b-%d", out_format="%Y-%b-%d",
            in_language="ko", out_language="zh")['out_table']
        np.testing.assert_array_equal(test_result2['time'], [
        '2013-五月-11',
        '2009-十二月-29',
        '2008-十二月-31',
        '2016-三月-17',
        '2010-一月-01',
        '2009-十二月-27'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(
        combine_reports=True, output=reportFoler))
