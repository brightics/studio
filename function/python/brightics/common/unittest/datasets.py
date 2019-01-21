import unittest
import pandas
from brightics.common.datasets import load_iris, _load_iris_sklearn, \
    load_random_table
import random
import string


class DatasetTest(unittest.TestCase):

    def test_templates(self):
        iris_parquet = load_iris()
        iris_sklearn = _load_iris_sklearn()
        pandas.testing.assert_frame_equal(iris_parquet, iris_sklearn)

    def dev_randomdata(self):

        RANDOM_COLUMN = [
            {'name': 'group1', 'type': 'category', 'population': ['A', 'B']},
            {'name': 'group2', 'type': 'category', 'population': [1, 2]},
            {'name': 'int1', 'type': 'int', 'min_value': -1000,
             'max_value': 1000},
            {'name': 'float1', 'type': 'float', 'min_value': -1000.0,
             'max_value': 1000.0},
            {'name': 'string1', 'type': 'string', 'min_length': 5,
             'max_length': 5, 'population': string.ascii_uppercase},
            {'name': 'string2', 'type': 'string', 'min_length': 1,
             'max_length': 20, 'population': (string.ascii_uppercase
                                              + string.ascii_lowercase
                                              + string.punctuation)}
            ]

        _seed = random.randint(0, 100)
        table = load_random_table(columns=RANDOM_COLUMN, seed=_seed)
        pandas.testing.assert_frame_equal(table,
                                          load_random_table(
                                              columns=RANDOM_COLUMN,
                                              seed=_seed))
        print(_seed)
        print(table)
