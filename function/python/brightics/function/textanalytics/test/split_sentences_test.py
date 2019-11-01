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

from brightics.function.textanalytics.split_sentences import split_sentences
import unittest
import numpy as np
import pandas as pd
import HtmlTestRunner
import os


class SplitSentences(unittest.TestCase):
    
    def setUp(self):
        print("*** Split Sentences UnitTest Start ***")
        self.testdata_1 = pd.DataFrame({'text':['이것은 우리 가족 이야기. 아버지가 방에 들어가신다. 어머니는 청소하신다. 우리는 행복하다.', '이것은 우리 가족 이야기이다. 아빠가 들어가신다. 엄마는 청소하신다. 우리는 행복한 가족이다.']})
        
        text1 = '''Nagasaki University in Japan will not hire teachers who smoke. It wants to create a healthier place to work and study. The university said: "Our job...is to look after our staff. We feel we have to discourage them from smoking." It said there would be no smoking in the university from August. People won't be able to take cigarettes into the university from April 2020. About eight per cent of the university's professors and teachers smoke.'''
        text2 = 'Garbage collectors in Ankara, Turkey are recycling books they find in the trash. They started a mobile library. It has over 9,000 books on its shelves. There are over 20 categories of books, including politics, romance, history, literature and economics. The library is inside a truck. It tours schools around Ankara. The library wants to make children more passionate about books, especially in the age of mobile phones. Many Turkish schools do not have a library.'
        self.testdata_2 = pd.DataFrame({'text':[text1, text2]})

    def tearDown(self):
        print("*** Split Sentences UnitTest End ***")
    
    def test(self):
        
        DF1 = split_sentences(table=self.testdata_1, input_col='text', language='eng')['out_table']
        # print(DF1)
        np.testing.assert_equal(DF1['doc_id'][0], 1)
        np.testing.assert_equal(DF1['doc_id'][1], 1)
        np.testing.assert_equal(DF1['doc_id'][6], 2)
        np.testing.assert_equal(DF1['doc_id'][7], 2)
        np.testing.assert_equal(DF1['sentence_id'][0], 1)
        np.testing.assert_equal(DF1['sentence_id'][1], 2)
        np.testing.assert_equal(DF1['sentence_id'][6], 3)
        np.testing.assert_equal(DF1['sentence_id'][7], 4)
        self.assertEqual(DF1['sentence'][0], '이것은 우리 가족 이야기.')
        self.assertEqual(DF1['sentence'][1], '아버지가 방에 들어가신다.')
        self.assertEqual(DF1['sentence'][6], '엄마는 청소하신다.')
        self.assertEqual(DF1['sentence'][7], '우리는 행복한 가족이다.')
        
        DF2 = split_sentences(table=self.testdata_2, input_col='text', language='eng')['out_table']
        # print(DF2[0:10])
        np.testing.assert_equal(DF2['doc_id'][0], 1)
        np.testing.assert_equal(DF2['doc_id'][1], 1)
        np.testing.assert_equal(DF2['doc_id'][7], 2)
        np.testing.assert_equal(DF2['doc_id'][8], 2)
        np.testing.assert_equal(DF2['sentence_id'][0], 1)
        np.testing.assert_equal(DF2['sentence_id'][1], 2)
        np.testing.assert_equal(DF2['sentence_id'][7], 1)
        np.testing.assert_equal(DF2['sentence_id'][8], 2)
        self.assertEqual(DF2['sentence'][0], 'Nagasaki University in Japan will not hire teachers who smoke.')
        self.assertEqual(DF2['sentence'][1], 'It wants to create a healthier place to work and study.')
        self.assertEqual(DF2['sentence'][7], 'Garbage collectors in Ankara, Turkey are recycling books they find in the trash.')
        self.assertEqual(DF2['sentence'][8], 'They started a mobile library.')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
