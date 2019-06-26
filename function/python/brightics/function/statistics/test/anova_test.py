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
from brightics.function.statistics.anova import twoway_anova


class TwowayAnovaTest(unittest.TestCase):
    def setUp(self):
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

    def test1(self):
        t1 = pd.DataFrame(self.example_df)
        print(t1)
        response_cols = ['value']
        factor_cols = ['Genotype', 'years']

        out1 = twoway_anova(table=t1, response_cols=response_cols, factor_cols=factor_cols, group_by=None)
        print(out1['result'])
