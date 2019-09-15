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


from brightics.function.extraction.encoder import label_encoder, label_encoder_model, \
    one_hot_encoder, one_hot_encoder_model
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
    for i in range(len(df)):
        random_group1.append(random.randint(1, 2))
        random_group2.append(random_group2_map[random.randint(1, 2)])
    df['random_group1'] = random_group1
    df['random_group2'] = random_group2
    return df


class TestLabelEncoder(unittest.TestCase):

    def setUp(self):
        print("*** Label Encoder UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Label Encoder UnitTest End ***")
        
    def test(self):
        
        le = label_encoder(self.testdata, input_col='species')
        DF1 = le['out_table'].values
        # print(DF1)
        np.testing.assert_equal(DF1[0][5], 0)
        np.testing.assert_equal(DF1[1][5], 0)
        np.testing.assert_equal(DF1[2][5], 0)
        np.testing.assert_equal(DF1[3][5], 0)
        np.testing.assert_equal(DF1[4][5], 0)
                
        le_model = label_encoder_model(self.testdata, model=le['model'], new_column_name='new_col')
        DF2 = le_model['out_table'].values
        # print(DF2)
        np.testing.assert_equal(DF2[0][5], 0)
        np.testing.assert_equal(DF2[1][5], 0)
        np.testing.assert_equal(DF2[2][5], 0)
        np.testing.assert_equal(DF2[3][5], 0)
        np.testing.assert_equal(DF2[4][5], 0)
        
    '''                
    def test_groupby1(self):
        df = get_iris_randomgroup()
        enc_out = label_encoder(df, input_col='species', group_by=['random_group1', 'random_group2'])
        # print(enc_out['out_table'])
        # print(enc_out['model'].keys())
        model_out = label_encoder_model(df, enc_out['model'])
        # print(model_out['out_table'])
    '''


class TestOneHotEncoder(unittest.TestCase):

    def setUp(self):
        print("*** One Hot Encoder/Model UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** One Hot Encoder/Model UnitTest End ***")
        
    def test(self):
        
        ohe = one_hot_encoder(self.testdata, input_cols=['species'], prefix_list=['list'])
        DF1 = ohe['out_table'].values
        # print(DF1)
        np.testing.assert_array_equal(DF1[0][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF1[1][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF1[2][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF1[3][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF1[4][5:8], [1.0, 0.0, 0.0])
                
        ohe_model = one_hot_encoder_model(self.testdata, model=ohe['model'])
        DF2 = ohe_model['out_table'].values
        # print(DF2)
        np.testing.assert_array_equal(DF2[0][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF2[1][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF2[2][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF2[3][5:8], [1.0, 0.0, 0.0])
        np.testing.assert_array_equal(DF2[4][5:8], [1.0, 0.0, 0.0])
                
    '''
    def test_groupby1(self):
        df = get_iris_randomgroup()
        enc_out = one_hot_encoder(df, input_cols=['sepal_length', 'sepal_width'], prefix_list=['a', 'b'], group_by=['random_group1', 'random_group2'])
        # print(enc_out['out_table'])
        model_out = one_hot_encoder_model(df, enc_out['model'])
        # print(model_out['out_table'])
    '''


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
