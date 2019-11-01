# -*- coding:utf-8 -*-

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
import numpy as np
import unittest
from brightics.function.textanalytics.search import search, search2
import HtmlTestRunner
import os


class SearchTest(unittest.TestCase):

    def setUp(self):
        print("*** Search UnitTest Start ***")
        self.example_df = pd.DataFrame({"id": [0, 1, 2, 3, 4, 5],
                                        'document': ['Once again Mr. Costner has dragged out a movie for far longer than necessary. Aside from the terrific sea rescue sequences, of which there are very few I just did not care about any of the characters.', 'This is an example of why the majority of action films are the same. Generic and boring, there\'s really nothing worth watching here. ', 'Brass pictures (movies is not a fitting word for them) really are somewhat brassy.', 'Their alluring visual qualities are reminiscent of expensive high class TV commercials.', 'signalling boredom, loathing, delight, fear, hate ... and ecstasy) are the best reason to watch this picture and worth two stars.', 'She endures this basically trashy stuff with an astonishing amount of dignity. I wish some really good parts come along for her. She really deserves it.'],
                                        "label": [2, 4, 1, 3, 3, 2]})

        self.user_dict = pd.DataFrame({'key': ['this', 'this'],
                                       'value': ['here', 'new york']})
        
        self.input_df = pd.DataFrame({'id': [0, 1, 2, 3, 4],
                                      'doc1': [ '어머니의 새옷을 사다.', '아버지가 과일을 드신다.', '사과는 빨갛다.', '하늘을 나는 비행기', '어머니의 사랑'],
                                      'doc2': [ '사과는 빨갛다.', '맛있는 사과를 먹는다.', '아버지가 새모자를 쓰셨다.', '포도는 보라색', '개나리 진달래'],
                                      'label': [4, 3, 2, 1, 0]})
        
        synonym_dict = {'word':['신상품', '과일', '부모'], 'synonym': ['새옷, 새모자', '사과, 포도', '아버지, 어머니']}
        
        self.synonym_dict = pd.DataFrame(synonym_dict, columns=synonym_dict.keys())
        
        self.keyword_dict = pd.DataFrame({'keyword': ['신상품', '과일']})

    def tearDown(self):
        print("*** Search UnitTest End ***")

    def test_search1_1(self):
        search_out = search(table=self.example_df, user_dict=pd.DataFrame(), input_cols=['document'], search_words=['this'], synonym_dict=[], main_operator='and')

        table = search_out['out_table'].values.tolist()
        self.assertListEqual(table[0], [4, 'signalling boredom, loathing, delight, fear, hate ... and ecstasy) are the best reason to watch this picture and worth two stars.', 3])
        self.assertListEqual(table[1], [5, 'She endures this basically trashy stuff with an astonishing amount of dignity. I wish some really good parts come along for her. She really deserves it.', 2])

    def test_search1_2(self):
        search_out = search(table=self.example_df, user_dict=self.user_dict, input_cols=['document'], search_words=['this'], synonym_dict=[], main_operator='and')

        table = search_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [0, 'Once again Mr. Costner has dragged out a movie for far longer than necessary. Aside from the terrific sea rescue sequences, of which there are very few I just did not care about any of the characters.', 2])
        self.assertListEqual(table[1], [1, 'This is an example of why the majority of action films are the same. Generic and boring, there\'s really nothing worth watching here. ', 4])
        self.assertListEqual(table[2], [4, 'signalling boredom, loathing, delight, fear, hate ... and ecstasy) are the best reason to watch this picture and worth two stars.', 3])
        self.assertListEqual(table[3], [5, 'She endures this basically trashy stuff with an astonishing amount of dignity. I wish some really good parts come along for her. She really deserves it.', 2])

    def test_search2_or_no(self):
        search_out = search2(table=self.input_df, input_cols=['doc1', 'doc2'], hold_cols=None, bool_search="or", keyword_dict=self.keyword_dict, keywords=None, synonym_dict=self.synonym_dict, remove_na='no')

        table = search_out['out_table'].values.tolist()
        self.assertListEqual(['어머니의 새옷을 사다.', '사과는 빨갛다.', 0, 4], table[0])
        self.assertListEqual(['아버지가 과일을 드신다.', '맛있는 사과를 먹는다.', 1, 3], table[1])
        self.assertListEqual(['사과는 빨갛다.', '아버지가 새모자를 쓰셨다.', 2, 2], table[2])
        self.assertEqual(True, np.isnan(table[3][0]))
        self.assertEqual('포도는 보라색', table[3][1])
        np.testing.assert_array_equal([True, True], np.isnan(table[4][:2]))
        self.assertEqual(5, len(table))
        
    def test_search2_or_all(self):
        search_out = search2(table=self.input_df, input_cols=['doc1', 'doc2'], hold_cols=None, bool_search="or", keyword_dict=self.keyword_dict, keywords=None, synonym_dict=self.synonym_dict, remove_na='all')

        table = search_out['out_table'].values.tolist()
        self.assertListEqual(['어머니의 새옷을 사다.', '사과는 빨갛다.', 0, 4], table[0])
        self.assertListEqual(['아버지가 과일을 드신다.', '맛있는 사과를 먹는다.', 1, 3], table[1])
        self.assertListEqual(['사과는 빨갛다.', '아버지가 새모자를 쓰셨다.', 2, 2], table[2])
        self.assertEqual(True, np.isnan(table[3][0]))
        self.assertEqual('포도는 보라색', table[3][1])
        self.assertEqual(4, len(table))
        
    def test_search2_or_any(self):
        search_out = search2(table=self.input_df, input_cols=['doc1', 'doc2'], hold_cols=None, bool_search="or", keyword_dict=self.keyword_dict, keywords=None, synonym_dict=self.synonym_dict, remove_na='any')

        table = search_out['out_table'].values.tolist()
        self.assertListEqual(['어머니의 새옷을 사다.', '사과는 빨갛다.', 0, 4], table[0])
        self.assertListEqual(['아버지가 과일을 드신다.', '맛있는 사과를 먹는다.', 1, 3], table[1])
        self.assertListEqual(['사과는 빨갛다.', '아버지가 새모자를 쓰셨다.', 2, 2], table[2])
        self.assertEqual(3, len(table))
        
        
if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
