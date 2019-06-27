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
from brightics.common.datasets import load_iris
from brightics.function.extraction.extraction import add_row_number
from brightics.function.clustering import hierarchical_clustering, hierarchical_clustering_post


class TestHierarchicalClustering(unittest.TestCase):

    def setUp(self):
        print("*** Hierarchical Clustering UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Hierarchical Clustering UnitTest End ***")

    def test_hierarchical_clusteringt1(self):
        input_dataframe = self.iris
        res_clustering = hierarchical_clustering(input_dataframe,
                                              input_cols=['sepal_length', 'sepal_width',
                                                            'petal_length', 'petal_width'])
        res_post_process = hierarchical_clustering_post(res_clustering['model'],
                                                  num_clusters=3)
        
        print(res_post_process['out_table'])
        
        table = res_post_process['out_table'].values.tolist()
        self.assertListEqual(table[49], [5, 3.3, 1.4, 0.2, 'setosa', 'pt_49', 3])
        self.assertListEqual(table[50], [7, 3.2, 4.7, 1.4, 'versicolor', 'pt_50', 1])
        self.assertListEqual(table[51], [6.4, 3.2, 4.5, 1.5, 'versicolor', 'pt_51', 1])
        self.assertListEqual(table[52], [6.9, 3.1, 4.9, 1.5, 'versicolor', 'pt_52', 1])
        self.assertListEqual(table[53], [5.5, 2.3, 4, 1.3, 'versicolor', 'pt_53', 2])
        
    def test_hierarchical_clusteringt2(self):
        input_dataframe = self.iris
        
        res_clustering = hierarchical_clustering(add_row_number(table=input_dataframe, new_col='index')['out_table'],
                                              input_cols=['sepal_length', 'sepal_width',
                                                            'petal_length', 'petal_width'], input_mode='original', key_col='index', link='ward', met='euclidean', num_rows=10, figure_height=8.4, orient='top')
        res_post_process = hierarchical_clustering_post(res_clustering['model'],
                                                  num_clusters=5, cluster_col='cluster_name')
        
        print(res_post_process['out_table'])
        
        table = res_post_process['out_table'].values.tolist()
        self.assertListEqual(table[49], [49, 5, 3.3, 1.4, 0.2, 'setosa', 49, 1])
        self.assertListEqual(table[50], [50, 7, 3.2, 4.7, 1.4, 'versicolor', 50, 5])
        self.assertListEqual(table[51], [51, 6.4, 3.2, 4.5, 1.5, 'versicolor', 51, 5])
        self.assertListEqual(table[52], [52, 6.9, 3.1, 4.9, 1.5, 'versicolor', 52, 5])
        self.assertListEqual(table[53], [53, 5.5, 2.3, 4, 1.3, 'versicolor', 53, 4])


if __name__ == '__main__':
    unittest.main()
