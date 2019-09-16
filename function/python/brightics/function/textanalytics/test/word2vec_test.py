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
from brightics.function.textanalytics import word2vec, word2vec_model, word2vec_similarity
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
        
        res = word2vec(df_input, input_col='text', size=2, window=5, min_count=1, seed=12345, workers=1, sg=1, topn=30, hashfxn=hash_brtc)
        df_res = res['out_table']
         
        self.assertListEqual(['What', 'a', 'wonderful', 'life', 'You'], df_res['words'].tolist()[:5], 'incorrect words')
        np.testing.assert_array_almost_equal([0.4767833948135376, 0.8790208101272583], df_res['word_vectors'].values[0], 10, 'incorrect 1st vector')
        np.testing.assert_array_almost_equal([-0.40653660893440247, 0.9136345386505127], df_res['word_vectors'].values[1], 10, 'incorrect 2nd vector')
        np.testing.assert_array_almost_equal([-0.6375106573104858, 0.7704415917396545], df_res['word_vectors'].values[2], 10, 'incorrect 3rd vector')
        np.testing.assert_array_almost_equal([0.7919377684593201, -0.6106019020080566], df_res['word_vectors'].values[3], 10, 'incorrect 4th vector')
        np.testing.assert_array_almost_equal([-0.6556293368339539, 0.7550828456878662], df_res['word_vectors'].values[4], 10, 'incorrect 5th vector')
        
        df_docs = pd.DataFrame({'text':[["This", "is", "wonderful", "life"], ["Please", "keep", "quiet"]]})
        df_res = word2vec_model(df_docs, res['model'])['out_table']
 
        np.testing.assert_array_almost_equal([0.07721355557441711, 0.07991984486579895], df_res['feature_vectors'].values[0], 10, 'incorrect 1st vector')
        np.testing.assert_array_almost_equal([0.7665442526340485, -0.14435414969921112], df_res['feature_vectors'].values[1], 10, 'incorrect 2nd vector')

        df_res = word2vec_similarity(res['model'], positive=['like', 'wonderful'], negative=['me'], topn=3)['out_table']
        outfile = open("D:/tmp", 'w')
        for i in range(3):
            print(df_res['similarity'].values[i], end=',', file=outfile)
        print('', file=outfile)
        self.assertListEqual(['to', 'can', 'nice'], df_res['most_similar_words'].tolist(), 'incorrect words')
        np.testing.assert_array_almost_equal([0.999999463558197, 0.9998206496238708, 0.9943715929985046], df_res['similarity'].values, 10, 'incorrect similarity')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
