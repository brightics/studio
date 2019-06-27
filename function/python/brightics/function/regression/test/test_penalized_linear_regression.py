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
from brightics.function.test_data import get_iris
from brightics.function.transform import split_data
from brightics.function.regression import penalized_linear_regression_train, penalized_linear_regression_predict


class TestPenalizedLinearRegression(unittest.TestCase):

    def setUp(self):
        print("*** Penalized Linear Regression UnitTest Start ***")
        self.iris = get_iris()

    def tearDown(self):
        print("*** Penalized Linear Regression UnitTest End ***")

    def test_penalized_linear_regression_train_predict1(self):
        input_dataframe = self.iris
        
        df_splitted = split_data(table=input_dataframe, train_ratio=7.0, test_ratio=3.0, random_state=1)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        res_train = penalized_linear_regression_train(table=train_df,
                                              feature_cols=['sepal_length', 'sepal_width'], label_col='petal_length', random_state=1)
        res_predict = penalized_linear_regression_predict(table=test_df, model=res_train['model'])
        
        print(res_predict['out_table'])
        table = res_predict['out_table'].values.tolist()
        self.assertListEqual(table[0][:5], [5.8, 4, 1.2, 0.2, 'setosa'])
        self.assertListEqual(table[1][:5], [5.1, 2.5, 3, 1.1, 'versicolor'])
        self.assertListEqual(table[2][:5], [6.6, 3, 4.4, 1.4 , 'versicolor'])
        self.assertListEqual(table[3][:5], [5.4, 3.9, 1.3, 0.4, 'setosa'])
        self.assertListEqual(table[4][:5], [7.9, 3.8, 6.4, 2, 'virginica'])
        self.assertAlmostEqual(table[0][5], 2.6620604866852506, places=10)
        self.assertAlmostEqual(table[1][5], 3.0806000137074365, places=10)
        self.assertAlmostEqual(table[2][5], 5.22006528333164, places=10)
        self.assertAlmostEqual(table[3][5], 2.0542480818158095, places=10)
        self.assertAlmostEqual(table[4][5], 6.664096854339767, places=10)
        

    def test_penalized_linear_regression_train_predict2(self):
        input_dataframe = self.iris
        
        df_splitted = split_data(table=input_dataframe, train_ratio=7.0, test_ratio=3.0, random_state=1)
        train_df = df_splitted['train_table']
        test_df = df_splitted['test_table']
        
        res_train = penalized_linear_regression_train(table=train_df,
                                              feature_cols=['sepal_length', 'sepal_width'], label_col='petal_length', regression_type='elastic_net', alpha=10.0, l1_ratio=0.3, fit_intercept=False, max_iter=100, tol=0.1, random_state=1)
        res_predict = penalized_linear_regression_predict(table=test_df, model=res_train['model'], prediction_col='predict')
        
        print(res_predict['out_table'])
        table = res_predict['out_table'].values.tolist()
        self.assertListEqual(table[0][:5], [5.8, 4, 1.2, 0.2, 'setosa'])
        self.assertListEqual(table[1][:5], [5.1, 2.5, 3, 1.1, 'versicolor'])
        self.assertListEqual(table[2][:5], [6.6, 3, 4.4, 1.4 , 'versicolor'])
        self.assertListEqual(table[3][:5], [5.4, 3.9, 1.3, 0.4, 'setosa'])
        self.assertListEqual(table[4][:5], [7.9, 3.8, 6.4, 2, 'virginica'])
        self.assertAlmostEqual(table[0][5], 2.6620702280485116, places=10)
        self.assertAlmostEqual(table[1][5], 2.336733050530184, places=10)
        self.assertAlmostEqual(table[2][5], 3.0230700306971934, places=10)
        self.assertAlmostEqual(table[3][5], 2.4791798382524073, places=10)
        self.assertAlmostEqual(table[4][5], 3.61935626757468, places=10)

if __name__ == '__main__':
    unittest.main()
