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

from brightics.function.extraction.pca import pca, pca_model
from brightics.common.datasets import load_iris
import unittest
import random
import pandas as pd
import numpy as np


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


class TestPCA(unittest.TestCase):

    def setUp(self):
        print("*** PCA/Model UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** PCA/Model UnitTest End ***")
        
    def test(self):
        
        _pca = pca(self.testdata, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], seed=12345)
        DF1 = _pca['out_table'].values
        # print(DF1)
        np.testing.assert_array_almost_equal(DF1[0][5:9], [-2.6842071251039474, 0.3266073147643872, -0.021511837001962797, 0.0010061572415412945], 10)
        np.testing.assert_array_almost_equal(DF1[1][5:9], [-2.71539061563413, -0.16955684755602674, -0.20352142500549092, 0.09960242401681729], 10)
        np.testing.assert_array_almost_equal(DF1[2][5:9], [-2.8898195396179154, -0.13734560960502842, 0.024709240998956827, 0.019304542832509375], 10)
        np.testing.assert_array_almost_equal(DF1[3][5:9], [-2.746437197308734, -0.31112431575199234, 0.037671975285301085, -0.07595527410853586], 10)
        np.testing.assert_array_almost_equal(DF1[4][5:9], [-2.728592981831314, 0.333924563568454, 0.09622969977460893, -0.06312873271710939], 10)
        
        Model = _pca['model']['model_table_explained_variance'].values
        # print(Model)
        np.testing.assert_array_almost_equal(Model[0], [4.2248407683, 0.9246162072, 0.9246162072], 10)
        np.testing.assert_array_almost_equal(Model[1], [0.2422435716, 0.0530155679, 0.977631775], 10)
        np.testing.assert_array_almost_equal(Model[2], [0.0785239081, 0.0171851395, 0.9948169145], 10)
        np.testing.assert_array_almost_equal(Model[3], [0.0236830271, 0.0051830855, 1.], 10)
                
        _pca_model = pca_model(self.testdata, model=_pca['model'], new_column_name='aaa')
        DF2 = _pca_model['out_table'].values
        # print(DF2)
        np.testing.assert_array_almost_equal(DF2[0][5:9], [-2.6842071251039474, 0.3266073147643872, -0.021511837001962797, 0.0010061572415412945], 10)
        np.testing.assert_array_almost_equal(DF2[1][5:9], [-2.71539061563413, -0.16955684755602674, -0.20352142500549092, 0.09960242401681729], 10)
        np.testing.assert_array_almost_equal(DF2[2][5:9], [-2.8898195396179154, -0.13734560960502842, 0.024709240998956827, 0.019304542832509375], 10)
        np.testing.assert_array_almost_equal(DF2[3][5:9], [-2.746437197308734, -0.31112431575199234, 0.037671975285301085, -0.07595527410853586], 10)
        np.testing.assert_array_almost_equal(DF2[4][5:9], [-2.728592981831314, 0.333924563568454, 0.09622969977460893, -0.06312873271710939], 10)
                
    '''
    def test_groupby1(self):
        df = get_iris_randomgroup()
        enc_out = pca(df, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], group_by=['random_group1', 'random_group2'])
        # print(enc_out['out_table'])
        model_out = pca_model(df, enc_out['model'])
        # print(model_out['out_table'])
    '''
