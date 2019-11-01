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
from brightics.function.textanalytics import doc_term_mtx
from brightics.function.textanalytics import bow
import HtmlTestRunner
import os


class TestTermDocumentMatrix(unittest.TestCase):

    def setUp(self):
        print("*** Term-document Matrix UnitTest Start ***")
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
        print("*** Term-document Matrix UnitTest End ***")

    def test_term_document_matrix1(self):
        input_dataframe = self.df
        
        res_bow = bow(table=input_dataframe, input_col='words', add_words=None, no_below=1, no_above=0.8, keep_n=10000)['model']
        res = doc_term_mtx(table=input_dataframe, model=res_bow, input_col='words', result_type='doc_to_bow_token')
        
        print(res['out_table'])
        
        table = res['out_table'].values.tolist()
        self.assertListEqual(table[0], ['doc_0', "['(What, 1)', '(a, 1)', '(life, 1)', '(wonderful, 1)']"])
        self.assertListEqual(table[1], ['doc_1', "['(You, 1)', '(about, 1)', '(cried, 1)', '(know, 1)', '(may, 1)', '(reason, 1)', '(she, 1)', '(the, 1)', '(why, 1)']"])
        self.assertListEqual(table[2], ['doc_2', "['(I, 1)', '(like, 1)', '(stop, 1)', '(to, 1)', '(working, 1)', '(would, 1)']"])
        self.assertListEqual(table[3], ['doc_3', "['(the, 1)', '(I, 2)', '(could, 1)', '(hear, 1)', '(not, 1)', '(voice, 1)', '(wish, 1)']"])
        self.assertListEqual(table[4], ['doc_4', "['(would, 1)', '(It, 1)', '(be, 1)', '(can, 1)', '(help, 1)', '(if, 1)', '(me, 1)', '(nice, 1)', '(this, 1)', '(with, 1)', '(you, 1)']"])
        
    def test_term_document_matrix2(self):
        input_dataframe = self.df
        
        res_bow = bow(table=input_dataframe, input_col='words', add_words=None, no_below=1, no_above=0.8, keep_n=10000)['model']
        res = doc_term_mtx(table=input_dataframe, model=res_bow, input_col='words', result_type='term_doc_mtx')
        
        print(res['out_table'])
        
        table = res['out_table'].values.tolist()
        self.assertListEqual(table[0], ['What', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[1], ['a', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[2], ['life', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[3], ['wonderful', 1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        self.assertListEqual(table[4], ['You', 0, 1, 0, 0, 0, 0, 0, 0, 0, 0])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
