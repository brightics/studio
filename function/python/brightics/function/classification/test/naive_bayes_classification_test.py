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

from brightics.function.classification.naive_bayes_classification import naive_bayes_train
from brightics.function.classification.naive_bayes_classification import naive_bayes_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class NaiveBayesClassification(unittest.TestCase):
    
    def setUp(self):
        print("*** Naive Bayes Classification UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Naive Bayes Classification UnitTest End ***")
    
    def test(self):
        naive_train = naive_bayes_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        naive_model = naive_train['model']['nb_model']
        
        
        np.testing.assert_array_almost_equal(naive_model.class_log_prior_, [-1.0986122886681096, -1.0986122886681096, -1.0986122886681096] , 10)
        np.testing.assert_array_almost_equal(naive_model.feature_log_prob_[0], [-0.7089390602578369, -1.088673592418579, -1.9288223546340486, -3.6553696752150584] , 10)
        predict = naive_bayes_predict(self.testdata, naive_train['model'], suffix = 'index')
        prob1 = predict['out_table']['probability_1']
        prob2 = predict['out_table']['probability_2']
        np.testing.assert_array_almost_equal(prob1[:5],[0.1609057108 ,0.1996142797 ,0.1803124811 ,0.2085379644 ,0.1564119916],10)
        np.testing.assert_array_almost_equal(prob2[:5],[0.0870622943 ,0.1158949593 ,0.1031335674 ,0.1235653077 ,0.0843493850],10)
        """
        outfile = open('D:/tmp', 'w')
        for i in range(5):
            print("%.10f " % prob1[i], end = ',', file=outfile)
        print('', file=outfile)
        for i in range(5):
            print("%.10f " % prob2[i], end = ',', file=outfile)
        print('', file=outfile)
            
        outfile.close()
        """
