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
import numpy as np
from brightics.function.textanalytics import word2vec, word2vec_model 
from brightics.function.textanalytics import word2vec_similarity, word2vec_similarity2
import HtmlTestRunner
import os


def hash_brtc(text):
    import hashlib
    return int(hashlib.md5(text.encode('utf-8')).hexdigest(), 16)


class TestWord2Vec(unittest.TestCase):

    def setUp(self):
        print("*** Word2Vec UnitTest Start ***")
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
        print("*** Word2Vec UnitTest End ***")

    def test_default(self):
        df_input = self.data
        
        res = word2vec(df_input, input_col='text', size=2, window=5, min_count=1, seed=12345, workers=1, sg="1", topn=30, hashfxn=hash_brtc)
        df_res = res['out_table']                                         
         
        self.assertListEqual(['What', 'a', 'wonderful', 'life', 'You'], df_res['words'].tolist()[:5], 'incorrect words')
        if os.name == 'posix':
            np.testing.assert_array_almost_equal([0.4595848321, 0.8881339430], df_res['word_vectors'].values[0], 10, 'incorrect 1st vector')
            np.testing.assert_array_almost_equal([-0.2637847065 , 0.9645815492], df_res['word_vectors'].values[1], 10, 'incorrect 2nd vector')
            np.testing.assert_array_almost_equal([-0.4351222515, 0.9003714323], df_res['word_vectors'].values[2], 10, 'incorrect 3rd vector')
            np.testing.assert_array_almost_equal([0.8790820240, -0.4766705930], df_res['word_vectors'].values[3], 10, 'incorrect 4th vector')
            np.testing.assert_array_almost_equal([-0.9363044500, -0.3511894047], df_res['word_vectors'].values[4], 10, 'incorrect 5th vector')
        else:
            np.testing.assert_array_almost_equal([0.4595847726, 0.8881338835], df_res['word_vectors'].values[0], 10, 'incorrect 1st vector')
            np.testing.assert_array_almost_equal([-0.263784796 , 0.9645815492], df_res['word_vectors'].values[1], 10, 'incorrect 2nd vector')
            np.testing.assert_array_almost_equal([-0.4351223111, 0.9003713130], df_res['word_vectors'].values[2], 10, 'incorrect 3rd vector')
            np.testing.assert_array_almost_equal([0.8790819645, -0.476670593], df_res['word_vectors'].values[3], 10, 'incorrect 4th vector')
            np.testing.assert_array_almost_equal([-0.9363044500, -0.3511893451], df_res['word_vectors'].values[4], 10, 'incorrect 5th vector')
            
        df_docs = pd.DataFrame({'text':[["This", "is", "wonderful", "life"], ["Please", "keep", "quiet"]]})
        df_res = word2vec_model(df_docs, res['model'])['out_table']
 
        np.testing.assert_array_almost_equal([0.2219798267, 0.21185036], df_res['feature_vectors'].values[0], 10, 'incorrect 1st vector')
        np.testing.assert_array_almost_equal([0.8309287429, -0.3005484268], df_res['feature_vectors'].values[1], 10, 'incorrect 2nd vector')

        df_res = word2vec_similarity(res['model'], positive=['like', 'wonderful'], negative=['me'], topn=3)['out_table']
        
        self.assertListEqual(['out', 'to', 'What'], df_res['most_similar_words'].tolist(), 'incorrect words')
        np.testing.assert_array_almost_equal([0.9990565777, 0.9905586839, 0.9507876039], df_res['similarity'].values, 10, 'incorrect similarity')
        
        table = pd.DataFrame({'pos':['like,wonderful', 'nice'], 'neg':['me', 'stop, working']}) 
        df_res = word2vec_similarity2(table=table, model=res['model'], positive_col='pos', negative_col='neg', topn=3)['out_table']
        
        self.assertListEqual(['out', 'to', 'What', 'Please', 'could', 'help'], df_res['synonym'].tolist(), 'incorrect words')
        np.testing.assert_array_almost_equal([0.9990565776824951, 0.9905586838722229, 0.9507876038551331,
                                              0.9989761114120483, 0.9576651453971863, 0.9429550766944885],
                                             df_res['similarity'].values, 10, 'incorrect similarity2')
  
  
if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
