import unittest
from brightics.function.regression.linear_regression import linear_regression_train, \
    linear_regression_predict
from brightics.function.test_data import get_iris
from brightics.function.regression.decision_tree_regression import decision_tree_regression_train, \
    decision_tree_regression_predict
from brightics.function.regression.glm import glm_train, glm_predict
from brightics.function.regression.xgb_regression import xgb_regression_train, \
    xgb_regression_predict


class LinearRegressionTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        train_out = linear_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = linear_regression_predict(df, train_out['model'])
        print(predict_out['out_table'][['petal_width', 'prediction']])

        
class DecisionTreeRegressionTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        train_out = decision_tree_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = decision_tree_regression_predict(df, train_out['model'])
        print(predict_out['out_table'][['petal_width', 'prediction']])

        
class GLMTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        train_out = glm_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = glm_predict(df, train_out['model'])
        print(predict_out['out_table'][['petal_width', 'prediction']])

        
class XGBRegressionTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        train_out = xgb_regression_train(df, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', group_by=['species'])
        predict_out = xgb_regression_predict(df, train_out['model'])
        print(predict_out['out_table'][['petal_width', 'prediction']])
