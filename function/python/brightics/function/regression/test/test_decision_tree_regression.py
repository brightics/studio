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
from brightics.common.datasets import load_iris
from brightics.function.regression import decision_tree_regression_train, decision_tree_regression_predict


class TestDecisionTreeRegression(unittest.TestCase):

    def setUp(self):
        print("*** Decision Tree Regression UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Decision Tree Regression UnitTest End ***")

    def test_decision_tres_regression_train_predict(self):
        input_dataframe = self.iris
        
        res_train = decision_tree_regression_train(table=input_dataframe,
                                              feature_cols=['sepal_length', 'sepal_width', 'petal_length'], label_col='petal_width', random_state=12345)
        res_predict = decision_tree_regression_predict(table=input_dataframe, model=res_train['model'])
        
        print(res_predict['out_table'])
        
        table = res_predict['out_table'].values.tolist()
        self.assertListEqual(table[0][:5], [5.1, 3.5, 1.4, 0.2, 'setosa'])
        self.assertListEqual(table[1][:5], [4.9, 3, 1.4, 0.2, 'setosa'])
        self.assertListEqual(table[2][:5], [4.7, 3.2, 1.3, 0.2 , 'setosa'])
        self.assertListEqual(table[3][:5], [4.6, 3.1, 1.5, 0.2, 'setosa'])
        self.assertListEqual(table[4][:5], [5, 3.6, 1.4, 0.2, 'setosa'])
        self.assertAlmostEqual(table[0][5], 0.25, places=10)
        self.assertAlmostEqual(table[1][5], 0.2, places=10)
        self.assertAlmostEqual(table[2][5], 0.2, places=10)
        self.assertAlmostEqual(table[3][5], 0.2, places=10)
        self.assertAlmostEqual(table[4][5], 0.2, places=10)


if __name__ == '__main__':
    unittest.main()
