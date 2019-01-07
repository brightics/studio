from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

import matplotlib.pyplot as plt
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster, leaders
import numpy as np
import pandas as pd


def _fancy_dendrogram(*args, **kwargs):
    max_d = kwargs.pop('max_d', None)
    if max_d and 'color_threshold' not in kwargs:
        kwargs['color_threshold'] = max_d
    annotate_above = kwargs.pop('annotate_above', 0)

    ddata = dendrogram(*args, **kwargs)

    if not kwargs.get('no_plot', False):
        for i, d, c in zip(ddata['icoord'], ddata['dcoord'], ddata['color_list']):
            x = 0.5 * sum(i[1:3])
            y = d[1]
            if y > annotate_above:
                plt.plot(x, y, 'o', c=c)
                plt.annotate("%.3g" % y, (x, y), xytext=(0, -5),
                             textcoords='offset points',
                             va='top', ha='center')
    return ddata

def hierarchical_clustering(table, group_by=None, **params):
    check_required_parameters(_hierarchical_clustering, params, ['table'])
    if group_by is not None:
        return _function_by_group(_hierarchical_clustering, table, group_by=group_by, **params)
    else:
        return _hierarchical_clustering(table, **params)


def _hierarchical_clustering(table, input_cols, link='complete', met='euclidean', num_rows=20, figure_height=6.4, orient='right'):
    table = table.copy()
    df = table[input_cols]
    Z = linkage(df, method=link, metric=met)
    out_table = pd.DataFrame([])
    out_table['linkage_step'] = [x + 1 for x in reversed(range(len(Z)))]
    out_table['joined_column1'] = ['pt_' + str(int(Z[:, 0][i])) for i in range(len(Z))]
    out_table['joined_column2'] = ['pt_' + str(int(Z[:, 1][i])) for i in range(len(Z))]
    out_table['name_of_clusters'] = ['CL_' + str(i + 1) for i in reversed(range(len(Z)))]
    out_table['distance'] = [distance for distance in Z[:, 2]]
    out_table['number_of_original'] = [int(entities) for entities in Z[:, 3]]
    
    # switch name of  point to cluster name

    for i in range(len(Z)):
        if Z[:, 0][i] >= len(df) :
            out_table['joined_column1'][i] = out_table['name_of_clusters'][Z[:, 0][i] - len(df)]
        if Z[:, 1][i] >= len(df) :
            out_table['joined_column2'][i] = out_table['name_of_clusters'][Z[:, 1][i] - len(df)]
    out_table = out_table.reindex(index=out_table.index[::-1])[0:]
    out_table1 = out_table.head(num_rows)
    
    # calculate full dendrogram
    def _llf(idx):
        n = len(df)
        if idx < n:
                return 'pt_' + str(idx)
 
    plt.figure(figsize=(8.4, figure_height))
    _fancy_dendrogram(
        Z,
        truncate_mode='none',  # show only the last p merged clusters (if another)
        get_leaves=True,
        orientation=orient,
        labels=True,
        leaf_label_func=_llf,
        leaf_rotation=45,
        leaf_font_size=5.,
        show_contracted=False,  # to get a distribution impression in truncated branches
        annotate_above=float(10),  # useful in small plots so annotations don't overlap
    )
    plt.title('Hierarchical Clustering Dendrogram')
    if orient=='top':
        plt.xlabel('Samples')
        plt.ylabel('Distance')
    elif orient=='right':
        plt.xlabel('Distance')
        plt.ylabel('Samples')
    
    plt2 = plt2MD(plt)
    plt.clf()
    
    rb = BrtcReprBuilder()
    params = { 
        'Input Columns': input_cols,
        'Linkage Method': link,
        'Metric': met,
        'Number of Rows in Linkage Matrix': num_rows
    }
    rb.addMD(strip_margin("""### Hierarchical Clustering Result"""))
    rb.addMD(strip_margin("""
    |## Dendrogram
    |
    |{image}
    |
    |### Parameters
    |
    | {display_params}
    |
    |## Linkage Matrix
    |
    |{out_table1}
    |
    """.format(image=plt2, display_params=dict2MD(params), out_table1=pandasDF2MD(out_table1))))

    model = _model_dict('hierarchical_clustering')
    model['model'] = Z
    model['parameters'] = params
    model['linkage_matrix'] = out_table
    model['report'] = rb.get()
        
    return {'model':model}

def hierarchical_clustering_post(table, model, group_by=None, **params):
    check_required_parameters(_hierarchical_clustering_post, params, ['table', 'model'])
    if group_by is not None:
        return _function_by_group(_hierarchical_clustering_post, table, model, group_by=group_by, **params)
    else:
        return _hierarchical_clustering_post(table, model, **params)


def _hierarchical_clustering_post(table, model, num_clusters, cluster_col='prediction'):
    Z = model['model']
    params = model['parameters']
    out_table = model['linkage_matrix']
    predict = fcluster(Z, t=num_clusters, criterion='maxclust')
    prediction_table = table.copy()
    prediction_table[cluster_col] = predict
    
    L, M = leaders(Z, predict)
    which_cluster = []
    for leader in L:
        if leader in Z[:, 0]:
            select_indices = np.where(Z[:, 0] == leader)[0][0]
            which_cluster.append(out_table['joined_column1'][select_indices])
        elif leader in Z[:, 1]:
            select_indices = np.where(Z[:, 1] == leader)[0][0]
            which_cluster.append(out_table['joined_column2'][select_indices])
    
    clusters_info_table = pd.DataFrame([])
    clusters_info_table[cluster_col] = M
    clusters_info_table['name_of_clusters'] = which_cluster
    clusters_info_table = clusters_info_table.sort_values(cluster_col)
    cluster_count = np.bincount(prediction_table[cluster_col])
    cluster_count = cluster_count[cluster_count != 0]
    clusters_info_table['num_of_entities'] = list(cluster_count)
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""### Hierarchical Clustering Post Process Result"""))
    rb.addMD(strip_margin("""
    |### Parameters
    |
    |{display_params}
    |
    |## Clusters Information
    |
    |{clusters_info_table}
    |
    """.format(display_params=dict2MD(params), clusters_info_table=pandasDF2MD(clusters_info_table))))

    model = _model_dict('hierarchical_clustering_post')
    model['params']=params
    model['clusters_info']=clusters_info_table
    model['report'] = rb.get()
    
    return {'out_table2' : prediction_table, 'model': model}
