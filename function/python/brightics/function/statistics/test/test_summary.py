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
from brightics.function.statistics.summary import string_summary


class TestSummary(unittest.TestCase):

    def setUp(self):
        print("*** Summary UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Summary UnitTest End ***")

    def test_string_summary(self):
        input_dataframe = self.iris

        res_summary = string_summary(table=input_dataframe, input_cols=['species'])['summary_table']
        res_count = string_summary(table=input_dataframe, input_cols=['species'])['count_table']
   
        print(res_summary)
        print(res_count)
        
        table1 = res_summary.values.tolist()
        table2 = res_count.values.tolist()
        self.assertListEqual(table1[0], ['species', 'virginica', 'setosa', ['setosa', 'versicolor', 'virginica'], 150, 0, 3, 0, 0])
        self.assertListEqual(table2[0], ['species', 'setosa', 50, 0.3333333333333333, 0.3333333333333333])
        self.assertListEqual(table2[1], ['species', 'versicolor', 50, 0.3333333333333333, 0.6666666666666666])
    

if __name__ == '__main__':
    unittest.main()
