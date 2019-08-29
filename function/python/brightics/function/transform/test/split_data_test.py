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
from brightics.function.transform import split_data
from brightics.common.datasets import load_iris


class TestSplitData(unittest.TestCase):
    
    def test_default(self):
        df_iris = load_iris()
        res = split_data(table=df_iris, train_ratio=7.0, test_ratio=3.0, random_state=12345, shuffle=True, stratify=None)
        df_train = res['train_table']
        df_test = res['test_table']
        
        self.assertEqual(105, len(df_train), 'wrong size of train table')
        self.assertEqual(45, len(df_test), 'wrong size of test table')
        
        self.assertListEqual([6.0, 2.9, 4.5, 1.5, 'versicolor'], df_train.loc[0].tolist(), 'incorrect train data in the 1st row')
        self.assertListEqual([4.9, 3.1, 1.5, 0.1, 'setosa'], df_train.loc[1].tolist(), 'incorrect train data in the 2nd row')
        self.assertListEqual([6.2, 2.2, 4.5, 1.5, 'versicolor'], df_train.loc[2].tolist(), 'incorrect train data in the 3rd row')

        self.assertListEqual([5.6, 2.5, 3.9, 1.1, 'versicolor'], df_test.loc[0].tolist(), 'incorrect train data in the 1st row')
        self.assertListEqual([4.4, 3.2, 1.3, 0.2, 'setosa'], df_test.loc[1].tolist(), 'incorrect train data in the 2nd row')
        self.assertListEqual([6.3, 3.3, 4.7, 1.6, 'versicolor'], df_test.loc[2].tolist(), 'incorrect train data in the 3rd row')
        
    def test_ratio(self):
        df_iris = load_iris()
        res = split_data(table=df_iris, train_ratio=1.0, test_ratio=1.0, random_state=12345, shuffle=True, stratify=None)
        df_train = res['train_table']
        df_test = res['test_table']
        
        self.assertEqual(75, len(df_train), 'wrong size of train table')
        self.assertEqual(75, len(df_test), 'wrong size of test table')
        
        self.assertListEqual([5.0, 3.4, 1.6, 0.4, 'setosa'], df_train.loc[0].tolist(), 'incorrect train data in the 1st row')
        self.assertListEqual([7.1, 3.0, 5.9, 2.1, 'virginica'], df_train.loc[1].tolist(), 'incorrect train data in the 2nd row')
        self.assertListEqual([6.7, 3.1, 4.7, 1.5, 'versicolor'], df_train.loc[2].tolist(), 'incorrect train data in the 3rd row')
        
        self.assertListEqual([5.6, 2.5, 3.9, 1.1, 'versicolor'], df_test.loc[0].tolist(), 'incorrect train data in the 1st row')
        self.assertListEqual([4.4, 3.2, 1.3, 0.2, 'setosa'], df_test.loc[1].tolist(), 'incorrect train data in the 2nd row')
        self.assertListEqual([6.3, 3.3, 4.7, 1.6, 'versicolor'], df_test.loc[2].tolist(), 'incorrect train data in the 3rd row')
