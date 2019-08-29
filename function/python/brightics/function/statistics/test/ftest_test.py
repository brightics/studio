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

from brightics.function.statistics.ftest import ftest_for_stacked_data
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class F_Test(unittest.TestCase):

    def setUp(self):
        print("*** F Test UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** F Test UnitTest End ***")

    def test(self):
        
        ftest = ftest_for_stacked_data(table = self.testdata, response_cols=['sepal_length'], first='setosa',second='versicolor',factor_col='species', alternatives=['larger', 'smaller', 'two-sided'], confi_level=0.99)['out_table']
        np.testing.assert_almost_equal(ftest.estimates[0], 0.4663429131686987, 10)
        np.testing.assert_array_almost_equal(ftest.p_value, [0.9956714058186501,0.0043285941813499046,0.008657188362699797], 10)
        np.testing.assert_array_almost_equal(ftest.lower_confidence_interval, [0.2376157326265369,0.0,0.22069688033086174], 10)

        