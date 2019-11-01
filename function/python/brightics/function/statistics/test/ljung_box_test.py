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

from brightics.function.statistics.ljung_box_test import ljung_box_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class LjungBoxTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Ljung Box UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Ljung Box UnitTest End ***")
    
    def test(self):
        ljung_box_res = ljung_box_test(self.testdata, input_cols=['sepal_length'])
        res = ljung_box_res['result']
        np.testing.assert_array_equal(res['sepal_length']['test statistic'], [53.640111429938216, 115.72030122938357, 157.70753453568318, 205.86448490926406, 253.7103615654276, 293.99972126275895, 329.6735119082845, 367.4405128743274, 396.8018284136885, 431.65426125578165, 461.2967029890127, 487.31715823508773, 529.4990430946578, 553.2201652339571, 585.3922435460893, 603.346849506536, 627.3885392021973, 651.4528131370209, 670.7158369191009, 689.8279444088038, 710.9128835550674, 731.3677722817637, 749.068789060117, 760.0741445738382, 773.003742481151, 786.2903390230085, 794.529069362496, 802.4876998903106, 807.8263677731406, 814.1203993710192, 820.5656276646013, 827.6273347664466, 832.3984060714226, 838.6368169721275, 844.5382632835885, 850.4264426285702, 852.8257553716717, 854.6583161145444, 856.5278360217529, 859.0746839206541])
        self.assertAlmostEqual(res['sepal_length']['p-value based on chi-square distribution'][0], 2.407926277925491e-13)
        self.assertAlmostEqual(res['sepal_length']['p-value based on chi-square distribution'][1], 7.44142083570756e-26)
