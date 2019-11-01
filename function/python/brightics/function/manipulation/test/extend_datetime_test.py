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

from brightics.function.extraction.extend_datetime import extend_datetime
import unittest
import pandas as pd
import HtmlTestRunner
import os
from io import StringIO
from pandas.testing import assert_frame_equal


class ExtendDatetimeTest(unittest.TestCase):

    def setUp(self):
        print("*** Extend datetime UnitTest Start ***")
        input_data_io = StringIO('''datetime,t01,d01
        19890101111717,AQE,3
        20010101111718,AQE,3
        20020101112020,WEF,4
        20030101112329,WW,3
        20080101112401,B,5
        20110101120051,SS,3
        20120101120053,SS,3''')
        self.test_data = pd.read_csv(input_data_io, sep=',')
        self.test_data['datetime'] = self.test_data['datetime'].astype(str)
        output_data_io = StringIO("""datetime,t01,d01,datetime_estimation_info
        19890101111717,AQE,3,s
        19900101000000,AQE,3,f
        19910101000000,AQE,3,f
        19920101000000,AQE,3,f
        19930101000000,AQE,3,f
        19940101000000,AQE,3,f
        19950101000000,AQE,3,f
        19960101000000,AQE,3,f
        19970101000000,AQE,3,f
        19980101000000,AQE,3,f
        19990101000000,AQE,3,f
        20000101000000,AQE,3,f
        20010101111718,AQE,3,e
        20020101112020,WEF,4,n
        20030101112329,WW,3,s
        20040101000000,WW,3,f
        20050101000000,WW,3,f
        20060101000000,WW,3,f
        20070101000000,WW,3,f
        20080101112401,B,5,e/s
        20090101000000,B,5,f
        20100101000000,B,5,f
        20110101120051,SS,3,e
        20120101120053,SS,3,n""")
        self.test_result = pd.read_csv(output_data_io, sep=',')
        self.test_result['datetime'] = self.test_result['datetime'].astype(str)

    def tearDown(self):
        print("*** Extend datetime UnitTest End ***")

    def test(self):
        test_result = extend_datetime(
            self.test_data,
            input_col='datetime',
            impute_unit='year'
        )['out_table']
        assert_frame_equal(self.test_result, test_result, check_dtype=False)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(
        combine_reports=True, output=reportFoler))
