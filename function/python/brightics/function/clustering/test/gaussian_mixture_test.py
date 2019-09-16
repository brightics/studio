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


from brightics.function.clustering.gaussian_mixture import gaussian_mixture_train, gaussian_mixture_predict
from brightics.common.datasets import load_iris
import unittest
import numpy as np
import HtmlTestRunner
import os


class GaussianMixture(unittest.TestCase):
    
    def setUp(self):
        print("*** Gaussian Mixture Train/Predict UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Gaussian Mixture Train/Predict UnitTest End ***")
    
    def test(self):
        
        gmm_train = gaussian_mixture_train(self.testdata, input_cols=['sepal_length', 'sepal_width', 'petal_length'],
                                           number_of_components=3, seed=12345)
        DF1 = gmm_train['model']['summary']['weight']
        # print(DF1)
        self.assertAlmostEqual(DF1[0], 0.33333327721668965, 10)
        self.assertAlmostEqual(DF1[1], 0.23263376331644228, 10)
        self.assertAlmostEqual(DF1[2], 0.4340329594668679, 10)
        DF2 = gmm_train['model']['summary']['mean_coordinate'][0]
        # print(DF2)
        self.assertAlmostEqual(DF2[0], 5.006000085165278, 10)
        self.assertAlmostEqual(DF2[1], 3.418000188146268, 10)
        self.assertAlmostEqual(DF2[2], 1.4640000275826497, 10)
        
        gmm_predict = gaussian_mixture_predict(self.testdata, model=gmm_train['model'], display_probability=None)
        DF3 = gmm_predict['out_table'].values
        # print(DF3)
        np.testing.assert_equal(DF3[0][5], 0)
        np.testing.assert_equal(DF3[1][5], 0)
        np.testing.assert_equal(DF3[2][5], 0)
        np.testing.assert_equal(DF3[147][5], 2)
        np.testing.assert_equal(DF3[148][5], 1)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
