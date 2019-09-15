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


from brightics.function.transform.svd import svd
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class SVD(unittest.TestCase):
    
    def setUp(self):
        print("*** SVD UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** SVD UnitTest End ***")
    
    def test(self):
        result = svd(self.testdata, input_cols=['sepal_length', 'sepal_width', 'petal_length','petal_width'])
        np.testing.assert_array_almost_equal(result['out_table1'].values[0],[-0.061617117153134844, 0.129969428300602, -5.5836415524852264e-05, 0.001058479717233855],10)
        np.testing.assert_array_almost_equal(result['out_table1'].values[1],[-0.058072297692432835, 0.11137145174192188, 0.06843866291937341, 0.052114946120718285],10)
        np.testing.assert_array_almost_equal(result['out_table1'].values[2],[-0.056763385167306515, 0.11829476930334057, 0.0023106279323664644, 0.009078262539796619],10)
        np.testing.assert_array_almost_equal(result['out_table1'].values[3],[-0.056654313968970894, 0.10560772911761908, 0.004217687601316031, -0.042215314477986335],10)
        np.testing.assert_array_almost_equal(result['out_table1'].values[4],[-0.06123006441704712, 0.13143114177405957, -0.03390848386085196, -0.033253828091285506],10)
        np.testing.assert_array_almost_equal(result['out_table2'].values[0],[95.95066751235814, 17.722953278750552, 3.4692966644142356, 1.8789123626216575],10)
        np.testing.assert_array_almost_equal(result['out_table2'].values[1],[0.8061602452168879, 0.9550653099922299, 0.9842137163788149, 1.0],10)
        np.testing.assert_array_almost_equal(result['out_table3'].values[0],[-0.7511680505936611, 0.28583095949112386, 0.49942378035014656, 0.32345495820047576],10)
        np.testing.assert_array_almost_equal(result['out_table3'].values[1],[-0.37978836669281435, 0.5448897554611328, -0.6750249882866073, -0.32124323511472985],10)
        np.testing.assert_array_almost_equal(result['out_table3'].values[2],[-0.5131509372098667, -0.7088987448097414, -0.054719825226601126, -0.48077481836612357],10)
        np.testing.assert_array_almost_equal(result['out_table3'].values[3],[-0.16787933742053854, -0.3447584467378051, -0.5402988927775116, 0.7490228620900514],10)

        
