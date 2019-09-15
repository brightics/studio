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


from brightics.function.timeseries.autocorrelation import autocorrelation
from brightics.common.datasets import load_iris
import unittest
import numpy as np
import HtmlTestRunner
import os


class AutocorrelationTest(unittest.TestCase):

    def setUp(self):
        print("*** Autocorrelation UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Autocorrelation UnitTest End ***")

    def test_first(self):
        
        ac = autocorrelation(self.testdata, input_col = 'sepal_length', nlags=20, conf_level=0.95)
        DF1 = ac['model']['autocorrelation_table'].values
        np.testing.assert_array_almost_equal(eval(DF1[0][2]), (1.0, 1.0), 10)
        np.testing.assert_array_almost_equal(eval(DF1[1][2]), (0.4320361893649062, 0.7520969677885935), 10)
        np.testing.assert_array_almost_equal(eval(DF1[2][2]), (0.42608371979516196, 0.8435251500982057), 10)
        np.testing.assert_array_almost_equal(eval(DF1[3][2]), (0.26690903594574483, 0.7736814927568862), 10)
        np.testing.assert_array_almost_equal(eval(DF1[4][2]), (0.27590364628708264, 0.8347240215595538), 10)
        np.testing.assert_array_almost_equal(DF1[0][0:2], [0, 1.0], 10)
        np.testing.assert_array_almost_equal(DF1[1][0:2], [1, 0.5920665785767498], 10)
        np.testing.assert_array_almost_equal(DF1[2][0:2], [2, 0.6348044349466838], 10)
        np.testing.assert_array_almost_equal(DF1[3][0:2], [3, 0.5202952643513156], 10)
        np.testing.assert_array_almost_equal(DF1[4][0:2], [4, 0.5553138339233182], 10)
        
    def test_second(self):
        
        ac = autocorrelation(self.testdata, input_col = 'sepal_width', nlags=15, conf_level=0.99)
        DF2 = ac['model']['partial_autocorrelation_table'].values
        np.testing.assert_array_almost_equal(eval(DF2[0][2]), (1.0, 1.0), 10)
        np.testing.assert_array_almost_equal(eval(DF2[1][2]), (0.22620960205307344, 0.646840765933298), 10)
        np.testing.assert_array_almost_equal(eval(DF2[2][2]), (-0.06555562287373096, 0.35507554100649363), 10)
        np.testing.assert_array_almost_equal(eval(DF2[3][2]), (-0.028540476994406955, 0.3920906868858176), 10)
        np.testing.assert_array_almost_equal(eval(DF2[4][2]), (0.019521431191183797, 0.44015259507140836), 10)
        np.testing.assert_array_almost_equal(DF2[0][0:2], [0, 1.0], 10)
        np.testing.assert_array_almost_equal(DF2[1][0:2], [1, 0.43652518399318574], 10)
        np.testing.assert_array_almost_equal(DF2[2][0:2], [2, 0.14475995906638134], 10)
        np.testing.assert_array_almost_equal(DF2[3][0:2], [3, 0.18177510494570534], 10)
        np.testing.assert_array_almost_equal(DF2[4][0:2], [4, 0.2298370131312961], 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
