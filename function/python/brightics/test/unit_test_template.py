import unittest
import pandas as pd
from brightics.function.manipulation import sort


class TemplateUnitTest(unittest.TestCase):

    def setUp(self):
        self.example_table = pd.DataFrame({
            'A': [1, 2, 3],
            'B': ['a', 'b', 'c']
            })
        print("Test Start")

    def tearDown(self):
        print("Test End")

    def test_none(self):
        pass

    def test_example_sort(self):
        in_table = self.example_table
        expected_table = pd.DataFrame({
            'A': [3, 2, 1],
            'B': ['c', 'b', 'a']
            })

        sort_out = sort(table=in_table,
                        input_cols=['B'],
                        is_asc=False)['out_table'].reset_index(drop=True)
        print(sort_out)
        pd.testing.assert_frame_equal(expected_table, sort_out)

    def test_assert(self):
        self.assertEqual(1.0, 1.0)
        self.assertTrue(1.0 == 0.0)
        self.assertFalse(False)

    def test_equal_pandas(self):
        table1 = pd.DataFrame({
            'A': [1, 2, 3],
            'B': ['a', 'b', 'c']
            })

        table2 = table1.copy()
        pd.testing.assert_frame_equal(table1, table2)
