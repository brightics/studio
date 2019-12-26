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
from sklearn.cluster import MeanShift
from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD, plt2MD
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.cm as cm
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to, greater_than, all_elements_greater_than, raise_runtime_error
from brightics.common.repr import pandasDF2MD
from brightics.common.classify_input_type import check_col_type


def _mean_shift_centers_plot(input_cols, cluster_centers, colors):
    sum_len_cols = np.sum([len(col) for col in input_cols])
    x = range(len(input_cols))
    if sum_len_cols >= 512:
        plt.xticks(x, input_cols, rotation='vertical')
    elif sum_len_cols >= 64:
        plt.xticks(x, input_cols, rotation=45, ha='right')
    else:
        plt.xticks(x, input_cols)
    for idx, centers in enumerate(cluster_centers):
        plt.plot(x, centers, "o-", label=idx, color=colors[idx])
    plt.tight_layout()
    fig_centers = plt2MD(plt)
    plt.clf()
    return fig_centers


def _mean_shift_samples_plot(table, input_cols, n_samples, cluster_centers, colors):
    sample = table[input_cols].sample(
        n=n_samples) if n_samples is not None else table[input_cols]
    feature_names, sample = check_col_type(sample, input_cols)
    sum_len_cols = np.sum([len(col) for col in feature_names])
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
    for idx, centers in enumerate(cluster_centers):
        plt.plot(x, centers, "o-", linewidth=4, color=colors[idx])
    plt.tight_layout()
    fig_samples = plt2MD(plt)
    plt.clf()
    return fig_samples


def _mean_shift_pca_plot(labels, cluster_centers, pca2_model, pca2, colors):
    for i, color in zip(range(len(cluster_centers)), colors):
        plt.scatter(pca2[:, 0][labels == i], pca2[:, 1][labels == i], color=color)

    pca2_centers = pca2_model.transform(cluster_centers)
    plt.scatter(pca2_centers[:, 0], pca2_centers[:, 1], marker='x', edgecolors=1, s=100, color='red')
    plt.tight_layout()
    fig_pca = plt2MD(plt)
    plt.clf()
    return fig_pca


def mean_shift(table, group_by=None, **params):
    check_required_parameters(_mean_shift, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _mean_shift)
    param_validation_check = [greater_than(params, 0.0, 'bandwidth')]
    validate(*param_validation_check)
    
    if group_by is not None:
        grouped_model = _function_by_group(_mean_shift, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _mean_shift(table, **params)
    

def _mean_shift(table, input_cols, prediction_col='prediction', bandwidth=None, bin_seeding=False, min_bin_freq=1, cluster_all=True):
    feature_names, inputarr = check_col_type(table, input_cols)
        
    ms = MeanShift(bandwidth=bandwidth, bin_seeding=bin_seeding, min_bin_freq=min_bin_freq, cluster_all=cluster_all, n_jobs=1)
    
    ms.fit(inputarr)

    label_name = {
        'bandwidth': 'Bandwidth',
        'bin_seeding': 'Bin Seeding',
        'min_bin_freq': 'Minimum Bin Frequency',
        'cluster_all': 'Cluster All'}
    get_param = ms.get_params()
    param_table = pd.DataFrame.from_items([
        ['Parameter', list(label_name.values())],
        ['Value', [get_param[x] for x in list(label_name.keys())]]
    ])
    
    cluster_centers = ms.cluster_centers_
    n_clusters = len(cluster_centers)
    colors = cm.nipy_spectral(np.arange(n_clusters).astype(float) / n_clusters)
    labels = ms.labels_
    
    if len(feature_names) > 1:
        pca2_model = PCA(n_components=2).fit(inputarr)
        pca2 = pca2_model.transform(inputarr)
    
    fig_centers = _mean_shift_centers_plot(feature_names, cluster_centers, colors)
    fig_samples = _mean_shift_samples_plot(table, input_cols, 100, cluster_centers, colors) if len(table.index) > 100 else _mean_shift_samples_plot(table, input_cols, None, cluster_centers, colors)
    
    if len(feature_names) > 1:
        fig_pca = _mean_shift_pca_plot(labels, cluster_centers, pca2_model, pca2, colors)
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Mean Shift Result
        | - Coordinates of cluster centers
        | {fig_cluster_centers} 
        | - Samples
        | {fig_pca}
        | {fig_samples}
        | ### Parameters
        | {params}
        """.format(fig_cluster_centers=fig_centers, fig_pca=fig_pca, fig_samples=fig_samples, params=pandasDF2MD(param_table))))
    else:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Mean Shift Result
        | - Coordinates of cluster centers
        | {fig_cluster_centers} 
        | - Samples
        | {fig_samples}
        | ### Parameters
        | {params}
        """.format(fig_cluster_centers=fig_centers, fig_samples=fig_samples, params=pandasDF2MD(param_table))))
    
    model = _model_dict('mean_shift')
    model['model'] = ms
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    
    out_table = table.copy()
    out_table[prediction_col] = labels
    return {'out_table':out_table, 'model':model}


def mean_shift_predict(table, model, **params):
    check_required_parameters(_mean_shift_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_mean_shift_predict, table, model, **params)
    else:
        return _mean_shift_predict(table, model, **params)

    
def _mean_shift_predict(table, model, prediction_col='prediction'):
    ms = model['model']
    input_cols = model['input_cols']
    _, inputarr = check_col_type(table, input_cols)
    predict = ms.predict(inputarr)
    out_table = table.copy()
    out_table[prediction_col] = predict
    
    return {'out_table':out_table}
