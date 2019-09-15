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
from brightics.function.classification import random_forest_classification_train, random_forest_classification_predict
import HtmlTestRunner
import os


class TestRandomForestClassification(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        model_train = random_forest_classification_train(table=df_iris,
                                                         feature_cols=['sepal_length', 'sepal_width'],
                                                         label_col='species',
                                                         n_estimators=10, criterion="gini",
                                                         max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                                         min_weight_fraction_leaf=0, max_features="sqrt",
                                                         max_leaf_nodes=None, min_impurity_decrease=0, class_weight=None, random_state=12345)['model']
         
        df_feature_importance = model_train['feature_importance_table']
        np.testing.assert_array_almost_equal([0.6271406867, 0.3728593133], [df_feature_importance.values[i][1] for i in range(2)], 10, 'incorrect feature_importance')
                                                        
        df_test = random_forest_classification_predict(table=df_iris,
                                                       model=model_train,
                                                       pred_col_name='prediction', prob_col_prefix='probability', suffix='index')['out_table']
                                             
        self.assertListEqual(['setosa'] * 5, df_test['prediction'].tolist()[:5], 'incorrect prediction')
        np.testing.assert_array_almost_equal([1.0, 1.0, 1.0, 1.0, 1.0], df_test['probability_0'].values[:5], 10, 'incorrect probability_0')
        np.testing.assert_array_almost_equal([0.0, 0.0, 0.0, 0.0, 0.0], df_test['probability_1'].values[:5], 10, 'incorrect probability_1')
        np.testing.assert_array_almost_equal([0.0, 0.0, 0.0, 0.0, 0.0], df_test['probability_2'].values[:5], 10, 'incorrect probability_2')
        
    def test_optional(self):
        df_iris = load_iris()
        model_train = random_forest_classification_train(table=df_iris,
                                                         feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
                                                         label_col='species',
                                                         n_estimators=10, criterion="entropy",
                                                         max_depth=None, min_samples_split=2, min_samples_leaf=1,
                                                         min_weight_fraction_leaf=0, max_features="sqrt",
                                                         max_leaf_nodes=None, min_impurity_decrease=0, class_weight=[0, 1, 3], random_state=12345)['model']
                                                         
        df_feature_importance = model_train['feature_importance_table']
        np.testing.assert_array_almost_equal([0.1542031364, 0.0474156052, 0.5028529743, 0.2955282841], [df_feature_importance.values[i][1] for i in range(4)], 10, 'incorrect feature_importance')
        
        df_test = random_forest_classification_predict(table=df_iris,
                                                       model=model_train,
                                                       pred_col_name='prediction', prob_col_prefix='probability', suffix='index')['out_table']
        
        self.assertListEqual(['versicolor'] * 5, df_test['prediction'].tolist()[:5], 'incorrect prediction')                                   
        np.testing.assert_array_almost_equal([0.0, 0.0, 0.0, 0.0, 0.0], df_test['probability_0'].values[:5], 10, 'incorrect probability_0')
        np.testing.assert_array_almost_equal([1. , 0.8, 0.8, 0.8, 1.], df_test['probability_1'].values[:5], 10, 'incorrect probability_1')
        np.testing.assert_array_almost_equal([0. , 0.2, 0.2, 0.2, 0.], df_test['probability_2'].values[:5], 10, 'incorrect probability_2')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
