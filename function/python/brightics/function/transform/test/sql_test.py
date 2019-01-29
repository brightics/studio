import unittest
import pandas as pd
import numpy as np
from brightics.function.test_data import get_iris
from brightics.function.transform import sql_execute
from brightics.common.repr import strip_margin

df_iris = get_iris()


class SQLTest(unittest.TestCase):

    def test_percentile(self):
        query = strip_margin('''
        | SELECT percentile(sepal_length, 25) FROM #{DF(0)}
        |''')

        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(5.1, result_df.values[0][0], 'The percentile is not correct.')
    
    def test_array(self):
        query = strip_margin('''
        | SELECT collect_list(sepal_length) as coll_list
        | , collect_set(sepal_length) as coll_set
        | , size(array(sepal_length,sepal_width)) as size_arr
        | FROM #{DF(0)}
        |''')
    
        result_df = sql_execute(df_iris, query)['out_table']
        
        with pd.option_context('display.max_rows', 100, 'display.max_columns', 100):
            print(result_df) 
        
        self.assertEqual(4.9, result_df.values[0][0][1], 'The second element of the list is not correct.')
        self.assertEqual(4.4, result_df.values[0][1][1], 'The second element of the list is not correct.')
        self.assertEqual(2, result_df.values[0][2], 'The size of first element is not correct.')      
