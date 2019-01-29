import unittest
from brightics.common.datasets import load_iris
from brightics.function.io.unload import write_csv
from brightics.function.io.load import read_csv
import pandas
import os


class LoadTest(unittest.TestCase):

    path_kr = '아이리스.csv'

    def tearDown(self):
        if os.path.exists(self.path_kr):
            os.remove(self.path_kr)

    def test_read_write_csv_korean_path(self):
        df = load_iris()
        write_csv(table=df, path=self.path_kr)
        df_load = read_csv(path=self.path_kr)['table']
        pandas.testing.assert_frame_equal(df, df_load)
