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
from sklearn.cluster import SpectralClustering
from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD, plt2MD
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.cm as cm
from matplotlib.lines import Line2D
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to, greater_than, all_elements_greater_than, raise_runtime_error
from brightics.common.repr import pandasDF2MD
from brightics.common.classify_input_type import check_col_type


def _spectral_clustering_samples_plot(labels, table, input_cols, n_samples, n_clusters, colors):
    sample = table[input_cols].sample(n=n_samples) if n_samples is not None else table[input_cols]
    feature_names, sample = check_col_type(sample, input_cols)
    sum_len_cols = np.sum([len(col) for col in input_cols])
    x = range(len(feature_names))
    if sum_len_cols >= 512:
        plt.xticks(x, feature_names, rotation='vertical')
    elif sum_len_cols >= 64:
        plt.xticks(x, feature_names, rotation=45, ha='right')
    else:
        plt.xticks(x, feature_names)
    if feature_names == input_cols:
        for idx in sample.index:
            plt.plot(x, sample.transpose()[idx], color='grey', linewidth=1)
    else:
        for idx in range(len(sample)):
            plt.plot(x, sample[idx], color='grey', linewidth=1)
    plt.tight_layout()
    fig_samples = plt2MD(plt)
    plt.clf()
    return fig_samples


def _spectral_clustering_pca_plot(labels, pca2_model, pca2, n_clusters, colors):
    for i, color in zip(range(n_clusters), colors):
        plt.scatter(pca2[:, 0][labels == i], pca2[:, 1][labels == i], color=color)

    plt.tight_layout()
    fig_pca = plt2MD(plt)
    plt.clf()
    return fig_pca


def spectral_clustering(table, group_by=None, **params):
    check_required_parameters(_spectral_clustering, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _spectral_clustering)
    
    if group_by is not None:
        grouped_model = _function_by_group(_spectral_clustering, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _spectral_clustering(table, **params)
    

def _spectral_clustering(table, input_cols, prediction_col='prediction', n_clusters=8, eigen_solver=None, random_state=None, n_init=10, gamma=1.0, affinity='rbf', n_neighbors=10, eigen_tol=0.0, assign_labels='kmeans', degree=3, coef0=1):
    feature_names, inputarr = check_col_type(table, input_cols)
        
    _eigen_solver = None if eigen_solver == 'None' else eigen_solver
    sc = SpectralClustering(n_clusters=n_clusters, eigen_solver=_eigen_solver, random_state=random_state, n_init=n_init, gamma=gamma, affinity=affinity, n_neighbors=n_neighbors, eigen_tol=eigen_tol, assign_labels=assign_labels, degree=degree, coef0=coef0)
    
    sc.fit(inputarr)
    

    label_name = {
        'n_clusters': 'N Clusters',
        'eigen_solver': 'Eigen Solver',
        'random_state': 'Seed',
        'n_init': 'N Init',
        'gamma': 'Gamma',
        'affinity': 'Affinity',
        'n_neighbors': 'N Neighbors',
        'eigen_tol': 'Eigen Tolerance',
        'assign_labels': 'Assign Labels',
        'degree': 'Degree',
        'coef0': 'Zero Coefficient'}
    get_param = sc.get_params()
    param_table = pd.DataFrame.from_items([
        ['Parameter', list(label_name.values())],
        ['Value', [get_param[x] for x in list(label_name.keys())]]
    ])
    
    # cluster_centers = sc.cluster_centers_
    labels = sc.labels_
    colors = cm.nipy_spectral(np.arange(n_clusters).astype(float) / n_clusters)
    
    if len(feature_names) > 1:
        pca2_model = PCA(n_components=2).fit(inputarr)
        pca2 = pca2_model.transform(inputarr)
    fig_samples = _spectral_clustering_samples_plot(labels, table, input_cols, 100, n_clusters, colors) if len(table.index) > 100 else _spectral_clustering_samples_plot(labels, table, input_cols, None, n_clusters, colors)
    
    if len(feature_names) > 1:
        fig_pca = _spectral_clustering_pca_plot(labels, pca2_model, pca2, n_clusters, colors)
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Spectral Clustering Result
        | - Samples
        | {fig_samples}
        | {fig_pca}
        | ### Parameters
        | {params}
        """.format(fig_samples=fig_samples, fig_pca=fig_pca, params=pandasDF2MD(param_table))))
    else:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Mean Shift Result
        | - Samples
        | {fig_samples}
        | ### Parameters
        | {params}
        """.format(fig_samples=fig_samples, params=pandasDF2MD(param_table))))
    
    model = _model_dict('spectral_clustering')
    model['model'] = sc
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    
    out_table = table.copy()
    out_table[prediction_col] = labels
    return {'out_table':out_table, 'model':model}
