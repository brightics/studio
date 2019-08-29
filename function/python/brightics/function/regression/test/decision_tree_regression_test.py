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
from brightics.function.regression import decision_tree_regression_train
from brightics.function.regression import decision_tree_regression_predict
from brightics.common.datasets import load_iris


class TestDecisionTreeRegression(unittest.TestCase):
    
    def test_default(self):
        df_iris = load_iris()
        model_train = decision_tree_regression_train(table=df_iris,
                                                     feature_cols=['sepal_length', 'sepal_width'], label_col=['petal_length'],
                                                     criterion='mse', splitter='best', max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                                     min_weight_fraction_leaf=0.0, max_features=None, random_state=12345, max_leaf_nodes=None,
                                                     min_impurity_decrease=0.0, min_impurity_split=None, presort=False,
                                                     sample_weight=None, check_input=True, X_idx_sorted=None)['model']
        df_res = decision_tree_regression_predict(table=df_iris, model=model_train, prediction_col='prediction', check_input=True)['out_table']
                                           
        np.testing.assert_array_almost_equal([1.4, 1.4, 1.4500000000000002, 1.5, 1.4],
                                             df_res['prediction'].values[:5], 7, 'incorrect prediction')   
        
    def test_optional(self):
        df_iris = load_iris()
        model_train = decision_tree_regression_train(table=df_iris,
                                                     feature_cols=['sepal_length', 'sepal_width'], label_col=['petal_length'],
                                                     criterion='mae', splitter='best', max_depth=5, min_samples_split=2, min_samples_leaf=1,
                                                     min_weight_fraction_leaf=0.0, max_features=None, random_state=12345, max_leaf_nodes=None,
                                                     min_impurity_decrease=0.0, min_impurity_split=None, presort=False,
                                                     sample_weight=None, check_input=True, X_idx_sorted=None)['model']
        df_res = decision_tree_regression_predict(table=df_iris, model=model_train, prediction_col='prediction', check_input=True)['out_table']
                                           
        np.testing.assert_array_almost_equal([1.5, 1.4, 1.5, 1.4, 1.5],
                                             df_res['prediction'].values[:5], 7, 'incorrect prediction')        

