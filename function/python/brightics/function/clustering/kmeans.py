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

from sklearn.cluster import KMeans as SKKMeans
from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD, plt2MD
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import numpy as np
import pandas as pd
import matplotlib.cm as cm
from sklearn.metrics import silhouette_score, \
    silhouette_samples
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to, greater_than, all_elements_greater_than, raise_runtime_error
from brightics.common.classify_input_type import check_col_type
from brightics.common.data_export import PyPlotData, PyPlotMeta


def _kmeans_centers_plot(input_cols, cluster_centers, colors):
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


def _kmeans_samples_plot(table, input_cols, n_samples, cluster_centers, seed, colors):
    feature_names, inputarr = check_col_type(table, input_cols)
    sum_len_cols = np.sum([len(col) for col in feature_names])
    sample = pd.DataFrame(inputarr).sample(n=n_samples, random_state=seed)
    x = range(len(feature_names))
    if sum_len_cols >= 512:
        plt.xticks(x, feature_names, rotation='vertical')
    elif sum_len_cols >= 64:
        plt.xticks(x, feature_names, rotation=45, ha='right')
    else:
        plt.xticks(x, feature_names)
    for idx in sample.index:
        plt.plot(x, sample.transpose()[idx], color='grey', linewidth=1)
    for idx, centers in enumerate(cluster_centers):
        plt.plot(x, centers, "o-", label=idx, linewidth=2, color=colors[idx])
    plt.tight_layout()


def _kmeans_pca_plot(labels, cluster_centers, pca2_model, pca2, colors):
    n_clusters = len(cluster_centers)

    pca2_centers = pca2_model.transform(cluster_centers)

    if pca2.shape[1] == 1:
        for i, color in zip(range(n_clusters), colors):
            plt.scatter(pca2[:, 0][labels == i], pca2[:, 0][labels == i], color=color)
        plt.scatter(pca2_centers[:, 0], pca2_centers[:, 0], marker='x', edgecolors=1, s=200, color=colors)
        plt.xlabel("Feature space for the 1st feature")
        plt.ylabel("Feature space for the 1st feature")
    else:
        for i, color in zip(range(n_clusters), colors):
            plt.scatter(pca2[:, 0][labels == i], pca2[:, 1][labels == i], color=color)
        plt.scatter(pca2_centers[:, 0], pca2_centers[:, 1], marker='x', edgecolors=1, s=200, color=colors)
        plt.xlabel("Feature space for the 1st feature")
        plt.ylabel("Feature space for the 2nd feature")
            
    plt.tight_layout()


def kmeans_train_predict(table, group_by=None, **params):
    check_required_parameters(_kmeans_train_predict, params, ['table'])

    params = get_default_from_parameters_if_required(params, _kmeans_train_predict)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'n_clusters'),
                              greater_than_or_equal_to(params, 1, 'n_init'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 0.0, 'tol'),
                              greater_than_or_equal_to(params, 1, 'n_jobs'),
                              greater_than_or_equal_to(params, 0, 'n_samples')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_kmeans_train_predict, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _kmeans_train_predict(table, **params)


def _kmeans_train_predict(table, input_cols, display_plt=True, n_clusters=3, prediction_col='prediction', init='k-means++', n_init=10,
                          max_iter=300, tol=1e-4, precompute_distances='auto', seed=None,
                          n_jobs=1, algorithm='auto', n_samples=None):
    feature_names, inputarr = check_col_type(table, input_cols)
    if n_samples is None:
        n_samples = len(inputarr)

    k_means = SKKMeans(n_clusters=n_clusters, init=init, n_init=n_init,
                       max_iter=max_iter, tol=tol, precompute_distances=precompute_distances,
                       verbose=0, random_state=seed, copy_x=True, n_jobs=n_jobs, algorithm=algorithm)

    k_means.fit(inputarr)

    params = {'input_cols': feature_names, 'n_clusters': n_clusters, 'init': init, 'n_init': n_init, 'max_iter': max_iter, 'tol': tol,
              'precompute_distances': precompute_distances, 'seed': seed, 'n_jobs': n_jobs, 'algorithm': algorithm, 'n_samples': n_samples}

    cluster_centers = k_means.cluster_centers_
    n_clusters = len(cluster_centers)
    colors = cm.nipy_spectral(np.arange(n_clusters).astype(float) / n_clusters)
    labels = k_means.labels_

    pca2_model = PCA(n_components=min(2, len(feature_names))).fit(inputarr)
    pca2 = pca2_model.transform(inputarr)

    figs = PyPlotData()
    rb = BrtcReprBuilder()
    if display_plt:
        plt.figure()
        _kmeans_centers_plot(feature_names, cluster_centers, colors)
        figs.addpltfig('fig_centers', plt)
        plt.clf()
        plt.figure()
        _kmeans_samples_plot(table, input_cols, n_samples, cluster_centers, seed, colors)
        figs.addpltfig('fig_samples', plt)
        plt.clf()
        plt.figure()
        _kmeans_pca_plot(labels, cluster_centers, pca2_model, pca2, colors)
        figs.addpltfig('fig_pca', plt)
        plt.clf()
        figs.compile()

        rb.addMD(strip_margin("""
        | ## Kmeans Result
        | - Number of iterations run: {n_iter_}.
        | - Sum of square error: {sse_}.
        | - Coordinates of cluster centers
        | {fig_cluster_centers} 
        | - Samples
        | {fig_pca}
        | {fig_samples}
        |
        | ### Parameters
        | {params}
        """.format(n_iter_=k_means.n_iter_, sse_=k_means.inertia_,
                   fig_cluster_centers=figs.getMD('fig_centers'),
                   fig_pca=figs.getMD('fig_pca'),
                   fig_samples=figs.getMD('fig_samples'),
                   params=dict2MD(params))))
    else:
        rb.addMD(strip_margin("""
        | ## Kmeans Result
        | - Number of iterations run: {n_iter_}.
        | - Sum of square error: {sse_}.
        |
        | ### Parameters
        | {params}
        """.format(n_iter_=k_means.n_iter_, sse_=k_means.inertia_, params=dict2MD(params))))

    model = _model_dict('kmeans')
    model['model'] = k_means
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    model['figures'] = figs.tojson()

    out_table = table.copy()
    out_table[prediction_col] = labels
    return {'out_table': out_table, 'model': model}


