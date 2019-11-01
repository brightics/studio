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
import numpy as np
from brightics.function.statistics import correlation
from brightics.common.datasets import load_iris
import HtmlTestRunner
import os


class CorrelationTest(unittest.TestCase):

    def setUp(self):
        print("*** Correlation UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Correlation UnitTest End ***")
        
    def test_first(self):
        
        cr = correlation(self.testdata, vars=['sepal_length', 'sepal_width'], method='pearson', display_plt=True, height=2.5, corr_prec=2)
        DF1 = cr['result']['corr_table'].values
        # print(DF1)
        np.testing.assert_equal(DF1[0][0], 'sepal_width')
        np.testing.assert_equal(DF1[0][1], 'sepal_length')
        np.testing.assert_almost_equal(DF1[0][2], -0.10936924995064935, 10)
        np.testing.assert_almost_equal(DF1[0][3], 0.1827652152713665, 10)
        
    def test_second(self):
        
        cr = correlation(self.testdata, vars=['sepal_width', 'petal_length', 'petal_width'], method='spearman', display_plt=False, height=2.5, corr_prec=2)
        DF2 = cr['result']['corr_table'].values
        # print(DF2)
        np.testing.assert_almost_equal(DF2[0][2], -0.3034206463815157, 10)
        np.testing.assert_almost_equal(DF2[0][3], 0.0001603809454660342, 10)
        np.testing.assert_almost_equal(DF2[1][2], -0.2775110724763029, 10)
        np.testing.assert_almost_equal(DF2[1][3], 0.0005856929405699988, 10)
        np.testing.assert_almost_equal(DF2[2][2], 0.9360033509355782, 10)
        np.testing.assert_almost_equal(DF2[2][3], 5.383649646072797e-69, 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
