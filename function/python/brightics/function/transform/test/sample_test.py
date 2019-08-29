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
import pandas as pd
import numpy as np
from brightics.function.transform import random_sampling
from brightics.common.datasets import load_iris


class TestRandomSampling(unittest.TestCase):
    
    def test_default(self):
        df_iris = load_iris()
        df_res = random_sampling(table=df_iris, num_or_frac='num', num=1, frac=50, replace=False, seed=12345)['table']
        
        self.assertListEqual([5.6, 2.5, 3.9, 1.1, 'versicolor'], df_res.loc[69].tolist(), 'incorrect sample')
        
    def test_frac_replace(self):
        df_iris = load_iris()
        df_res = random_sampling(table=df_iris, num_or_frac='frac', num=10, frac=50, replace=True, seed=12345)['table'].reset_index(drop=True)
        
        self.assertListEqual([4.7, 3.2, 1.6, 0.2, 'setosa'], df_res.loc[0].tolist(), 'incorrect sample[0]') 
        self.assertListEqual([7.2, 3.0, 5.8, 1.6, 'virginica'], df_res.loc[1].tolist(), 'incorrect sample[1]')  
        self.assertListEqual([6.2, 2.8, 4.8, 1.8, 'virginica'], df_res.loc[2].tolist(), 'incorrect sample[2]') 
        self.assertListEqual([5.8, 2.7, 5.1, 1.9, 'virginica'], df_res.loc[3].tolist(), 'incorrect sample[3]') 
        self.assertListEqual([4.9, 3.1, 1.5, 0.1, 'setosa'], df_res.loc[4].tolist(), 'incorrect sample[4]')
