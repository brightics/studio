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


from brightics.function.extraction.lda import lda
from brightics.function.extraction.lda import lda_model as lda_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class LDA(unittest.TestCase):
    
    def setUp(self):
        print("*** LDA UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** LDA UnitTest End ***")
    
    def test(self):
        lda_res = lda(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species')
        lda_model = lda_res['model']['lda_model']
        res_intercept = lda_model.intercept_ if hasattr(lda_model, 'intercept_') else None
        res_covariance = lda_model.covariance_ if hasattr(lda_model, 'covariance_') else None
        res_explained_variance_ratio = lda_model.explained_variance_ratio_ if \
            hasattr(lda_model, 'explained_variance_ratio_') else None
        res_mean = lda_model.means_ if hasattr(lda_model, 'means_') else None
        res_priors = lda_model.priors_ if hasattr(lda_model, 'priors_') else None
        res_scalings = lda_model.scalings_ if hasattr(lda_model, 'scalings_') else None
        res_xbar = lda_model.xbar_ if hasattr(lda_model, 'xbar_') else None
        res_classes = lda_model.classes_ if hasattr(lda_model, 'classes_') else None
        
        np.testing.assert_array_equal([round(x, 15) for x in res_intercept], [-15.395513774632914 , -2.111574455331304 , -33.636549891487867 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_covariance[0]], [0.259708000000000 , 0.091220000000000 , 0.164093333333333 , 0.037704000000000 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_covariance[1]], [0.091220000000000 , 0.113566666666667 , 0.054133333333333 , 0.032754666666667 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_covariance[2]], [0.164093333333333 , 0.054133333333333 , 0.181466666666667 , 0.041690666666667 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_covariance[3]], [0.037704000000000 , 0.032754666666667 , 0.041690666666667 , 0.041170666666667 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_explained_variance_ratio], [0.991472475659508 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_mean[0]], [5.005999999999999, 3.418000000000000, 1.464000000000000, 0.244000000000000])
        np.testing.assert_array_equal([round(x, 15) for x in res_mean[1]], [5.936000000000000, 2.770000000000000, 4.260000000000000, 1.326000000000000])
        np.testing.assert_array_equal([round(x, 15) for x in res_mean[2]], [6.587999999999998, 2.974000000000000, 5.552000000000000, 2.026000000000000])
        np.testing.assert_array_equal([round(x, 15) for x in res_priors], [0.333333333333333 , 0.333333333333333 , 0.333333333333333 ])
        np.testing.assert_array_equal([round(x, 15) for x in res_scalings[0]], [-0.819268517078646, 0.032859753412294])
        np.testing.assert_array_equal([round(x, 15) for x in res_scalings[1]], [-1.547873204332895, 2.154711055309698])
        np.testing.assert_array_equal([round(x, 15) for x in res_scalings[2]], [2.184940557484971, -0.930246792285624])
        np.testing.assert_array_equal([round(x, 15) for x in res_scalings[3]], [2.853850022210224, 2.806004602417054])
        np.testing.assert_array_equal([round(x, 15) for x in res_xbar], [5.843333333333332 , 3.054000000000000 , 3.758666666666666 , 1.198666666666666 ])
        
        predict = lda_predict(self.testdata, lda_res['model'])['out_table']['prediction']
        np.testing.assert_array_equal(predict, ['setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','virginica','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','virginica','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','versicolor','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica'])
        
