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


class CorrelatedSubQueryTest(unittest.TestCase):

    def setUp(self):
        self.dept = pd.DataFrame({
            'deptno': [10, 20, 30, 40],
            'dname': ['ACCOUNTING', 'RESEARCH', 'SALES', 'OPERATIONS'],
            'loc': ['NEW YORK', 'DALLAS', 'CHICAGO', 'BOSTON']})
        self.emp = pd.DataFrame({
            'empno': [7839, 7698, 7782, 7566, 7788, 7902, 7369, 7499, 7521,
                      7654, 7844, 7876, 7900, 7934],
            'ename': ['KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER'],
            'job': ['PRESIDENT', 'MANAGER', 'MANAGER', 'MANAGER', 'ANALYST',
                    'ANALYST', 'CLERK', 'SALESMAN', 'SALESMAN', 'SALESMAN',
                    'SALESMAN', 'CLERK', 'CLERK', 'CLERK'],
            'mgr': [None, 7839, 7839, 7839, 7566, 7566, 7902, 7698, 7698, 7698,
                    7698, 7788, 7698, 7782],
            'hiredate': ['1996-11-17', '1991-1-05', '1999-9-06', '2001-02-04',
                         '2003-06-17', '1981-03-12', '2007-12-1', '20-2-1981',
                         '22-2-1981', '28-9-1981', '8-9-1981', '13-7-1987',
                         '3-12-1981', '2003-1-23'],
            'sal': [5000, 2850, 2450, 2975, 3000, 3000, 800, 1600, 1250, 1250,
                    1500, 1100, 950, 1300],
            's': [5, 3, 2, 3, 3, 3, 1, 2, 1, 1, 2, 1, 1, 1],
            'comm': [None, None, None, None, None, None, None, '300', '500',
                     '1400', '0', None, None, None],
            'deptno': [10, 30, 10, 20, 20, 20, 20, 30, 30, 30, 30, 20, 30, 10]})
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
        self.input_tables = dict(dept=self.dept, emp=self.emp, food=self.food,
                                 color=self.color)

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
        sql = """select * from food f
                 where exists (select c.number from color c
                               where c.number=f.number)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, 2, 3, 4, 5, 6],
            'food': ['chicken', 'hamberger', 'pizza', 'salad', None, None]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test02(self):
        sql = """select * from food f
                 where exists (select c.number from color c
                               where f.number=c.number)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, 2, 3, 4, 5, 6],
            'food': ['chicken', 'hamberger', 'pizza', 'salad', None, None]})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test03(self):
        sql = """select * from food f
                 where exists (select c.number from color c
                               where f.number>f.number)"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [],
            'food': []})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test04(self):
        sql = """select * from food f
                 where exists (select c.number from color c
                               where f.number=abs(f.number))"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            'food': ['chicken', 'hamberger', 'pizza', 'salad',
                     None, None, 'candy', 'sushi', 'soup', 'cake']})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test05(self):
        sql = """select * from food f
                 where exists (select c.number from color c
                               where f.number<>abs(f.number))"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'number': [],
            'food': []})
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test06(self):
        sql = """select e1.ename, (select e2.ename from emp e2
                                   where e1.mgr = e2.empno) as mgr_name
                 from emp e1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ename': ['KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER'],
            'mgr_name': [None, 'KING', 'KING', 'KING', 'JONES', 'JONES', 'FORD',
                         'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'SCOTT', 'BLAKE',
                         'CLARK']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test07(self):
        sql = """select e1.ename,
                        (select e2.ename from emp e2
                         where e1.mgr = e2.empno) as mgr_name,
                        (select e3.ename from emp e3
                         where e1.mgr = e3.empno ) as M2
                 from emp e1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ename': ['KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER'],
            'mgr_name': [None, 'KING', 'KING', 'KING', 'JONES', 'JONES', 'FORD',
                         'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'SCOTT', 'BLAKE',
                         'CLARK'],
            'M2': [None, 'KING', 'KING', 'KING', 'JONES', 'JONES', 'FORD',
                   'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'SCOTT', 'BLAKE',
                   'CLARK']
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test08(self):
        sql = """select e1.ename, (select e2.ename from emp e2
                                   where e1.mgr = e2.empno and e2.mgr = e3.empno) as mgr_name
                 from emp e1, emp e3"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ename': ['KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER', 'KING', 'BLAKE', 'CLARK', 'JONES',
                      'SCOTT', 'FORD', 'SMITH', 'ALLEN', 'WARD', 'MARTIN',
                      'TURNER', 'ADAMS', 'JAMES', 'MILLER', 'KING', 'BLAKE',
                      'CLARK', 'JONES', 'SCOTT', 'FORD', 'SMITH', 'ALLEN',
                      'WARD', 'MARTIN', 'TURNER', 'ADAMS', 'JAMES', 'MILLER',
                      'KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER', 'KING', 'BLAKE', 'CLARK', 'JONES',
                      'SCOTT', 'FORD', 'SMITH', 'ALLEN', 'WARD', 'MARTIN',
                      'TURNER', 'ADAMS', 'JAMES', 'MILLER', 'KING', 'BLAKE',
                      'CLARK', 'JONES', 'SCOTT', 'FORD', 'SMITH', 'ALLEN',
                      'WARD', 'MARTIN', 'TURNER', 'ADAMS', 'JAMES', 'MILLER',
                      'KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER', 'KING', 'BLAKE', 'CLARK', 'JONES',
                      'SCOTT', 'FORD', 'SMITH', 'ALLEN', 'WARD', 'MARTIN',
                      'TURNER', 'ADAMS', 'JAMES', 'MILLER', 'KING', 'BLAKE',
                      'CLARK', 'JONES', 'SCOTT', 'FORD', 'SMITH', 'ALLEN',
                      'WARD', 'MARTIN', 'TURNER', 'ADAMS', 'JAMES', 'MILLER',
                      'KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER', 'KING', 'BLAKE', 'CLARK', 'JONES',
                      'SCOTT', 'FORD', 'SMITH', 'ALLEN', 'WARD', 'MARTIN',
                      'TURNER', 'ADAMS', 'JAMES', 'MILLER', 'KING', 'BLAKE',
                      'CLARK', 'JONES', 'SCOTT', 'FORD', 'SMITH', 'ALLEN',
                      'WARD', 'MARTIN', 'TURNER', 'ADAMS', 'JAMES', 'MILLER',
                      'KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER', 'KING', 'BLAKE', 'CLARK', 'JONES',
                      'SCOTT', 'FORD', 'SMITH', 'ALLEN', 'WARD', 'MARTIN',
                      'TURNER', 'ADAMS', 'JAMES', 'MILLER'],
            'mgr_name': [None, None, None, None, 'JONES', 'JONES', None,
                         'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', None, 'BLAKE',
                         'CLARK', None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         'FORD', None, None, None, None, 'SCOTT', None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None, None, None, None, None,
                         None, None, None, None, None]
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test09(self):
        sql = """select e1.ename, (select e2.ename from emp e2
                                   where e1.mgr = e2.empno and e2.mgr = e2.empno) as mgr_name
                 from emp e1, emp e3"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ename': ['KING', 'KING', 'KING', 'KING', 'KING', 'KING', 'KING',
                      'KING', 'KING', 'KING', 'KING', 'KING', 'KING', 'KING',
                      'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE',
                      'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE',
                      'BLAKE', 'BLAKE', 'CLARK', 'CLARK', 'CLARK', 'CLARK',
                      'CLARK', 'CLARK', 'CLARK', 'CLARK', 'CLARK', 'CLARK',
                      'CLARK', 'CLARK', 'CLARK', 'CLARK', 'JONES', 'JONES',
                      'JONES', 'JONES', 'JONES', 'JONES', 'JONES', 'JONES',
                      'JONES', 'JONES', 'JONES', 'JONES', 'JONES', 'JONES',
                      'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT',
                      'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT',
                      'SCOTT', 'SCOTT', 'FORD', 'FORD', 'FORD', 'FORD', 'FORD',
                      'FORD', 'FORD', 'FORD', 'FORD', 'FORD', 'FORD', 'FORD',
                      'FORD', 'FORD', 'SMITH', 'SMITH', 'SMITH', 'SMITH',
                      'SMITH', 'SMITH', 'SMITH', 'SMITH', 'SMITH', 'SMITH',
                      'SMITH', 'SMITH', 'SMITH', 'SMITH', 'ALLEN', 'ALLEN',
                      'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN',
                      'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN',
                      'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD',
                      'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD',
                      'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN',
                      'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN',
                      'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN', 'TURNER',
                      'TURNER', 'TURNER', 'TURNER', 'TURNER', 'TURNER',
                      'TURNER', 'TURNER', 'TURNER', 'TURNER', 'TURNER',
                      'TURNER', 'TURNER', 'TURNER', 'ADAMS', 'ADAMS', 'ADAMS',
                      'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS',
                      'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'JAMES',
                      'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES',
                      'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES',
                      'JAMES', 'MILLER', 'MILLER', 'MILLER', 'MILLER', 'MILLER',
                      'MILLER', 'MILLER', 'MILLER', 'MILLER', 'MILLER',
                      'MILLER', 'MILLER', 'MILLER', 'MILLER'],
            'mgr_name': [None] * 196
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test10(self):
        sql = """select e1.ename, (select e2.ename from emp e2
                                   where e1.mgr = e2.empno and e1.mgr = e1.empno) as mgr_name
                 from emp e1, emp e3"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ename': ['KING', 'KING', 'KING', 'KING', 'KING', 'KING', 'KING',
                      'KING', 'KING', 'KING', 'KING', 'KING', 'KING', 'KING',
                      'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE',
                      'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE',
                      'BLAKE', 'BLAKE', 'CLARK', 'CLARK', 'CLARK', 'CLARK',
                      'CLARK', 'CLARK', 'CLARK', 'CLARK', 'CLARK', 'CLARK',
                      'CLARK', 'CLARK', 'CLARK', 'CLARK', 'JONES', 'JONES',
                      'JONES', 'JONES', 'JONES', 'JONES', 'JONES', 'JONES',
                      'JONES', 'JONES', 'JONES', 'JONES', 'JONES', 'JONES',
                      'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT',
                      'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT', 'SCOTT',
                      'SCOTT', 'SCOTT', 'FORD', 'FORD', 'FORD', 'FORD', 'FORD',
                      'FORD', 'FORD', 'FORD', 'FORD', 'FORD', 'FORD', 'FORD',
                      'FORD', 'FORD', 'SMITH', 'SMITH', 'SMITH', 'SMITH',
                      'SMITH', 'SMITH', 'SMITH', 'SMITH', 'SMITH', 'SMITH',
                      'SMITH', 'SMITH', 'SMITH', 'SMITH', 'ALLEN', 'ALLEN',
                      'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN',
                      'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN', 'ALLEN',
                      'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD',
                      'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD', 'WARD',
                      'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN',
                      'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN',
                      'MARTIN', 'MARTIN', 'MARTIN', 'MARTIN', 'TURNER',
                      'TURNER', 'TURNER', 'TURNER', 'TURNER', 'TURNER',
                      'TURNER', 'TURNER', 'TURNER', 'TURNER', 'TURNER',
                      'TURNER', 'TURNER', 'TURNER', 'ADAMS', 'ADAMS', 'ADAMS',
                      'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS',
                      'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'ADAMS', 'JAMES',
                      'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES',
                      'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES', 'JAMES',
                      'JAMES', 'MILLER', 'MILLER', 'MILLER', 'MILLER', 'MILLER',
                      'MILLER', 'MILLER', 'MILLER', 'MILLER', 'MILLER',
                      'MILLER', 'MILLER', 'MILLER', 'MILLER'],
            'mgr_name': [None] * 196
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test11(self):
        sql = """select f.sal, (select e.empno from emp e
                                where f.mgr = e.empno and e.mgr=f.mgr) as c
                                from emp f"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'sal': [5000, 2850, 2450, 2975, 3000, 3000, 800, 1600, 1250, 1250,
                    1500, 1100, 950, 1300],
            'c': [None] * 14
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)

    def test12(self):
        sql = """select e1.ename,
                        (select e2.ename from emp e2
                         where e1.mgr = e2.empno) as mgr_name,
                        (select e3.ename from emp e3
                         where e3.empno = 7839 ) as M2
                 from emp e1"""
        res = self.brtcsql.execute(sql)
        ref = pd.DataFrame({
            'ename': ['KING', 'BLAKE', 'CLARK', 'JONES', 'SCOTT', 'FORD',
                      'SMITH', 'ALLEN', 'WARD', 'MARTIN', 'TURNER', 'ADAMS',
                      'JAMES', 'MILLER'],
            'mgr_name': [None, 'KING', 'KING', 'KING', 'JONES', 'JONES', 'FORD',
                         'BLAKE', 'BLAKE', 'BLAKE', 'BLAKE', 'SCOTT', 'BLAKE',
                         'CLARK'],
            'M2': ['KING'] * 14
        })
        table_cmp(sql, res, ref, print_dfs=self.print_dfs,
                  check_row_order=self.check_row_order)


if __name__ == '__main__':
    unittest.main()
