import numpy as np
import pandas as pd
import unittest

from brighticsql.utils.unittest_util import table_cmp
from brighticsql.sqldf import BrighticSQL


class MultipleRowSubQueryTest(unittest.TestCase):

    def setUp(self):
        self.print_dfs = False
        self.check_row_order = True
        self.orderdetails = pd.DataFrame({
            'OrderDetailID': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'NAME': ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', None, 'j'],
            'ProductID': [3, 4, 2, 5, 1, 6, 7, 9, 8, 10],
            'Quantity': [12, 10, 5, 9, 40, 10, 35, np.nan, 10, 15]
        })
        self.products = pd.DataFrame({
            'ProductID': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'ProductName': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            'SupplierID': [1, 1, 1, 1, 3, 3, 2, 2, 4, 5],
            'CategoryID': [5, 5, 3, 4, 2, 2, 1, 1, 5, 1],
            'Price': [18.0, 19.0, 10.0, 22.0, 21.35, 25.0, 3.0, 40.0, 9.0, 31]
        })
        self.instructor = pd.DataFrame({
            'NAME': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            'DEPARTMENT': ['CB', 'E', 'CS', 'E', 'CS', 'E', 'CS', 'B'],
            'SALARY': [1, 1.2, 1.3, 1.2, 2, 1.2, 2, 0.9]
        })
        self.food = pd.DataFrame({
            'number': [1, None, 2, 3, 4, 5, 6, 7, 8, 9, None, None, 10],
            'food': ['chicken', 'spagetti', 'hamberger', 'pizza', 'salad',
                     None, None, 'candy', 'sushi', 'soup', 'taco', 'donut',
                     'cake']
        })
        self.color = pd.DataFrame({
            'number': [1, 2, 3, 4, 5, 6, None],
            'color': ['red', 'blue', 'green', None, 'yellow', 'white', 'black']
        })
        self.input_tables = dict(orderdetails=self.orderdetails,
                                 products=self.products,
                                 instructor=self.instructor,
                                 food=self.food,
                                 color=self.color)
        self.port = 50051
        self.brtcsql = BrighticSQL()
        self.brtcsql.connect('grpc', self.port)
        self.brtcsql.set_tables(self.input_tables)

    def test01(self):
        sql = """SELECT ProductName
                 FROM Products
                 WHERE ProductID in (SELECT ProductID FROM OrderDetails WHERE Quantity = 10)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'ProductName': ['D', 'F', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test02(self):
        sql = """SELECT ProductName
                 FROM Products
                 WHERE ProductID = some(SELECT ProductID FROM OrderDetails WHERE Quantity = 10)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'ProductName': ['D', 'F', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test03(self):
        sql = """SELECT ProductName
                 FROM Products
                 WHERE ProductID <> some(SELECT ProductID FROM OrderDetails WHERE Quantity = 10)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame(
            {'ProductName': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test04(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary > some (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['E', 'G']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test05(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary >= some (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['C', 'E', 'G']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test06(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary < some (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['A', 'B', 'C', 'D', 'F', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test07(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary <= some (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test08(self):
        sql = """SELECT ProductName
                 FROM Products
                 WHERE ProductID = any(SELECT ProductID FROM OrderDetails WHERE Quantity = 10)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'ProductName': ['D', 'F', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test09(self):
        sql = """SELECT ProductName
                 FROM Products
                 WHERE ProductID <> any(SELECT ProductID FROM OrderDetails WHERE Quantity = 10)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame(
            {'ProductName': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test10(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary > any (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['E', 'G']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test11(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary >= any (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['C', 'E', 'G']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test12(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary < any (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['A', 'B', 'C', 'D', 'F', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test13(self):
        sql = """SELECT name
                 FROM instructor
                 WHERE salary <= any (SELECT salary from instructor where department='CS')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'name': ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test14(self):
        sql = """SELECT Name
                 FROM instructor
                 WHERE salary = all(SELECT salary FROM instructor WHERE department = 'E')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'Name': ['B', 'D', 'F']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test15(self):
        sql = """SELECT Name
                 FROM instructor
                 WHERE salary <> all(SELECT salary FROM instructor WHERE department = 'E')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'Name': ['A', 'C', 'E', 'G', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test16(self):
        sql = """SELECT Name
                 FROM instructor
                 WHERE salary > all(SELECT salary FROM instructor WHERE department = 'E')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'Name': ['C', 'E', 'G']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test17(self):
        sql = """SELECT Name
                 FROM instructor
                 WHERE salary >= all(SELECT salary FROM instructor WHERE department = 'E')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'Name': ['B', 'C', 'D', 'E', 'F', 'G']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test18(self):
        sql = """SELECT Name
                 FROM instructor
                 WHERE salary < all(SELECT salary FROM instructor WHERE department = 'E')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'Name': ['A', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test19(self):
        sql = """SELECT Name
                 FROM instructor
                 WHERE salary <= all(SELECT salary FROM instructor WHERE department = 'E')"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({'Name': ['A', 'B', 'D', 'F', 'H']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test20(self):
        sql = """select * from food f
                 where exists (select c.number from color c)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, None, 2, 3, 4, 5, 6, 7, 8, 9, None, None, 10],
            'food': ['chicken', 'spagetti', 'hamberger', 'pizza', 'salad',
                     None, None, 'candy', 'sushi', 'soup', 'taco', 'donut',
                     'cake']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test21(self):
        sql = """select * from food f
                 where exists (select number = number from color)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, None, 2, 3, 4, 5, 6, 7, 8, 9, None, None, 10],
            'food': ['chicken', 'spagetti', 'hamberger', 'pizza', 'salad',
                     None, None, 'candy', 'sushi', 'soup', 'taco', 'donut',
                     'cake']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test22(self):
        sql = """select * from food f
                 where exists (select number <> number from color)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, None, 2, 3, 4, 5, 6, 7, 8, 9, None, None, 10],
            'food': ['chicken', 'spagetti', 'hamberger', 'pizza', 'salad',
                     None, None, 'candy', 'sushi', 'soup', 'taco', 'donut',
                     'cake']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)


if __name__ == '__main__':
    unittest.main()
