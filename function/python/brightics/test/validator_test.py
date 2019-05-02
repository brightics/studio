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

# -*- coding:utf-8 -*-

import unittest

import pandas as pd

from brightics.common.validator import ParamValidator, DataFrameValidator, NumberValidator


class ValidatorTest(unittest.TestCase):

    maxDiff = None

    def test_param_validator(self):
        self.assertFalse(ParamValidator('test param', 'parameter').among(['parameter', 2, 3]).result())

        self.assertEqual(ParamValidator('test param', 'parameter').among([1, 2, 3]).result(),
                         [('BR-0000', 'test param not in 1, 2, 3')])
        self.assertEqual(ParamValidator('test param', 'parameter').among(['p', 2, 3]).result(),
                         [('BR-0000', 'test param not in p, 2, 3')])

        self.assertFalse(ParamValidator('test param', 1).among([1, 2, 3]).result())

        self.assertEqual(ParamValidator('test param', 0).among([1, 2, 3]).result(),
                         [('BR-0000', 'test param not in 1, 2, 3')])

    def test_number_validator(self):
        self.assertEqual(NumberValidator('number', 'k').greater_than(2).result(),
                         [('BR-0000', 'number is not a number')])

        self.assertFalse(NumberValidator('number', 3).greater_than(2).result())
        self.assertFalse(NumberValidator('number', 3).greater_than_or_equal_to(3).result())

        self.assertEqual(NumberValidator('number', 3).greater_than(3).result(),
                         [('BR-0000', 'number should be greater than 3')])
        self.assertFalse(NumberValidator('number', 3).greater_than_or_equal_to(3).result())
        self.assertEqual(NumberValidator('number', 3).greater_than_or_equal_to(4).result(),
                         [('BR-0000', 'number should be greater than or equal to 4')])
        self.assertEqual(NumberValidator('number', 3).less_than(3).result(),
                         [('BR-0000', 'number should be less than 3')])
        self.assertFalse(NumberValidator('number', 3).less_than_or_equal_to(3).result())
        self.assertEqual(NumberValidator('number', 3).less_than_or_equal_to(2).result(),
                         [('BR-0000', 'number should be less than or equal to 2')])
        self.assertEqual(NumberValidator('number', 3).less_than(3).greater_than(3).result(),
                         [('BR-0000', 'number should be less than 3'), ('BR-0000', 'number should be greater than 3')])

    def test_dataframe_validator(self):
        self.assertEqual(DataFrameValidator('df', '123').has_columns(['one']).result(),
                         [('BR-0000', 'df is not a pandas dataframe')])

        df = pd.DataFrame({'one': [1, 2], 'two': [True, False]})
        self.assertFalse(DataFrameValidator('df', df).has_columns(['one']).result())
        self.assertEqual(DataFrameValidator('df', df).has_columns(['three']).result(),
                         [('BR-0000', 'three are not in dataframe columns one, two')])


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(ValidatorTest)
    unittest.TextTestRunner(verbosity=2).run(suite)
