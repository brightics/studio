import unittest
import pandas
from brightics.common.datasets import load_iris, _load_iris_sklearn, \
    load_random_table, load_random_float_table, add_category_column, \
    load_basic_test_data, load_random_classification, load_random_regression
import random
import string
import logging


class DatasetTest(unittest.TestCase):

    def setUp(self):
        unittest.TestCase.setUp(self)
        self.logger = logging.getLogger(self.__class__.__name__)
        self.logger.setLevel(logging.INFO)
        self.logger.addHandler(logging.StreamHandler())

    def test_iris(self):
        iris_parquet = load_iris()
        iris_sklearn = _load_iris_sklearn()
        pandas.testing.assert_frame_equal(iris_parquet, iris_sklearn)

    def test_basic_test_data(self):
        _seed = random.randint(0, 100)
        _data_size = random.randint(10, 50)
        data1 = load_basic_test_data(seed=_seed, data_size=_data_size)
        data2 = load_basic_test_data(seed=_seed, data_size=_data_size)
        self.logger.info(data1)
        pandas.testing.assert_frame_equal(data1, data2)

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
        self.logger.info(data1)
        pandas.testing.assert_frame_equal(data1, data2)

    def test_load_random_regression(self):
        _seed = random.randint(0, 100)
        _data_size = random.randint(150, 500)
        _n_xcol = random.randint(1, 5)
        data1 = load_random_regression(seed=_seed, data_size=_data_size,
                                       n_xcol=_n_xcol)
        data2 = load_random_regression(seed=_seed, data_size=_data_size,
                                       n_xcol=_n_xcol)
        self.logger.info(data1)
        pandas.testing.assert_frame_equal(data1, data2)

    def test_randomfloat(self):
        _seed = random.randint(0, 100)
        _n_col = random.randint(1, 5)
        rf1 = load_random_float_table(seed=_seed, n_col=_n_col)
        rf1 = add_category_column(rf1, 'group1', ['A', 'B'], _seed)
        rf1 = add_category_column(rf1, 'group2', [1, 2], _seed)

        rf2 = load_random_float_table(seed=_seed, n_col=_n_col)
        rf2 = add_category_column(rf2, 'group1', ['A', 'B'], _seed)
        rf2 = add_category_column(rf2, 'group2', [1, 2], _seed)

        self.logger.info(rf1)
        pandas.testing.assert_frame_equal(rf1, rf2)

    def test_randomdata(self):

        RANDOM_COLUMN = [
            {'name': 'float1', 'type': 'float', 'min_value':-1000.0,
             'max_value': 1000.0, 'n_null': 5},
            {'name': 'group1', 'type': 'category',
             'population': ['A', 'B', 'C']},
            {'name': 'group2', 'type': 'category', 'population': [1, 0]},
            {'name': 'int1', 'type': 'int', 'min_value':-1000,
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
        pandas.testing.assert_frame_equal(table,
                                          load_random_table(
                                              columns=RANDOM_COLUMN,
                                              seed=_seed,
                                              data_size=_data_size))
        print(_seed)
        print(table)
