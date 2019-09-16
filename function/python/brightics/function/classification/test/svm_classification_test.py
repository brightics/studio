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
from brightics.function.classification import svm_classification_train, svm_classification_predict
import HtmlTestRunner
import os


class SVMClassificationTest(unittest.TestCase):

    def setUp(self):
        print("*** SVM Classification UnitTest Start ***")
        self.iris = load_iris()

    def tearDown(self):
        print("*** SVM Classification UnitTest End ***")

    def test_svm_classification1(self):
        train_out = svm_classification_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)
        predict_out = svm_classification_predict(table=self.iris, model=train_out['model'])

        table = predict_out['out_table'].values.tolist()
        self.assertListEqual(table[0][:6], [5.1, 3.5, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[0][6], 0.9723943803243237, places=10)
        self.assertAlmostEqual(table[0][7], 0.01388056532410064 , places=10)
        self.assertAlmostEqual(table[0][8], 0.013725054351575833, places=10)

        self.assertListEqual(table[1][:6], [4.9, 3.0, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[1][6], 0.9688766062899229, places=10)
        self.assertAlmostEqual(table[1][7], 0.01650331634583648 , places=10)
        self.assertAlmostEqual(table[1][8], 0.01462007736424048, places=10)

        self.assertListEqual(table[2][:6], [4.7, 3.2, 1.3, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[2][6], 0.9710812337223403, places=10)
        self.assertAlmostEqual(table[2][7], 0.013475834147364599, places=10)
        self.assertAlmostEqual(table[2][8], 0.01544293213029483, places=10)

        self.assertListEqual(table[3][:6], [4.6, 3.1, 1.5, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[3][6], 0.9652957979551062, places=10)
        self.assertAlmostEqual(table[3][7], 0.017692592660507486, places=10)
        self.assertAlmostEqual(table[3][8], 0.017011609384386128, places=10)

        self.assertListEqual(table[4][:6], [5.0, 3.6, 1.4, 0.2, 'setosa', 'setosa'])
        self.assertAlmostEqual(table[4][6], 0.972159479406423, places=10)
        self.assertAlmostEqual(table[4][7], 0.013441016065873218, places=10)
        self.assertAlmostEqual(table[4][8], 0.014399504527703685, places=10)

    def test_svm_classification2(self):
        train_out = svm_classification_train(table=self.iris, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345, c=0.5, group_by=['sepal_length', 'sepal_width'])
        predict_out = svm_classification_predict(table=self.iris, model=train_out['model'])

        table = predict_out['out_table'].values.tolist()

        self.assertListEqual(table[0][:6], [6.4, 3.2, 4.5, 1.5, 'versicolor', 'virginica'])
        self.assertAlmostEqual(table[0][6], 0.4762877808623251, places=10)
        self.assertAlmostEqual(table[0][7], 0.5237122191376749, places=10)

        self.assertListEqual(table[1][:6], [6.4, 3.2, 5.3, 2.3, 'virginica', 'versicolor'])
        self.assertAlmostEqual(table[1][6], 0.5237071857250375, places=10)
        self.assertAlmostEqual(table[1][7], 0.4762928142749625, places=10)

        self.assertListEqual(table[2][:6], [6.9, 3.1, 4.9, 1.5, 'versicolor', 'versicolor'])
        self.assertAlmostEqual(table[2][6], 0.604757991613619, places=10)
        self.assertAlmostEqual(table[2][7], 0.39524200838638096, places=10)

        self.assertListEqual(table[3][:6], [6.9, 3.1, 5.4, 2.1, 'virginica', 'versicolor'])
        self.assertAlmostEqual(table[3][6], 0.6634971835521454, places=10)
        self.assertAlmostEqual(table[3][7], 0.3365028164478546, places=10)

        self.assertListEqual(table[4][:6], [6.9, 3.1, 5.1, 2.3, 'virginica', 'versicolor'])
        self.assertAlmostEqual(table[4][6], 0.6634971838966314, places=10)
        self.assertAlmostEqual(table[4][7], 0.33650281610336863, places=10)


if __name__ == '__main__':
    filepath = os.path.dirname(os.path.abspath(__file__))
    reportFoler = filepath + "/../../../../../../../reports"
    unittest.main(testRunner=HtmlTestRunner.HTMLTestRunner(combine_reports=True, output=reportFoler))
