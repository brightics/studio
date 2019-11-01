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

from brightics.function.clustering.spectral_clustering import spectral_clustering
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class SpectralClustering(unittest.TestCase):
    
    def setUp(self):
        print("*** Spectral Clustering Train/Predict UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Spectral Clustering Train/Predict UnitTest End ***")
    
    def test(self):
        sc_train = spectral_clustering(self.testdata, input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], n_clusters=3)
        labels = sc_train['out_table']['prediction']
        
        exp = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 2, 0, 2, 2, 0]
        
        mapping = dict()
        
        for i in range(len(labels)):
            if labels[i] not in mapping.keys():
                mapping[labels[i]] = exp[i]
            else:
                self.assertEqual(exp[i], mapping[labels[i]])
        
