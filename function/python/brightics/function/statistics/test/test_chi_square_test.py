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
from brightics.function.test_data import get_iris
from brightics.function.statistics import chi_square_test_of_independence


class TestChiSquareTestOfIndependence(unittest.TestCase):

    def setUp(self):
        print("*** Chi-square Test of Independence UnitTest Start ***")
        self.iris = get_iris()

    def tearDown(self):
        print("*** Chi-square Test of Independence UnitTest End ***")

    def test_chi_square_test_of_independence1(self):
        input_dataframe = self.iris

        res = chi_square_test_of_independence(table=input_dataframe, feature_cols=['sepal_length'], label_col='species', correction=False)['model']['result0']
   
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], [156.26666666666668, 68.0, 6.665987344005466e-09])
    
    def test_chi_square_test_of_independence2(self):
        input_dataframe = self.iris

        res = chi_square_test_of_independence(table=input_dataframe, feature_cols=['sepal_length', 'sepal_width'], label_col='species', correction=True)['model']
        res0 = res['result0']
        res1 = res['result1']
        
        print(res0)
        print(res1)
        
        table0 = res0.values.tolist()
        table1 = res1.values.tolist()
        self.assertListEqual(table0[0], [156.26666666666668, 68.0, 6.665987344005466e-09])
        self.assertListEqual(table1[0], [89.54628704628703, 44.0, 6.016031482207116e-05])
        

if __name__ == '__main__':
    unittest.main()
