import unittest

import pandas as pd

from brighticsql.sqldf import BrighticSQL
from brighticsql.utils.unittest_util import table_cmp


class SingleRowSubQueryTest(unittest.TestCase):

    def setUp(self):
        self.print_dfs = False
        self.check_row_order = True
        self.food = pd.DataFrame({
            'number': [1, None, 2, 3, 4, 5, 6, 7, 8, 9, None, None, 10],
            'food': ['chicken', 'spagetti', 'hamberger', 'pizza', 'salad',
                     None, None, 'candy', 'sushi', 'soup', 'taco', 'donut',
                     'cake']
        })
        self.color = pd.DataFrame({
            'number': [1, 2, 3, 4, 5, 6, None, 8, 9, 10],
            'color': ['red', 'blue', 'green', None, 'yellow', 'white', 'black',
                      'black', 'red', 'red']
        })

        self.input_tables = dict(food=self.food, color=self.color)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = """SELECT * from food
                 where number = (select number from color where color='green')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [3],
            'food': ['pizza']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test02(self):
        sql = """SELECT * from food
                 where number = (select number from color where color='orange')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [],
            'food': []})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test03(self):
        sql = """SELECT * from food
                 where number < (select number from color where color='green')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, 2],
            'food': ['chicken', 'hamberger']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test04(self):
        sql = """SELECT * from food
                 where number <= (select number from color where color='green')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, 2, 3],
            'food': ['chicken', 'hamberger', 'pizza']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test05(self):
        sql = """SELECT * from food
                 where number > (select number from color where color='green')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [4, 5, 6, 7, 8, 9, 10],
            'food': ['salad', None, None, 'candy', 'sushi', 'soup', 'cake']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test06(self):
        sql = """SELECT * from food
                 where number >= (select number from color where color='green')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [3, 4, 5, 6, 7, 8, 9, 10],
            'food': ['pizza', 'salad', None, None, 'candy', 'sushi', 'soup',
                     'cake']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test07(self):
        sql = """SELECT * from food
                 where number <> (select number from color where color='green')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, 2, 4, 5, 6, 7, 8, 9, 10],
            'food': ['chicken', 'hamberger', 'salad', None, None, 'candy',
                     'sushi', 'soup', 'cake']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)


if __name__ == '__main__':
    unittest.main()
