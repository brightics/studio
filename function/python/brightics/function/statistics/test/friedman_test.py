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

from brightics.function.statistics.friedman_test import friedman_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class FriedmanTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Friedman UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Friedman UnitTest End ***")
    
    def test(self):
        friedman_res = friedman_test(self.testdata, response_cols=['sepal_length'], factor_col='species')
        res = friedman_res['result']
        self.assertAlmostEqual(res['sepal_length_species']['Statistics'], 73.785714285)
        self.assertAlmostEqual(res['sepal_length_species']['P value'], 9.498077769131953e-17)
