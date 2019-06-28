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
import pandas as pd
from brightics.common.datasets import load_iris, _load_iris_sklearn, \
    load_random_table, load_random_float_table, add_category_column, \
    load_basic_test_data, load_random_classification, load_random_regression, \
    _save_dataset, load_dataset, _remove_dataset
import random
import string
import logging
import uuid


class DatasetTest(unittest.TestCase):

    def setUp(self):
        unittest.TestCase.setUp(self)
        self.logger = logging.getLogger(self.__class__.__name__)
        # self.logger.setLevel(logging.DEBUG)
        self.logger.addHandler(logging.StreamHandler())

    def test_save_load_parquet(self):
        data_name = 'iris_' + str(uuid.uuid4())
        iris = _load_iris_sklearn()
        _save_dataset(iris, data_name)
        iris_reload = load_dataset(data_name)
        pd.testing.assert_frame_equal(iris, iris_reload)
        _remove_dataset(data_name)

    def test_iris(self):
        iris_parquet = load_iris()
        iris_sklearn = _load_iris_sklearn()
        pd.testing.assert_frame_equal(iris_parquet, iris_sklearn)

    def test_basic_test_data(self):
        _seed = random.randint(0, 100)
        _data_size = random.randint(10, 50)
        data1 = load_basic_test_data(seed=_seed, data_size=_data_size)
        data2 = load_basic_test_data(seed=_seed, data_size=_data_size)
        self.logger.debug(data1)
        pd.testing.assert_frame_equal(data1, data2)

    def test_load_random_classification(self):
        _seed = random.randint(0, 100)
        _data_size = random.randint(150, 500)
        _n_xcol = random.randint(1, 5)
        _n_class = random.randint(2, 5)
        data1 = load_random_classification(seed=_seed, data_size=_data_size,
                                           n_xcol=_n_xcol,
                                           n_class=_n_class)
        data2 = load_random_classification(seed=_seed, data_size=_data_size,
                                           n_xcol=_n_xcol,
                                           n_class=_n_class)
        self.logger.debug(data1)
        pd.testing.assert_frame_equal(data1, data2)

    def test_load_random_regression(self):
        _seed = random.randint(0, 100)
        _data_size = random.randint(150, 500)
        _n_xcol = random.randint(1, 5)
        data1 = load_random_regression(seed=_seed, data_size=_data_size,
                                       n_xcol=_n_xcol)
        data2 = load_random_regression(seed=_seed, data_size=_data_size,
                                       n_xcol=_n_xcol)
        self.logger.debug(data1)
        pd.testing.assert_frame_equal(data1, data2)

    def test_randomfloat(self):
        _seed = random.randint(0, 100)
        _n_col = random.randint(1, 5)
        rf1 = load_random_float_table(seed=_seed, n_col=_n_col)
        rf1 = add_category_column(rf1, 'group1', ['A', 'B'], _seed)
        rf1 = add_category_column(rf1, 'group2', [1, 2], _seed)

        rf2 = load_random_float_table(seed=_seed, n_col=_n_col)
        rf2 = add_category_column(rf2, 'group1', ['A', 'B'], _seed)
        rf2 = add_category_column(rf2, 'group2', [1, 2], _seed)

        self.logger.debug(rf1)
        pd.testing.assert_frame_equal(rf1, rf2)

    def test_randomdata(self):
        RANDOM_COLUMN = [
            {'name': 'float1', 'type': 'float', 'min_value': -1000.0,
             'max_value': 1000.0, 'n_null': 5},
            {'name': 'group1', 'type': 'category',
             'population': ['A', 'B', 'C']},
            {'name': 'group2', 'type': 'category', 'population': [1, 0]},
            {'name': 'int1', 'type': 'int', 'min_value': -1000,
             'max_value': 1000},
            {'name': 'string1', 'type': 'string', 'min_length': 5,
             'max_length': 5, 'population': string.ascii_uppercase},
            {'name': 'string2', 'type': 'string', 'min_length': 1,
             'max_length': 20, 'n_null': 8,
             'population': (string.ascii_uppercase +
                            string.ascii_lowercase +
                            string.punctuation)}
        ]

        _seed = random.randint(0, 100)
        _data_size = 30
        table = load_random_table(columns=RANDOM_COLUMN, seed=_seed,
                                  data_size=_data_size)
        pd.testing.assert_frame_equal(table,
                                      load_random_table(columns=RANDOM_COLUMN,
                                                        seed=_seed,
                                                        data_size=_data_size))
        self.logger.debug('seed={}'.format(_seed))
        self.logger.debug(table)
