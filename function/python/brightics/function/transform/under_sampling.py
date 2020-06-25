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
from sklearn.cluster import KMeans
from imblearn.over_sampling import SMOTE as SMOTE_LIB
from imblearn.under_sampling import ClusterCentroids
import pandas as pd
import numpy as np


def under_sampling(table, group_by=None, **params):
    check_required_parameters(_under_sampling, params, ['table'])
    params = get_default_from_parameters_if_required(params, _under_sampling)
    
    if group_by is not None:
        return _function_by_group(_under_sampling, table, group_by=group_by, **params)
    else:
        return _under_sampling(table, **params)


def _under_sampling(table, label_col, sampling_strategy='not majority', seed=None, estimator='KMeans',
                    n_clusters=8, voting='auto', n_jobs=1):

    # Separate features and label
    features = table.drop([label_col], axis=1)
    y = table[label_col]

    if(sklearn_utils.multiclass.type_of_target(y) == 'continuous'):
        raise_error('0718', 'label_col')
    
    # Initialization label encoder
    lab_encoder = preprocessing.LabelEncoder()

    # Filter out categorical columns in features
    categorical_cols = [col for col in features.columns if features[col].dtypes == 'object']

    # Transform categorical columns and add to the original features
    for cate_col in categorical_cols:
        features_encoder = lab_encoder.fit_transform(features[cate_col])
        features[cate_col] = features_encoder
    
    # Transform label column with object type
    if (y.dtypes == 'object'):
        y_encoder = lab_encoder.fit_transform(y)
    else:
        y_encoder = y

    if (estimator == 'Kmeans'):
        estimator_model = KMeans(n_clusters=n_clusters)
    else:
        estimator_model = None
    
    # Process under sampling
    sm = ClusterCentroids(sampling_strategy=sampling_strategy, random_state=seed, 
                    estimator=estimator_model, voting=voting, n_jobs=n_jobs)
    
    X_res, y_res = sm.fit_resample(features, y_encoder)

    # Invert to original data
    if (y.dtypes == 'object'):
        y_decoder = lab_encoder.inverse_transform(y_res)
    else:    
        y_decoder = y_res

    df = pd.DataFrame(data=X_res, columns=features.columns)

    for cate_col in categorical_cols:
        df[cate_col] = lab_encoder.inverse_transform(df[cate_col].astype('int32'))

    df1 = pd.DataFrame(data=y_decoder, columns=[label_col])

    # Output result
    out_table = df.join(df1)

    return {'out_table' : out_table}
