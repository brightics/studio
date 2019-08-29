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
from brightics.common.datasets import load_iris
from brightics.function.regression import random_forest_regression_train, random_forest_regression_predict


class TestRandomForestRegression(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        model_train = random_forest_regression_train(table=df_iris,
                                                     feature_cols=['sepal_length', 'sepal_width'],
                                                     label_col='petal_length',
                                                     n_estimators=10, criterion="mse",
                                                     max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                                     min_weight_fraction_leaf=0, max_features="None",
                                                     max_leaf_nodes=None, min_impurity_decrease=0, random_state=12345)['model']
        df_res = random_forest_regression_predict(table=df_iris, model=model_train, prediction_col='prediction')['out_table']
                                           
        np.testing.assert_array_almost_equal([1.3975, 1.4200000000000002, 1.446, 1.45, 1.41],
                                             df_res['prediction'].values[:5], 7, 'incorrect prediction')
        
    def test_optional(self):
        
        df_iris = load_iris()
        model_train = random_forest_regression_train(table=df_iris,
                                                     feature_cols=['sepal_length', 'sepal_width', 'petal_length'],
                                                     label_col='petal_width',
                                                     n_estimators=20, criterion="mse",
                                                     max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                                     min_weight_fraction_leaf=0, max_features="None",
                                                     max_leaf_nodes=None, min_impurity_decrease=0, random_state=12345)['model']
        df_res = random_forest_regression_predict(table=df_iris, model=model_train, prediction_col='prediction')['out_table']
                                           
        np.testing.assert_array_almost_equal([0.24708333333333332, 0.19000000000000009, 0.20000000000000004, 0.19166666666666674, 0.23875000000000002],
                                             df_res['prediction'].values[:5], 7, 'incorrect prediction')
