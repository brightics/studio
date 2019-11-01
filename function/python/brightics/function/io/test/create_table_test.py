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

from brightics.function.io import create_table
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class TestCreateTable(unittest.TestCase):

    def setUp(self):
        print("*** Create Table UnitTest Start ***")

    def tearDown(self):
        print("*** Create Table UnitTest End ***")
        
    def test_first(self):
        
        col = ['aaa', 'bbb', 'ccc']
        data = [[1, 'abc', 2.4], [2, 'def', 3.6], [3, 'ghi', 5.2]]
        type = ['int', 'string', 'double']
        ct = create_table(col_names=col, data_array=data, type_array=type)
        DF1 = ct['out_table'].values
        # print(DF1)
        np.testing.assert_array_equal(DF1[0].tolist(), [1, 'abc', 2.4])
        np.testing.assert_array_equal(DF1[1].tolist(), [2, 'def', 3.6])
        np.testing.assert_array_equal(DF1[2].tolist(), [3, 'ghi', 5.2])
        
    def test_second(self):
        
        col = ['aaa', 'bbb', 'ccc']
        data = [[1, None, 2.4], [None, 'def', 3.6], [3, 'ghi', None]]
        type = ['int', 'string', 'double']
        ct = create_table(col_names=col, data_array=data, type_array=type)
        DF2 = ct['out_table'].values
        # print(DF2)
        np.testing.assert_array_equal(DF2[0].tolist(), [1.0, '', 2.4])
        np.testing.assert_array_equal(DF2[1].tolist(), [np.nan, 'def', 3.6])
        np.testing.assert_array_equal(DF2[2].tolist(), [3.0, 'ghi', np.nan])        


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
