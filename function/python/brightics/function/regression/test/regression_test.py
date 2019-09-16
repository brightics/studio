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
from brightics.function.regression.linear_regression import linear_regression_train, \
    linear_regression_predict
from brightics.common.datasets import load_iris
from brightics.function.regression.decision_tree_regression import decision_tree_regression_train, \
    decision_tree_regression_predict
from brightics.function.regression.glm import glm_train, glm_predict
from brightics.function.regression.xgb_regression import xgb_regression_train, \
    xgb_regression_predict
import HtmlTestRunner
import os


class LinearRegressionTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        train_out = linear_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = linear_regression_predict(df, train_out['model'])
        #print(predict_out['out_table'][['petal_width', 'prediction']])

        
class DecisionTreeRegressionTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        train_out = decision_tree_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = decision_tree_regression_predict(df, train_out['model'])
        #print(predict_out['out_table'][['petal_width', 'prediction']])

        
class GLMTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        train_out = glm_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = glm_predict(df, train_out['model'])
        #print(predict_out['out_table'][['petal_width', 'prediction']])

        
class XGBRegressionTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        train_out = xgb_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = xgb_regression_predict(df, train_out['model'])
        #print(predict_out['out_table'][['petal_width', 'prediction']])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
