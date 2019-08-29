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
from brightics.function.classification.logistic_regression import logistic_regression_train, \
    logistic_regression_predict


class LogisticRegressionTest(unittest.TestCase):

    def setUp(self):
        print("*** Logistic Regression UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Logistic Regression UnitTest End ***")

    def test_logistic_regression1(self):
        train_out = logistic_regression_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)
        table = train_out['model']

        self.assertAlmostEqual(table['aic'], 102.8061763653174, places=10)
        self.assertAlmostEqual(table['bic'], 117.85935283579867, places=10)
        self.assertAlmostEqual(table['intercept'][0], 0.265606167975517, places=10)
        self.assertAlmostEqual(table['intercept'][1], 1.0854237423889328, places=10)
        self.assertAlmostEqual(table['intercept'][2], -1.2147145780786375, places=10)
        self.assertAlmostEqual(table['coefficients'][0][0], 0.41498832829570176, places=10)
        self.assertAlmostEqual(table['coefficients'][1][0], 0.41663968559519354, places=10)
        self.assertAlmostEqual(table['coefficients'][2][0], -1.7075251538239118, places=10)

    def test_logistic_regression2(self):
        train_out = logistic_regression_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)
        predict_out = logistic_regression_predict(table=self.iris, model=train_out['model'])

        table = predict_out['out_table'].values.tolist()
        self.assertListEqual(table[0][:6], [5.1, 3.5, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[0][6], 0.8796816489561853, places=10)
        self.assertAlmostEqual(table[0][7], 0.1203075379065891, places=10)
        self.assertAlmostEqual(table[0][8], 1.0813137225508066e-05, places=10)

        self.assertListEqual(table[1][:6], [4.9, 3.0, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[1][6], 0.7997063251281568, places=10)
        self.assertAlmostEqual(table[1][7], 0.2002632923353134, places=10)
        self.assertAlmostEqual(table[1][8], 3.0382536530016292e-05, places=10)

        self.assertListEqual(table[2][:6], [4.7, 3.2, 1.3, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[2][6], 0.853796794849413, places=10)
        self.assertAlmostEqual(table[2][7], 0.14617730202211324, places=10)
        self.assertAlmostEqual(table[2][8], 2.590312847381948e-05, places=10)

        self.assertListEqual(table[3][:6], [4.6, 3.1, 1.5, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[3][6], 0.8253831268363401, places=10)
        self.assertAlmostEqual(table[3][7], 0.17455893749671547, places=10)
        self.assertAlmostEqual(table[3][8], 5.793566694451843e-05, places=10)

        self.assertListEqual(table[4][:6], [5.0, 3.6, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[4][6], 0.8973236276177116, places=10)
        self.assertAlmostEqual(table[4][7], 0.10266516737872604, places=10)
        self.assertAlmostEqual(table[4][8], 1.1205003562481428e-05, places=10)

    def test_logistic_regression3(self):
        train_out = logistic_regression_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345, C=2.0, group_by=['petal_width'])
        predict_out = logistic_regression_predict(table=self.iris, model=train_out['model'])

        table = predict_out['out_table'].values.tolist()
        self.assertListEqual(table[0][:6], [7.0, 3.2, 4.7, 1.4, 'versicolor', 'versicolor'])
        self.assertAlmostEqual(table[0][6], 0.9352574891997213, places=10)
        self.assertAlmostEqual(table[0][7], 0.06474251080027872, places=10)

        self.assertListEqual(table[1][:6], [5.2, 2.7, 3.9, 1.4, 'versicolor', 'versicolor'])
        self.assertAlmostEqual(table[1][6], 0.8639068307342562, places=10)
        self.assertAlmostEqual(table[1][7], 0.13609316926574377, places=10)

        self.assertListEqual(table[2][:6], [6.1, 2.9, 4.7, 1.4, 'versicolor', 'versicolor'])
        self.assertAlmostEqual(table[2][6], 0.8587139003988119, places=10)
        self.assertAlmostEqual(table[2][7], 0.14128609960118807, places=10)

        self.assertListEqual(table[3][:6], [6.7, 3.1, 4.4, 1.4, 'versicolor', 'versicolor'])
        self.assertAlmostEqual(table[3][6], 0.9368424584237718, places=10)
        self.assertAlmostEqual(table[3][7], 0.06315754157622822, places=10)

        self.assertListEqual(table[4][:6], [6.6, 3.0, 4.4, 1.4, 'versicolor', 'versicolor'])
        self.assertAlmostEqual(table[4][6], 0.9278851167206701, places=10)
        self.assertAlmostEqual(table[4][7], 0.07211488327932994, places=10)


if __name__ == '__main__':
    unittest.main()
