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


from brightics.function.classification.mlp_classification import mlp_classification_train, mlp_classification_predict
from brightics.common.datasets import load_iris
import unittest
import pandas as pd
import numpy as np


class MLPClassification(unittest.TestCase):
    
    def setUp(self):
        print("*** MLP Classifcation Train/Predict UnitTest Start ***")
        self.testdata = load_iris()

    def tearDown(self):
        print("*** MLP Classifcation Train/Predict UnitTest End ***")
    
    def test(self):
        mlp_train = mlp_classification_train(self.testdata, feature_cols=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'], label_col='species', random_state=12345)
        mlp_model = mlp_train['model']['mlp_model']
        intercepts = mlp_model.intercepts_
        coefficients = mlp_model.coefs_
        classes = mlp_model.classes_
        loss = mlp_model.loss_
        self.assertEqual(round(intercepts[0][0], 15), 0.137164690225582)
        self.assertEqual(round(intercepts[0][1], 15), -0.196349116307770)
        self.assertEqual(round(intercepts[0][2], 15), -0.206045482378042)
        self.assertEqual(round(intercepts[0][97], 15), 0.343541786572518)
        self.assertEqual(round(intercepts[0][98], 15), -0.271779775891970)
        self.assertEqual(round(intercepts[0][99], 15), 0.228951530828744)
        self.assertEqual(round(intercepts[1][0], 15), -0.026276894809166)
        self.assertEqual(round(intercepts[1][1], 15), 0.102296294264046)
        self.assertEqual(round(intercepts[1][2], 15), 0.084530780374178)
        self.assertEqual(round(coefficients[0][0][0], 15), 0.167972505514702)
        self.assertEqual(round(coefficients[0][0][1], 15), -0.014235122637386)
        self.assertEqual(round(coefficients[0][0][2], 15), -0.046148531345803)
        self.assertEqual(round(coefficients[0][0][97], 15), 0.230681504208153)
        self.assertEqual(round(coefficients[0][0][98], 15), 0.178647888200497)
        self.assertEqual(round(coefficients[0][0][99], 15), -0.092987981064533)
        self.assertEqual(round(coefficients[0][1][0], 15), -0.206702905129565)
        self.assertEqual(round(coefficients[0][1][1], 15), -0.018391348211744)
        self.assertEqual(round(coefficients[0][1][2], 15), 0.005970269911820)
        self.assertEqual(round(coefficients[0][1][97], 15), 0.074130112673865)
        self.assertEqual(round(coefficients[0][1][98], 15), -0.215931730891333)
        self.assertEqual(round(coefficients[0][1][99], 15), 0.001359420850033)
        self.assertEqual(round(coefficients[0][2][0], 15), 0.226470919817300)
        self.assertEqual(round(coefficients[0][2][1], 15), -0.005411289247559)
        self.assertEqual(round(coefficients[0][2][2], 15), -0.001325008986190)
        self.assertEqual(round(coefficients[0][2][97], 15), -0.114505616949751)
        self.assertEqual(round(coefficients[0][2][98], 15), 0.102122380171088)
        self.assertEqual(round(coefficients[0][2][99], 15), -0.045283303742007)
        self.assertEqual(round(coefficients[0][3][0], 15), 0.008808281960365)
        self.assertEqual(round(coefficients[0][3][1], 15), 0.041093469366915)
        self.assertEqual(round(coefficients[0][3][2], 15), -0.018335586190543)
        self.assertEqual(round(coefficients[0][3][97], 15), -0.304300122439071)
        self.assertEqual(round(coefficients[0][3][98], 15), 0.036791428970714)
        self.assertEqual(round(coefficients[0][3][99], 15), 0.006924872480155)
        self.assertEqual(round(coefficients[1][0][0], 15), -0.205199415247389)
        self.assertEqual(round(coefficients[1][0][1], 15), -0.113219336185970)
        self.assertEqual(round(coefficients[1][0][2], 15), 0.002856925566530)
        self.assertEqual(round(coefficients[1][1][0], 15), 0.000240975186718)
        self.assertEqual(round(coefficients[1][1][1], 15), -0.021077425020470)
        self.assertEqual(round(coefficients[1][1][2], 15), -0.015534541802955)
        self.assertEqual(round(coefficients[1][2][0], 15), -0.015586388401352)
        self.assertEqual(round(coefficients[1][2][1], 15), -0.024706472365163)
        self.assertEqual(round(coefficients[1][2][2], 15), 0.002888874608097)
        self.assertEqual(round(coefficients[1][97][0], 15), 0.316498140619881)
        self.assertEqual(round(coefficients[1][97][1], 15), 0.086173852993057)
        self.assertEqual(round(coefficients[1][97][2], 15), -0.206139695829655)
        self.assertEqual(round(coefficients[1][98][0], 15), -0.210254664748215)
        self.assertEqual(round(coefficients[1][98][1], 15), 0.100176438046239)
        self.assertEqual(round(coefficients[1][98][2], 15), 0.170825034575622)
        self.assertEqual(round(coefficients[1][99][0], 15), -0.001930413619141)
        self.assertEqual(round(coefficients[1][99][1], 15), 0.009995171584596)
        self.assertEqual(round(coefficients[1][99][2], 15), -0.001787992665306)
        
        predict = mlp_classification_predict(self.testdata, mlp_train['model'])['out_table']['prediction']
        np.testing.assert_array_equal(predict, ['setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','setosa','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','virginica','versicolor','virginica','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','virginica','virginica','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','versicolor','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica','virginica'])
