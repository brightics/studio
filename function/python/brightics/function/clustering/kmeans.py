from sklearn.cluster import KMeans as SKKMeans
from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD, plt2MD
import matplotlib.pyplot as plt
from sklearn.decomposition import PCA
import numpy as np
import matplotlib.cm as cm
from sklearn.metrics.cluster.unsupervised import silhouette_score, \
    silhouette_samples
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than_or_equal_to, \
    greater_than, all_elements_greater_than, raise_runtime_error


def _kmeans_centers_plot(input_cols, cluster_centers):
    sum_len_cols = np.sum([len(col) for col in input_cols])
    x = range(len(input_cols))
    if sum_len_cols >= 512:
        plt.xticks(x, input_cols, rotation='vertical')
    elif sum_len_cols >= 64:
        plt.xticks(x, input_cols, rotation=45, ha='right')
    else:
        plt.xticks(x, input_cols)
    for idx, centers in enumerate(cluster_centers):
        plt.plot(x, centers, "o-", label=idx)
    plt.legend()
    plt.tight_layout()
    fig_centers = plt2MD(plt)
    plt.clf()
    return fig_centers


def _kmeans_samples_plot(table, input_cols, n_samples, cluster_centers):
    sum_len_cols = np.sum([len(col) for col in input_cols])
    sample = table[input_cols].sample(n=n_samples)
    x = range(len(input_cols))
    if sum_len_cols >= 512:
        plt.xticks(x, input_cols, rotation='vertical')
    elif sum_len_cols >= 64:
        plt.xticks(x, input_cols, rotation=45, ha='right')
    else:
        plt.xticks(x, input_cols)
    for idx in sample.index:
        plt.plot(x, sample.transpose()[idx], color='grey', linewidth=1)
    for idx, centers in enumerate(cluster_centers):
        plt.plot(x, centers, "o-", label=idx, linewidth=4)
    plt.tight_layout()
    fig_samples = plt2MD(plt)
    plt.clf()
    return fig_samples


def _kmeans_pca_plot(labels, cluster_centers, pca2_model, pca2):
    n_clusters = len(cluster_centers)
    colors = cm.nipy_spectral(np.arange(n_clusters).astype(float) / n_clusters)

    for i, color in zip(range(n_clusters), colors):
        plt.scatter(pca2[:, 0][labels == i], pca2[:, 1][labels == i], color=color)

    pca2_centers = pca2_model.transform(cluster_centers)
    plt.scatter(pca2_centers[:, 0], pca2_centers[:, 1], marker='x', edgecolors=1, s=200, color=colors)
    plt.tight_layout()
    fig_pca = plt2MD(plt)
    plt.clf()
    return fig_pca


def kmeans_train_predict(table, group_by=None, **params):
    check_required_parameters(_kmeans_train_predict, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_kmeans_train_predict, table, group_by=group_by, **params)
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _kmeans_train_predict(table, **params)
    

