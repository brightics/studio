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
from brightics.function.textanalytics.search import search
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

    def tearDown(self):
        print("*** Search UnitTest End ***")

    def test_search1(self):
        search_out = search(table=self.example_df, user_dict=pd.DataFrame(), input_cols=['document'], search_words=['this'], synonym_dict=[], main_operator='and')

        table = search_out['out_table'].values.tolist()
        self.assertListEqual(table[0], [4, 'signalling boredom, loathing, delight, fear, hate ... and ecstasy) are the best reason to watch this picture and worth two stars.',3])
        self.assertListEqual(table[1], [5, 'She endures this basically trashy stuff with an astonishing amount of dignity. I wish some really good parts come along for her. She really deserves it.', 2])

    def test_search2(self):
        search_out = search(table=self.example_df, user_dict=self.user_dict, input_cols=['document'], search_words=['this'], synonym_dict=[], main_operator='and')

        table = search_out['out_table'].values.tolist()

        self.assertListEqual(table[0], [0, 'Once again Mr. Costner has dragged out a movie for far longer than necessary. Aside from the terrific sea rescue sequences, of which there are very few I just did not care about any of the characters.', 2])
        self.assertListEqual(table[1], [1, 'This is an example of why the majority of action films are the same. Generic and boring, there\'s really nothing worth watching here. ',4])
        self.assertListEqual(table[2], [4, 'signalling boredom, loathing, delight, fear, hate ... and ecstasy) are the best reason to watch this picture and worth two stars.', 3])
        self.assertListEqual(table[3], [5, 'She endures this basically trashy stuff with an astonishing amount of dignity. I wish some really good parts come along for her. She really deserves it.',2])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
