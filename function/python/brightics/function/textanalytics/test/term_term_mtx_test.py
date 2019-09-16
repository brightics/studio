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
from brightics.function.textanalytics import term_term_mtx
from brightics.function.textanalytics import bow
import HtmlTestRunner
import os


class TestTermTermMatrix(unittest.TestCase):

    def setUp(self):
        print("*** Term-term Matrix UnitTest Start ***")
        data = [['What', 'a', 'wonderful', 'life'],
                ['You', 'may', 'know', 'about', 'the', 'reason', 'why', 'she', 'cried'],
                ['I', 'would', 'like', 'to', 'stop', 'working'],
                ['I', 'wish', 'I', 'could', 'not', 'hear', 'the', 'voice'],
                ['It', 'would', 'be', 'nice', 'if', 'you', 'can', 'help', 'me', 'with', 'this'],
                ['Let', 'me', 'know', 'your', 'opinion', 'on', 'this'],
                ['I', 'hate', 'you', 'so', 'much'],
                ['Please', 'keep', 'distance', 'with', 'me'],
                ['Get', 'out', 'from', 'here'],
                ['Stay', 'away', 'from', 'me']]
        self.df = pd.DataFrame({'words': data})
        print(self.df)

    def tearDown(self):
        print("*** Term-term Matrix UnitTest End ***")

    def test_term_term_matrix1(self):
        input_dataframe = self.df
        
        res_bow = bow(table=input_dataframe, input_col='words', add_words=None, no_below=1, no_above=0.8, keep_n=10000)['model']
        res = term_term_mtx(table=input_dataframe, model=res_bow, input_col='words', result_type='sparse')
        
        print(res['out_table'])
        
        table = res['out_table'].values.tolist()
        self.assertListEqual(table[0], ['What', 'a', 1])
        self.assertListEqual(table[1], ['a', 'life', 1])
        self.assertListEqual(table[2], ['What', 'life', 1])
        self.assertListEqual(table[3], ['life', 'wonderful', 1])
        self.assertListEqual(table[4], ['a', 'wonderful', 1])
        
    def test_term_term_matrix2(self):
        input_dataframe = self.df
        
        res_bow = bow(table=input_dataframe, input_col='words', add_words=None, no_below=1, no_above=0.8, keep_n=10000)['model']
        res = term_term_mtx(table=input_dataframe, model=res_bow, input_col='words', result_type='dense')
        
        print(res['out_table'])
        
        table = res['out_table'].values.tolist()
        self.assertListEqual(table[0], ['What', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[1], ['a', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[2], ['life', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[3], ['wonderful', 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[4], ['You', 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        
        
if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
