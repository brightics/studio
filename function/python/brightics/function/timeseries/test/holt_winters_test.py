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

from brightics.function.timeseries import holt_winters_train, holt_winters_predict
from brightics.common.datasets import load_iris
import unittest


class TestHoltWinters(unittest.TestCase):

    def setUp(self):
        print("*** Holt-Winters UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Holt-Winters UnitTest End ***")

    def test(self):
        
        hw_train = holt_winters_train(self.testdata, input_cols=['sepal_length'], period=12, model_type='multiplicative')
        DF1 = hw_train['model']
        # print(DF1['sse_sepal_length'])
        # print(DF1['aic_sepal_length'])
        # print(DF1['bic_sepal_length'])
        self.assertAlmostEqual(DF1['sse_sepal_length'], 75.0985720516664, 10)
        self.assertAlmostEqual(DF1['aic_sepal_length'], -71.77506241991551, 10)
        self.assertAlmostEqual(DF1['bic_sepal_length'], -23.604897714375426, 10)
 
        hw_predict = holt_winters_predict(model=DF1, prediction_num=24)
        DF2 = hw_predict['out_table'].values
        # print(DF2[0][1])
        # print(DF2[1][1])
        # print(DF2[2][1])
        # print(DF2[3][1])
        # print(DF2[4][1])
        self.assertAlmostEqual(DF2[0][1], 5.602275321420261, 10)
        self.assertAlmostEqual(DF2[1][1], 5.5832064381953055, 10)
        self.assertAlmostEqual(DF2[2][1], 5.496285744490528, 10)
        self.assertAlmostEqual(DF2[3][1], 5.449483922508893, 10)
        self.assertAlmostEqual(DF2[4][1], 5.183025448632435, 10)
