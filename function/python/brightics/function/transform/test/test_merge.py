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
from brightics.common.datasets import load_iris
from brightics.function.transform.merge import bind_row_column


class TestMerge(unittest.TestCase):

    def setUp(self):
        print("*** Merge UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Manipulation UnitTest End ***")

    def test_bind_row_column1(self):
        input_dataframe = self.iris
        
        res = bind_row_column(first_table=input_dataframe, second_table=input_dataframe, row_or_col='row')['table']
        
        print(res)
        
        self.assertEqual(300, len(res.index))
        self.assertEqual(5, res.columns.size)
        
    def test_bind_row_column2(self):
        input_dataframe = self.iris

        res = bind_row_column(first_table=input_dataframe, second_table=input_dataframe, row_or_col='col')['table']
        
        print(res)
        
        self.assertEqual(150, len(res.index))
        self.assertEqual(10, res.columns.size)
        
    
if __name__ == '__main__':
    unittest.main()
