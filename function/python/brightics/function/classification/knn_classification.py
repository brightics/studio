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

from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import raise_error
import sklearn.utils as sklearn_utils
from brightics.common.classify_input_type import check_col_type

from sklearn.neighbors import KNeighborsClassifier 
import pandas as pd


def knn_classification(train_table, test_table, **params):
    check_required_parameters(_knn_classification, params, ['train_table', 'test_table'])
    
    params = get_default_from_parameters_if_required(params, _knn_classification)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'k'),
                              greater_than_or_equal_to(params, 1, 'leaf_size'),
                              greater_than_or_equal_to(params, 1, 'p')]
    validate(*param_validation_check)
    
    return _knn_classification(train_table, test_table, **params)


def _knn_classification(train_table, test_table, feature_cols, label_col, k=5, algorithm='auto', leaf_size=30, p=2, pred_col_name='prediction', prob_col_prefix='probability', suffix='index'):
    
    _, X_train = check_col_type(train_table, feature_cols)
    y_train = train_table[label_col]
    _, X_test = check_col_type(test_table, feature_cols)
    
    if(sklearn_utils.multiclass.type_of_target(y_train) == 'continuous'):
        raise_error('0718', 'label_col')

    knn = KNeighborsClassifier(n_neighbors=k, algorithm=algorithm, leaf_size=leaf_size, p=p)
    
    # Predict the class labels for the provided data
    knn.fit(X_train, y_train)
    pred = knn.predict(X_test)
    out_col_pred = pd.DataFrame(pred, columns=[pred_col_name])
    
    classes = knn.classes_
    if suffix == 'index':
        suffixes = [i for i, _ in enumerate(classes)]
    else:
        suffixes = classes

    # Return probability estimates for the test data 
    prob = knn.predict_proba(X_test)
    prob_col_name = ['{prob_col_prefix}_{suffix}'.format(prob_col_prefix=prob_col_prefix, suffix=suffix) for suffix in suffixes]	
    out_col_prob = pd.DataFrame(data=prob, columns=prob_col_name)
    
    # Result
    out_table = pd.concat([test_table.reset_index(drop=True), out_col_pred, out_col_prob], axis=1)
    return {'out_table':out_table}
