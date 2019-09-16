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


from brightics.function.evaluation import evaluate_ranking_algorithm
from brightics.function.recommendation.als import als_recommend
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class EvaluateRankingAlgorithm(unittest.TestCase):
    
    def setUp(self):
        print("*** Evaluate Ranking Algorithm UnitTest Start ***")
        data = dict()
        np.random.seed(3) ; data['user']= np.random.randint(10,size=100)
        np.random.seed(10) ; data['item']= np.random.randint(10,size=100)
        np.random.seed(5) ; data['rating'] = np.random.randint(5,size=100)
        self.testdata = data

    def tearDown(self):
        print("*** Evaluate Ranking Algorithm UnitTest End ***")

    def test(self):
        recommend_result = als_recommend(self.testdata, user_col = 'user', item_col = 'item', rating_col = 'rating', filter=False, seed = 5)['out_table']
        result = evaluate_ranking_algorithm(table1 = pd.DataFrame(self.testdata), table2=recommend_result, user_col ='user', item_col ='item', evaluation_measure=['prec','ndcg','map'], k_values=[1])
        np.testing.assert_array_almost_equal(result['out_table'].value[:3], [1.0,1.0,0.5424142162951686], 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
