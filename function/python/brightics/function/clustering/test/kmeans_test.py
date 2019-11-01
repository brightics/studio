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
from brightics.function.clustering.kmeans import kmeans_train_predict, kmeans_predict
from brightics.common.datasets import load_iris
import HtmlTestRunner
import os


class KMeansTest(unittest.TestCase):

    def setUp(self):
        print("*** KMeans UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** KMeans UnitTest End ***")

    def test_kmeans_1(self):
        train_out = kmeans_train_predict(self.iris, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], seed=12345)
        predict_out = kmeans_predict(self.iris, train_out['model'])
        table = predict_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 0])
        self.assertListEqual(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 0])
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 0])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 0])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 0])

    def test_kmeans_groupby1(self):
        train_out = kmeans_train_predict(self.iris, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], seed=12345, n_clusters=2, n_init=4, max_iter=10, n_jobs=3, n_samples=2, group_by=['species'])
        predict_out = kmeans_predict(self.iris, train_out['model'])
        table = predict_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 1])
        self.assertListEqual(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 0])
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 0])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 0])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 1])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
