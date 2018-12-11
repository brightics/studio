import unittest
from brightics.function.regression.linear_regression import linear_regression_train,\
    linear_regression_predict
from brightics.function.test_data import get_iris


class LinearRegressionTest(unittest.TestCase):
    
    def test1(self):
        df = get_iris()
        train_out = linear_regression_train(df, feature_cols=['sepal_length', 'sepal_width'], label_col='petal_width', group_by=['species'])
        predict_out = linear_regression_predict(df, train_out['model'], prediction_col='pred_col')
        print(predict_out.keys())
        print(predict_out['out_table'][['petal_width', 'pred_col']])