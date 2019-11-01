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

from brightics.function.extraction.decompose_datetime import decompose_datetime
import unittest
import pandas as pd
import HtmlTestRunner
import os
from io import StringIO
from pandas.testing import assert_frame_equal


class DecomposeDatetimeTest(unittest.TestCase):
    def setUp(self):
        print("*** Decompose datetime UnitTest Start ***")
        input_data_io = StringIO('''time,d01,d022,pa,d03,time2,time_anotherFormat
        20130511153413,11,65,A,101,20140511153313,201405
        20091229121242,3,52,C,99,20160207121242,20160207121242
        20081231131658,2,16,B,1,20140107131658,201401
        20160317001000,12,46,C,3,20160324000000,201603
        20100101000000,12,46,C,3,20091231010000,200912
        20091227000000,12,46,C,3,20091228000000,200912''')
        self.test_data = pd.read_csv(input_data_io, sep=',')
        self.test_data['time'] = self.test_data['time'].astype(str)
        output_data_io = StringIO("""time,d01,d022,pa,d03,time2,time_anotherFormat,time_year,time_month,time_day,time_hour,time_week,time_dayname
        20130511153413,11,65,A,101,20140511153313,201405,2013,5,11,15,19,Saturday
        20091229121242,3,52,C,99,20160207121242,20160207121242,2009,12,29,12,53,Tuesday
        20081231131658,2,16,B,1,20140107131658,201401,2008,12,31,13,1,Wednesday
        20160317001000,12,46,C,3,20160324000000,201603,2016,3,17,0,11,Thursday
        20100101000000,12,46,C,3,20091231010000,200912,2010,1,1,0,53,Friday
        20091227000000,12,46,C,3,20091228000000,200912,2009,12,27,0,52,Sunday""")
        self.test_result = pd.read_csv(output_data_io, sep=',')
        self.test_result['time'] = self.test_result['time'].astype(str)

    def tearDown(self):
        print("*** Decompose datetime UnitTest End ***")

    def test(self):
        test_result = decompose_datetime(
            self.test_data,
            input_cols=['time']
        )['out_table']
        assert_frame_equal(self.test_result, test_result, check_dtype=False)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(
        combine_reports=True, output=reportFoler))
