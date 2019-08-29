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


from brightics.function.statistics.duncan_test import duncan_test
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class Duncan(unittest.TestCase):
    
    def setUp(self):
        print("*** Duncan UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Duncan UnitTest End ***")
    
    def test(self):
        duncan_res = duncan_test(self.testdata, response_cols=['sepal_length'], factor_col='species')
        res = duncan_res['result']
        np.testing.assert_array_equal(res['sepal_length_species']['critical_val']['critical_value'], [0.20346880603871212, 0.21415681109106452])
        np.testing.assert_array_equal(res['sepal_length_species']['mean_by_factor']['sepal_length'], [6.587999999999998,5.936,5.005999999999999])
        np.testing.assert_array_equal(res['sepal_length_species']['comp_by_factor']['difference'], [0.6519999999999984,1.581999999999999,0.9300000000000006])
        np.testing.assert_array_equal(res['sepal_length_species']['comp_by_factor']['significant'], ['YES','YES','YES'])