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

# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd
import unittest

from  ..src.utils.unittest_util import table_cmp
from ..brighticsql import BrighticSQL


class Distinct_Condition_test(unittest.TestCase):
    def setUp(self):
        self.print_dfs = False
        self.df1 = pd.DataFrame({
            'A': [1, None, 2, 4, 3, None, 8],
            'g': ['g0', 'g1', 'g0', 'g2', 'g2', 'g1', 'g1'],
            'B': [0.1, -0.1, 0.1, -0.2, 3.2, -0.4, -0.1],
            'C': [1, 4, 1, 5, 1, 1, None]
        })
        self.input_tables = dict(df1=self.df1)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = "select distinct a from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'A': [1, None, 2, 4, 3, 8]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select distinct a,b from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'A': [1, None, 2, 4, 3, None, 8],
            'B': [0.1, -0.1, 0.1, -0.2, 3.2, -0.4, -0.1]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select count(distinct c) from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'COUNT(DISTINCT C)': [3]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test04(self):
        sql = "select max(distinct c) from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'MAX(C)': [5]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test05(self):
        sql = "select min(distinct c) from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'MIN(C)': [1]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test06(self):
        sql = "select avg(distinct c) from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'AVG(DISTINCT C)': [10/3]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test07(self):
        sql = "select 2.5, avg(distinct c), avg(c),\
        count(*), count(c), count(distinct c) from df1"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            '2.5': [2.5],
            'AVG(DISTINCT C)': [10/3],
            'AVG(C)': [13/6],
            'COUNT(*)': [7],
            'COUNT(C)': [6],
            'COUNT(DISTINCT C)': [3]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test08(self):
        sql = "select g, count(distinct c) from df1 group by df1.g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'G': ['g0', 'g1', 'g2'],
            'COUNT(DISTINCT C)': [1, 2, 2]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test09(self):
        sql = "select g, count(distinct c) from df1 group by b, df1.g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'G': ['g1', 'g2', 'g1', 'g0', 'g2'],
            'COUNT(DISTINCT C)': [1, 1, 1, 1, 1]})
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
