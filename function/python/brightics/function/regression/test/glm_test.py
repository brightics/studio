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

from brightics.function.regression.glm import glm_train
from brightics.function.regression.glm import glm_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class GLMRegression(unittest.TestCase):
    
    def setUp(self):
        print("*** GLM Regression UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** GLM Regression UnitTest End ***")
    
    def test(self):
        glm_model = glm_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', family="Poisson", link='log', group_by = ['species'])['model']
        np.testing.assert_array_almost_equal(glm_model['_grouped_data']['data']['setosa']['coefficients'], [-3.6342016377 ,0.1245708937 ,0.1885508496 ,0.6428621488] , 10)
        predict = glm_predict(self.testdata, glm_model)['out_table']['prediction']
        np.testing.assert_array_almost_equal(predict[:5],[0.2371754544 ,0.2105262982 ,0.1999606014 ,0.2203860121 ,0.2386977666],10)
        

        
