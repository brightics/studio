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

from brightics.function.recommendation.als import als_train
from brightics.function.recommendation.als import als_predict
from brightics.function.recommendation.als import als_recommend
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np
import HtmlTestRunner
import os


class ALS(unittest.TestCase):
    
    def setUp(self):
        print("*** ALS UnitTest Start ***")
        data = dict()
        np.random.seed(3) ; data['user'] = np.random.randint(10, size=100)
        np.random.seed(10) ; data['item'] = np.random.randint(10, size=100)
        np.random.seed(5) ; data['rating'] = np.random.randint(5, size=100)
        self.testdata = data

    def tearDown(self):
        print("*** ALS UnitTest End ***")
    
    def test(self):
        result = als_train(self.testdata, user_col='user', item_col='item', rating_col='rating', implicit=True, seed=5)['model']
        np.testing.assert_array_almost_equal(result['user_factors']['features'][0], [0.7827272522525689, 0.5719906568592842, 0.04662757615567294, 0.08435863658705169, 0.13961930483088836, 0.8158731311149139, -0.2989090206125877, 0.18833942895847422, 0.22372763072542956, 0.24804294365451002], 10)
        np.testing.assert_array_almost_equal(result['user_factors']['features'][1], [0.6231809722140008, 0.18638666829515813, 0.6494260943804142, -0.27646543445251864, -0.3845309876582424, 0.6397336295652383, 0.01564816564638764, -0.03867166495432923, 0.7250761840795689, 0.10994264590483944], 10)
        np.testing.assert_array_almost_equal(result['user_factors']['features'][2], [0.39027551931624577, -0.15305372642373116, 0.3697306467265087, -0.3061721146289602, 0.25116083826202235, -0.010580822026468721, 0.6106377866190532, 0.3929926281979517, 0.533076138698723, 0.2740249383131869], 10)
        np.testing.assert_array_almost_equal(result['user_factors']['features'][3], [0.36880430655625285, 0.33040135139120513, 0.4784710806190769, 0.6539707617726397, -0.07757454178495538, 0.28011644723180507, -0.15975519195760648, 0.10971640101984394, -0.3098423506341671, -0.07909486951433393], 10)
        np.testing.assert_array_almost_equal(result['user_factors']['features'][4], [-0.08200541559064711, 0.37848581949552046, -0.28233808896252915, 0.04577983873739822, 0.4285143599922477, 0.6179166850800334, 0.17008419995671525, 0.5559306112245265, 0.30794429302324133, -0.39045653631429367], 10)
        predict = als_predict(table=pd.DataFrame(self.testdata), model=result)['out_table']
        np.testing.assert_array_almost_equal(predict.prediction[:5], [0.9956982152505974, -0.045045469162887486, 0.9844770330982069, 0.9967581851809032, 0.9956982152505974], 4)
        recommend_result = als_recommend(self.testdata, user_col='user', item_col='item', rating_col='rating', filter=False, seed=5)['out_table']
        np.testing.assert_array_almost_equal(recommend_result['rating_top1'][:5], [16.976264923981944, 3.9679093140523096, 3.9873630479966105, 3.0033018849257873, 7.9666502915457755], 10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
