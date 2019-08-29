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

from brightics.function.transform import delete_missing_data
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class DeleteMissingData(unittest.TestCase):
    
    def setUp(self):
        print("*** Delete Missing Data UnitTest Start ***")
        df = pd.DataFrame({'number1' : [np.int32(1), 2, np.nan, np.nan, np.nan]})
        df['number2'] = [np.int32(10), 20, 30, np.nan, np.nan]
        df['string1'] = ['A', 'A', None, 'A', None]
        df['string2'] = ['a', None, 'a', None, None]
        self.data = df

    def tearDown(self):
        print("*** Delete Missing Data UnitTest End ***")
    
    def test(self):
        result = delete_missing_data(table=self.data,input_cols=['number2','string1'])['out_table'].values
        np.testing.assert_array_equal(result[0], np.array([1, 10, 'A', 'a'],dtype=object))
        np.testing.assert_array_equal(result[1], np.array([2, 20, 'A', None],dtype=object))
    