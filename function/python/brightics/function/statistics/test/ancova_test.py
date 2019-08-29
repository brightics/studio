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


from brightics.function.statistics.ancova import ancova
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class Ancova(unittest.TestCase):
    
    def setUp(self):
        print("*** Ancova UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Ancova UnitTest End ***")
    
    def test(self):
        acv_res = ancova(self.testdata, response_cols=['sepal_length', 'sepal_width', 'petal_length'], factor_col='petal_width', between_col='species')
        sepal_length_res = acv_res['result']['_grouped_data']['sepal_length']
        sepal_width_res = acv_res['result']['_grouped_data']['sepal_width']
        petal_length_res = acv_res['result']['_grouped_data']['petal_length']
        np.testing.assert_array_equal([round(x, 15) for x in sepal_length_res['SS']], [0.035976611203942,5.179385219249953,33.776279306611876])
        np.testing.assert_array_equal([round(x, 15) for x in sepal_length_res['F'][0:2]], [0.077755533522417,22.388204311848675])
        np.testing.assert_array_equal([round(x, 15) for x in sepal_length_res['p-unc'][0:2]], [0.925228863130016,0.000005209190425])
        np.testing.assert_array_equal([round(x, 15) for x in sepal_width_res['SS']], [11.326033726136874,3.908856506250405,13.125890313070389]) 
        np.testing.assert_array_equal([round(x, 15) for x in sepal_width_res['F'][0:2]], [62.990048087228601,43.478425942983783])
        np.testing.assert_array_equal([round(x, 15) for x in sepal_width_res['p-unc'][0:2]], [0.000000000000000,0.000000000733167])
        np.testing.assert_array_equal([round(x, 15) for x in petal_length_res['SS']], [13.019810102934493,6.332585167433126,20.887004664475192])
        np.testing.assert_array_equal([round(x, 15) for x in petal_length_res['F'][0:2]], [45.504185630347727,44.264721021379003])
        np.testing.assert_array_equal([round(x, 15) for x in petal_length_res['p-unc'][0:2]], [0.000000000000000,0.000000000538366])