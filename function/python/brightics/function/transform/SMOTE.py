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

from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import raise_error
from brightics.common.classify_input_type import check_col_type

import sklearn.utils as sklearn_utils
from sklearn import svm
from sklearn import preprocessing
from imblearn.over_sampling import SMOTE as SMOTE_LIB
import pandas as pd
import numpy as np


def SMOTE(table, group_by=None, **params):
    check_required_parameters(_SMOTE, params, ['table'])
    params = get_default_from_parameters_if_required(params, _SMOTE)
    
    if group_by is not None:
        return _function_by_group(_SMOTE, table, group_by=group_by, **params)
    else:
        return _SMOTE(table, **params)


def _SMOTE(table, label_col, sampling_strategy='not majority', seed=None, k_neighbors=5, m_neighbors=10,
            out_step=0.5, kind='regular', svm_estimator='svc', n_jobs=1):

    features = table.drop([label_col], axis=1)
    y = table[label_col]

    if(sklearn_utils.multiclass.type_of_target(y) == 'continuous'):
        raise_error('0718', 'label_col')
    
    lab_encoder = preprocessing.LabelEncoder()
    y_encoder = lab_encoder.fit_transform(y)

    if (kind == 'svm'):
        svc_model = svm.SVC()
    else:
        svc_model = None

    sm = SMOTE_LIB(sampling_strategy=sampling_strategy, random_state=seed, k_neighbors=k_neighbors, m_neighbors=m_neighbors,
                    out_step=out_step, kind=kind, svm_estimator=svc_model, n_jobs=n_jobs)
    
    X_res, y_res = sm.fit_resample(features, y_encoder)
    y_decoder = lab_encoder.inverse_transform(y_res)

    df = pd.DataFrame(data=X_res, columns=features.columns)
    df1 = pd.DataFrame(data=y_decoder, columns=[label_col])

    out_table = df.join(df1)

    return {'out_table' : out_table}
