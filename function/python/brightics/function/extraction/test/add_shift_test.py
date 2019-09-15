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


from brightics.function.extraction import add_shift
from brightics.common.datasets import load_iris
import unittest
import math
import HtmlTestRunner
import os


class AddShiftTest(unittest.TestCase):
    
    def setUp(self):
        print("*** Add Shift UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Add Shift UnitTest End ***")

    def test_add_shift1(self):
        add_shift_out = add_shift(table=self.iris, input_col='sepal_length', shift_list=[-2, -1, 0, 1, 2])

        table = add_shift_out['out_table'].values.tolist()
        self.assertListEqual(table[0][:8], [5.1, 3.5, 1.4, 0.2, 'setosa', 4.7, 4.9, 5.1])
        self.assertTrue(math.isnan(table[0][8]))
        self.assertTrue(math.isnan(table[0][9]))
        self.assertListEqual(table[1][:9], [4.9, 3.0, 1.4, 0.2, 'setosa', 4.6, 4.7, 4.9, 5.1])
        self.assertTrue(math.isnan(table[0][9]))
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 5.0, 4.6, 4.7, 4.9, 5.1])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 5.4, 5.0, 4.6, 4.7, 4.9])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 4.6, 5.4, 5.0, 4.6, 4.7])

    def test_add_shift2(self):
        add_shift_out = add_shift(table=self.iris, input_col='sepal_length', shift_list=[1], order_by=['sepal_width'], group_by=['species'])

        table = add_shift_out['out_table'].values.tolist()

        self.assertListEqual(table[0][:5], [4.5, 2.3, 1.3, 0.3, 'setosa'])
        self.assertTrue(math.isnan(table[0][5]))
        self.assertListEqual(table[1], [4.4, 2.9, 1.4, 0.2, 'setosa', 4.5])
        self.assertListEqual(table[2], [4.9, 3.0, 1.4, 0.2, 'setosa', 4.4])
        self.assertListEqual(table[3], [4.8, 3.0, 1.4, 0.1, 'setosa', 4.9])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
