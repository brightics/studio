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

from brightics.function.statistics.kruskal_wallis_test import kruskal_wallis_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class KruskalWallisTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Kruskal Wallis UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Kruskal Wallis UnitTest End ***")
    
    def test(self):
        kruskal_wallis_res = kruskal_wallis_test(self.testdata, response_cols=['sepal_length'], factor_col='species')
        res = kruskal_wallis_res['result']
        self.assertAlmostEqual(res['sepal_length_species']['Statistics'], 96.937436000)
        self.assertAlmostEqual(res['sepal_length_species']['P value'], 8.91873433246198e-22)
