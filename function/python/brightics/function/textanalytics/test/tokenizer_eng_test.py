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
from brightics.function.textanalytics.tokenizer import tokenizer_eng


class TokenizerTest(unittest.TestCase):
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

