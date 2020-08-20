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


class Group_By_test(unittest.TestCase):

    def setUp(self):
        self.print_dfs = False
        self.df1 = pd.DataFrame({
            'A': [1, None, 2, 4, 3, None, 8, 9, 10],
            'g': ['g0', 'g1', 'g0', 'g2', 'g2', 'g1', 'g1', None, None],
            'B': [0.1, -0.1, 0.1, -0.2, 3.2, -0.4, -0.1, 0.1, -0.1],
            'C': [1, 4, 1, 5, 2, 3, 5, 3, 4]
        })
        self.input_tables = dict(df1=self.df1)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = "select g from df1 group by df1.g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'g': [None, 'g0', 'g1', 'g2']})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test02(self):
        sql = "select g as groupColG, c groupColC from df1 group by df1.g, c"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'GROUPCOLG': [None, None, 'g0', 'g1', 'g1', 'g1', 'g2', 'g2'],
            'GROUPCOLC': [3, 4, 1, 3, 4, 5, 2, 5]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test03(self):
        sql = "select c from df1 group by g, c"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'C': [3, 4, 1, 3, 4, 5, 2, 5]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test04(self):
        sql = "select 1/3, count(b) from df1 group by g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'(1/3)': [0, 0, 0, 0],
                            'count(b)': [2, 2, 3, 2]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test05(self):
        sql = "select 1.0/3, count(b) from df1 group by g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'(1.0/3)': [1/3, 1/3, 1/3, 1/3],
                            'count(b)': [2, 2, 3, 2]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test06(self):
        sql = "select avg(b) from df1 group by g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({'AVG(B)': [0.0, 0.1, -0.2, 1.5]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test07(self):
        sql = "select b gpcolB, count(b), b from df1 group by b"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'gpcolB': [-0.4, -0.2, -0.1, 0.1, 3.2],
            'count(b)': [1, 1, 3, 3, 1],
            'B': [-0.4, -0.2, -0.1, 0.1, 3.2]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test08(self):
        sql = "select g, avg(b), min(b), max(b), sum(b) from df1 group by df1.g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'g': [None, 'g0', 'g1', 'g2'],
            'AVG(B)': [0.0, 0.1, -0.2, 1.5],
            'MIN(B)': [-0.1, 0.1, -0.4, -0.2],
            'MAX(B)': [0.1, 0.1, -0.1, 3.2],
            'SUM(B)': [0.0, 0.2, -0.6, 3.0]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test09(self):
        sql = "select count(*), count(b) from df1 group by b,g"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'COUNT(*)': [1, 1, 1, 2, 1, 2, 1],
            'count(b)': [1, 1, 1, 2, 1, 2, 1]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test10(self):
        sql = "select count(b), c,b, count(a) from df1 group by g, b, c"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'count(b)': [1, 1, 2, 1, 1, 1, 1, 1],
            'C': [4, 3, 1, 3, 4, 5, 5, 2],
            'B': [-0.1, 0.1, 0.1, -0.4, -0.1, -0.1, -0.2, 3.2],
            'COUNT(A)': [1, 1, 2, 0, 0, 1, 1, 1]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)

    def test11(self):
        sql = "select count(b) cntB, c,b, AVG(a) avgA from df1 group by g,b,c"
        res = self.brtcsql.execute_sql_query(sql)
        ref = pd.DataFrame({
            'CNTB': [1, 1, 2, 1, 1, 1, 1, 1, ],
            'C': [4, 3, 1, 3, 4, 5, 5, 2],
            'B': [-0.1, 0.1, 0.1, -0.4, -0.1, -0.1, -0.2, 3.2],
            'AVGA': [10.0, 9.0, 1.5, None, None, 8, 4, 3]})
        table_cmp(sql, res, ref,
                  print_dfs=self.print_dfs, check_row_order=False)
