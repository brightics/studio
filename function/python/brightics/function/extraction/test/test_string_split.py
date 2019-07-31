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


from brightics.function.extraction.string_split import string_split
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class StringSplit(unittest.TestCase):
    
    def setUp(self):
        print("*** StringSplit UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** StringSplit UnitTest End ***")
    
    def test(self):
        self.testdata['array'] = ['{' + str(row[0]) + '|' + str(row[1]) + '|' + str(row[2]) + '|' + str(row[3]) + '}' for row in self.testdata.values]
        res = string_split(self.testdata, input_col='array', delimiter='|', output_col_cnt=4, output_col_type='double', start_pos=1, end_pos=1)
        out_table = res['out_table']
        np.testing.assert_array_equal(self.testdata['sepal_length'], out_table['split_0'])
        np.testing.assert_array_equal(self.testdata['sepal_width'], out_table['split_1'])
        np.testing.assert_array_equal(self.testdata['petal_length'], out_table['split_2'])
        np.testing.assert_array_equal(self.testdata['petal_width'], out_table['split_3'])
        res = string_split(self.testdata, input_col='array', delimiter='|', output_col_cnt=4, output_col_type='double_arr', start_pos=1, end_pos=1)
        out_array = [[row[0],row[1],row[2],row[3]] for row in res['out_table']['split']]
        array = self.testdata[['sepal_length','sepal_width','petal_length','petal_width']].values
        np.testing.assert_array_equal(np.array(array), out_array)