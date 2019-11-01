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

import unittest
import pandas as pd
from brightics.function.textanalytics import tokenizer_kor
from brightics.function.textanalytics.tokenizer import tokenizer_eng
import HtmlTestRunner
import os


class TestTokenizerKor(unittest.TestCase):

    def setUp(self):
        print("*** Tokenizer Korean (Twitter) UnitTest Start ***")
        words = ["아버지가 방에 들어가신다.", "사과는 빨갛다.", "은비까비가 세종시에 갔다."] 
        self.data = pd.DataFrame({'text': words})

    def tearDown(self):
        print("*** Tokenizer Korean (Twitter) UnitTest End ***")

    def test_default(self):
        df_input = self.data
        
        df_res = tokenizer_kor(df_input, input_cols=['text'], hold_cols=None, new_col_prefix='tokenized',
                               normalization=True, stemming=True, pos_extraction=None, is_tagged=False)['out_table']
        
        self.assertListEqual(['아버지', '가', '방', '에', '들어가다', '.'], df_res['tokenized_text'].values[0], 'incorrect result')
        self.assertListEqual(['사과', '는', '빨갛다', '.'], df_res['tokenized_text'].values[1], 'incorrect result')
        self.assertListEqual(['은비', '까비', '가', '세종시', '에', '가다', '.'], df_res['tokenized_text'].values[2], 'incorrect result')
    
    def test_stemming_false(self):
        df_input = self.data
        
        df_res = tokenizer_kor(df_input, input_cols=['text'], hold_cols=None, new_col_prefix='tokenized',
                               normalization=True, stemming=False, pos_extraction=None, is_tagged=False)['out_table']
        
        self.assertListEqual(['아버지', '가', '방', '에', '들어가신', '다', '.'], df_res['tokenized_text'].values[0], 'incorrect result')
        self.assertListEqual(['사과', '는', '빨갛', '다', '.'], df_res['tokenized_text'].values[1], 'incorrect result')
        self.assertListEqual(['은비', '까비', '가', '세종시', '에', '갔', '다', '.'], df_res['tokenized_text'].values[2], 'incorrect result')
          
    def test_noun_extraction(self):
        df_input = self.data
        
        df_res = tokenizer_kor(df_input, input_cols=['text'], hold_cols=None, new_col_prefix='tokenized',
                               normalization=True, stemming=True, pos_extraction=['Noun'], is_tagged=False)['out_table']
        
        self.assertListEqual(['아버지', '방'], df_res['tokenized_text'].values[0], 'incorrect result')
        self.assertListEqual(['사과'], df_res['tokenized_text'].values[1], 'incorrect result')
        self.assertListEqual(['은비', '까비', '세종시'], df_res['tokenized_text'].values[2], 'incorrect result')


class TestTokenizerEng(unittest.TestCase):

    def setUp(self):
        print("*** Tokenizer UnitTest Start ***")
        self.example_df = pd.DataFrame({"id": [0],
                                        'document': ['Once again Mr. Costner has dragged out a movie for far longer than necessary.'],
                                        "label": [2]})

    def tearDown(self):
        print("*** Tokenizer UnitTest End ***")

    def test_eng1(self):

        tokenizer_out = tokenizer_eng(table=self.example_df, input_cols=['document'], stemming=False)
        table = tokenizer_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [0, 'Once again Mr. Costner has dragged out a movie for far longer than necessary.', 2, ['once', 'again', 'mr', 'costner', 'has', 'dragged', 'out', 'a', 'movie', 'for', 'far', 'longer', 'than', 'necessary']])

    def test_eng2(self):

        tokenizer_out = tokenizer_eng(table=self.example_df, input_cols=['document'], hold_cols=['id'], stemming=True, pos_extraction=['JJ', 'RB'], is_tagged=True)
        table = tokenizer_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [0, ['onc(RB)', 'again(RB)', 'mr(JJ)', 'far(RB)']])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
