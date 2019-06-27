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
from brightics.function.statistics import cross_table


class TestCrossTable(unittest.TestCase):

    def setUp(self):
        print("*** Cross Table UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Cross Table UnitTest End ***")

    def test_cross_table1(self):
        input_dataframe = self.iris

        res = cross_table(table=input_dataframe, input_cols_1=['sepal_length'], input_cols_2=['species'], result='N', margins=False)['model']['result_table']
   
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], ['4.3', 1, 0, 0])
        self.assertListEqual(table[1], ['4.4', 3, 0, 0])
        self.assertListEqual(table[2], ['4.5', 1, 0, 0])
        self.assertListEqual(table[3], ['4.6', 4, 0, 0])
        self.assertListEqual(table[4], ['4.7', 2, 0, 0])
    
    def test_cross_table2(self):
        input_dataframe = self.iris

        res = cross_table(table=input_dataframe, input_cols_1=['sepal_length'], input_cols_2=['species'], result='N / Total', margins=False)['model']['result_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], ['4.3', 0.006666666666666667, 0.0, 0.0])
        self.assertListEqual(table[1], ['4.4', 0.02, 0.0, 0.0])
        self.assertListEqual(table[2], ['4.5', 0.006666666666666667, 0.0, 0.0])
        self.assertListEqual(table[3], ['4.6', 0.02666666666666667, 0.0, 0.0])
        self.assertListEqual(table[4], ['4.7', 0.013333333333333334, 0.0, 0.0])
        

if __name__ == '__main__':
    unittest.main()
