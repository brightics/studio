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


from brightics.function.timeseries.unit_root_test import unit_root_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class UnitRootTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Unit Root Test UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Unit Root Test UnitTest End ***")
    
    def test(self):
        result = unit_root_test(self.testdata, input_col = 'sepal_length')['model']
        np.testing.assert_almost_equal(result['adf'], -1.4361052468046858 , 10)
        np.testing.assert_almost_equal(result['p_value'], 0.5648497057270827 , 10)
        np.testing.assert_almost_equal(result['usedlag'], 12 , 10)
        np.testing.assert_almost_equal(result['nobs'], 137 , 10)
        np.testing.assert_almost_equal(result['critical_values']['1%'], -3.479007355368944 , 10)
        np.testing.assert_almost_equal(result['critical_values']['5%'], -2.8828782366015093 , 10)
        np.testing.assert_almost_equal(result['critical_values']['10%'], -2.5781488587564603 , 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
