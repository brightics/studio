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
from sklearn.cluster import AgglomerativeClustering
from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD, plt2MD
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
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
from brightics.common.data_export import PyPlotData, PyPlotMeta


def _agglomerative_clustering_samples_plot(labels, table, input_cols, n_samples, n_clusters, colors):
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
    plt.tight_layout()


def _agglomerative_clustering_pca_plot(labels, pca2_model, pca2, n_clusters, colors):
    for i, color in zip(range(n_clusters), colors):
        plt.scatter(pca2[:, 0][labels == i], pca2[:, 1][labels == i], color=color)

    plt.tight_layout()
    plt2MD(plt)


def agglomerative_clustering(table, group_by=None, **params):
    check_required_parameters(_agglomerative_clustering, params, ['table'])

    params = get_default_from_parameters_if_required(params, _agglomerative_clustering)

    if group_by is not None:
        grouped_model = _function_by_group(_agglomerative_clustering, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _agglomerative_clustering(table, **params)


def _agglomerative_clustering(table, input_cols, prediction_col='prediction', linkage='ward', affinity='euclidean', n_clusters=2, compute_full_tree_auto=True, compute_full_tree=None):
    feature_names, inputarr = check_col_type(table, input_cols)
    _compute_full_tree = 'auto' if compute_full_tree_auto else compute_full_tree
    _affinity = 'euclidean' if linkage == 'ward' else affinity

    ac = AgglomerativeClustering(linkage=linkage, affinity=_affinity, n_clusters=n_clusters, compute_full_tree=_compute_full_tree)

    ac.fit(inputarr)

    label_name = {
        'linkage': 'Linkage',
        'affinity': 'Affinity',
        'n_clusters': 'N Clusters',
        'compute_full_tree': 'Compute Full Tree'}
    get_param = ac.get_params()
    param_table = pd.DataFrame.from_dict([
        ['Parameter', list(label_name.values())],
        ['Value', [get_param[x] for x in list(label_name.keys())]]
    ])

    labels = ac.labels_
    colors = cm.nipy_spectral(np.arange(n_clusters).astype(float) / n_clusters)

    if len(feature_names) > 1:
        pca2_model = PCA(n_components=2).fit(inputarr)
        pca2 = pca2_model.transform(inputarr)
        _len = 100 if len(table.index) > 100 else None
        plt.figure()
        _agglomerative_clustering_samples_plot(labels, table, input_cols, _len, n_clusters, colors)

    figs = PyPlotData()
    figs.addpltfig('fig_samples', plt)
    plt.clf()

    if len(feature_names) > 1:
        plt.figure()
        _agglomerative_clustering_pca_plot(labels, pca2_model, pca2, n_clusters, colors)
        figs.addpltfig('fig_pca', plt)
        plt.clf()
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Agglomerative Clustering Result
        | ### Samples
        | {fig_samples}
        | {fig_pca}
        | ### Parameters
        | {params}
        """.format(fig_pca=figs.getMD('fig_pca'), fig_samples=figs.getMD('fig_samples'), params=pandasDF2MD(param_table))))
    else:
        rb = BrtcReprBuilder()
        rb.addMD(strip_margin("""
        | ## Agglomerative Clustering Result
        | - Samples
        | {fig_samples}
        | ### Parameters
        | {params}
        """.format(fig_samples=figs.getMD('fig_samples'), params=pandasDF2MD(param_table))))

    model = _model_dict('agglomerative_clustering')
    model['model'] = ac
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    model['figures'] = figs.tojson()


    out_table = table.copy()
    out_table[prediction_col] = labels
    return {'out_table':out_table, 'model':model}


def agglomerative_clustering_predict(table, model, **params):
    check_required_parameters(_agglomerative_clustering_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_agglomerative_clustering_predict, table, model, **params)
    else:
        return _agglomerative_clustering_predict(table, model, **params)


def _agglomerative_clustering_predict(table, model, prediction_col='prediction'):
    ac_model = model['model']
    input_cols = model['input_cols']
    _, inputarr = check_col_type(table, input_cols)
    predict = ac_model.fit_predict(inputarr)
    out_table = table.copy()
    out_table[prediction_col] = predict

    return {'out_table':out_table}
