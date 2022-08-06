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

import numpy as np
import pandas as pd
import unittest

from brighticsql.utils.unittest_util import table_cmp
from brighticsql.sqldf import BrighticSQL


class OrderByClauseTest(unittest.TestCase):

    def setUp(self):
        self.df1 = pd.DataFrame({
            'A': ['K0', 'K4', 'K2', 'K4', 'K6', 'K5'],
            'B': ['A5', 'A1', 'A4', 'A3', 'A2', 'A0']})

        self.df2 = pd.DataFrame({
            'a': [0.1, 0.2, 0.001, -0.3, 0.7, 0.221],
            'b': [-1, 0, 7, 6, 1, 2],
            'c': [0.001, None, 0.2, None, None, None]
        })
        self.df3 = pd.DataFrame({
            'a': [0.1, 0.2, np.nan, -0.3, np.nan, 0.221],
            'b': [-1, 0, 7, 6, np.nan, 2],
            'c': ['g', None, 'f', None, None, None]
        })
        self.input_tables = dict(df1=self.df1, df2=self.df2, df3=self.df3)

        self.print_dfs = False
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.start_calcite()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def tearDown(self):
        self.brtcsql.stop_calcite()

    def test01(self):
        sql = "select * from df1 limit 1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': ['K0'], 'B': ['A5']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select * from df1 order by A"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': ['K0', 'K2', 'K4', 'K4', 'K5', 'K6'],
                            'B': ['A5', 'A4', 'A1', 'A3', 'A0', 'A2']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select * from df1 order by B limit 4"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'A': ['K5', 'K4', 'K6', 'K4'],
                            'B': ['A0', 'A1', 'A2', 'A3']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test04(self):
        sql = "select B,A from df2 order by B desc limit 3"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'B': [7, 6, 2],
                            'A': [0.001, -0.3, 0.221]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test05(self):
        sql = "select C from df2 order by A asc"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'C': [None, 0.2, 0.001, None, None, None]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test06(self):
        sql = "select C from df2 order by A desc"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'C': [None, None, None, 0.001, 0.2, None]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test07(self):
        sql = "select * from df2 order by C asc, B desc"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [0.1, 0.001, -0.3, 0.221, 0.7, 0.2],
            'B': [-1, 7, 6, 2, 1, 0],
            'C': [0.001, 0.2, None, None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test08(self):
        sql = "select * from df3 order by C asc nulls last"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, 0.1, 0.2, -0.3, None, 0.221],
            'B': [7, -1, 0, 6, None, 2],
            'C': ['f', 'g', None, None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test09(self):
        sql = "select * from df3 order by A desc nulls first"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, None, 0.221, 0.2, 0.1, -0.3],
            'B': [7, None, 2, 0, -1, 6],
            'C': ['f', None, None, None, 'g', None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test10(self):
        sql = "select * from df3 order by C asc nulls first, A desc nulls last"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [0.221, 0.2, -0.3, None, None, 0.1],
            'B': [2, 0, 6, None, 7, -1],
            'C': [None, None, None, None, 'f', 'g']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test11(self):
        sql = "select * from df3 \
            order by C asc nulls first, A desc nulls first"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, 0.221, 0.2, -0.3, None, 0.1],
            'B': [None, 2, 0, 6, 7, -1],
            'C': [None, None, None, None, 'f', 'g']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
