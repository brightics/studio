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
from brightics.function.textanalytics import bow


class TestBagOfWords(unittest.TestCase):

    def setUp(self):
        print("*** Bag of Words UnitTest Start ***")
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
        self.df = pd.DataFrame({'words':data})
        print(self.df)
        
       
    def tearDown(self):
        print("*** Bag of Words UnitTest End ***")

    def test_bag_of_words1(self):
        input_dataframe = self.df

        res = bow(table=input_dataframe, input_col='words', add_words=None, no_below=1, no_above=0.8, keep_n=10000)['out_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], ['What', 1])
        self.assertListEqual(table[1], ['a', 1])
        self.assertListEqual(table[7], ['know', 2])
        self.assertListEqual(table[13], ['I', 3])
        self.assertListEqual(table[14], ['like', 1])
    
    def test_bag_of_words2(self):
        input_dataframe = self.df

        res = bow(table=input_dataframe, input_col='words', add_words=None, no_below=2, no_above=0.7, keep_n=10)['out_table']
        
        print(res)
        
        table = res.values.tolist()
        self.assertListEqual(table[0], ['know', 2])
        self.assertListEqual(table[1], ['the', 2])
        self.assertListEqual(table[2], ['I', 3])
        self.assertListEqual(table[3], ['would', 2])
        self.assertListEqual(table[4], ['me', 4])
        

if __name__ == '__main__':
    unittest.main()
