import unittest
from brightics.function.classification import svc_train, svc_predict
from brightics.function.transform import train_test_split

import pandas as pd
import numpy as np
from sklearn import svm
import matplotlib.pyplot as plt


class SVMTest(unittest.TestCase):
    
    def test1(self):
        df = pd.read_csv('sample_iris.csv')
        #print(df)
        
        df_splitted = train_test_split(df, 0.7, 0.3)
        
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        train_out = svc_train(train_df, ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], 'species')
        print(train_out['model']['svc_model'])
        
        predict_out = svc_predict(test_df, train_out['model'])
        
        print(predict_out['out_table'])

        