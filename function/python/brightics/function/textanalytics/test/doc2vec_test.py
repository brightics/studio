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
from brightics.function.textanalytics import doc2vec, doc2vec_model
import HtmlTestRunner
import os


def hash_brtc(text):
    import hashlib
    return int(hashlib.md5(text.encode('utf-8')).hexdigest(), 16)


class TestDoc2Vec(unittest.TestCase):

    def setUp(self):
        print("*** Doc2Vec UnitTest Start ***")
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
        print("*** Doc2Vec UnitTest End ***")

    def test_default(self):
        df_input = self.data
        
        res = doc2vec(df_input, input_col='text', dm=1, vector_size=2, window=10, min_count=1, max_vocab_size=None,
                      train_epoch=100, workers=1, alpha=0.025, min_alpha=0.025, seed=12345,
                      hs=1, negative=5, ns_exponent=0.75, hashfxn=hash_brtc)
        df_res = res['doc_table']
         
        if os.name == 'posix':
            np.testing.assert_array_almost_equal([-0.1508731245, 2.5971629619], df_res['document_vectors'].values[0], 10, 'incorrect 1st vector')
            np.testing.assert_array_almost_equal([-2.2133889198, 1.2029378414], df_res['document_vectors'].values[1], 10, 'incorrect 2nd vector')
            np.testing.assert_array_almost_equal([-2.1448497772, -0.5242040753], df_res['document_vectors'].values[2], 10, 'incorrect 3rd vector')
            np.testing.assert_array_almost_equal([-1.7283661365, 2.0390095710], df_res['document_vectors'].values[3], 10, 'incorrect 4th vector')
            np.testing.assert_array_almost_equal([-2.8729238510, 1.6128736734], df_res['document_vectors'].values[4], 10, 'incorrect 5th vector')
        else:
            np.testing.assert_array_almost_equal([-0.15087300539016724, 2.5971627235412598], df_res['document_vectors'].values[0], 10, 'incorrect 1st vector')
            np.testing.assert_array_almost_equal([-2.213388442993164, 1.2029374837875366], df_res['document_vectors'].values[1], 10, 'incorrect 2nd vector')
            np.testing.assert_array_almost_equal([-2.1448493003845215, -0.5242040753364563], df_res['document_vectors'].values[2], 10, 'incorrect 3rd vector')
            np.testing.assert_array_almost_equal([-1.7283657789230347, 2.0390093326568604], df_res['document_vectors'].values[3], 10, 'incorrect 4th vector')
            np.testing.assert_array_almost_equal([-2.8729236125946045, 1.6128734350204468], df_res['document_vectors'].values[4], 10, 'incorrect 5th vector')
        
        df_res = res['word_table']
        
        self.assertListEqual(['I', 'me', 'know', 'the', 'would'], df_res['words'].tolist()[:5], 'incorrect words')
        np.testing.assert_array_almost_equal([0.11733274906873703, 0.21637524664402008], df_res['word_vectors'].values[0], 10, 'incorrect 1st vector')
        np.testing.assert_array_almost_equal([-0.05361199006438255, 0.12040887773036957], df_res['word_vectors'].values[1], 10, 'incorrect 2nd vector')
        np.testing.assert_array_almost_equal([-0.0865887999534607, 0.10449013859033585], df_res['word_vectors'].values[2], 10, 'incorrect 3rd vector')
        np.testing.assert_array_almost_equal([0.1396317332983017, -0.10766895860433578], df_res['word_vectors'].values[3], 10, 'incorrect 4th vector')
        np.testing.assert_array_almost_equal([-0.08853525668382645, 0.10193411260843277], df_res['word_vectors'].values[4], 10, 'incorrect 5th vector')
        
        df_docs = pd.DataFrame({'text':[["This", "is", "wonderful", "life"], ["Please", "keep", "quiet"]]})
        df_res = doc2vec_model(df_docs, res['model'])['out_table']
        
        np.testing.assert_array_almost_equal([-0.047298919409513474, 1.3835302591323853], df_res['document_vectors'].values[0], 10, 'incorrect 1st vector')
        np.testing.assert_array_almost_equal([-1.4491902589797974, -0.3811323642730713], df_res['document_vectors'].values[1], 10, 'incorrect 2nd vector')


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
