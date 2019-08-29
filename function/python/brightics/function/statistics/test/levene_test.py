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


from brightics.function.statistics.levene import levenes_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class Levene(unittest.TestCase):
    
    def setUp(self):
        print("*** Levene UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Levene UnitTest End ***")
    
    def test(self):
        lv_res = levenes_test(self.testdata, response_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], factor_col='species', proportiontocut=0.05)
        self.assertAlmostEqual(lv_res['result']['result_table']['estimate'][0], 6.3527200204)
        self.assertAlmostEqual(lv_res['result']['result_table']['estimate'][1], 0.6475222363)
        self.assertAlmostEqual(lv_res['result']['result_table']['estimate'][2], 19.7200553250)
        self.assertAlmostEqual(lv_res['result']['result_table']['estimate'][3], 19.4122066520)
        self.assertAlmostEqual(lv_res['result']['result_table']['p_value'][0], 0.0022585277)
        self.assertAlmostEqual(lv_res['result']['result_table']['p_value'][1], 0.5248269975)
        self.assertAlmostEqual(lv_res['result']['result_table']['p_value'][2], 0.0000000258)
        self.assertAlmostEqual(lv_res['result']['result_table']['p_value'][3], 0.0000000330)