def kmeans_predict(table, model, **params):
    check_required_parameters(_kmeans_predict, params, ['table', 'model'])
    if '_grouped_data' in model:
        return _function_by_group(_kmeans_predict, table, model, **params)
    else:
        return _kmeans_predict(table, model, **params)


def _kmeans_predict(table, model, prediction_col='prediction'):
    if model['_context'] == 'python' and model['_type'] == 'kmeans':
        k_means = model['model']
        input_cols = model['input_cols']
        feature_names, features = check_col_type(table, input_cols)
        predict = k_means.predict(features)
        out_table = table.copy()
        out_table[prediction_col] = predict
    elif model['_context'] == 'python' and model['_type'] == 'kmeans_silhouette':
        k_means = model['best_model']
        input_cols = model['input_cols']
        feature_names, features = check_col_type(table, input_cols)
        predict = k_means.predict(features)
        out_table = table.copy()
        out_table[prediction_col] = predict
    else:
        raise_runtime_error("Unsupported model")
        # raise Exception("Unsupported model")

    return {'out_table': out_table}


def kmeans_silhouette_train_predict(table, group_by=None, **params):
    check_required_parameters(_kmeans_silhouette_train_predict, params, ['table'])
    params = get_default_from_parameters_if_required(params, _kmeans_silhouette_train_predict)
    param_validation_check = [all_elements_greater_than(params, 1, 'n_clusters_list'),
                              greater_than_or_equal_to(params, 1, 'n_init'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 0.0, 'tol'),
                              greater_than_or_equal_to(params, 1, 'n_jobs'),
                              greater_than_or_equal_to(params, 0, 'n_samples')]
    validate(*param_validation_check)

    if group_by is not None:
        grouped_model = _function_by_group(_kmeans_silhouette_train_predict, table, group_by=group_by, **params) 
        return grouped_model
    else:
        return _kmeans_silhouette_train_predict(table, **params)


