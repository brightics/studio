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
from sklearn import preprocessing
from imblearn.over_sampling import SMOTE
import pandas as pd
import numpy as np


def over_sampling(table, group_by=None, **params):
    check_required_parameters(_over_sampling, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _over_sampling)
    # param_validation_check = [greater_than_or_equal_to(params, 1, 'num')]
    # validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_over_sampling, table, group_by=group_by, **params)
    else:
        return _over_sampling(table, **params)


def _over_sampling(table, feature_cols, label_col, seed=None):

    feature_names, features = check_col_type(table, feature_cols)
    # X = table[feature_cols]
    y = table[label_col]

    if(sklearn_utils.multiclass.type_of_target(y) == 'continuous'):
        raise_error('0718', 'label_col')
    
    lab_encoder = preprocessing.LabelEncoder()
    y_encoder = lab_encoder.fit_transform(y)

    sm = SMOTE(random_state=seed)
    X_res, y_res = sm.fit_resample(features, y_encoder)
    
    y_decoder = lab_encoder.inverse_transform(y_res)

    # data = [X_res, y_decoder]
    # title = [feature_cols, label_col]

    df = pd.DataFrame(data=X_res, columns=feature_names)
    df1 = pd.DataFrame(data=y_decoder, columns=[label_col])

    out_table = df.join(df1)

    # if num_or_frac == 'num':
    #     out_table = table.sample(n=num, replace=replace, random_state=seed)
    # else:  # 'frac'
    #     out_table = table.sample(frac=frac / 100, replace=replace, random_state=seed)
    return {'table' : out_table}
