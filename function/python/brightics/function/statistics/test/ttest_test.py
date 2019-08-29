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

import unittest
import numpy as np
from brightics.common.datasets import load_iris
from brightics.function.statistics import one_sample_ttest, paired_ttest, two_sample_ttest_for_stacked_data


class TestOneSampleTTest(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        df_res = one_sample_ttest(table=df_iris,
                                  input_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
                                  alternatives=['Greater', 'Less', 'Two Sided'],
                                  hypothesized_mean=0,
                                  conf_level=0.95)['model']['result']

        np.testing.assert_array_almost_equal([86.4253746172] * 3, df_res['t_value'].values[:3], 7, 'incorrect t-value')
        np.testing.assert_array_almost_equal([2.1874883768175626e-129, 1., 4.374976753635125e-129], df_res['p_value'].values[3:6], 7, 'incorrect p-value')
        np.testing.assert_array_almost_equal([3.5202193882, -np.inf, 3.4739936640], df_res['lower_confidence_interval'].values[6:9], 7, 'incorrect lower confidence limit')
        np.testing.assert_array_almost_equal([np.inf, 1.3018017244, 1.3217956315], df_res['upper_confidence_interval'].values[9:12], 7, 'incorrect upper confidence limit')

    def test_optional(self):
        df_iris = load_iris()
        df_res = one_sample_ttest(table=df_iris,
                                  input_cols=['sepal_length'],
                                  alternatives=['Less'],
                                  hypothesized_mean=5.0,
                                  conf_level=0.99)['model']['result']
              
        self.assertAlmostEqual(12.4732571467, df_res['t_value'].values[0], 7, 'incorrect t-value')
        self.assertAlmostEqual(1., df_res['p_value'].values[0], 7, 'incorrect p-value')
        self.assertAlmostEqual(-np.inf, df_res['lower_confidence_interval'].values[0], 7, 'incorrect lower confidence limit')
        self.assertAlmostEqual(6.0023304639 , df_res['upper_confidence_interval'].values[0], 7, 'incorrect upper confidence limit')

        
class TestPairedTTest(unittest.TestCase):

    def setUp(self):
        print("*** Paired T Test UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** Paired T Test UnitTest End ***")

    def test_first(self):
        
        ptt = paired_ttest(self.testdata, first_column='sepal_length', second_column='sepal_width', alternative=['greater'], hypothesized_difference=0, confidence_level=0.95)
        DF1 = ptt['model']
        # print(DF1)
        self.assertEqual(DF1['degree_of_freedom'], 149)
        self.assertAlmostEqual(DF1['mean_of_differences'], 2.7893333333333334, 10)
        self.assertAlmostEqual(DF1['t_value'], 35.008548217517124, 10)
        self.assertAlmostEqual(DF1['summary'].values[0][1], 4.430261188837228e-74, 10)
        
    def test_second(self):
        
        ptt = paired_ttest(self.testdata, first_column='sepal_width', second_column='petal_length', alternative=['greater', 'less', 'twosided'], hypothesized_difference=-0.69, confidence_level=0.99)
        DF2 = ptt['model']
        # print(DF2)
        self.assertEqual(DF2['degree_of_freedom'], 149)
        self.assertAlmostEqual(DF2['mean_of_differences'], -0.7046666666666664, 10)
        self.assertAlmostEqual(DF2['t_value'], -0.09044302374175528, 10)
        self.assertAlmostEqual(DF2['summary'].values[0][1], 0.5359716817253225, 10)

        
class TTestForStackedDataTest(unittest.TestCase):

    def setUp(self):
        print("*** T Test for stacked data UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** T Test for stacked data Test UnitTest End ***")

    def test(self):
        
        ttest = two_sample_ttest_for_stacked_data(table=self.testdata, response_cols=['sepal_length'], first='setosa', second='versicolor', factor_col='species', alternatives=['larger', 'smaller', 'two-sided'], confi_level=0.93, hypo_diff=0.3)['out_table']
        np.testing.assert_almost_equal(ttest.estimates[0], -13.914852805468179, 10)
        np.testing.assert_array_almost_equal(ttest.p_value, [1.0, 3.0531725711507176e-25, 6.106345142301435e-25], 10)
        np.testing.assert_array_almost_equal(ttest.lower_confidence_interval, [-1.0615185295011744, -np.inf, -1.0919325209228996], 10)