def _kmeans_train_predict(table, input_cols, n_clusters=3, prediction_col='prediction', init='k-means++', n_init=10,
             max_iter=300, tol=1e-4, precompute_distances='auto', seed=None,
             n_jobs=1, algorithm='auto', n_samples=None):
    inputarr = table[input_cols]
    if n_samples is None:
        n_samples = len(inputarr)
        
    validate(greater_than_or_equal_to(n_clusters, 1, 'n_clusters'),
             greater_than_or_equal_to(n_init, 1, 'n_init'),
             greater_than_or_equal_to(max_iter, 1, 'max_iter'),
             greater_than(tol, 0.0, 'tol'),
             greater_than_or_equal_to(n_jobs, 1, 'n_jobs'),
             greater_than_or_equal_to(n_samples, 0, 'n_samples'))
        
    k_means = SKKMeans(n_clusters=n_clusters, init=init, n_init=n_init,
             max_iter=max_iter, tol=tol, precompute_distances=precompute_distances,
             verbose=0, random_state=seed, copy_x=True, n_jobs=n_jobs, algorithm=algorithm)
    
    k_means.fit(inputarr)
    
    params = {'input_cols':input_cols, 'n_clusters':n_clusters, 'init':init, 'n_init':n_init, 'max_iter':max_iter, 'tol':tol,
              'precompute_distances':precompute_distances, 'seed':seed, 'n_jobs':n_jobs, 'algorithm':algorithm}
    
    cluster_centers = k_means.cluster_centers_
    labels = k_means.labels_
    
    pca2_model = PCA(n_components=2).fit(inputarr)
    pca2 = pca2_model.transform(inputarr)
    
    fig_centers = _kmeans_centers_plot(input_cols, cluster_centers)
    fig_samples = _kmeans_samples_plot(table, input_cols, n_samples, cluster_centers)
    fig_pca = _kmeans_pca_plot(labels, cluster_centers, pca2_model, pca2)
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Kmeans Result
    | - Number of iterations run: {n_iter_}.
    | - Coordinates of cluster centers
    | {fig_cluster_centers} 
    | - Samples
    | {fig_pca}
    | {fig_samples}
    |
    | ### Parameters
    | {params}
    """.format(n_iter_=k_means.n_iter_, fig_cluster_centers=fig_centers, fig_pca=fig_pca, fig_samples=fig_samples, params=dict2MD(params))))
    
    model = _model_dict('kmeans')
    model['model'] = k_means
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    
    out_table = table.copy()
    out_table[prediction_col] = labels
    return {'out_table':out_table, 'model':model}


def kmeans_predict(table, model, group_by=None, **params):
    check_required_parameters(_kmeans_predict, params, ['table', 'model'])
    if '_grouped_key' in model:
        group_by = model['_grouped_key']
        return _function_by_group(_kmeans_predict, table, model, group_by=group_by, **params)
    else:
        return _kmeans_predict(table, model, **params)

    
def _kmeans_predict(table, model, prediction_col='prediction'):
    if model['_context'] == 'python' and model['_type'] == 'kmeans':
        k_means = model['model']
        input_cols = model['input_cols']
        predict = k_means.predict(table[input_cols])
        out_table = table.copy()
        out_table[prediction_col] = predict
    elif model['_context'] == 'python' and model['_type'] == 'kmeans_silhouette':
        k_means = model['best_model']
        input_cols = model['input_cols']
        predict = k_means.predict(table[input_cols])
        out_table = table.copy()
        out_table[prediction_col] = predict
    else:
        raise_runtime_error("Unsupported model")
        # raise Exception("Unsupported model")
    
    return {'out_table':out_table}


def kmeans_silhouette_train_predict(table, group_by=None, **params):
    check_required_parameters(_kmeans_silhouette_train_predict, params, ['table'])
    if group_by is not None:
        grouped_model = _function_by_group(_kmeans_silhouette_train_predict, table, group_by=group_by, **params) 
        grouped_model['model']['_grouped_key'] = group_by
        return grouped_model
    else:
        return _kmeans_silhouette_train_predict(table, **params)
    

def _kmeans_silhouette_train_predict(table, input_cols, n_clusters_list=range(2, 10), prediction_col='prediction', init='k-means++', n_init=10,
             max_iter=300, tol=1e-4, precompute_distances='auto', seed=None,
             n_jobs=1, algorithm='auto', n_samples=None):
    if n_samples is None:
        n_samples = len(table)
    inputarr = table[input_cols]
    
    validate(all_elements_greater_than(n_clusters_list, 1, 'n_clusters_list'),
         greater_than_or_equal_to(n_init, 1, 'n_init'),
         greater_than_or_equal_to(max_iter, 1, 'max_iter'),
         greater_than(tol, 0.0, 'tol'),
         greater_than_or_equal_to(n_jobs, 1, 'n_jobs'),
         greater_than_or_equal_to(n_samples, 0, 'n_samples'))
    
    pca2_model = PCA(n_components=2).fit(inputarr)
    pca2 = pca2_model.transform(inputarr)
    
    silhouette_list = []
    silouette_samples_list = []
    models = []
    centers_list = []
    images = []
    for k in n_clusters_list:
        k_means = SKKMeans(n_clusters=k, init=init, n_init=n_init,
             max_iter=max_iter, tol=tol, precompute_distances=precompute_distances,
             verbose=0, random_state=seed, copy_x=True, n_jobs=n_jobs, algorithm=algorithm)
        k_means.fit(inputarr)
        models.append(k_means)
        predict = k_means.labels_
        centersk = k_means.cluster_centers_
        centers_list.append(centersk)
        
        score = silhouette_score(inputarr, predict)
        silhouette_list.append(score)
        samples = silhouette_samples(inputarr, predict)
        silouette_samples_list.append(samples)
    
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

            y_lower = y_upper

            ax2.scatter(pca2[:, 0][predict == i], pca2[:, 1][predict == i], color=color)

        ax1.axvline(x=score, color="red")
        ax2.scatter(pca2_centers[:, 0], pca2_centers[:, 1], marker='x', edgecolors=1, s=200, color=colors)

        imagek = plt2MD(plt)
        plt.clf()
        images.append(imagek)
    
    argmax = np.argmax(silhouette_list)
    best_k = n_clusters_list[argmax]
    best_model = models[argmax]
    predict = best_model.predict(inputarr)
    best_centers = best_model.cluster_centers_
    best_labels = best_model.labels_
    
    fig_centers = _kmeans_centers_plot(input_cols, best_centers)
    fig_samples = _kmeans_samples_plot(table, input_cols, n_samples, best_centers)
    fig_pca = _kmeans_pca_plot(predict, best_centers, pca2_model, pca2)
    
    x_clusters = range(len(n_clusters_list))
    plt.xticks(x_clusters, n_clusters_list)
    plt.plot(x_clusters, silhouette_list, '.-')
    fig_silhouette = plt2MD(plt)
    plt.clf()
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Kmeans Silhouette Result
    | - silloutte metrics:
    | {fig_silhouette}
    | - best K: {best_k} 
    | - best centers:
    | {fig_pca}
    | {fig_centers}
    | {fig_samples}
    |
    """.format(fig_silhouette=fig_silhouette, best_k=best_k, fig_pca=fig_pca, fig_centers=fig_centers, fig_samples=fig_samples)))

    for k, image in zip(n_clusters_list, images):
        rb.addMD(strip_margin("""
        | ### k = {k}
        | {image}
        |
        """.format(k=k, image=image)))

    model = _model_dict('kmeans_silhouette')
    model['best_k'] = best_k
    model['best_centers'] = best_centers
    model['best_model'] = best_model
    model['input_cols'] = input_cols
    model['_repr_brtc_'] = rb.get()
    
    out_table = table.copy()
    out_table[prediction_col] = predict
    
    return {'out_table':out_table, 'model':model}
