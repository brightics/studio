import numpy as np
import pandas as pd
import unittest

from brighticsql.utils.unittest_util import table_cmp
from brighticsql.sqldf import BrighticSQL


class UnionTest(unittest.TestCase):

    def setUp(self):
        self.print_dfs = False
        self.df1 = pd.DataFrame({
            'A': [1, None, 2],
            'g': ['g0', 'g1', 'g0'],
            'B': [0.1, -0.1, 0.1],
            'C': [1, 4, 1]
        })
        self.df2 = pd.DataFrame({
            'a': [1, 2],
            'b': [-1, 0],
            'c': [0.001, None]
        })
        self.input_tables = dict(df1=self.df1, df2=self.df2)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = "select a from df1 union select a from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': [None, 1.0, 2.0]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=False)

    def test02(self):
        sql = "select a from df1 union all select a from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': [1, None, 2.0, 1.0, 2.0]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=False)

    def test03(self):
        sql = "select count(*) from df1 union select count(*) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'COUNT(*)': [2, 3]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=False)

    def test04(self):
        sql = "select a as AA from df1 union select b as A from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'AA': [None, -1.0, 0.0, 1.0, 2.0]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=False)

    def test05(self):
        sql = "select a,b from df1 union select b,c as A from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, -1.0, 0.0, 1.0, 2.0],
            'B': [-0.100, 0.001, None, 0.1, 0.1]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=False)


if __name__ == '__main__':
    unittest.main()
