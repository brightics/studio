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

import pandas as pd
import unittest
from brightics.function.statistics import bartletts_test
from brightics.function.statistics.anova import oneway_anova
from brightics.function.statistics.anova import twoway_anova
from brightics.common.datasets import load_iris
import HtmlTestRunner
import os


class TestBartlettsTest(unittest.TestCase):

    def test_default(self):
        df_iris = load_iris()
        df_res = bartletts_test(table=df_iris,
                                response_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'],
                                factor_col='species')['result']['result_table']
        
        self.assertListEqual(['sepal_length by species', 'sepal_width by species', 'petal_length by species', 'petal_width by species'],
                             df_res['data'].tolist(), 'incorrect data column')
        self.assertAlmostEqual(16.005701874401502, df_res['estimate'].values[0], 10, 'sepal_length by species: incorrect estimate')
        self.assertAlmostEqual(2.2158125491551637, df_res['estimate'].values[1], 10, 'sepal_length by species: incorrect estimate')
        self.assertAlmostEqual(8.904503355816222e-13, df_res['p_value'].values[2], 10, 'petal_length by species: incorrect p_value')
        self.assertAlmostEqual(5.615311140767724e-09, df_res['p_value'].values[3], 10, 'petal_width by species: incorrect p_value')

        
class TwowayAnovaTest(unittest.TestCase):

    def setUp(self):
        print("*** n-way Anova UnitTest Start ***")
        self.iris = load_iris()
        self.example_df = pd.DataFrame({'Genotype': ['A', 'A', 'A', 'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'E',
                                                     'E', 'E', 'F', 'F', 'F', 'A', 'A', 'A', 'B', 'B', 'B', 'C', 'C',
                                                     'C', 'D', 'D', 'D', 'E', 'E', 'E', 'F', 'F', 'F', 'A', 'A', 'A',
                                                     'B', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D', 'E', 'E', 'E', 'F',
                                                     'F', 'F'],
                                        'years': ['year_1', 'year_1', 'year_1', 'year_1', 'year_1', 'year_1', 'year_1',
                                                  'year_1', 'year_1', 'year_1', 'year_1', 'year_1', 'year_1', 'year_1',
                                                  'year_1', 'year_1', 'year_1', 'year_1', 'year_2', 'year_2', 'year_2',
                                                  'year_2', 'year_2', 'year_2', 'year_2', 'year_2', 'year_2', 'year_2',
                                                  'year_2', 'year_2', 'year_2', 'year_2', 'year_2', 'year_2', 'year_2',
                                                  'year_2', 'year_3', 'year_3', 'year_3', 'year_3', 'year_3', 'year_3',
                                                  'year_3', 'year_3', 'year_3', 'year_3', 'year_3', 'year_3', 'year_3',
                                                  'year_3', 'year_3', 'year_3', 'year_3', 'year_3'],
                                        'value': [1.53, 1.83, 1.38, 3.6, 2.94, 4.02, 3.99, 3.3, 4.41, 3.75, 3.63, 3.57,
                                                  1.71, 2.01, 2.04, 3.96, 4.77, 4.65, 4.08, 3.84, 3.96, 5.7, 5.07, 7.2,
                                                  6.09, 5.88, 6.51, 5.19, 5.37, 5.55, 3.6, 5.1, 6.99, 5.25, 5.28, 5.07,
                                                  6.69, 5.97, 6.33, 8.55, 7.95, 8.94, 10.02, 9.63, 10.38, 11.4, 9.66,
                                                  10.53, 6.87, 6.93, 6.84, 9.84, 9.87, 10.08]})

    def tearDown(self):
        print("*** n-way Anova UnitTest End ***")

    def test_oneway1(self):
        oneway_anova_out = oneway_anova(table=self.iris, response_cols=['sepal_width'], factor_col='petal_width', group_by=None)
        # print(oneway_anova_out['result'])

    def test_oneway2(self):
        oneway_anova_out = oneway_anova(table=self.iris, response_cols=['sepal_width'], factor_col='petal_width', group_by=['species'])
        # print(oneway_anova_out['result'])

    def test_twoway1(self):
        twoway_anova_out = twoway_anova(table=self.example_df, response_cols=['value'], factor_cols=['Genotype', 'years'], group_by=None)
        # print(twoway_anova_out['result'])

    def test_twoway2(self):
        twoway_anova_out = twoway_anova(table=self.example_df, response_cols=['value'], factor_cols=['Genotype', 'years'], group_by=['Genotype'])
        # print(twoway_anova_out['result'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
