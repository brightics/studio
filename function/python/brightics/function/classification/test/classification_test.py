import unittest
from brightics.function.classification import svm_classification_train, svm_classification_predict
from brightics.function.transform import split_data
from brightics.function.test_data import get_iris
import pandas as pd
import random
from brightics.function.classification.decision_tree_classification import decision_tree_classification_train, \
    decision_tree_classification_predict
from brightics.function.classification.logistic_regression import logistic_regression_train, \
    logistic_regression_predict
from brightics.function.classification.xgb_classification import xgb_classification_train, \
    xgb_classification_predict


class SVMTest(unittest.TestCase):
    
    def test1(self):
        iris = get_iris()
        
        df_splitted = split_data(iris, 0.7, 0.3)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svm_classification_train(train_df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        # print(train_out['model']['svc_model'])
        
        predict_out = svm_classification_predict(test_df, train_out['model'])
        print(predict_out['out_table'][['species', 'prediction']])
        
    def predict_thresholds(self):
        iris = get_iris()
        
        df_splitted = split_data(iris, 0.7, 0.3)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svm_classification_train(train_df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        # print(train_out['model']['svc_model'])
        
        predict_out = svm_classification_predict(test_df, train_out['model'], thresholds=[0.1, 0.2, 0.3])
        print(predict_out['out_table'][['species', 'prediction']])
        
    def groupby1(self):
        df = get_iris()
        random_group = []
        for i in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = svm_classification_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = svm_classification_predict(df, train_out['model'])
        print(predict_out['out_table'][['species', 'prediction']])
        

class DecisionTreeClassificationTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        random_group = []
        for i in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = decision_tree_classification_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = decision_tree_classification_predict(df, train_out['model'])
        print(predict_out['out_table'][['species', 'prediction']])
        
        
class LogisticRegressionTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        random_group = []
        for i in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = logistic_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = logistic_regression_predict(df, train_out['model'])
        print(predict_out['out_table'][['species', 'prediction']])
        
        
class XGBClassificationTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        random_group = []
        for i in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        
        train_out = xgb_classification_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', group_by=['random_group'])
        predict_out = xgb_classification_predict(df, train_out['model'])
        print(predict_out['out_table'][['species', 'prediction']])
