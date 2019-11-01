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

from brightics.function.extraction.array_column_conversion import columns_to_array
from brightics.function.extraction.array_column_conversion import array_to_columns
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class ArrayColumnConversion(unittest.TestCase):
    
    def setUp(self):
        print("*** array_column_conversion UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** array_column_conversion UnitTest End ***")
    
    def test(self):
        input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width']
        array_res = columns_to_array(self.testdata, input_cols=input_cols, remain_cols=False, output_col_name='array')
        array = array_res['out_table']['array']
        column_res = array_to_columns(array_res['out_table'], input_cols=['array'], remain_cols=False)
        column = column_res['out_table']
        for i in range(self.testdata.shape[0]):
            np.testing.assert_array_equal(array[i], self.testdata[input_cols][i:i+1].values[0])
        np.testing.assert_array_equal(list(column['array_0']), list(self.testdata['sepal_length']))
        np.testing.assert_array_equal(list(column['array_1']), list(self.testdata['sepal_width']))
        np.testing.assert_array_equal(list(column['array_2']), list(self.testdata['petal_length']))
        np.testing.assert_array_equal(list(column['array_3']), list(self.testdata['petal_width']))


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
