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
from brightics.function.extraction.pca import pca, pca_model
import random


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


class PCATest(unittest.TestCase):
    
    def test_groupby1(self):
        df = get_iris_randomgroup()
        enc_out = pca(df, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], group_by=['random_group1', 'random_group2'])
        print(enc_out['out_table'])
        model_out = pca_model(df, enc_out['model'])
        print(model_out['out_table'])
