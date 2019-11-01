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

from brightics.function.statistics.normality_test import normality_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class NormalityTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Mann Whitney UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Mann Whitney UnitTest End ***")
    
    def test(self):
        normality_res = normality_test(self.testdata, input_cols=['sepal_length'], method=['kstest', 'jarque_bera', 'anderson'])
        kstest_res = normality_res['result']['kstest']
        self.assertAlmostEqual(kstest_res['sepal_length']['estimates'], 0.999991460094529)
        self.assertAlmostEqual(kstest_res['sepal_length']['p_value'], 1.0349293786381419e-130)
        jarque_bera_res = normality_res['result']['jarque_bera']
        self.assertAlmostEqual(jarque_bera_res['sepal_length']['estimates'], 4.485875437350938)
        self.assertAlmostEqual(jarque_bera_res['sepal_length']['p_value'], 0.10614621817187797)
        anderson_res = normality_res['result']['anderson']
        self.assertAlmostEqual(anderson_res['sepal_length']['estimates'][0], 0.8891994860134105)
        np.testing.assert_array_equal(anderson_res['sepal_length']['critical value'], [0.562, 0.64, 0.767, 0.895, 1.065])
