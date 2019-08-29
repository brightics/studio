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

import unittest
import pandas as pd
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
    
    def test_isotime(self):
        query = strip_margin('''
        | SELECT 
        | datediff('2013-09-28T01:21:16+00:00','2013-09-27T23:21:16+00:00') as date_diff
        | , datediff('2013-03-02','2013-02-27') as date_diff2
        |''')
    
        result_df = sql_execute([], query)['out_table']
        
        with pd.option_context('display.max_rows', 100, 'display.max_columns', 100):
            print(result_df)

        self.assertEqual(0, result_df.values[0][0], 'datediff gives a wrong result.')
        self.assertEqual(3, result_df.values[0][1], 'datediff gives a wrong result.')

    def test_variance(self):
        query = strip_margin('''
        | select variance(sepal_length) as var_sepal_length from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(0.6811222222222235, result_df.values[0][0], 10, 'variance gives a wrong result.')

    def test_var_pop(self):
        query = strip_margin('''
        | select var_pop(sepal_length) as var_pop_sepal_length from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(0.6811222222222235, result_df.values[0][0], 10, 'var_pop gives a wrong result.')

    def test_var_samp(self):
        query = strip_margin('''
        | select var_samp(sepal_length) as var_samp_sepal_length from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(0.6856935123042518, result_df.values[0][0], 10, 'var_samp gives a wrong result.')

    def test_stddev_pop(self):
        query = strip_margin('''
        | select stddev_pop(sepal_length) as stddev_pop_sepal_length from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(0.8253012917851417, result_df.values[0][0], 10, 'stddev_pop gives a wrong result.')

    def test_stddev_samp(self):
        query = strip_margin('''
        | select stddev_samp(sepal_length) as stddev_samp_sepal_length from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(0.8280661279778637, result_df.values[0][0], 10, 'stddev_samp gives a wrong result.')

    def test_covar_pop(self):
        query = strip_margin('''
        | select covar_pop(sepal_length, sepal_width) as covar_pop_sepal_length_sepal_width from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(-0.039006666666666696, result_df.values[0][0], 10, 'covar_pop gives a wrong result.')

    def test_covar_samp(self):
        query = strip_margin('''
        | select covar_samp(sepal_length, sepal_width) as covar_samp_sepal_length_sepal_width from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(-0.03926845637583896, result_df.values[0][0], 10, 'covar_samp gives a wrong result.')

    def test_e(self):
        query = strip_margin('''
        | select sepal_length + e() from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(7.818281828459044, result_df.values[0][0], 10, 'e gives a wrong result.')

    def test_pi(self):
        query = strip_margin('''
        | select sepal_length + pi() from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(8.241592653589793, result_df.values[0][0], 10, 'pi gives a wrong result.')

    def test_log(self):
        query = strip_margin('''
        | select log(sepal_length), ln(sepal_length), log(10), ln(10) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(1.62924053973028, result_df.values[0][0], 10, 'log gives a wrong result.')
        self.assertAlmostEqual(1.62924053973028, result_df.values[0][1], 10, 'ln gives a wrong result.')
        self.assertAlmostEqual(2.302585092994046, result_df.values[0][2], 10, 'log gives a wrong result.')
        self.assertAlmostEqual(2.302585092994046, result_df.values[0][3], 10, 'ln gives a wrong result.')

    def test_log10(self):
        query = strip_margin('''
        | select log10(sepal_length), log10(10) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(0.7075701760979364, result_df.values[0][0], 10, 'log10 gives a wrong result.')

    def test_log2(self):
        query = strip_margin('''
        | select log2(sepal_length), log2(10) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(2.350497247084133, result_df.values[0][0], 10, 'log2 gives a wrong result.')

    def test_exp(self):
        query = strip_margin('''
        | select exp(sepal_length), exp(10) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(164.0219072999017, result_df.values[0][0], 10, 'exp gives a wrong result.')

    def test_exp2(self):
        query = strip_margin('''
        | select exp2(sepal_length), exp2(10) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(34.29675080116137, result_df.values[0][0], 10, 'exp2 gives a wrong result.')

    def test_sqrt(self):
        query = strip_margin('''
        | select sqrt(sepal_length), sqrt(2) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(2.258317958127243, result_df.values[0][0], 10, 'sqrt gives a wrong result.')
        self.assertAlmostEqual(1.4142135623730951, result_df.values[0][1], 10, 'sqrt gives a wrong result.')

    def test_ceil(self):
        query = strip_margin('''
        | select ceil(sepal_length), ceil(-1.5) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(6, result_df.values[0][0], 'ceil gives a wrong result.')
        self.assertEqual(-1, result_df.values[0][1], 'ceil gives a wrong result.')

    def test_floor(self):
        query = strip_margin('''
        | select floor(sepal_length), floor(-1.5) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(5, result_df.values[0][0], 'floor gives a wrong result.')
        self.assertEqual(-2, result_df.values[0][1], 'floor gives a wrong result.')

    def test_sign(self):
        query = strip_margin('''
        | select sign(sepal_length), sign(-1.5) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(1, result_df.values[0][0], 'sign gives a wrong result.')
        self.assertEqual(-1, result_df.values[0][1], 'sign gives a wrong result.')

    def test_factorial(self):
        query = strip_margin('''
        | select factorial(ceil(sepal_length)), factorial(5) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(720, result_df.values[0][0], 'factorial gives a wrong result.')
        self.assertEqual(120, result_df.values[0][1], 'factorial gives a wrong result.')

    def test_pow(self):
        query = strip_margin('''
        | select pow(sepal_length, sepal_width), pow(2, 3) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertAlmostEqual(299.56813546353686, result_df.values[0][0], 10, 'pow gives a wrong result.')
        self.assertEqual(8.0, result_df.values[0][1], 'pow gives a wrong result.')

    def test_ljust(self):
        query = strip_margin('''
        | select ljust(sepal_length, 7, '_'), ljust('abc', 7, '_'), rjust(sepal_length, 5, '_'), rjust('abc', 5, '_') from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual('5.1____', result_df.values[0][0], 'ljust gives a wrong result.')
        self.assertEqual('abc____', result_df.values[0][1], 'ljust gives a wrong result.')
        self.assertEqual('__5.1', result_df.values[0][2], 'ljust gives a wrong result.')
        self.assertEqual('__abc', result_df.values[0][3], 'ljust gives a wrong result.')

    def test_is_null(self):
        query = strip_margin('''
        | select is_null(sepal_length), is_null(5), is_null(null) from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(0, result_df.values[0][0], 'is_null gives a wrong result.')
        self.assertEqual(0, result_df.values[0][1], 'is_null gives a wrong result.')
        self.assertEqual(1, result_df.values[0][2], 'is_null gives a wrong result.')

    def test_regexp(self):
        query = strip_margin('''
        | select regexp('set', species), regexp('setosa2', species), regexp('a', 'a b'), regexp('a b', 'a') from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(1, result_df.values[0][0], 'regexp gives a wrong result.')
        self.assertEqual(0, result_df.values[0][1], 'regexp gives a wrong result.')
        self.assertEqual(1, result_df.values[0][2], 'regexp gives a wrong result.')
        self.assertEqual(0, result_df.values[0][3], 'regexp gives a wrong result.')

    def test_regexp_replace(self):
        query = strip_margin('''
        | select regexp_replace(species, 'setosa', 'setosa_2'), regexp_replace('a b c', 'a', 'value') from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual('setosa_2', result_df.values[0][0], 'regexp_replace gives a wrong result.')
        self.assertEqual('value b c', result_df.values[0][1], 'regexp_replace gives a wrong result.')

    def test_concat_ws(self):
        query = strip_margin('''
        | select concat_ws('^', column) from #{DF(0)}
        ''')
        df_iris['column'] = df_iris.apply(lambda x: [x['sepal_length'], x['sepal_width'], x['petal_length'], x['petal_width']], axis=1)
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual('5.1^3.5^1.4^0.2', result_df.values[0][0], 'concat_ws gives a wrong result.')

    def test_split(self):
        query = strip_margin('''
        | select split(species, 't') from #{DF(0)}
        ''')
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(['se', 'osa'], result_df.values[0][0], 'split gives a wrong result.')

    def test_size(self):
        query = strip_margin('''
        | select size(array) from #{DF(0)}
        ''')
        df_iris['array'] = df_iris.apply(lambda x: [x['sepal_length'], x['sepal_width'], x['petal_length'], x['petal_width']], axis=1)
        result_df = sql_execute(df_iris, query)['out_table']
        print(result_df)
        self.assertEqual(4, result_df.values[0][0], 'size gives a wrong result.')
