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


class IsnullTest(unittest.TestCase):

    def setUp(self):
        self.df1 = pd.DataFrame({
            'A': [1, None, 2, 4, np.nan, None, 8],
            'g': ['g0', 'g1', 'g0', None, 'g2', 'g1', 'g1'],
            'B': [0.1, -0.1, 0.1, np.nan, 3.2, -0.4, np.nan],
        })
        self.input_tables = dict(df1=self.df1)

        self.print_dfs = False
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.start_calcite()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def tearDown(self):
        self.brtcsql.stop_calcite()

    def test01(self):
        sql = "select a from df1 where a is null"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select * from df1 where a is null"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [None, None, None],
            'G': ['g1', 'g2', 'g1'],
            'B': [-0.1, 3.2, -0.4]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select * from df1 where a is not null"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 2, 4, 8],
            'G': ['g0', 'g0', None, 'g1'],
            'B': [0.1, 0.1, np.nan, np.nan]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)

    def test04(self):
        sql = "select a, b from df1 where a is not null"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'A': [1, 2, 4, 8],
            'b': [0.1, 0.1, np.nan, np.nan]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
