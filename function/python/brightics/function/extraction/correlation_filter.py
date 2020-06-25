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

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, pandasDF2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than, greater_than_or_equal_to
from brightics.common.exception import BrighticsFunctionException as BFE

import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder

from scipy.sparse import issparse
from scipy.stats import spearmanr

from sklearn.base import BaseEstimator
from sklearn.feature_selection.base import SelectorMixin
from sklearn.utils import check_array
from sklearn.utils.validation import check_is_fitted
from sklearn.utils.extmath import safe_sparse_dot
from sklearn.utils.sparsefuncs import min_max_axis, mean_variance_axis

def correlation_filter(table, group_by=None, **params):
    check_required_parameters(_correlation_filter, params, ['table'])
    
    if group_by is not None:
        return _function_by_group(_correlation_filter, table, group_by=group_by, **params)
    else:
        return _correlation_filter(table, **params)


def _correlation_filter(table, feature_cols, correlation_threshold=0.9, method='pearson'):
    X = table[feature_cols]

    keep_features = CorrelationThreshold(X, correlation_threshold, method)
    
    out_table = table[X.columns[keep_features]]

    return {'out_table': out_table}

def CorrelationThreshold(X, threshold, kind):
    """Learn empirical variances from X.
    Parameters
    ----------
    X : {array-like, sparse matrix} of shape (n_samples, n_features)
        Training set to compute correlations.
    y : ignored
        Not used, present here for API consistency by convention.
    Returns
    -------
    support_mask : Boolean array for feature selection
    """
    
    if not (0.0 <= threshold <= 1.0):
        raise BFE.from_errors([{'0100': 'Threshold value must in [0.0, 1.0]'}])
    
    if kind not in ('pearson', 'spearmanr'):
        raise BFE.from_errors([{'0100': "Kind must be 'pearson' or 'spearmanr"}])
        
    if issparse(X) and kind != 'pearson':
        raise BFE.from_errors([{'0100': "Only pearson correlation is supported with 'sparse matrices'"}])

    X = check_array(X, accept_sparse=['csc', 'csr'], dtype=[np.float64, np.float32])
    
    n_features = X.shape[1]
    if threshold == 1 or (1 in X.shape):
        support_mask = np.ones(n_features, dtype=np.bool)
        return support_mask
    
    # get constant features
    if issparse(X):
        mins, maxes = min_max_axis(X, axis=0)
        peak_to_peaks = maxes - mins
        constant_mask = np.isclose(peak_to_peaks, 0.0)
        
        # sparse correlation
        mu, sparse_var = mean_variance_axis(X, 0)
        X_corr = sparse_correlation(X, mu, ~constant_mask)
    else:
        peak_to_peaks = np.ptp(X, axis=0)
        constant_mask = np.isclose(peak_to_peaks, 0.0)
        
        if kind == 'pearson':
            X_corr = np.corrcoef(X, rowvar=False)
        else: # spearmanr
            X_corr, _ = spearmanr(X)
            # spearmanr returns scaler when comparing two columns
            if isinstance(X_corr, float):
                X_corr = np.array([[1, X_corr], [X_corr, 1]])
    
    np.fabs(X_corr, out=X_corr)
    
    # Removes constant features from support_mask
    support_mask = np.ones(n_features, dtype=np.bool)
    upper_idx = np.triu_indices(n_features, 1)
    
    non_constant_features = n_features
    for i in np.flatnonzero(constant_mask):
        feat_remove_mask = np.logical_and(upper_idx[0] != i,
                                          upper_idx[1] != i)
        upper_idx = (upper_idx[0][feat_remove_mask],
                     upper_idx[1][feat_remove_mask])
        support_mask[i] = False
        non_constant_features -= 1
    
    for _ in range(non_constant_features -1):
        max_idx = np.argmax(X_corr[upper_idx])
        feat1, feat2 = upper_idx[0][max_idx], upper_idx[1][max_idx]
        cur_corr = X_corr[feat1, feat2]
        
        # max correlation is lower than threshold
        if cur_corr < threshold:
            break
        
        # Temporary remove both features to calculate the mean with other
        # features. One of the featuers will be selected.
        support_mask[[feat1, feat2]] = False
        
        # if there are no other features to compare, keep the feature with the most
        # variance
        if np.all(~support_mask):
            if issparse(X):
                # sparse precalculates variance for all features
                var = sparse_var[[feat1, feat2]]
            else:
                var = np.var(X[:, [feat1, feat2]], axis=0)

            print(feat1, feat2)
            if var[0] < var[1]:
                support_mask[feat2] = True
            else:
                support_mask[feat1] = True
            break
            
        # mean with other features
        feat1_mean = np.mean(X_corr[feat1, support_mask])
        feat2_mean = np.mean(X_corr[feat2, support_mask])
        
        # feature with lower mean is kept
        if feat1_mean < feat2_mean:
            support_mask[feat1] = True
            feat_to_remove = feat2
        else:
            support_mask[feat2] = True
            feat_to_remove = feat1
        
        # remove the removed feature from consideration
        upper_idx_to_keep = np.logical_and(upper_idx[0] != feat_to_remove,
                                           upper_idx[1] != feat_to_remove)
        upper_idx = (upper_idx[0][upper_idx_to_keep],
                     upper_idx[1][upper_idx_to_keep])

    return support_mask

def sparse_correlation(X, mu, non_constant_mask):
    """Calcuate Pearson correlation for sparse matrices
    Parameters
    ----------
    X : sparse matrix of shape (n_samples, n_features)
        Matrix to find correlation on.
    mu : ndarray of shape (n_features,)
        Mean of feature columns.
    non_constant_mask : ndarray of shape (n_features,)
        Boolean mask for non constant features.
    Returns
    -------
    correlation matrix : ndarray of shape (n_features, n_features)
    """
    X_diff = X - mu[None, :]
    X_corr = safe_sparse_dot(X_diff.T, X_diff, dense_output=True)
    stddev = np.sqrt(np.diag(X_corr))

    X_corr[non_constant_mask, :] /= stddev[non_constant_mask][:, None]
    X_corr[:, non_constant_mask] /= stddev[non_constant_mask][None, :]
    return X_corr   