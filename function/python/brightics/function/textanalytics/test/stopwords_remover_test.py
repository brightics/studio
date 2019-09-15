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
from brightics.function.textanalytics import stopwords_remover, stopwords_remover_user_dict
import HtmlTestRunner
import os


class TestStopwordsRemover(unittest.TestCase):

    def setUp(self):
        print("*** Stopwords Remover UnitTest Start ***")
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
        print("*** Stopwords Remover UnitTest End ***")

    def test_default(self):
        df_input = self.data
        
        df_res = stopwords_remover(df_input, input_cols=['text'],
                                             hold_cols=None, default_dict=False,
                                             stop_words=['What', 'a', 'to', 'be'],
                                             prefix='stopwords', user_dict=None)['out_table']

        self.assertListEqual(['wonderful', 'life'], df_res['stopwords_text'].values[0], 'incorrect result')
        self.assertListEqual(["I", "would", "like", "stop", "working"], df_res['stopwords_text'].values[2], 'incorrect result')
        self.assertListEqual(["It", "would", "nice", "if", "you", "can", "help", "me", "with", "this"], df_res['stopwords_text'].values[4], 'incorrect result')

    def test_optional(self):
        df_input = self.data
        user_dict = pd.DataFrame({'stopwords':['on', 'with']})
        df_res = stopwords_remover_user_dict(df_input, input_cols=['text'],
                                             hold_cols=None, default_dict=False,
                                             stop_words=None,
                                             prefix='stopwords', user_dict=user_dict)['out_table']

        self.assertListEqual(["What", "a", 'wonderful', 'life'], df_res['stopwords_text'].values[0], 'incorrect result')
        self.assertListEqual(["I", "would", "like", "to", "stop", "working"], df_res['stopwords_text'].values[2], 'incorrect result')
        self.assertListEqual(["Let", "me", "know", "your", "opinion", "this"], df_res['stopwords_text'].values[5], 'incorrect result')
        self.assertListEqual(["Please", "keep", "distance", "me"], df_res['stopwords_text'].values[7], 'incorrect result')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
