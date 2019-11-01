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
from brightics.function.clustering.kmeans import kmeans_train_predict, \
    kmeans_predict, kmeans_silhouette_train_predict
from brightics.common.datasets import load_iris
import HtmlTestRunner
import os


class KMeansTest(unittest.TestCase):
    
    def test_kmeans_groupby1(self):
        df = load_iris()
        train_out = kmeans_train_predict(df, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], group_by=['species'])
        predict_out = kmeans_predict(df, train_out['model'])
        
    def test_kmeans_silhouette_groupby1(self):
        df = load_iris()
        train_out = kmeans_silhouette_train_predict(df, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], group_by=['species'])
        predict_out = kmeans_predict(df, train_out['model'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
