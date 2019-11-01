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

from brightics.function.extraction.replace_string import replace_string
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class ReplaceString(unittest.TestCase):
    
    def setUp(self):
        print("*** ReplaceString UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** ReplaceString UnitTest End ***")
    
    def test(self):
        res = replace_string(self.testdata, input_cols=['species'], replace_mode='full', target_string_null=False, target_string='versicolor', replace_string_null=False, replace_string='ver_si_co_lor')
        np.testing.assert_array_equal(res['out_table']['species'].values, ['setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'ver_si_co_lor', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica', 'virginica'])
        res = replace_string(self.testdata, input_cols=['species'], replace_mode='part', target_string_null=False, target_string='nica', replace_string_null=False, replace_string='_ni_ca')
        np.testing.assert_array_equal(res['out_table']['species'].values, ['setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'setosa', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'versicolor', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca', 'virgi_ni_ca'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
