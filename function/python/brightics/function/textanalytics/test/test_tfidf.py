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
from brightics.function.textanalytics import tfidf


class TestTFIDF(unittest.TestCase):

    def setUp(self):
        print("*** TF-IDF UnitTest Start ***")
        data = ['eat turkey on turkey day holiday',
              'i like to eat cake on holiday',
              'turkey trot race on thanksgiving holiday',
              'snail race the turtle',
              'time travel space race',
              'movie on thanksgiving',
              'movie at air and space museum is cool movie',
              'aspiring movie star'
            ]
        df = pd.DataFrame({'text':data})
        print(df)
        self.data = df

    def tearDown(self):
        print("*** TF-IDF UnitTest End ***")

    def test_tfidf1(self):
        input_dataframe = self.data
        
        res = tfidf2(table=input_dataframe, input_col='text', max_df=None, min_df=1, num_voca=100, idf_weighting_scheme='inverseDocumentFrequency', norm='l2', smooth_idf=True, sublinear_tf=False, output_type=True)
        
        idf_table = res['table_1']
        tfidf_table = res['table_2']
        
        print(idf_table)
        print(tfidf_table)
        
        table1 = idf_table.values.tolist()
        table2 = tfidf_table.values.tolist()
        
        self.assertListEqual(table1[0], ['air', 2.504077396776274])
        self.assertListEqual(table1[1], ['aspiring', 2.504077396776274])
        self.assertListEqual(table1[2], ['cake', 2.504077396776274])
        self.assertListEqual(table1[3], ['cool', 2.504077396776274])
        self.assertListEqual(table2[2], ['doc_0', 'eat turkey on turkey day holiday', 'holiday', 1, 0.3222992816130961])
        self.assertListEqual(table2[3], ['doc_0', 'eat turkey on turkey day holiday', 'turkey', 2, 0.7469986716940933])
        self.assertListEqual(table2[4], ['doc_1', 'i like to eat cake on holiday', 'cake', 1, 0.4456617592757509])
        self.assertListEqual(table2[5], ['doc_1', 'i like to eat cake on holiday', 'eat', 1, 0.373499335847046644])
        
    def test_tfidf2(self):
        input_dataframe = self.data
        
        res = tfidf2(table=input_dataframe, input_col='text', max_df=4, min_df=1, num_voca=100, idf_weighting_scheme='unary', norm='l1', smooth_idf=False, sublinear_tf=False, output_type=False)
        
        idf_table = res['idf_table']
        tfidf_table = res['tfidf_table']
        
        print(idf_table)
        print(tfidf_table)
        
        table1 = idf_table.values.tolist()
        table2 = tfidf_table.values.tolist()
        
        self.assertListEqual(table1[0], ['air', 1.0])
        self.assertListEqual(table1[1], ['aspiring', 1.0])
        self.assertListEqual(table1[2], ['cake', 1.0])
        self.assertListEqual(table1[3], ['cool', 1.0])
        self.assertListEqual(table2[2], ['doc_0', 'eat turkey on turkey day holiday', 'cake', 0, 0.0])
        self.assertListEqual(table2[3], ['doc_0', 'eat turkey on turkey day holiday', 'cool', 0, 0.0])
        self.assertListEqual(table2[4], ['doc_0', 'eat turkey on turkey day holiday', 'day', 1, 1.0])
        self.assertListEqual(table2[5], ['doc_0', 'eat turkey on turkey day holiday', 'eat', 1, 1.0])


if __name__ == '__main__':
    unittest.main()
