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

from brightics.function.extraction.shift_datetime import shift_datetime
import unittest
import pandas as pd
import HtmlTestRunner
import os
from io import StringIO
from pandas.testing import assert_frame_equal


class ShiftDatetimeTest(unittest.TestCase):

    def setUp(self):
        print("*** Shift datetime UnitTest Start ***")
        input_data_io = StringIO('''time,d01,d022,pa,d03,time2,time_anotherFormat
        20130511153413,11,65.0,A,101,20140511153313,201405
        20091229121242,3,52.0,C,99,20160207121242,20160207121242
        20081231131658,2,16.0,B,1,20140107131658,201401
        20160317001000,12,46.0,C,3,20160324000000,201603
        20100101000000,12,46.0,C,3,20091231010000,200912
        20091227000000,12,46.0,C,3,20091228000000,200912''')
        self.test_data = pd.read_csv(input_data_io, sep=',')
        self.test_data['time'] = self.test_data['time'].astype(str)
        self.test_data['time2'] = self.test_data['time2'].astype(str)
        output_data_io = StringIO("""time,d01,d022,pa,d03,time2,time_anotherFormat,time_timeshift_result,time2_timeshift_result
        20130511153413,11,65.0,A,101,20140511153313,201405,20180511153413,20190511153313
        20091229121242,3,52.0,C,99,20160207121242,20160207121242,20141229121242,20210207121242
        20081231131658,2,16.0,B,1,20140107131658,201401,20131231131658,20190107131658
        20160317001000,12,46.0,C,3,20160324000000,201603,20210317001000,20210324000000
        20100101000000,12,46.0,C,3,20091231010000,200912,20150101000000,20141231010000
        20091227000000,12,46.0,C,3,20091228000000,200912,20141227000000,20141228000000""")
        self.test_result = pd.read_csv(output_data_io, sep=',')
        self.test_result['time'] = self.test_result['time'].astype(str)
        self.test_result['time2'] = self.test_result['time2'].astype(str)
        self.test_result['time_timeshift_result'] = self.test_result['time_timeshift_result'].astype(str)
        self.test_result['time2_timeshift_result'] = self.test_result['time2_timeshift_result'].astype(str)

    def tearDown(self):
        print("*** Shift datetime UnitTest End ***")

    def test(self):
        test_result = shift_datetime(
            self.test_data,
            input_cols=['time', 'time2'],
            interval=5,
            shift_unit='year'
        )['out_table']
        assert_frame_equal(self.test_result, test_result, check_dtype=False)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(
        combine_reports=True, output=reportFoler))
