import unittest
from brightics.function.classification import svm_classification_train, svm_classification_predict
from brightics.function.transform import split_data
from brightics.function.test_data import get_iris
import pandas as pd

class SVMTest(unittest.TestCase):
    
    def test1(self):
        iris = get_iris()
        
        df_splitted = split_data(iris, 0.7, 0.3)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svm_classification_train(train_df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        #print(train_out['model']['svc_model'])
        
        predict_out = svm_classification_predict(test_df, train_out['model'])
        print(predict_out['out_table'][['species', 'prediction']])
        
    def predict_thresholds(self):
        iris = get_iris()
        
        df_splitted = split_data(iris, 0.7, 0.3)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svm_classification_train(train_df, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        #print(train_out['model']['svc_model'])
        
        predict_out = svm_classification_predict(test_df, train_out['model'], thresholds=[0.1, 0.2, 0.3])
        print(predict_out['out_table'][['species', 'prediction']])