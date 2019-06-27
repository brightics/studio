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
from brightics.function.timeseries import autocorrelation


class TestAutoCorrelation(unittest.TestCase):

    def setUp(self):
        print("*** AutoCorrelation UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** AutoCorrelation UnitTest End ***")

    def test_autocorrelation1(self):
        input_dataframe = self.iris
        
        res = autocorrelation(table=input_dataframe, input_col='sepal_length')['model']
        res_autocorrelation=res['autocorrelation_table']
        res_partial_autocorrelation=res['partial_autocorrelation_table']
        
        
        print("Autocorrelation Table\n", res_autocorrelation.values)
        
        print("Partial Autocorrelation Table\n", res_partial_autocorrelation.values)
        
        table1=res_autocorrelation.values.tolist()
        table2=res_partial_autocorrelation.values.tolist()
        self.assertListEqual(table1[1], [1, 0.5920665785767498, '(0.4320361893649062, 0.7520969677885935)'])
        self.assertListEqual(table1[19], [19, 0.3326828817365676, '(-0.15031337059372796, 0.8156791340668632)'])
        self.assertListEqual(table2[2], [2, 0.446878925378876, '(0.2868485361670323, 0.6069093145907197)'])
        self.assertListEqual(table2[18], [18, 0.057734494528377006, '(-0.10229589468346667, 0.21776488374022068)'])
    
    def test_autocorrelation2(self):
        input_dataframe = self.iris
        
        res = autocorrelation(table=input_dataframe, input_col='sepal_length', nlags=10, conf_level=0.99)['model']
        res_autocorrelation=res['autocorrelation_table']
        res_partial_autocorrelation=res['partial_autocorrelation_table']
        
        
        print("Autocorrelation Table\n", res_autocorrelation.values)
        
        print("Partial Autocorrelation Table\n", res_partial_autocorrelation.values)
        
        table1=res_autocorrelation.values.tolist()
        table2=res_partial_autocorrelation.values.tolist()
        self.assertListEqual(table1[1], [1, 0.5920665785767498, '(0.38175099663663753, 0.8023821605168622)'])
        self.assertListEqual(table1[9], [9, 0.4261180078628408, '(-0.07603010015333178, 0.9282661158790134)'])
        self.assertListEqual(table2[2], [2, 0.446878925378876, '(0.23656334343876373, 0.6571945073189883)'])
        self.assertListEqual(table2[8], [8, 0.10858539870660004, '(-0.10173018323351225, 0.31890098064671235)'])

if __name__ == '__main__':
    unittest.main()
