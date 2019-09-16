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
import numpy as np
import HtmlTestRunner
import os


class KMeansSilhouetteTest(unittest.TestCase):

    def setUp(self):
        print("*** KMeans Silhouette UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** KMeans Silhouette UnitTest End ***")

    def test_kmeans_silhouette1(self):
        predict_out = kmeans_silhouette_train_predict(table=self.iris, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], n_clusters_list=[3, 2], prediction_col='predict', init='k-means++', n_init=3, max_iter=300, tol=0.0001, precompute_distances=True, seed=12345, n_jobs=1, algorithm='auto', n_samples=2, group_by=None)
        table = predict_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 0])
        self.assertListEqual(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 0])
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 0])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 0])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 0])

    def test_kmeans_silhouette_groupby1(self):
        predict_out = kmeans_silhouette_train_predict(table=self.iris, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], n_clusters_list=[3, 2], prediction_col='predict', init='random', n_init=3, max_iter=300, tol=0.0001, precompute_distances=False, seed=12345, n_jobs=1, algorithm='full', n_samples=2, group_by=['species'])
        table = predict_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 1])
        self.assertListEqual(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 0])
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 0])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 0])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 1])

    def test_kmeans_silhouette2(self):
        predict_out = kmeans_silhouette_train_predict(table=self.iris, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], n_clusters_list=[3, 2], prediction_col='predict', init='k-means++', n_init=3, max_iter=300, tol=0.0001, precompute_distances=True, seed=12345, n_jobs=1, algorithm='auto', n_samples=2, group_by=None)
        table = predict_out['model']['best_centers']

        self.assertAlmostEqual(table[0].tolist()[0], 5.00566038, 8)
        self.assertAlmostEqual(table[0].tolist()[1], 3.36037736, 8)
        self.assertAlmostEqual(table[0].tolist()[2], 1.56226415, 8)
        self.assertAlmostEqual(table[0].tolist()[3], 0.28867925, 8)

        self.assertAlmostEqual(table[1].tolist()[0], 6.30103093, 8)
        self.assertAlmostEqual(table[1].tolist()[1], 2.88659794, 8)
        self.assertAlmostEqual(table[1].tolist()[2], 4.95876289, 8)
        self.assertAlmostEqual(table[1].tolist()[3], 1.69587629, 8)

    def test_kmeans_silhouette_groupby2(self):
        predict_out = kmeans_silhouette_train_predict(table=self.iris, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], n_clusters_list=[3, 2], prediction_col='predict', init='random', n_init=3, max_iter=300, tol=0.0001, precompute_distances=False, seed=12345, n_jobs=1, algorithm='full', n_samples=2, group_by=['species'])
        table = predict_out['model']['_grouped_data']['data']['setosa']['best_centers'].tolist()

        self.assertAlmostEqual(table[0][0], 4.71304348, 8)
        self.assertAlmostEqual(table[0][1], 3.12173913, 8)
        self.assertAlmostEqual(table[0][2], 1.4173913, 7)
        self.assertAlmostEqual(table[0][3], 0.19130435, 8)

        self.assertAlmostEqual(table[1][0], 5.25555556, 8)
        self.assertAlmostEqual(table[1][1], 3.67037037, 8)
        self.assertAlmostEqual(table[1][2], 1.5037037, 7)
        self.assertAlmostEqual(table[1][3], 0.28888889, 8)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
