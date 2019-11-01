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

from brightics.function.textanalytics.doc_summarize import doc_summarizer_eng, doc_summarizer_kor
import unittest
import numpy as np
import pandas as pd
import HtmlTestRunner
import os


class DocumentSummerizerKorean(unittest.TestCase):
    
    def setUp(self):
        print("*** Document Summerizer(Korean) UnitTest Start ***")
        self.testdata = pd.DataFrame({'text':['이것은 우리 가족 이야기. 아버지가 방에 들어가신다. 어머니는 청소하신다. 우리는 행복하다.', '이것은 우리 가족 이야기이다. 아빠가 들어가신다. 엄마는 청소하신다. 우리는 행복한 가족이다.']})

    def tearDown(self):
        print("*** Document Summerizer(Korean) UnitTest End ***")
    
    def test(self):
        
        DF1 = doc_summarizer_kor(table=self.testdata, input_col='text', result_type='summarized_document', ratio=0.1)['out_table']
        # print(DF1)
        self.assertEqual(DF1['summarized_document'][0], '이것은 우리 가족 이야기.')
        self.assertEqual(DF1['summarized_document'][1], '이것은 우리 가족 이야기이다.')
        
        DF2 = doc_summarizer_kor(table=self.testdata, input_col='text', result_type='scored_sentence', num_sentence=2)['out_table']
        # print(DF2)
        np.testing.assert_equal(DF2['doc_id'][0], 1)
        np.testing.assert_equal(DF2['doc_id'][1], 1)
        np.testing.assert_equal(DF2['doc_id'][2], 2)
        np.testing.assert_equal(DF2['doc_id'][3], 2)
        np.testing.assert_equal(DF2['sentence_id'][0], 1)
        np.testing.assert_equal(DF2['sentence_id'][1], 4)
        np.testing.assert_equal(DF2['sentence_id'][2], 1)
        np.testing.assert_equal(DF2['sentence_id'][3], 4)
        self.assertAlmostEqual(DF1['score'][0], 0.9999999999999998, 10)
        self.assertAlmostEqual(DF1['score'][1], 0.9999999999999998, 10)
        self.assertAlmostEqual(DF1['score'][2], 0.9999999999999998, 10)
        self.assertAlmostEqual(DF1['score'][3], 0.9999999999999998, 10)
        self.assertEqual(DF2['sentence'][0], '이것은 우리 가족 이야기.')
        self.assertEqual(DF2['sentence'][1], '우리는 행복하다.')
        self.assertEqual(DF2['sentence'][2], '이것은 우리 가족 이야기이다.')
        self.assertEqual(DF2['sentence'][3], '우리는 행복한 가족이다.')
        

class DocumentSummerizerEnglish(unittest.TestCase):
    
    def setUp(self):
        print("*** Document Summerizer(English) UnitTest Start ***")
        text1 = '''Nagasaki University in Japan will not hire teachers who smoke. It wants to create a healthier place to work and study. The university said: "Our job...is to look after our staff. We feel we have to discourage them from smoking." It said there would be no smoking in the university from August. People won't be able to take cigarettes into the university from April 2020. About eight per cent of the university's professors and teachers smoke.'''
        text2 = 'Garbage collectors in Ankara, Turkey are recycling books they find in the trash. They started a mobile library. It has over 9,000 books on its shelves. There are over 20 categories of books, including politics, romance, history, literature and economics. The library is inside a truck. It tours schools around Ankara. The library wants to make children more passionate about books, especially in the age of mobile phones. Many Turkish schools do not have a library.'
        self.testdata = pd.DataFrame({'text':[text1, text2]})

    def tearDown(self):
        print("*** Document Summerizer(English) UnitTest End ***")
    
    def test(self):
        
        DF1 = doc_summarizer_eng(table=self.testdata, input_col='text', result_type='summarized_document', ratio=0.2)['out_table']
        # print(DF1)
        self.assertEqual(DF1['summarized_document'][0], "About eight per cent of the university's professors and teachers smoke.")
        self.assertEqual(DF1['summarized_document'][1], 'It tours schools around Ankara.')
        
        DF2 = doc_summarizer_eng(table=self.testdata, input_col='text', result_type='sentence', num_sentence=2)['out_table']
        # print(DF2)
        np.testing.assert_equal(DF2['doc_id'][0], 1)
        np.testing.assert_equal(DF2['doc_id'][1], 1)
        np.testing.assert_equal(DF2['doc_id'][2], 2)
        np.testing.assert_equal(DF2['doc_id'][3], 2)
        self.assertEqual(DF2['sentence'][0], 'Nagasaki University in Japan will not hire teachers who smoke.')
        self.assertEqual(DF2['sentence'][1], "About eight per cent of the university's professors and teachers smoke.")
        self.assertEqual(DF2['sentence'][2], 'They started a mobile library.')
        self.assertEqual(DF2['sentence'][3], 'It tours schools around Ankara.')
        

if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
