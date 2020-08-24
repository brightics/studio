import pandas as pd
import unittest

from brighticsql.utils.unittest_util import table_cmp
from brighticsql.sqldf import BrighticSQL


class WhereClauseTest(unittest.TestCase):

    def setUp(self):
        self.print_dfs = False
        self.df1 = pd.DataFrame({
            'A': [1, None, 2, 4, 3, None, 8],
            'g': ['g0', 'g1', 'g0', 'g2', 'g2', 'g1', 'g1'],
            'B': [0.1, -0.1, 0.1, -0.2, 3.2, -0.4, -0.1],
            'C': [1, 4, 1, 5, 2, 3, 5]
        })
        self.df2 = pd.DataFrame({
            'a': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221],
            'b': [-1, 0, 7, 6, 1, 2],
            'c': [0.001, None, None, None, None, None]
        })
        self.df3 = pd.DataFrame({
            'b': [True, False, True, False, False],
            'c': [1, 2, 0, 3, 1],
            'g': ['g0', 'g0', 'g1', 'g2', 'g2']
        })
        self.input_tables = dict(df1=self.df1, df2=self.df2, df3=self.df3)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = "select * from df1 where g='g1'"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, None, 8],
            'G': ['g1', 'g1', 'g1'],
            'B': [-0.1, -0.4, -0.1],
            'C': [4, 3, 5]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select b as colB,c from df1 where b=0.1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'COLB': [0.1, 0.1],
            'C': [1, 1]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select -a as mA, b as colB, c from df1 where b<0"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'MA': [None, -4.0, None, -8.0],
            'COLB': [-0.1, -0.2, -0.4, -0.1],
            'C': [4, 5, 3, 5]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test04(self):
        sql = "select c,b from df2 where b between 1 and 7"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'C': [None, None, None, None],
            'B': [7, 6, 1, 2]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test05(self):
        sql = "select a,b from df2 where b <5 and b>1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': [0.221], 'B': [2]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test06(self):
        sql = "select b from df2 where b <0 or b>4"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'B': [-1, 7, 6]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test07(self):
        sql = "select a,g from df1 where g<>'g1'"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1.0, 2.0, 4.0, 3.0],
            'G': ['g0', 'g0', 'g2', 'g2']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test08(self):
        sql = "select a,b,c from df1 where g='g1' or a>2 and c=5"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, 4.0, None, 8.0],
            'B': [-0.1, -0.2, -0.4, -0.1],
            'C': [4, 5, 3, 5]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test09(self):
        sql = "select a,b,c,g from df1 where g='g1' and a>2 and c=5"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [8.0],
            'B': [-0.1],
            'C': [5],
            'G': ['g1']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test10(self):
        sql = "select a from df1 where a>2e-100\
        and a<1.7843902839048213908490189048913894081390849012894E0"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': [1.0]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test11(self):
        sql = "select * from df3 where b=True"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'b': [True, True],
            'c': [1, 0],
            'g': ['g0', 'g1']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test12(self):
        sql = "select * from df3 where not b=True"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'b': [False, False, False],
            'c': [2, 3, 1],
            'g': ['g0', 'g2', 'g2']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test13(self):
        sql = "select g, b from df3 where b<>False"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'g': ['g0', 'g1'], 'b': [True, True]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test14(self):
        sql = "select a,b,c from df1 where not (g='g1') or a>2 and c=5"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 2, 4, 3, 8],
            'B': [0.1, 0.1, -0.2, 3.2, -0.1],
            'C': [1, 1, 5, 2, 5]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test15(self):
        sql = "select g, a,b,c from df1 where g='g1' or a>2 or c=5 or c=1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'g': ['g0', 'g1', 'g0', 'g2', 'g2', 'g1', 'g1'],
            'A': [1, None, 2, 4, 3, None, 8],
            'B': [0.1, -0.1, 0.1, -0.2, 3.2, -0.4, -0.1],
            'C': [1, 4, 1, 5, 2, 3, 5]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test16(self):
        sql = "select * from df1 where a<>2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 4, 3, 8],
            'g': ['g0', 'g2', 'g2', 'g1'],
            'B': [0.1, -0.2, 3.2, -0.1],
            'C': [1, 5, 2, 5]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
