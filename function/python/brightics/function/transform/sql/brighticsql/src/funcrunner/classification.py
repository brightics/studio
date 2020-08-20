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

from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LogisticRegression

from .common.functionbase import ClassificationTrainBase
from .common.param import (AnyParam, BoolParam, FloatParam, IntParam, StrParam,
                           UnionParam, DictParam, ListParam)
from .common.constraint import (GreaterThanOrEqualTo, FromTo, GreaterThan,
                                ElemInSet)


class DecisionTreeClassificationTrain(ClassificationTrainBase):
    criterion = StrParam('gini')
    splitter = StrParam('best')
    max_depth = IntParam(allowNone=True, constraint=[GreaterThanOrEqualTo(1)])
    min_samples_split = IntParam(2, constraint=[GreaterThanOrEqualTo(2)])
    min_samples_leaf = IntParam(1, constraint=[GreaterThanOrEqualTo(1)])
    min_weight_fraction_leaf = FloatParam(0.0, constraint=[FromTo(0.0, 0.5)])
    max_features = IntParam(allowNone=True, constraint=[
                            GreaterThanOrEqualTo(1)])
    random_state = IntParam(allowNone=True)
    max_leaf_nodes = IntParam(allowNone=True, constraint=[GreaterThan(1)])
    min_impurity_decrease = FloatParam(0.0, GreaterThanOrEqualTo(0.0))
    min_impurity_split = FloatParam(allowNone=True)
    class_weight = UnionParam(params=[DictParam(), StrParam(
        constraint=ElemInSet({'balanced'}))],
        allowNone=True)
    presort = BoolParam(False)
    # fit
    sample_weight = AnyParam(allowNone=True)
    check_input = BoolParam(True)
    X_idx_sorted = AnyParam(allowNone=True)

    def settrain(self, **kwargs):
        self.trainargs = {}
        self.trainargs['sample_weight'] = kwargs.pop('sample_weight')
        self.trainargs['check_input'] = kwargs.pop('check_input')
        self.trainargs['X_idx_sorted'] = kwargs.pop('X_idx_sorted')
        self.classifier = DecisionTreeClassifier(**kwargs)


class LogisticRegressionTrain(ClassificationTrainBase):
    penalty = StrParam('l2', constraint=[
        ElemInSet({'l1', 'l2', 'elasticnet', 'none'})])
    dual = BoolParam(False)
    tol = FloatParam(1e-4, constraint=[GreaterThan(0)])
    C = FloatParam(1.0, constraint=[GreaterThan(0.0)])
    fit_intercept = BoolParam(True)
    intercept_scaling = FloatParam(1)
    class_weight = UnionParam(params=[DictParam(), StrParam(
        constraint=ElemInSet({'balanced'}))],
        allowNone=True)
    random_state = IntParam(allowNone=True)
    solver = StrParam('warn', constraint=[ElemInSet(
        {'newton-cg', 'lbfgs', 'liblinear', 'sag', 'saga'})])
    max_iter = IntParam(100)
    multi_class = StrParam(
        'ovr', constraint=[ElemInSet({'ovr', 'multinomial', 'auto'})])
    verbose = IntParam(0)
    warm_start = BoolParam(False)
    n_jobs = IntParam(allowNone=True)
    l1_ratio = FloatParam(allowNone=True)

    def settrain(self, **kwargs):
        self.classifier = LogisticRegression(**kwargs)
