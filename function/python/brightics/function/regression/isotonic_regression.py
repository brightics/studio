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

import pandas as pd
import numpy as np
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from brightics.common.groupby import _function_by_group
from sklearn.isotonic import IsotonicRegression
from brightics.function.utils import _model_dict
from brightics.common.repr import plt2MD
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.exception import BrighticsFunctionException as BFE
from brightics.common.data_export import PyPlotData, PyPlotMeta


def isotonic_regression_train(table, group_by=None, **params):
    params = get_default_from_parameters_if_required(
        params, _isotonic_regression_train)
    check_required_parameters(_isotonic_regression_train, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(
            _isotonic_regression_train, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _isotonic_regression_train(table, **params)


def preprocess_(feature_col, label_col):
    if feature_col == label_col:
        raise BFE.from_errors([{'0100': '{} is duplicate in Feature column and Label column'.format(feature_col)}])
    preprocess_result = {'estimator_class': IsotonicRegression,
                         'estimator_params': ['increasing']}
    return preprocess_result


def postprocess_(table, feature_col, label_col, regressor):
    features = table[feature_col]
    label = table[label_col]
    predict = regressor.predict(features)

    plt.figure()
    plt.plot(label, 'r.-')
    plt.plot(predict, 'b.-')
    plt.xlabel('Samples')
    plt.legend(['True label', 'Predicted'])

    figs = PyPlotData()
    figs.addpltfig('fig_actual_predict', plt)

    postprocess_result = {'update_md': {'Predicted vs Actual': figs.getMD('fig_actual_predict')},
                          'type': 'isotonic_regression_model',
                          'figs': figs}

    return postprocess_result


def _isotonic_regression_train(table, feature_col, label_col, increasing=True):
    if feature_col == label_col:
        raise BFE.from_errors([{'0100': '{} is duplicate in Feature column and Label column'.format(feature_col)}])
    features = table[feature_col]
    label = table[label_col]

    preprocess_(feature_col, label_col)
    isotonic_model = IsotonicRegression(increasing=increasing, out_of_bounds="clip" )
    isotonic_model.fit(features, label)

    postprocess_result = postprocess_(table, feature_col, label_col, isotonic_model)
    fig_actual_predict = postprocess_result['update_md']['Predicted vs Actual']

    get_param = isotonic_model.get_params()

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Linear Regression Result
    | ### Param
    | {param}
    | ### Predicted vs Actual
    | {image1}
    """.format(image1=fig_actual_predict, param=get_param)))
    model = _model_dict('isotonic_regression_model')
    model['_repr_brtc_'] = rb.get()
    model['feature_col'] = feature_col
    model['label_col'] = label_col
    model['parameters'] = get_param
    model['regressor'] = isotonic_model
    model['figures'] = postprocess_result['figs'].tojson()

    return {"model": model}


def isotonic_regression_predict(table, model, **params):
    check_required_parameters(
        _isotonic_regression_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_isotonic_regression_predict, table, model, **params)
    else:
        return _isotonic_regression_predict(table, model, **params)


def _isotonic_regression_predict(table, model, prediction_col='prediction'):
    result = table.copy()
    features = table[model['feature_col']]
    prediction = model['regressor'].predict(features)
    result[prediction_col] = prediction
    return {'out_table': result}
