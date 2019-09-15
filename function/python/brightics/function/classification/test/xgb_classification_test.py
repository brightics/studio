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
from brightics.function.classification import xgb_classification_train, xgb_classification_predict
import HtmlTestRunner
import os


class TestXgbClassification(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        model_train = xgb_classification_train(table=df_iris,
                                          feature_cols=['sepal_length', 'sepal_width'],
                                          label_col='species',
                                          max_depth=3, learning_rate=0.1, n_estimators=100, random_state=12345)['model']

        df_feature_importance = model_train['feature_importance_table']
        np.testing.assert_array_almost_equal([0.6451905965805054, 0.354809433221817], [df_feature_importance.values[i][1] for i in range(2)], 10, 'incorrect feature_importance')
        
        df_test = xgb_classification_predict(table=df_iris,
                                             model=model_train,
                                             prediction_col='prediction', probability_col='probability',
                                             thresholds=None, suffix='index',
                                             output_margin=False, ntree_limit=None)['out_table']
                                             
        self.assertListEqual(['setosa'] * 5, df_test['prediction'].tolist()[:5], 'incorrect prediction')                                   
        np.testing.assert_array_almost_equal([0.9957091808, 0.9548807144, 0.9963358641, 0.9958093166, 0.9968782663], df_test['probability_0'].values[:5].astype('float64'), 10, 'incorrect probability_0')
        np.testing.assert_array_almost_equal([0.003195002 , 0.0195275117, 0.0022283769, 0.0019767662, 0.0020245721], df_test['probability_1'].values[:5].astype('float64'), 10, 'incorrect probability_1')
        np.testing.assert_array_almost_equal([0.0010958249, 0.0255918186, 0.0014357698, 0.0022139512, 0.0010971115], df_test['probability_2'].values[:5].astype('float64'), 10, 'incorrect probability_2')
        
    def test_class_weight(self):
        df_iris = load_iris()
        model_train = xgb_classification_train(table=df_iris,
                                          feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
                                          label_col='species',
                                          max_depth=3, learning_rate=0.1, n_estimators=100, class_weight=[0, 1, 1], random_state=12345)['model']

        df_feature_importance = model_train['feature_importance_table']
        np.testing.assert_array_almost_equal([0.0338172317, 0.036154151 , 0.3261058331, 0.6039227843], [df_feature_importance.values[i][1] for i in range(4)], 10, 'incorrect feature_importance')
        
        df_test = xgb_classification_predict(table=df_iris,
                                             model=model_train,
                                             prediction_col='prediction', probability_col='probability',
                                             thresholds=None, suffix='index',
                                             output_margin=False, ntree_limit=None)['out_table']
        
        self.assertListEqual(['versicolor'] * 5, df_test['prediction'].tolist()[:5], 'incorrect prediction')                                 
        np.testing.assert_array_almost_equal([0.0007314461, 0.0010454282, 0.0010394535, 0.0010394285, 0.0010394535], df_test['probability_0'].values[:5].astype('float64'), 10, 'incorrect probability_0')
        np.testing.assert_array_almost_equal([0.9976045489, 0.9954549074, 0.9956334233, 0.9956094623, 0.9956334233], df_test['probability_1'].values[:5].astype('float64'), 10, 'incorrect probability_1')
        np.testing.assert_array_almost_equal([0.0016639883, 0.0034996143, 0.0033270852, 0.0033510949, 0.0033270852], df_test['probability_2'].values[:5].astype('float64'), 10, 'incorrect probability_2')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
