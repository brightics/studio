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
from brightics.function.classification.decision_tree_classification import decision_tree_classification_train, \
    decision_tree_classification_predict
import HtmlTestRunner
import os


class DecisionTreeClassificationTest(unittest.TestCase):

    def setUp(self):
        print("*** Decision Tree Classification UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** Decision Tree Classification UnitTest End ***")

    def test_decision_tree_classification1(self):
        train_out = decision_tree_classification_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)

        table = train_out['model']['feature_importance']
        self.assertAlmostEqual(table[0], 0.02666667, 6)
        self.assertAlmostEqual(table[1], 0.0, 1)
        self.assertAlmostEqual(table[2], 0.55072262, 6)
        self.assertAlmostEqual(table[3], 0.42261071, 6)

    def test_decision_tree_classification2(self):
        train_out = decision_tree_classification_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)
        predict_out = decision_tree_classification_predict(table=self.iris, model=train_out['model'])

        table = predict_out['out_table'].values.tolist()
        self.assertListEqual(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 'setosa'])

    def test_decision_tree_classification3(self):
        train_out = decision_tree_classification_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345, criterion='entropy', max_leaf_nodes=2, group_by=['species'])
        predict_out = decision_tree_classification_predict(table=self.iris, model=train_out['model'])

        table = predict_out['out_table'].values.tolist()
        self.assertListEqual(table[0], [5.1, 3.5, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[1], [4.9, 3.0, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[2], [4.7, 3.2, 1.3, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[3], [4.6, 3.1, 1.5, 0.2, 'setosa', 'setosa'])
        self.assertListEqual(table[4], [5.0, 3.6, 1.4, 0.2, 'setosa', 'setosa'])


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
