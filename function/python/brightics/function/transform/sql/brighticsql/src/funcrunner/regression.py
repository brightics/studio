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

# -*- coding: utf-8 -*-

from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor

from .common.functionbase import RegressionTrainBase
from .common.param import AnyParam, BoolParam, FloatParam, IntParam, StrParam
from .common.constraint import GreaterThanOrEqualTo, FromTo, GreaterThan


class LinearRegressionTrain(RegressionTrainBase):
    fit_intercept = BoolParam(True)
    normalize = BoolParam(False)

    def settrain(self, **kwargs):
        self.trainargs = {}
        self.regressor = LinearRegression(**kwargs)


class DecisionTreeRegressionTrain(RegressionTrainBase):
    criterion = StrParam('mse')
    splitter = StrParam('best')
    max_depth = IntParam(allowNone=True, constraint=[GreaterThanOrEqualTo(1)])
    min_samples_split = IntParam(2, constraint=[GreaterThanOrEqualTo(2)])
    min_samples_leaf = IntParam(1, constraint=[GreaterThanOrEqualTo(2)])
    min_weight_fraction_leaf = FloatParam(0.0, constraint=[FromTo(0.0, 0.5)])
    max_features = IntParam(allowNone=True, constraint=[
                            GreaterThanOrEqualTo(1)])
    random_state = IntParam(allowNone=True)
    max_leaf_nodes = IntParam(allowNone=True, constraint=[GreaterThan(1)])
    min_impurity_decrease = FloatParam(0.0)
    min_impurity_split = FloatParam(allowNone=True, constraint=[
                                    GreaterThanOrEqualTo(0.0)])
    presort = BoolParam(False)

    sample_weight = AnyParam(allowNone=True)
    check_input = BoolParam(True)
    X_idx_sorted = AnyParam(allowNone=True)

    def settrain(self, **kwargs):
        self.trainargs = {}
        self.trainargs['sample_weight'] = kwargs.pop('sample_weight')
        self.trainargs['check_input'] = kwargs.pop('check_input')
        self.trainargs['X_idx_sorted'] = kwargs.pop('X_idx_sorted')
        self.regressor = DecisionTreeRegressor(**kwargs)
