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
from brightics.function.textanalytics import synonym_converter, synonym_converter_user_dict
import HtmlTestRunner
import os


class TestSynonymConverter(unittest.TestCase):

    def setUp(self):
        print("*** Synonym Converter UnitTest Start ***")
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
        print("*** Synonym Converter UnitTest End ***")

    def test_default(self):
        df_input = self.data
        
        df_res = synonym_converter(df_input, input_cols=['text'],
                                   hold_cols=None, default_dict=False,
                                   synonym_list=['you, You, your', "don't like, hate"],
                                   prefix='synonym', user_dict=None)['out_table']
        
        self.assertListEqual(["Let", "me", "know", "you", "opinion", "on", "this"], df_res['synonym_text'].values[5], 'incorrect result')
        self.assertListEqual(["you", "may", "know", "about", "the", "reason", "why", "she", "cried"], df_res['synonym_text'].values[1], 'incorrect result')
        self.assertListEqual(["I", "don't like", "you", "so", "much"], df_res['synonym_text'].values[6], 'incorrect result')

    def test_optional(self):
        df_input = self.data
        user_dict = pd.DataFrame({'word':['you', 'quit'], 'synonym':['You, she', 'stop']})
        
        df_res = synonym_converter_user_dict(df_input, input_cols=['text'], hold_cols=None, default_dict=False, synonym_list=None, prefix='synonym', user_dict=user_dict)['out_table']
        
        outfile = open("D:/tmp", 'w')
        for i in range(3):
            print(df_res['synonym_text'].values[i], end=',', file=outfile)
        print('', file=outfile)
        
        self.assertListEqual(["you", "may", "know", "about", "the", "reason", "why", "you", "cried"], df_res['synonym_text'].values[1], 'incorrect result')
        self.assertListEqual(["I", "would", "like", "to", "quit", "working"], df_res['synonym_text'].values[2], 'incorrect result')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
