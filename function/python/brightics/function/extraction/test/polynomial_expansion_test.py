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


from brightics.function.extraction.polynomial_expansion import polynomial_expansion
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class PolynomialExpansion(unittest.TestCase):
    
    def setUp(self):
        print("*** PolynomialExpansion UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** PolynomialExpansion UnitTest End ***")
    
    def test(self):
        res = polynomial_expansion(self.testdata, input_cols=['sepal_length','sepal_width'])
        np.testing.assert_array_almost_equal([17.849999999999998,14.700000000000001,15.040000000000001,14.26,18], res['out_table']['sepal_length_sepal_width'][0:5], 10)
        np.testing.assert_array_almost_equal([26.009999999999998,24.010000000000005,22.090000000000003,21.159999999999997,25], res['out_table']['sepal_length_sepal_length'][0:5], 10)
        np.testing.assert_array_almost_equal([12.25,9,10.240000000000002,9.610000000000001,12.96], res['out_table']['sepal_width_sepal_width'][0:5], 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
