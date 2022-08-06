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


class NumericFunctionsTest(unittest.TestCase):

    def setUp(self):
        self.df1 = pd.DataFrame({
            'realval': [-20.0, -10.5, -3.6, -1.1, 0.0, 0.1, 6.5, 10.2, 22.4],
            'csangle': [-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                        np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2],
            'tangle': [-np.pi / 2.2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                       np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2.2],
            'cosval': np.cos([-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                              np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2]),
            'sinval': np.sin([-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                              np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2]),
            'tanval': np.tan(
                [-np.pi / 2.2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                 np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2.2]),
            'degangle': np.arange(9) * 30.0
        })
        self.df2 = pd.DataFrame({
            'col1': [0.5, -0.8],
            'col2': [1, 2]
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
        sql = "select abs(-3), abs(realval), abs(-2*realval) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'abs(-3)': [3, 3, 3, 3, 3, 3, 3, 3, 3],
            'abs(realval)': [20, 10.5, 3.6, 1.1, 0, 0.1, 6.5, 10.2, 22.4],
            'abs((-2*realval))': [40, 21, 7.2, 2.2, 0, 0.2, 13, 20.4, 44.8]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test02(self):
        sql = "select atan2(2,4), atan2(col1, 1), atan2(col1, col2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'atan2(2,4)': [np.arctan2(2, 4), np.arctan2(2, 4)],
            'atan2(col1,1)': np.arctan2([0.5, -0.8], [1, 1]),
            'atan2(col1,col2)': np.arctan2([0.5, -0.8], [1, 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test03(self):
        sql = "select cos(0.8*pi), cos(csangle) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'cos((0.8*pi))': [np.cos(0.8 * np.pi)] * 9,
            'cos(csangle)': np.cos(
                [-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6,
                 0, np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test04(self):
        sql = "select pi, 3*pi from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'pi': [np.pi] * len(self.df1),
            '(3*pi)': [3 * np.pi] * len(self.df1)
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test05(self):
        sql = "select acos(0.5), acos(cosval) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'acos(0.5)': [np.arccos(0.5)] * 9,
            'acos(cosval)': np.arccos(
                np.cos([-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                        np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2]))
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test06(self):
        sql = "select asin(0.5), asin(sinval) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'asin(0.5)': [np.arcsin(0.5)] * 9,
            'asin(sinval)': np.arcsin(
                np.sin([-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                        np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2]))
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test07(self):
        sql = "select atan(0.1), atan(tanval) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'atan(0.1)': [np.arctan(0.1)] * 9,
            'atan(tanval)': np.arctan(
                np.tan([-np.pi / 2.2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                        np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2.2]))
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test08(self):
        sql = "select exp(0), exp(1), exp(col1), exp(col2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'exp(0)': [1.0] * 2,
            'exp(1)': [np.e] * 2,
            'exp(col1)': np.exp([0.5, -0.8]),
            'exp(col2)': np.exp([1, 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test09(self):
        sql = "select floor(0.2), floor(col1), floor(col2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'floor(0.2)': [0] * 2,
            'floor(col1)': np.floor([0.5, -0.8]),
            'floor(col2)': np.floor([1, 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test10(self):
        sql = "select ln(1), ln(exp(1)), ln(col1),ln(col2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'LN(1)': [0] * 2,
            'LN(EXP(1))': [1] * 2,
            'LN(col1)': np.log([0.5, -0.8]),
            'LN(col2)': np.log([1, 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test11(self):
        sql = "select log10(1), log10(10), log10(col1), log10(col2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'LOG10(1)': [0] * 2,
            'LOG10(10)': [1] * 2,
            'LOG10(col1)': np.log10([0.5, -0.8]),
            'LOG10(col2)': np.log10([1, 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test12(self):
        sql = "select mod(2,3), mod(3,2), mod(col2, 1), mod(col2,2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'MOD(2,3)': [2] * 2,
            'MOD(3,2)': [1] * 2,
            'MOD(COL2,1)': [0, 0],
            'MOD(COL2,2)': [1, 0]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test13(self):
        sql = "select degrees(pi/2), degrees(0), degrees(csangle) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'DEGREES((PI/2))': [90.0] * 9,
            'DEGREES(0)': [0.0] * 9,
            'DEGREES(CSANGLE)': [-90.0, -60, -45, -30, 0, 30, 45, 60, 90]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test14(self):
        sql = "select radians(0), radians(degangle) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'RADIANS(0)': [0.0] * 9,
            'RADIANS(degangle)': [
                0., 0.52359878, 1.04719755, 1.57079633, 2.0943951, 2.61799388,
                3.14159265, 3.66519143, 4.1887902]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test15(self):
        sql = "select sqrt(2), sqrt(col2) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'SQRT(2)': [np.sqrt(2)] * 2,
            'SQRT(col2)': [1, np.sqrt(2)]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test16(self):
        sql = "select POWER(2, 1.2), POWER(2,3), POWER(col2,3) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'POWER(2,1.2)': [np.power(2, 1.2)] * 2,
            'POWER(2,3)': [np.power(2, 3)] * 2,
            'POWER(col2,3)': np.power([1, 2], 3)
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test17(self):
        sql = "select ceil(2.2), ceil(col1) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'CEIL(2.2)': [3] * 2,
            'CEIL(col1)': [1, 0]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test18(self):
        sql = "select ceiling(2.2), ceiling(col1) from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'CEIL(2.2)': [3] * 2,
            'CEIL(col1)': [1, 0]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test19(self):
        sql = "select sin(0.8*pi), sin(csangle) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'sin((0.8*pi))': [np.sin(0.8 * np.pi)] * 9,
            'sin(csangle)': np.sin(
                [-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6,
                 0, np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test20(self):
        sql = "select tan(0.25*pi), tan(tangle) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'tan((0.25*pi))': [1] * 9,
            'tan(tangle)': np.tan(
                [-np.pi / 2.2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                 np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2.2])
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test21(self):
        sql = "select sign(-1), sign(0), sign(1), \
            sign(col1) as sgn1, sign(col2) as sgn2 from df2"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'sign(-1)': [-1] * 2,
            'sign(0)': [0] * 2,
            'sign(1)': [1] * 2,
            'SGN1': [1, -1],
            'SGN2': [1, 1]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test22(self):
        sql = "SELECT ROUND(235.415, 2), ROUND(235.415, 1) as roundvalue"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ROUND(235.415,2)': [235.42],
            'roundvalue': [235.4]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test23(self):
        sql = "SELECT csangle, ROUND(csangle, 1) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'csangle': [-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                        np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2],
            'round(csangle,1)': np.around(
                [-np.pi / 2, -np.pi / 3, -np.pi / 4, -np.pi / 6, 0,
                 np.pi / 6, np.pi / 4, np.pi / 3, np.pi / 2], 1),
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test24(self):
        sql = "SELECT rand(3), rand(3) as r32, rand(), rand() as r2, rand() as r3"
        res = self.brtcsql.execute(sql)
        ref = None
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test25(self):
        sql = "select truncate(135.375,2), truncate(135.375,1), truncate(135.375), truncate(135.375, -1), truncate(135.375,-2)"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'TRUNCATE(135.375,2)': [135.37],
            'TRUNCATE(135.375,1)': [135.3],
            'TRUNCATE(135.375)': [135],
            'TRUNCATE(135.375,-1)': [130],
            'TRUNCATE(135.375,-2)': [100]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)

    def test26(self):
        sql = "select truncate(csangle, 2) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'TRUNCATE(csangle,2)': [-1.57, -1.04, -0.78, -0.52, 0, 0.52, 0.78,
                                    1.04, 1.57]
        })
        table_cmp(sql, res, ref, check_row_order=self.check_row_order,
                  print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
