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

from sklearn.preprocessing import MinMaxScaler, StandardScaler, MaxAbsScaler, RobustScaler
from brightics.function.extraction.scale import scale, scale_model
from brightics.common.datasets import load_iris
import unittest
import random
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


def get_iris_randomgroup():
    df = load_iris()
    random_group1 = []
    random_group2 = []
    random_group2_map = {1:'A', 2:'B'}
    for _ in range(len(df)):
        random_group1.append(random.randint(1, 2))
        random_group2.append(random_group2_map[random.randint(1, 2)])
    df['random_group1'] = random_group1
    df['random_group2'] = random_group2
    return df


class TestScale(unittest.TestCase):

    def setUp(self):
        print("*** Normalization/Model UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Normalization/Model UnitTest End ***")
        
    def test(self):
        
        nm = scale(self.testdata, input_cols=['sepal_length'], scaler='Min_Max', suffix=None)
        DF1 = nm['out_table'].values
        # print(DF1)
        np.testing.assert_almost_equal(DF1[0][5], 0.2222222222222221, 10)
        np.testing.assert_almost_equal(DF1[1][5], 0.16666666666666674, 10)
        np.testing.assert_almost_equal(DF1[2][5], 0.11111111111111116, 10)
        np.testing.assert_almost_equal(DF1[3][5], 0.08333333333333326, 10)
        np.testing.assert_almost_equal(DF1[4][5], 0.19444444444444442, 10)
                
        nm_model = scale_model(self.testdata, model=nm['model'])
        DF2 = nm_model['out_table'].values
        # print(DF2)
        np.testing.assert_almost_equal(DF2[0][5], 0.2222222222222221, 10)
        np.testing.assert_almost_equal(DF2[1][5], 0.16666666666666674, 10)
        np.testing.assert_almost_equal(DF2[2][5], 0.11111111111111116, 10)
        np.testing.assert_almost_equal(DF2[3][5], 0.08333333333333326, 10)
        np.testing.assert_almost_equal(DF2[4][5], 0.19444444444444442, 10)
        
    '''
    def test_groupby1(self):
        df = get_iris_randomgroup()
        enc_out = scale(df, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], scaler='RobustScaler', group_by=['random_group1', 'random_group2'])
        # print(enc_out['out_table'])
        # print(enc_out['model'].keys())
        model_out = scale_model(df, enc_out['model'])
        # print(model_out['out_table'])
    '''


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
