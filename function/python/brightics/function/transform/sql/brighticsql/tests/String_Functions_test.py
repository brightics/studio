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


class StringFunctionsTest(unittest.TestCase):

    def setUp(self):
        self.df1 = pd.DataFrame({
            'lo': ['A', 'B', 'CcD F'],
            'up': ['a', 'b', 'ccc ff'],
            'lc': ['4 45' * 10000, None, ' 1423' * 7],
            'lckor': ['가 가가', '  나다', '라마  '],
            'wn': [None, 'efg', None]
        })
        self.df2 = pd.DataFrame({
            'col': [None, '  gg gg gg ', None, None, '  gg gg gg ', None],
            'col2': ['gg ff gg', '  ff  gg', '  ff gg  '] * 2,
            'col3': ['fgh fghgg', 'fghfgh fgh ggfgh fghfghfgh',
                     'fghfghfgh fgh sdf', 'vv fgh', '   fgh', ' fghfgh'],
            'col4': ['gggg g', 'ggggg gggggg', ' gggg', ' gg', 'g', 'gggggg'],
            'col5': ['abababab abab ab aba', 'ababababababab abab', 'abab abab',
                     ' abab', 'abab  ', 'abab']
        })
        self.df3 = pd.DataFrame({
            'col': ['fghgg fgh', 'fgh ggfgh fghfgh', 'fgh sdf fghfghfgh',
                    'vv fgh  ', ' fg', ' fghfgh'],
            'col2': ['gggg ggg', 'ggggg ggggg', ' gggg gg', ' gg ggg', 'gg ',
                     'gggggggggg'],
            'col3': ['abab ab abababababab', 'abab ababababababab',
                     'abab ab ab', ' abab', 'abab  ', 'abab']
        })
        self.df4 = pd.DataFrame({
            'col': ['fghgg fgh', 'fgh ggfgh fghfgh', ' fgh sdf fghfghfgh',
                    'vv fgh  fghfgh', ' fg', ' fghfgh'],
            'col2': ['gggg ggg', 'ggggg ggggg', ' gggg gg', ' gg ggg', 'gg ',
                     'gggggggggg'],
            'col3': ['abab ab abababababab', 'abab ababababababab',
                     'abab ab ab', ' abab ', 'abab  ', 'abab']
        })
        self.input_tables = dict(
            df1=self.df1, df2=self.df2, df3=self.df3, df4=self.df4)

        self.print_dfs = False
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.start_calcite()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def tearDown(self):
        self.brtcsql.stop_calcite()

    def test01(self):
        sql = "select lower('AG D')"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "lower('AG D')": ['ag d']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test02(self):
        sql = "select lower(lo), upper(up) from df1"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "lower(lo)": ['a', 'b', 'ccd f'],
            "upper(up)": ['A', 'B', 'CCC FF'],
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test03(self):
        sql = "select upper(lower('AG D'))"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "upper(lower('AG D'))": ['AG D']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test04(self):
        sql = """select char_length(' f'), char_length('ABC DEF') as length"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "char_length(' f')": [2],
            'length': [7]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test05(self):
        sql = """select char_length(' f') as lf, char_length(lc) from df1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'lf': [2, 2, 2],
            "char_length(lc)": [40000, None, 35]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test06(self):
        sql = """select char_length(lckor) from df1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'char_length(lckor)': [4, 4, 4]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test07(self):
        sql = """SELECT {fn concat('A','b')}"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "CONCAT('A','b')": ['Ab']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test08(self):
        sql = """SELECT lo || up, concat('a', ' b') from df1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "CONCAT(lo,up)": ['Aa', 'Bb', 'CcD Fccc ff'],
            "concat('a',' b')": ['a b', 'a b', 'a b']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test09(self):
        sql = """SELECT lo || ' + ab', 'f ' || up, wn || '??' from df1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "CONCAT(lo,' + ab')": ['A + ab', 'B + ab', 'CcD F + ab'],
            "CONCAT('f ',up)": ['f a', 'f b', 'f ccc ff'],
            "CONCAT(wn,'??')": [None, 'efg??', None]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test10(self):
        sql = """SELECT REVERSE('abc def'), REVERSE(wn)  from df1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "REVERSE('abc def')": ['fed cba'] * 3,
            "REVERSE(wn)": [None, 'gfe', None]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test11(self):
        sql = """SELECT REVERSE(CONCAT('abc','def'))"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "REVERSE(CONCAT('abc','def'))": ['fedcba']

        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test12(self):
        sql = """SELECT trim(' a b  '), trim(' ' from ' f '), trim('g' from 'g gff g')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "TRIM(BOTH ' ' from ' a b  ')": ['a b'],
            "TRIM(BOTH ' ' from ' f ')": ['f'],
            "TRIM(BOTH 'g' from 'g gff g')": [' gff ']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test13(self):
        sql = """SELECT trim(col), trim('g' from col) from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "TRIM(BOTH ' ' from col)": [None, 'gg gg gg', None] * 2,
            "TRIM(BOTH 'g' from col)": [None, '  gg gg gg ', None] * 2
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test14(self):
        sql = """SELECT trim(leading col2) as t,
                        trim(leading 'g' from col2) t2,
                        trim(trailing from col2) t3 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            't': ['gg ff gg', 'ff  gg', 'ff gg  '] * 2,
            't2': [' ff gg', '  ff  gg', '  ff gg  '] * 2,
            't3': ['gg ff gg', '  ff  gg', '  ff gg'] * 2

        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test15(self):
        sql = """SELECT trim(leading 'fgh' from col3) lt,
                        trim(leading 'gg' from col4) lt2,
                        trim(leading 'ggg' from col4) lt3,
                        trim(leading 'abab' from col5) lt4
                 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'lt': [' fghgg', ' fgh ggfgh fghfghfgh', ' fgh sdf', 'vv fgh',
                   '   fgh', ' fghfgh'],
            'lt2': [' g', 'g gggggg', ' gggg', ' gg', 'g', ''],
            'lt3': ['g g', 'gg gggggg', ' gggg', ' gg', 'g', ''],
            'lt4': [' abab ab aba', 'ab abab', ' abab', ' abab', '  ', '']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test16(self):
        sql = """SELECT trim(trailing 'fgh' from col) lt,
                        trim(trailing 'gg' from col2) lt2,
                        trim(trailing 'ggg' from col2) lt3,
                        trim(trailing 'ab' from col3) lt4,
                        trim(trailing 'abab' from col3) lt5
                 from df3"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'lt': ['fghgg ', 'fgh ggfgh ', 'fgh sdf ', 'vv fgh  ', ' fg', ' '],
            'lt2': ['gggg g', 'ggggg g', ' gggg ', ' gg g', 'gg ', ''],
            'lt3': ['gggg ', 'ggggg gg', ' gggg gg', ' gg ', 'gg ', 'g'],
            'lt4': ['abab ab ', 'abab ', 'abab ab ', ' ', 'abab  ', ''],
            'lt5': ['abab ab ', 'abab ab', 'abab ab ab', ' ', 'abab  ', '']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test17(self):
        sql = """SELECT trim(both 'fgh' from col) lt,
                        trim(both 'gg' from col2) lt2,
                        trim(both 'ggg' from col2) lt3,
                        trim(both 'ab' from col3) lt4,
                        trim(both 'abab' from col3) lt5
                 from df4"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'lt': ['gg ', ' ggfgh ', ' fgh sdf ', 'vv fgh  ', ' fg', ' '],
            'lt2': [' g', 'g g', ' gggg ', ' gg g', ' ', ''],
            'lt3': ['g ', 'gg gg', ' gggg gg', ' gg ', 'gg ', 'g'],
            'lt4': [' ab ', ' ', ' ab ', ' abab ', '  ', ''],
            'lt5': [' ab ', ' ab', ' ab ab', ' abab ', '  ', '']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test18(self):
        sql = """select left('gggg afdsadf', 3), left('  gggg afdsadf', 4) le2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "LEFT('gggg afdsadf',3)": ['ggg'],
            "LE2": ['  gg']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test19(self):
        sql = """select left(col, 5) le, left(col5, 3) le2 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'le': [None, '  gg ', None, None, '  gg ', None],
            'le2': ['aba', 'aba', 'aba', ' ab', 'aba', 'aba']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test20(self):
        sql = """select trim(leading 'ab' from left(col5, 4)) le2 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'le2': ['', '', '', ' aba', '', '']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test21(self):
        sql = """select LTRIM('     aaa'), RTRIM(' aa   ')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "TRIM(LEADING ' ' from '     aaa')": ['aaa'],
            "TRIM(TRAILING ' ' from ' aa   ')": [' aa']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test22(self):
        sql = "SELECT REPLACE('SQL Tutorial', 'Tu', 'MOo')"
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "REPLACE('SQL TUTORIAL','TU','MOO')": ['SQL MOotorial']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test23(self):
        sql = """SELECT REPLACE(col5, 'abab', 'R') cr,
                        REPLACE(col, 'gg', 'V') cr2 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "cr": ['RR R ab aba', 'RRRab R', 'R R', ' R', 'R  ', 'R'],
            "cr2": [None, '  V V V ', None, None, '  V V V ', None]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test24(self):
        sql = """SELECT trim('        ' from ' f ') as test,
                        trim('    ' from 'ffff') as test2,
                        trim('    ' from '    f ' ) as test3,
                        trim('gggg' from 'gggg') as test4"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'test': [' f '],
            'test2': ['ffff'],
            'test3': ['f '],
            'test4': ['']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test25(self):
        sql = """SELECT {fn INSERT('MyHome.ppo', 1, 6, 'MySchool')},
                        {fn INSERT('HH MyHome!!.lll', 4, 6, 'SSL')}
        """
        # sql = """SELECT overlay('MyHome.com', 'MySchool', 1, 6) """
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "OVERLAY('MYHOME.PPO' PLACING 'MYSCHOOL' FROM 1 FOR 6)": [
                'MySchool.ppo'],
            "OVERLAY('HH MYHOME!!.LLL' PLACING 'SSL' FROM 4 FOR 6)": [
                'HH SSL!!.lll']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test26(self):
        sql = """SELECT overlay('waaaaaaarce' placing 'resou' from 3),
                        overlay('waaaaaaarce' placing 'resou' from 3 for 2)
        """
        # sql = """SELECT overlay('MyHome.com', 'MySchool', 1, 6) """
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "OVERLAY('waaaaaaarce' PLACING 'resou' FROM 3)": ['waresouarce'],
            "OVERLAY('waaaaaaarce' PLACING 'resou' FROM 3 FOR 2)": [
                'waresouaaaarce']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test27(self):
        sql = """select space(10)"""
        res = self.brtcsql.execute(sql)
        ref = ref = pd.DataFrame({
            "SPACE(10)": [' ' * 10]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test28(self):
        sql = """select right('gggg afdsadf', 6), right('  gggg afdsadf   ', 4) R2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "RIGHT('gggg afdsadf',6)": ['fdsadf'],
            "R2": ['f   ']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test29(self):
        sql = """select right(col, 5) r, right(col5, 3) r2 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'r': [None, 'g gg ', None, None, 'g gg ', None],
            'r2': ['aba', 'bab', 'bab', 'bab', 'b  ', 'bab']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test30(self):
        sql = """select repeat(col, 3) from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'REPEAT(COL,3)': [None, '  gg gg gg   gg gg gg   gg gg gg ', None,
                              None, '  gg gg gg   gg gg gg   gg gg gg ', None]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test31(self):
        sql = """select repeat('gg ff', 3) rr"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'rr': ['gg ffgg ffgg ff']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test32(self):
        sql = """select ascii('a b '), ascii(' bb'), ascii('zdf')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "ASCII('a b ')": [97],
            "ASCII(' bb')": [32],
            "ASCII('zdf')": [122]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test33(self):
        sql = """select ascii(wn) from df1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "ASCII(wn)": [None, 101, None]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test34(self):
        sql = """select {fn locate('acc', 'a3acccc')} l,
                        {fn locate('acc', 'a3acccc', 3)} l1,
                        {fn locate('acc', 'a3acccc', 4)} l2,
                        {fn locate('f', 'a3acccc')} l3
        """
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "l": [3],
            "l1": [3],
            "l2": [0],
            "l3": [0]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test35(self):
        sql = """select POSITION('Acc' in 'a3acccc'),
                        POSITION('acc' in 'a3acccc' from 3),
                        POSITION('acc' in 'a3acccc' from 4),
                        POSITION('f' in 'a3acccc')
        """
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "POSITION('Acc' IN 'a3acccc')": [3],
            "POSITION('acc' IN 'a3acccc' FROM 3)": [3],
            "POSITION('acc' IN 'a3acccc' FROM 4)": [0],
            "POSITION('f' IN 'a3acccc')": [0]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test36(self):
        sql = """select POSITION(' gg' in col) c,
                        POSITION('gg' in col) c1,
                        POSITION('gg' in col from 6) c2 from df2
        """
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'c': [None, 2, None, None, 2, None],
            'c1': [None, 3, None, None, 3, None],
            'c2': [None, 0, None, None, 0, None]
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test37(self):
        sql = """select substring('SQL SQLSQL', 5, 3),
                        substring('SQL', 1, 6),
                        substring('SQL', 3, 3),
                        substring('SQL', 5, 3)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "SUBSTRING('SQL SQLSQL',5,3)": ['SQL'],
            "SUBSTRING('SQL',1,6)": ['SQL'],
            "SUBSTRING('SQL',3,3)": ['L'],
            "SUBSTRING('SQL',5,3)": ['']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    def test38(self):
        sql = """select substring(col, 3, 4) c,
                        substring(col2, 1, 1) c1,
                        substring(col5, 3, 4) c2 from df2"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            "c": [None, 'gg g', None, None, 'gg g', None],
            "c1": ['g', ' ', ' '] * 2,
            "c2": ['abab', 'abab', 'ab a', 'bab', 'ab  ', 'ab']
        })
        table_cmp(sql, res, ref,
                  check_row_order=False, print_dfs=self.print_dfs)

    # def test39(self):
    #     sql = """select substring_index(("www.w3schools.com", ".", 2)"""
    #     res = self.brtcsql.execute(sql)
    #     ref = pd.DataFrame({
    #         "c": [None, 'gg g', None, None, 'gg g', None],
    #         "c1": ['g', ' ', ' ']*2,
    #         "c2": ['abab', 'abab', 'ab a', 'bab', 'ab  ', 'ab']
    #     })
    #     table_cmp(sql, res, ref,
    #               check_row_order=False, print_dfs=self.print_dfs)


if __name__ == '__main__':
    unittest.main()
