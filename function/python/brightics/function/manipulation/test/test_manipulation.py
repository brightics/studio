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


import unittest
import pandas as pd
import numpy as np
from brightics.common.datasets import load_iris
from brightics.function.manipulation import sort, replace_missing_number, replace_missing_string


class TestManipulation(unittest.TestCase):

    def setUp(self):
        print("*** Manipulation UnitTest Start ***")
        self.iris = load_iris()
        df = pd.DataFrame({'number1' : [1, 2, np.nan, np.nan, np.nan]})
        df['number2'] = [10, 20, 30, np.nan, np.nan]
        df['string1'] = ['A', 'A', None, 'A', None]
        df['string2'] = ['a', None, 'a', None, None]
        self.data = df

    def tearDown(self):
        print("*** Manipulation UnitTest End ***")

    def test_sort1(self):
        input_dataframe = self.iris
        
        res = sort(table=input_dataframe, input_cols=['sepal_length', 'sepal_width'], is_asc=[True, False], group_by=['species'])['out_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], [4.3, 3, 1.1, 0.1, 'setosa'])
        self.assertListEqual(table[1], [4.4, 3.2, 1.3, 0.2, 'setosa'])
        self.assertListEqual(table[2], [4.4, 3, 1.3, 0.2 , 'setosa'])
        self.assertListEqual(table[3], [4.4, 2.9, 1.4, 0.2, 'setosa'])
        self.assertListEqual(table[4], [4.5, 2.3, 1.3, 0.3, 'setosa'])
        
    def test_sort2(self):
        input_dataframe = self.iris

        res = sort(table=input_dataframe, input_cols=['petal_length', 'petal_width'], is_asc=[True, False], group_by=['species'])['out_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], [4.6, 3.6, 1, 0.2, 'setosa'])
        self.assertListEqual(table[1], [4.3, 3, 1.1, 0.1, 'setosa'])
        self.assertListEqual(table[2], [5.8, 4, 1.2, 0.2 , 'setosa'])
        self.assertListEqual(table[3], [5, 3.2, 1.2, 0.2, 'setosa'])
        self.assertListEqual(table[4], [5.4, 3.9, 1.3, 0.4, 'setosa'])
        
    def test_replace_missing_number(self):
        input_dataframe = self.data
        
        res = replace_missing_number(table=input_dataframe, input_cols=['number1'], fill_method=None, fill_value='value', fill_value_to=0.0, limit=None, downcast=None)['out_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertEqual(table[2][0], 0.0)
        self.assertEqual(table[3][0], 0.0)
        self.assertEqual(table[4][0], 0.0)
        
    def test_replace_missing_string(self):
        input_dataframe = self.data
        
        res = replace_missing_string(table=input_dataframe, input_cols=['string2'], fill_method=None, fill_string='N', limit=None, downcast=None)['out_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertEqual(table[1][3], 'N')
        self.assertEqual(table[3][3], 'N')
        self.assertEqual(table[4][3], 'N')
        
    
if __name__ == '__main__':
    unittest.main()
