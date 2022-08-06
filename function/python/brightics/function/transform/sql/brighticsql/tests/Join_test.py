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


class JoinTest(unittest.TestCase):
    def setUp(self):
        self.df1 = pd.DataFrame({
            'A': [1, 1, None, 2, 4],
            'g': ['g0', 'g0', 'g1', 'g0', 'g2'],
            'B': [0.1, 0.1, -0.1, 0.1, 0.3],
            'g2': [None, None, None, 'g0', 'g2']
        })

        self.df2 = pd.DataFrame({
            'D': [2, None, 2, 4, 5, 5],
            'GG': ['g0', 'g1', 'g1', 'g2', 'g1', 'g1'],
            'BB': [0.1, -0.1, 0.1, 0.3, None, None],
            'GGG': [None, 'g1', 'g1', 'g2', 'g2', 'g2']
        })
        self.input_tables = dict(df1=self.df1, df2=self.df2)

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
        sql = "select * from df1 cross join df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, None,
                  None, None, None, None, None, 2, 2, 2, 2, 2, 2, 4, 4,
                  4, 4, 4, 4],
            'g': ['g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0',
                  'g0', 'g0', 'g1', 'g1', 'g1', 'g1', 'g1', 'g1', 'g0', 'g0',
                  'g0', 'g0', 'g0', 'g0', 'g2', 'g2', 'g2', 'g2', 'g2', 'g2'],
            'B': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
                  0.1, -0.1, -0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.1, 0.1, 0.1,
                  0.1, 0.1, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3],
            'g2': [None, None, None, None, None, None, None, None, None, None,
                   None, None, None, None, None, None, None, None, 'g0', 'g0',
                   'g0', 'g0', 'g0', 'g0', 'g2', 'g2', 'g2', 'g2', 'g2', 'g2'],
            'D': [2, None, 2, 4, 5, 5, 2, None, 2, 4, 5, 5, 2,
                  None, 2, 4, 5, 5, 2, None, 2, 4, 5, 5, 2, None, 2, 4, 5, 5],
            'GG': ['g0', 'g1', 'g1', 'g2', 'g1', 'g1', 'g0', 'g1', 'g1', 'g2',
                   'g1', 'g1', 'g0', 'g1', 'g1', 'g2', 'g1', 'g1', 'g0', 'g1',
                   'g1', 'g2', 'g1', 'g1', 'g0', 'g1', 'g1', 'g2', 'g1', 'g1'],
            'BB': [0.1, -0.1, 0.1, 0.3, None, None, 0.1, -0.1, 0.1, 0.3, None,
                   None, 0.1, -0.1, 0.1, 0.3, None, None, 0.1, -0.1, 0.1, 0.3,
                   None, None, 0.1, -0.1, 0.1, 0.3, None, None],
            'GGG': [None, 'g1', 'g1', 'g2', 'g2', 'g2', None, 'g1', 'g1', 'g2',
                    'g2', 'g2', None, 'g1', 'g1', 'g2', 'g2', 'g2', None, 'g1',
                    'g1', 'g2', 'g2', 'g2', None, 'g1', 'g1', 'g2', 'g2', 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test02(self):
        sql = "select * from df1 inner join df2 on df1.g=df2.gg"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 1, None, None, None, None, 2, 4],
            'G': ['g0', 'g0', 'g1', 'g1', 'g1', 'g1', 'g0', 'g2'],
            'B': [0.1, 0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.3],
            'G2': [None, None, None, None, None, None, 'g0', 'g2'],
            'D': [2, 2, None, 2, 5, 5, 2, 4],
            'GG': ['g0', 'g0', 'g1', 'g1', 'g1', 'g1', 'g0', 'g2'],
            'BB': [0.1, 0.1, -0.1, 0.1, None, None, 0.1, 0.3],
            'GGG': [None, None, 'g1', 'g1', 'g2', 'g2', None, 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test03(self):
        sql = "select * from df1 t1 inner join df2 t2 on t1.g=t2.gg"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 1, None, None, None, None, 2, 4],
            'G': ['g0', 'g0', 'g1', 'g1', 'g1', 'g1', 'g0', 'g2'],
            'B': [0.1, 0.1, -0.1, -0.1, -0.1, -0.1, 0.1, 0.3],
            'G2': [None, None, None, None, None, None, 'g0', 'g2'],
            'D': [2, 2, None, 2, 5, 5, 2, 4],
            'GG': ['g0', 'g0', 'g1', 'g1', 'g1', 'g1', 'g0', 'g2'],
            'BB': [0.1, 0.1, -0.1, 0.1, None, None, 0.1, 0.3],
            'GGG': [None, None, 'g1', 'g1', 'g2', 'g2', None, 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test04(self):
        sql = "select a,d,df1.g g1,df2.d d1 from df1\
               inner join df2 on df1.A=df2.D"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [2, 2, 4],
            'D': [2, 2, 4],
            'G1': ['g0', 'g0', 'g2'],
            'D1': [2, 2, 4]
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test05(self):
        sql = "select * from df1 j1 inner join df2 j2 on j1.A >  j2.D"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [4, 4],
            'G': ['g2', 'g2'],
            'B': [0.3, 0.3],
            'G2': ['g2', 'g2'],
            'D': [2, 2],
            'GG': ['g0', 'g1'],
            'BB': [0.1, 0.1],
            'GGG': [None, 'g1']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test06(self):
        sql = "select * from df1 j1 inner join df2 j2 on j1.A <  j2.D"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 4, 4],
            'G': ['g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0',
                  'g0', 'g0', 'g0', 'g2', 'g2'],
            'B': [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1,
                  0.1, 0.3, 0.3],
            'G2': [None, None, None, None, None, None, None, None, None, None,
                   'g0', 'g0', 'g0', 'g2', 'g2'],
            'D': [2, 2, 4, 5, 5, 2, 2, 4, 5, 5, 4, 5, 5, 5, 5],
            'GG': ['g0', 'g1', 'g2', 'g1', 'g1', 'g0', 'g1', 'g2', 'g1', 'g1',
                   'g2', 'g1', 'g1', 'g1', 'g1'],
            'BB': [0.1, 0.1, 0.3, None, None, 0.1, 0.1, 0.3, None, None, 0.3,
                   None, None, None, None],
            'GGG': [None, 'g1', 'g2', 'g2', 'g2', None, 'g1', 'g2', 'g2', 'g2',
                    'g2', 'g2', 'g2', 'g2', 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test07(self):
        sql = "select a,d,df1.g g1, df2.d d1 from df1\
            inner join df2 on df1.A < df2.D"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 4, 4],
            'D': [2, 2, 4, 5, 5, 2, 2, 4, 5, 5, 4, 5, 5, 5, 5],
            'G1': ['g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0', 'g0',
                   'g0', 'g0', 'g0', 'g2', 'g2'],
            'D1': [2, 2, 4, 5, 5, 2, 2, 4, 5, 5, 4, 5, 5, 5, 5]
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test08(self):
        sql = "select * from df1 inner join df2 on\
             (df1.g2 = df2.ggg or df1.a = df2.d)"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [2, 2, 4, 4, 4],
            'G': ['g0', 'g0', 'g2', 'g2', 'g2'],
            'B': [0.1, 0.1, 0.3, 0.3, 0.3],
            'G2': ['g0', 'g0', 'g2', 'g2', 'g2'],
            'D': [2, 2, 4, 5, 5],
            'GG': ['g0', 'g1', 'g2', 'g1', 'g1'],
            'BB': [0.1, 0.1, 0.3, None, None],
            'GGG': [None, 'g1', 'g2', 'g2', 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test09(self):
        sql = "select df1.*, df2.* from df1, df2 where df1.A =  df2.D"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [2, 2, 4],
            'G': ['g0', 'g0', 'g2'],
            'B': [0.1, 0.1, 0.3],
            'G2': ['g0', 'g0', 'g2'],
            'D': [2, 2, 4],
            'GG': ['g0', 'g1', 'g2'],
            'BB': [0.1, 0.1, 0.3],
            'GGG': [None, 'g1', 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test10(self):
        sql = "select df1.g, df2.d from df1, df2 where df1.A =  df2.D"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'G': ['g0', 'g0', 'g2'],
            'D': [2, 2, 4]
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test11(self):
        sql = "select * from df1 left join df2 on df1.g2 = df2.ggg"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 1, None, 2, 4, 4, 4],
            'g': ['g0', 'g0', 'g1', 'g0', 'g2', 'g2', 'g2'],
            'B': [0.1, 0.1, -0.1, 0.1, 0.3, 0.3, 0.3],
            'g2': [None, None, None, 'g0', 'g2', 'g2', 'g2'],
            'D': [None, None, None, None, 4, 5, 5],
            'GG': [None, None, None, None, 'g2', 'g1', 'g1'],
            'BB': [None, None, None, None, 0.3, None, None],
            'GGG': [None, None, None, None, 'g2', 'g2', 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    # def test12(self):
    #     input_tables = dict(df1=self.df1, df2=self.df2)
    #     self.brtcsql.set_tables(input_tables)
    #     sql = "select df1.A, df1.g2, df2.GG, df2.GGG from df1 left join df2\
    #            on df1.g2 > df2.ggg"
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame()
    #     table_cmp(sql, res, ref,
    #               check_row_order=self.check_row_order, print_dfs=self.print_dfs)

    # def test13(self):
    #     input_tables = dict(df1=self.df1, df2=self.df2)
    #     self.brtcsql.set_tables(input_tables)
    #     sql = "select * from df1 left join df2 on df1.b> (df2.d*df2.bb)"
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame()
    #     table_cmp(sql, res, ref,
    #               check_row_order=self.check_row_order, print_dfs=self.print_dfs)

    def test14(self):
        sql = "select * from df1 right join df2 on df1.g2 = df2.ggg"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, None, None, 4, 4, 4],
            'g': [None, None, None, 'g2', 'g2', 'g2'],
            'B': [None, None, None, 0.3, 0.3, 0.3],
            'g2': [None, None, None, 'g2', 'g2', 'g2'],
            'D': [2, None, 2, 4, 5, 5],
            'GG': ['g0', 'g1', 'g1', 'g2', 'g1', 'g1'],
            'BB': [0.1, -0.1, 0.1, 0.3, None, None],
            'GGG': [None, 'g1', 'g1', 'g2', 'g2', 'g2']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    # def test15(self):
    #     input_tables = dict(df1=self.df1, df2=self.df2)
    #     self.brtcsql.set_tables(input_tables)
    #     sql = "select df1.A, df1.g2, df2.GG, df2.GGG from df1 right join df2\
    #            on df1.g2 > df2.ggg"
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame()
    #     table_cmp(sql, res, ref,
    #               check_row_order=self.check_row_order, print_dfs=self.print_dfs)

    # def test16(self):
    #     input_tables = dict(df1=self.df1, df2=self.df2)
    #     self.brtcsql.set_tables(input_tables)
    #     sql = "select * from df1 right join df2 on df1.b> (df2.d*df2.bb)"
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame()
    #     table_cmp(sql, res, ref,
    #               check_row_order=self.check_row_order, print_dfs=self.print_dfs)

    def test17(self):
        sql = "select * from df1 full outer join df2 on df1.g2 = df2.ggg"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [4, 4, 4, 1, 1, None, None, 2, None, None],
            'g': ['g2', 'g2', 'g2', 'g0', 'g0', 'g1', None, 'g0', None, None],
            'B': [0.3, 0.3, 0.3, 0.1, 0.1, -0.1, None, 0.1, None, None],
            'g2': ['g2', 'g2', 'g2', None, None, None, None, 'g0', None, None],
            'D': [4, 5, 5, None, None, None, 2, None, None, 2],
            'GG': ['g2', 'g1', 'g1', None, None, None, 'g0', None, 'g1', 'g1'],
            'BB': [0.3, None, None, None, None, None, 0.1, None, -0.1, 0.1],
            'GGG': ['g2', 'g2', 'g2', None, None, None, None, None, 'g1', 'g1']
        })
        table_cmp(sql, res, ref,
                  check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    # def test18(self):
    #     input_tables = dict(df1=self.df1, df2=self.df2)
    #     self.brtcsql.set_tables(input_tables)
    #     sql = "select df1.A, df1.g2, df2.GG, df2.GGG from df1 full outer\
    #            join df2 on df1.g2 > df2.ggg"
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame()
    #     table_cmp(sql, res, ref,
    #               check_row_order=self.check_row_order, print_dfs=self.print_dfs)

    # def test19(self):
    #     input_tables = dict(df1=self.df1, df2=self.df2)
    #     self.brtcsql.set_tables(input_tables)
    #     sql = "select * from df1 full outer join df2 on df1.b>(df2.d*df2.bb)"
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame({
    #         'A': [ 1, None, None, 2, 4],
    #         'G': ['g0', 'g1', 'g1', 'g0', 'g2'],
    #         'B': [ 0.1, -0.1, -0.1, 0.1, 0.3],
    #         'G2': [None, None, None, 'g0','g2'],
    #         'D': [ 2, None, 2, 2, 4],
    #         'GG': ['g0', 'g1', 'g1', 'g0', 'g2'],
    #         'BB': [ 0.1, -0.1, 0.1, 0.1, 0.3],
    #         'GGG': [None, 'g1', 'g1', None, 'g2']
    #     })
    #     table_cmp(sql, res, ref,
    #               check_row_order=self.check_row_order, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
