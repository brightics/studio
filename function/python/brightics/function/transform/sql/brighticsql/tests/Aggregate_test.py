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

from brighticsql.utils.unittest_util import table_cmp
from brighticsql.sqldf import BrighticSQL


class AggregateTest(unittest.TestCase):

    def setUp(self):
        self.df1 = pd.DataFrame({
            'g': ['g0', 'g1', 'g0', 'g2', 'g2', 'g1', 'g1'],
            'B': [1, None, 2, 4, 3, None, 8],
            'C': [0.1, -0.1, 0.2, -0.2, 3.2, -3.2, 0],
        })
        self.input_tables = dict(df1=self.df1)

        self.print_dfs = False
        self.check_row_order = False
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.start_calcite()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def tearDown(self):
        self.brtcsql.stop_calcite()

    def test01(self):
        sql = "select count(*) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'COUNT(*)': [7]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select count(B) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'COUNT(B)': [5]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select count(B), count(*), count(g) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'COUNT(B)': [5], 'COUNT(*)': [7], 'COUNT(G)': [7]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test04(self):
        sql = "select count(*) CNTALL from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'CNTALL': [7]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test05(self):
        sql = "select count(g), max(c), min(c), avg(c) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'COUNT(G)': [7],
            'MAX(C)': [3.2],
            'MIN(C)': [-3.2],
            'AVG(C)': [0.0]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test06(self):
        sql = "select sum(c), max(b*c) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'SUM(C)': [0.0], 'MAX((B*C))': [9.6]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test07(self):
        sql = "select sum(c) as sumC, max(b*c) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'SUMC': [0.0], 'MAX((B*C))': [9.6]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test08(self):
        sql = "select sum(c), max(b*c) max_BC from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'SUM(C)': [0.0], 'MAX_BC': [9.6]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test09(self):
        sql = "select sum(c) as sumC, max(b*c) MAXBC from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'SUMC': [0.0], 'MAXBC': [9.6]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
