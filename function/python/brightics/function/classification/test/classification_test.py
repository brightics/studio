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
from brightics.function.classification import svm_classification_train, svm_classification_predict
from brightics.function.transform import split_data
from brightics.common.datasets import load_iris
import pandas as pd
import random
from brightics.function.classification.decision_tree_classification import decision_tree_classification_train, \
    decision_tree_classification_predict
from brightics.function.classification.logistic_regression import logistic_regression_train, \
    logistic_regression_predict
from brightics.function.classification.xgb_classification import xgb_classification_train, \
    xgb_classification_predict
import HtmlTestRunner
import os


class SVMTest(unittest.TestCase):
    
    def test1(self):
        iris = load_iris()
        
        df_splitted = split_data(table=iris, train_ratio=0.7, test_ratio=0.3)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svm_classification_train(table=train_df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        
        predict_out = svm_classification_predict(table=test_df, model=train_out['model'])
        
    def test_predict_thresholds(self):
        iris = load_iris()
        
        df_splitted = split_data(table=iris, train_ratio=0.7, test_ratio=0.3)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svm_classification_train(table=train_df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        
        predict_out = svm_classification_predict(table=test_df, model=train_out['model'], thresholds=[0.1, 0.2, 0.3])
        
    def test_groupby1(self):
        df = load_iris()
        random_group = []
        for _ in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = svm_classification_train(table=df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = svm_classification_predict(table=df, model=train_out['model'])
        

class DecisionTreeClassificationTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        random_group = []
        for _ in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = decision_tree_classification_train(table=df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = decision_tree_classification_predict(table=df, model=train_out['model'])
        
        
class LogisticRegressionTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        random_group = []
        for _ in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = logistic_regression_train(table=df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = logistic_regression_predict(table=df, model=train_out['model'])
        
        
class XGBClassificationTest(unittest.TestCase):
    
    def test_groupby1(self):
        df = load_iris()
        random_group = []
        for _ in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = xgb_classification_train(table=df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = xgb_classification_predict(table=df, model=train_out['model'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
