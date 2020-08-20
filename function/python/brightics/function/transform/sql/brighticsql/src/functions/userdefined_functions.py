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


import numpy as np

from ..funcrunner.regression import (
    LinearRegressionTrain, DecisionTreeRegressionTrain)
from ..funcrunner.classification import (
    DecisionTreeClassificationTrain
)

_regression = {
    'linear_regression': LinearRegressionTrain,
    'decision_tree_regression': DecisionTreeRegressionTrain
}

_classification = {
    'decision_tree_classification': DecisionTreeClassificationTrain}

_mlmodels = {}
_mlmodels.update(_regression)
_mlmodels.update(_classification)


def mltrain(table, **kwargs):
    params = {}
    for k, v in kwargs.items():
        if not (v.rex_typename == 'RexCall' and v.operator.kind == 'DEFAULT'):
            val = v().value
            if isinstance(val, np.ndarray):
                val = [it for it in val]
            params[k] = val
    model_type = params.pop('model_type')
    model = _mlmodels[model_type](**params)
    res = model(**{'table': table})
    return {'res': res}


userdefined_functions = {
    'MLTRAIN': mltrain
}
