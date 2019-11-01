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

from brightics.function.statistics.wilcoxon_test import wilcoxon_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class WilcoxonTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Wilcoxon UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Wilcoxon UnitTest End ***")
    
    def test(self):
        wilcoxon_res = wilcoxon_test(self.testdata, response_col='sepal_length', factor_col='species')
        res = wilcoxon_res['result']
        self.assertEqual(res['setosa_versicolor']['Statistics'], 19.0)
        self.assertAlmostEqual(res['setosa_versicolor']['P value'], 3.479904217643913e-09)
        self.assertEqual(res['setosa_virginica']['Statistics'], 0.0)
        self.assertAlmostEqual(res['setosa_virginica']['P value'], 1.0947696934612459e-09)
        self.assertEqual(res['versicolor_virginica']['Statistics'], 171.0)
        self.assertAlmostEqual(res['versicolor_virginica']['P value'], 1.883485656410222e-05)
