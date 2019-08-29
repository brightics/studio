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

from brightics.function.recommendation.collaborative_filtering import collaborative_filtering_train
from brightics.function.recommendation.collaborative_filtering import collaborative_filtering_predict
from brightics.function.recommendation.collaborative_filtering import collaborative_filtering_recommend
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class CollaborativeFiltering(unittest.TestCase):
    
    def setUp(self):
        print("*** Collaborative Filtering UnitTest Start ***")
        data = dict()
        np.random.seed(3) ; data['user']= np.random.randint(10,size=100)
        np.random.seed(10) ; data['item']= np.random.randint(10,size=100)
        np.random.seed(5) ; data['rating'] = np.random.randint(5,size=100)
        self.testdata = data

    def tearDown(self):
        print("*** Collaborative Filtering UnitTest End ***")
    
    def test(self):
        result = collaborative_filtering_train(self.testdata, user_col = 'user', item_col = 'item', rating_col = 'rating')['model']
        np.testing.assert_array_almost_equal(result['similar_coeff'][0], [1.0, 0.025172508890969832, -0.25837523294085907, 0.8460464988245734, 0.11354561902774424, -0.3174005953995147, 0.20154047802764788, 0.3392145675431896, 0.3035585070136878, -0.38048504712211856], 10)
        np.testing.assert_array_almost_equal(result['similar_coeff'][1], [0.025172508890969832, 0.9999999999999999, -0.34263446117362434, -0.005104699098597409, -0.3389900564711026, 0.24440440667427968, -0.0588602011685014, 0.011640504929493038, 0.10398227833599262, -0.006871970987351806], 10)
        np.testing.assert_array_almost_equal(result['similar_coeff'][2], [-0.25837523294085907, -0.34263446117362434, 1.0, -0.16229304156072535, 0.29385235467698123, 0.27498597046143514, 0.16247247889198468, 0.13770607453181927, 0.07522197531466354, 0.42273279418912], 10)
        np.testing.assert_array_almost_equal(result['similar_coeff'][3], [0.8460464988245734, -0.005104699098597409, -0.16229304156072535, 1.0, 0.44770717567132823, -0.10675210253672475, 0.07884165279854435, 0.0, 0.2047888355996599, 0.01380722983961874], 10)
        np.testing.assert_array_almost_equal(result['similar_coeff'][4], [0.11354561902774424, -0.3389900564711026, 0.29385235467698123, 0.44770717567132823, 1.0, 0.38195770709508803, 0.40120101254299, -0.1059981384423915, 0.14269226079251268, 0.4538406086510286], 10)
        predict = collaborative_filtering_predict(table = pd.DataFrame(self.testdata), model = result, maintain_already_scored = False)
        np.testing.assert_array_almost_equal(predict['out_table'].prediction[:5],[8.03357256721028,1.4624509664720293,0.2579380152129754,3.8620124519953776,8.03357256721028],10)
        recommend_result = collaborative_filtering_recommend(self.testdata, user_col = 'user', item_col = 'item', rating_col = 'rating')        
        np.testing.assert_array_almost_equal(recommend_result['out_table']['rating_top1'][:5],[9.058001251195108,2.5503525350619616,2.19020248543627,1.2333489755922515,np.nan],10)

        