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
from brightics.function.textanalytics import n_gram
import HtmlTestRunner
import os


class TestNGram(unittest.TestCase):

    def setUp(self):
        print("*** NGram UnitTest Start ***")
        words = [["What", "a", "wonderful", "life"],
            ["You", "may", "know", "about", "the", "reason", "why", "she", "cried"],
            ["I", "would", "like", "to", "stop", "working"],
            ["I", "wish", "I", "could", "not", "hear", "the", "voice"],
            ["It", "would", "be", "nice", "if", "you", "can", "help", "me", "with", "this"],
            ["Let", "me", "know", "your", "opinion", "on", "this"],
            ["I", "hate", "you", "so", "much"],
            ["Please", "keep", "distance", "with", "me"],
            ["Get", "out"],
            ["Stay", "away", "from", "me"]] 
        self.data = pd.DataFrame({'text': words})

    def tearDown(self):
        print("*** NGram UnitTest End ***")

    def test_default(self):
        df_input = self.data
        
        df_res = n_gram(df_input, input_col='text', n=2)['out_table']
        
        self.assertListEqual(['What a', 'a wonderful', 'wonderful life'],
                             df_res['n_gram'].values[0], 'incorrect n_gram')
        self.assertListEqual(['Stay away', 'away from', 'from me'],
                             df_res['n_gram'].values[9], 'incorrect n_gram')

    def test_optional(self):
        df_input = self.data
        
        df_res = n_gram(df_input, input_col='text', n=3)['out_table']
        
        self.assertListEqual(['What a wonderful', 'a wonderful life'],
                             df_res['n_gram'].values[0], 'incorrect n_gram')
        self.assertListEqual([],
                             df_res['n_gram'].values[8], 'incorrect n_gram')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
