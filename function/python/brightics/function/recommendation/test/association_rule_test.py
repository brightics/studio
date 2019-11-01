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

from brightics.function.recommendation.association_rule import association_rule
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class AssociationRule(unittest.TestCase):
    
    def setUp(self):
        print("*** Association Rule UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Association Rule UnitTest End ***")
    
    def test(self):
        result = association_rule(self.testdata, input_mode='merong', items='petal_length', user_name='petal_width', min_support=0.1)['out_table']
        np.testing.assert_array_equal(result.values[:5], [[[1.4], [1.5], 0.13636363636363635, 1.0, 5.5, np.inf], [[1.3], [1.5], 0.13636363636363635, 1.0, 5.5, np.inf], [[1.3], [1.7], 0.13636363636363635, 1.0, 5.5, np.inf], [[1.3], [1.5, 1.7], 0.13636363636363635, 1.0, 7.333333333333333, np.inf], [[1.3, 1.5], [1.7], 0.13636363636363635, 1.0, 5.5, np.inf]])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