def _kmeans_silhouette_train_predict(table, input_cols, display_plt=True, n_clusters_list=range(2, 10), prediction_col='prediction',
                                     init='k-means++', n_init=10, max_iter=300, tol=1e-4, precompute_distances='auto',
                                     seed=None, n_jobs=1, algorithm='auto', n_samples=None):

    feature_names, features = check_col_type(table, input_cols)

    if n_samples is None:
        n_samples = len(table)
    inputarr = features

    pca2_model = PCA(n_components=min(2, len(feature_names))).fit(inputarr)
    pca2 = pca2_model.transform(inputarr)

    silhouette_list = []
    models = []
    centers_list = []
    images = []
    figs = PyPlotData()

    for k in n_clusters_list:
        k_means = SKKMeans(n_clusters=k, init=init, n_init=n_init, max_iter=max_iter, tol=tol,
                           precompute_distances=precompute_distances, verbose=0, random_state=seed, copy_x=True,
                           n_jobs=n_jobs, algorithm=algorithm)
        k_means.fit(inputarr)
        models.append(k_means)
        predict = k_means.labels_
        centersk = k_means.cluster_centers_
        centers_list.append(centersk)
        
        score = silhouette_score(inputarr, predict)
        silhouette_list.append(score)
        samples = silhouette_samples(inputarr, predict)
        # silhouette_samples_list.append(samples)

        if display_plt:
            pca2_centers = pca2_model.transform(centersk)

            _, (ax1, ax2) = plt.subplots(1, 2)
            colors = cm.nipy_spectral(np.arange(k).astype(float) / k)
            y_lower = 0

            for i, color in zip(range(k), colors):
                si = samples[predict == i]
                si.sort()

                sizei = si.shape[0]
                y_upper = y_lower + sizei

                ax1.fill_betweenx(np.arange(y_lower, y_upper),
                                0, si,
                                facecolor=color, edgecolor=color, alpha=0.7)
                
                # cluster label
                ax1.text(0.9, y_lower + 0.45 * sizei, str(i))

                y_lower = y_upper
                
                if pca2.shape[1] == 1:
                    ax2.scatter(pca2[:, 0][predict == i], pca2[:, 0][predict == i], color=color)
                else:
                    ax2.scatter(pca2[:, 0][predict == i], pca2[:, 1][predict == i], color=color)

            ax1.axvline(x=score, color="red")
            ax1.set_xlim(right=1.0)
            ax1.set_yticks([])
            ax1.set_xlabel("Silhouette coefficient values")
            ax1.set_ylabel("Cluster label")
            
            if pca2.shape[1] == 1:
                ax2.scatter(pca2_centers[:, 0], pca2_centers[:, 0], marker='x', edgecolors=1, s=200, color=colors)
                ax2.set_xlabel("Feature space for the 1st feature")
                ax2.set_ylabel("Feature space for the 1st feature")
            else:
                ax2.scatter(pca2_centers[:, 0], pca2_centers[:, 1], marker='x', edgecolors=1, s=200, color=colors)
                ax2.set_xlabel("Feature space for the 1st feature")
                ax2.set_ylabel("Feature space for the 2nd feature")   
            
            plt.tight_layout()
            figs.addpltfig('image'+str(i), plt)
            plt.clf()
            # images.append(imagek)
            images.append(figs.getMD('image'+str(i)))

    argmax = np.argmax(silhouette_list)
    best_k = n_clusters_list[argmax]
    best_model = models[argmax]
    predict = best_model.predict(inputarr)
    best_centers = best_model.cluster_centers_
    best_labels = best_model.labels_
    best_sse = best_model.inertia_

    n_clusters = len(best_centers)
    colors = cm.nipy_spectral(np.arange(n_clusters).astype(float) / n_clusters)

    plt.figure()
    _kmeans_centers_plot(feature_names, best_centers, colors)
    figs.addpltfig('fig_centers', plt)
    plt.clf()
    plt.figure()
    _kmeans_samples_plot(table, input_cols, n_samples, best_centers, seed, colors)
    figs.addpltfig('fig_samples', plt)
    plt.clf()
    plt.figure()
    _kmeans_pca_plot(predict, best_centers, pca2_model, pca2, colors)
    figs.addpltfig('fig_pca', plt)
    plt.clf()
    
    rb = BrtcReprBuilder()
    if display_plt:
        x_clusters = range(len(n_clusters_list))
        plt.xticks(x_clusters, n_clusters_list)
        plt.plot(x_clusters, silhouette_list, '.-')
        plt.xlabel("Number of Clusters k")
        plt.tight_layout()
        figs.addpltfig('fig_silhouette', plt)
        plt.clf()

        rb.addMD(strip_margin("""
        | ## Kmeans Silhouette Result
        | - silhoutte metrics:
        | {fig_silhouette}
        | - best K: {best_k} 
        | - Sum of square error: {best_sse}.
        | - best centers:
        | {fig_pca}
        | {fig_centers}
        | {fig_samples}
        |
        """.format(fig_silhouette=figs.getMD('fig_silhouette'),
                   best_k=best_k, best_sse=best_sse,
                   fig_pca=figs.getMD('fig_pca'),
                   fig_centers=figs.getMD('fig_centers'),
                   fig_samples=figs.getMD('fig_samples'))))

        for k, image in zip(n_clusters_list, images):
            rb.addMD(strip_margin("""
            | ### k = {k}
            | {image}
            |
            """.format(k=k, image=image)))
    else:
        rb.addMD(strip_margin("""
        | ## Kmeans Silhouette Result
        | - best K: {best_k} 
        | - Sum of square error: {best_sse}.
        |
        """.format(best_k=best_k, best_sse=best_sse)))

    model = _model_dict('kmeans_silhouette')
    model['best_k'] = best_k
    model['best_centers'] = best_centers
    model['best_model'] = best_model
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    model['figures'] = figs.tojson()

    out_table = table.copy()
    out_table[prediction_col] = predict
    # out_table['silhouette'] = silhouette_samples_list[best_k-2]
    # out_table = out_table.sort_values(by=['prediction','silhouette'])
    # out_table = out_table.reset_index(drop=True)

    return {'out_table': out_table, 'model': model}
