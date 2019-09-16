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


from brightics.function.extraction.kernel_density_estimation import kernel_density_estimation
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class KernelDensityEstimation(unittest.TestCase):
    
    def setUp(self):
        print("*** KernelDensityEstimation UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** KernelDensityEstimation UnitTest End ***")
    
    def test(self):
        res = kernel_density_estimation(self.testdata, input_col='sepal_length', points='1 to 5 by 0.5', bandwidth=1.0, kernel='gaussian')
        np.testing.assert_array_almost_equal([0.00010057844059507809,0.0005600162258325031,0.0024931232862503505,0.008914560114578961,0.02574995950723397,0.060540261239952264,0.11699353665817123,0.1881373011908771], res['out_table']['input_estimated'], 10)
        
        res = kernel_density_estimation(self.testdata, input_col='sepal_length', points='1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5', bandwidth=1.0, kernel='gaussian')
        np.testing.assert_array_almost_equal([0.00010057844059507809,0.0005600162258325031,0.0024931232862503505,0.008914560114578961,0.02574995950723397,0.060540261239952264,0.11699353665817123,0.1881373011908771], res['out_table']['input_estimated'], 10)
        
        res = kernel_density_estimation(self.testdata, input_col='sepal_length', points='1.5', bandwidth=1.0, kernel='gaussian')
        np.testing.assert_array_almost_equal([0.0005600162258325031], res['out_table']['input_estimated'], 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
