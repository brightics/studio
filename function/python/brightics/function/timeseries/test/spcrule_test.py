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

from brightics.common.datasets import load_iris
from brightics.function.timeseries import spcrule,spcrule_summ
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class SpcruleTest(unittest.TestCase):
    def setUp(self):
        print("*** Spc ruleset AD with/without summary UnitTest Start ***")
        testdata = load_iris()
        setosa = testdata[testdata.species=='setosa']
        versicolor = testdata[testdata.species=='versicolor']
        versicolor_test = versicolor[versicolor.sepal_length>6.5]
        testset = setosa.append(versicolor_test)
        testset = testset.reset_index(drop=True)
        testset['time'] = testset.index.astype(int)
        self.testdata = testset
        
    def tearDown(self):
        print("*** Spc ruleset AD with/without summary UnitTest End ***")

    def test_first(self):        
        spc = spcrule(self.testdata,time_col='time',value_col='sepal_length',ruleset_id='0')
        DF1 = spc['out_table'].values
        DF2 = spc['out_table2'].values
        np.testing.assert_string_equal(DF1[0][4], 'lack of samples')
        np.testing.assert_equal(DF1[0][5], None)
        np.testing.assert_string_equal(DF1[len(DF1)-1][4], '1')
        np.testing.assert_equal(DF1[len(DF1)-1][5], True)
        np.testing.assert_equal(DF2[0][3][-1],DF1[-1][1])
        np.testing.assert_equal(DF2[0][3][-2],DF1[-2][1])
        np.testing.assert_equal(DF2[0][3][-3],DF1[-3][1])
        np.testing.assert_equal(DF2[0][3][-4],DF1[-4][1])
        np.testing.assert_equal(DF2[0][3][-4],DF1[-4][1])
        np.testing.assert_equal(DF2[0][0],DF1[-1][2])
        np.testing.assert_equal(DF2[0][1],DF1[-1][3])
        self.summary = td['out_table2']
        
    def test_second(self):
        spc = spcrule(self.testdata,time_col='time',value_col='sepal_length',ruleset_id='0')
        self.summary = td['out_table2']
        spc2 = spcrule_summ(self.testdata,self.summary,time_col='time',value_col='sepal_length',ruleset_id='0')
        DF1 = spc2['out_table'].values
        DF2 = spc2['out_table2'].values
        np.testing.assert_string_equal(DF1[0][4], 'old_data')
        np.testing.assert_string_equal(DF1[len(DF1)-1][4], '1')
        np.testing.assert_equal(DF1[len(DF1)-1][5], True)
        np.testing.assert_equal(DF2[0][3][-1],DF1[-1][1])
        np.testing.assert_equal(DF2[0][3][-2],DF1[-2][1])
        np.testing.assert_equal(DF2[0][3][-3],DF1[-3][1])
        np.testing.assert_equal(DF2[0][3][-4],DF1[-4][1])
        np.testing.assert_equal(DF2[0][3][-4],DF1[-4][1])
        np.testing.assert_equal(DF2[0][0],DF1[-1][2])
        np.testing.assert_equal(DF2[0][1],DF1[-1][3])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))