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

from brightics.function.statistics.mann_whitney_test import mann_whitney_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class MannWhitneyTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Mann Whitney UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Mann Whitney UnitTest End ***")
    
    def test(self):
        mann_whitney_res = mann_whitney_test(self.testdata, response_col='sepal_length', factor_col='species')
        res = mann_whitney_res['result']
        self.assertEqual(res['setosa_versicolor']['Statistics'], 168.5)
        self.assertAlmostEqual(res['setosa_versicolor']['P value'], 4.172913572970345e-14)
        self.assertEqual(res['setosa_virginica']['Statistics'], 38.5)
        self.assertAlmostEqual(res['setosa_virginica']['P value'], 3.198349534698269e-17)
        self.assertEqual(res['versicolor_virginica']['Statistics'], 526.0)
        self.assertAlmostEqual(res['versicolor_virginica']['P value'], 2.9345032053320985e-07)
