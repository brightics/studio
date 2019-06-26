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

from sklearn.neighbors import KNeighborsRegressor 
import pandas as pd
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to


def knn_regression(train_table, test_table, **params):
    check_required_parameters(_knn_regression, params, ['train_table', 'test_table'])

    params = get_default_from_parameters_if_required(params,_knn_regression)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'k'),
                              greater_than_or_equal_to(params, 1, 'leaf_size'),
                              greater_than_or_equal_to(params, 1, 'p')]
    validate(*param_validation_check)

    return _knn_regression(train_table, test_table, **params)


def _knn_regression(train_table, test_table, feature_cols, label_col, k=5, algorithm='auto', leaf_size=30, p=2, pred_col_name='prediction'):
    
    X_train = train_table[feature_cols]
    y_train = train_table[label_col]
    X_test = test_table[feature_cols]

    knn = KNeighborsRegressor (n_neighbors=k, algorithm=algorithm, leaf_size=leaf_size, p=p)
    
    out_col_pred = pd.DataFrame()
    
    # Predict the class labels for the provided data
    knn.fit(X_train, y_train)
    pred = knn.predict(X_test)
    out_col_pred[pred_col_name] = pred
    
    # Result
    out_table = pd.concat([test_table.reset_index(drop=True), out_col_pred], axis=1)
    return {'out_table':out_table}
