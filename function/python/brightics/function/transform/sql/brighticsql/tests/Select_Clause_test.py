import numpy as np
import pandas as pd
import unittest

from brighticsql.utils.unittest_util import table_cmp
from brighticsql.sqldf import BrighticSQL


class SelectClauseTest(unittest.TestCase):

    def setUp(self):
        self.print_dfs = False
        self.df1 = pd.DataFrame({
            'A': ['K0', 'K1', 'K2', 'K3', 'K4', 'K5'],
            'B': ['A0', 'A1', 'A2', 'A3', 'A4', 'A5']
        })

        self.df2 = pd.DataFrame({
            'a': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221],
            'b': [-1, 0, 7, 6, 1, 2],
            'c': [0.001, None, 0.2, None, None, None]
        })
        self.input_tables = dict(df1=self.df1, df2=self.df2)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = "select * from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': ['K0', 'K1', 'K2', 'K3', 'K4', 'K5'],
            'B': ['A0', 'A1', 'A2', 'A3', 'A4', 'A5']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select * from df1 limit 2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': ['K0', 'K1'], 'B': ['A0', 'A1']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select b from df1 limit 3"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'B': ['A0', 'A1', 'A2']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test04(self):
        sql = "select a*3 from DF2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'(a*3)': [0.3, 0.6, 0.003, -0.9, 2.1, 0.663]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test05(self):
        sql = "select b/2 from DF2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'(B/2)': [-1, 0, 3, 3, 0, 1]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test06(self):
        sql = "select b/2.0 from DF2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'(b/2.0)': [-0.5, 0.0, 3.5, 3.0, 0.5, 1.0]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test07(self):
        sql = "select 4 from df1"
        # sql = "select 4"
        # input_tables = dict()
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'4': [4] * 6})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test08(self):
        sql = "select 4 as t from df1"
        # input_tables = dict()
        # sql = "select 4 as t"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'T': [4] * 6})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test09(self):
        sql = "select 4 as a , 4/3 as b, 4/3.0 as c, 4+7 as d, 5-2 from df1"
        # input_tables = dict()
        # sql = "select 4 as a , 4/3 as b, 4/3.0 as c, 4+7 as d, 5-2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [4] * 6,
            'B': [1] * 6,
            'C': [4 / 3.0] * 6,
            'D': [11] * 6,
            '(5-2)': [3] * 6
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test10(self):
        sql = "select ((1+2)*2-2)/3 from df1"
        # input_tables = dict()
        # sql = "select ((1+2)*2-2)/3"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({"((((1+2)*2)-2)/3)": [1] * 6})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test11(self):
        sql = "select ((1+2)*2-2)/3.0 from df1"
        # input_tables = dict()
        # sql = "select ((1+2)*2-2)/3.0"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({"((((1+2)*2)-2)/3.0)": [4 / 3] * 6})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test12(self):
        sql = "select ((1.3+2)*2-2.7)/3.0 from df1"
        # input_tables = dict()
        # sql = "select ((1.3+2)*2-2.7)/3.0"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame(
            {"((((1.3+2)*2)-2.7)/3.0)": [((1.3 + 2) * 2 - 2.7) / 3.0] * 6})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test13(self):
        sql = "select ((1.3+2)*2-2.7)/3, c from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "((((1.3+2)*2)-2.7)/3)": ((1.3 + 2) * 2 - 2.7) / 3.0,
            'C': [0.001, None, 0.2, None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test14(self):
        sql = "select ((1.3+2)*2-2.7)/3.0, c from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "((((1.3+2)*2)-2.7)/3.0)": ((1.3 + 2) * 2 - 2.7) / 3.0,
            'C': [0.001, None, 0.2, None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test15(self):
        sql = "select a, c from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221],
            'C': [0.001, None, 0.2, None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test16(self):
        sql = "select a*c from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'(A*C)': [0.0001, None, 0.0002, None, None, None]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test17(self):
        sql = "select a/b from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            '(A/B)': [-0.1, np.inf, 0.001 / 7, -0.3 / 6, 0.7, 0.1105]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test18(self):
        sql = "select -a from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'-A': [-0.1, -0.2, -0.001, 0.3, -0.7, -0.221]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test19(self):
        sql = "select -a*b from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'(-A*B)': [0.1, 0, -0.007, 1.8, -0.7, -0.442]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test20(self):
        sql = "select -a*b*b from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            '((-A*B)*B)': [-0.1, -0, -0.049, 10.8, -0.7, -0.884]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test21(self):
        sql = "select -a*(b+b) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            '(-A*(B+B))': [0.2, -0.0, -0.014, 3.6, -1.4, -0.884]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test22(self):
        sql = "select a, a, a from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221],
            'A0': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221],
            'A1': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test23(self):
        sql = "select ((1.3+2)*2-2.7)/3.0, c*a from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "((((1.3+2)*2)-2.7)/3.0)": ((1.3 + 2) * 2 - 2.7) / 3.0,
            '(c*a)': [0.0001, None, 0.0002, None, None, None],
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
