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
import numpy as np
from sklearn.model_selection import train_test_split
from brightics.common.datasets import load_iris
from brightics.function.classification import knn_classification


class TestKNNClassification(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        df_train, df_test = train_test_split(df_iris, random_state=12345)
        df_res = knn_classification(train_table=df_train, test_table=df_test,
                                    feature_cols=['sepal_length', 'sepal_width'], label_col='species',
                                    k=5, algorithm='auto', leaf_size=30, p=2)['out_table']
        
        self.assertListEqual(['versicolor', 'setosa', 'virginica', 'setosa', 'setosa'], df_res['prediction'].tolist()[:5], 'incorrect prediction')                                    
        np.testing.assert_array_almost_equal([0.0, 1.0, 0.0, 1.0, 1.0], df_res['probability_0'].values[:5], 7, 'incorrect probability_0')
        np.testing.assert_array_almost_equal([0.8, 0.0, 0.2, 0.0, 0.0], df_res['probability_1'].values[:5], 7, 'incorrect probability_1')
        np.testing.assert_array_almost_equal([0.2, 0.0, 0.8, 0.0, 0.0], df_res['probability_2'].values[:5], 7, 'incorrect probability_2')

    def test_optional(self):
        df_iris = load_iris()
        df_train, df_test = train_test_split(df_iris, random_state=12345)
        df_res = knn_classification(train_table=df_train, test_table=df_test,
                                    feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='species',
                                    k=10, algorithm='auto', leaf_size=30, p=2)['out_table']
        
        self.assertListEqual(['versicolor', 'setosa', 'versicolor', 'setosa', 'setosa'], df_res['prediction'].tolist()[:5], 'incorrect prediction')                                    
        np.testing.assert_array_almost_equal([0.0, 1.0, 0.0, 1.0, 1.0], df_res['probability_0'].values[:5], 7, 'incorrect probability_0')
        np.testing.assert_array_almost_equal([1.0, 0.0, 0.7, 0.0, 0.0], df_res['probability_1'].values[:5], 7, 'incorrect probability_1')
        np.testing.assert_array_almost_equal([0.0, 0.0, 0.3, 0.0, 0.0], df_res['probability_2'].values[:5], 7, 'incorrect probability_2')
