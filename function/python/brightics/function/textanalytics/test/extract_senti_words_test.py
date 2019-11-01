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

from brightics.function.textanalytics.extract_senti_words import extract_senti_words
import unittest
import numpy as np
import pandas as pd
import HtmlTestRunner
import os


class SplitSentences(unittest.TestCase):
    
    def setUp(self):
        print("*** Extract Sentimental Words UnitTest Start ***")
        self.testdata_1 = pd.DataFrame({'tokenized_sentence':[['늘', '가야', '나름', '에어', '드레스', '필요성', '상품', '가치', '제대로', '홍보', '것'],
                                                              ['이제', '먼지', '털공', '스팀', '공', '주름', '쫙쫙', '향기도', '솔솔', '배송', '예용', '잇님들', '구매', '제품', '하나', '하나']]})
        self.testdata_2 = pd.DataFrame({'tokenized_sentence':[['lords', 'lordships', 'accept', 'view', 'pleading'],
                                                              ['microsoft', 'held', 'talks', 'past', 'few']],
                                        'hold_test' : [1, 2]})
        
    def tearDown(self):
        print("*** Extract Sentimental Words UnitTest End ***")
    
    def test(self):
        
        user_dict_kor = pd.DataFrame({'word':['솔솔', '아이디어', '주름'], 'score':[1, 1, -1]})
        DF1 = extract_senti_words(table=self.testdata_1, input_col='tokenized_sentence', user_dict=user_dict_kor, hold_cols=None)['out_table']
        # print(DF1)
        np.testing.assert_equal(DF1['pos_words'][0], ['가치', '제대로'])
        np.testing.assert_equal(DF1['neg_words'][0], [])
        np.testing.assert_equal(DF1['total_score'][0], 2)
        self.assertAlmostEqual(DF1['avg_score'][0], 0.18181818181818182, 10)
        
        np.testing.assert_equal(DF1['pos_words'][1], ['솔솔'])
        np.testing.assert_equal(DF1['neg_words'][1], ['먼지', '주름'])
        np.testing.assert_equal(DF1['total_score'][1], -1)
        self.assertAlmostEqual(DF1['avg_score'][1], -0.0625, 10)
        
        user_dict_eng = pd.DataFrame({'word':['accept', 'lords', 'past'], 'score':[1, 1, -1]})
        DF2 = extract_senti_words(table=self.testdata_2, input_col='tokenized_sentence', user_dict=user_dict_eng, hold_cols=['hold_test'])['out_table']
        # print(DF2)
        np.testing.assert_equal(DF2['hold_test'][0], 1)
        np.testing.assert_equal(DF2['pos_words'][0], ['lords', 'accept'])
        np.testing.assert_equal(DF2['neg_words'][0], [])
        np.testing.assert_equal(DF2['total_score'][0], 2)
        self.assertAlmostEqual(DF2['avg_score'][0], 0.4, 10)
        
        np.testing.assert_equal(DF2['hold_test'][1], 2)
        np.testing.assert_equal(DF2['pos_words'][1], [])
        np.testing.assert_equal(DF2['neg_words'][1], ['past'])
        np.testing.assert_equal(DF2['total_score'][1], -1)
        self.assertAlmostEqual(DF2['avg_score'][1], -0.2, 10)
        

if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
