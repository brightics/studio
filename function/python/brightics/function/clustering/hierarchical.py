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

from sklearn.cluster import AgglomerativeClustering as SKAgglomerativeClustering
from scipy.cluster.hierarchy import dendrogram
from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD
import numpy as np
import matplotlib.pyplot as plt


class AgglomerativeClustering():  # TODO predefine matrix input

    def process(self, input_table, input_cols, n_clusters=3, affinity='euclidean', compute_full_tree=True, linkage='ward', prediction_col='prediction', figw=6.4, figh=4.8):
        return agglomerative_clustering_train_predict(input_table=input_table, input_cols=input_cols, n_clusters=n_clusters, affinity=affinity, compute_full_tree=compute_full_tree, linkage=linkage, prediction_col=prediction_col, figw=figw, figh=figh) 

    
def agglomerative_clustering_train_predict(input_table, input_cols, n_clusters=3, affinity='euclidean', compute_full_tree=True, linkage='ward', prediction_col='prediction', figw=6.4, figh=4.8):
    inputarr = input_table[input_cols]
    
    agglomerative_clustering = SKAgglomerativeClustering(n_clusters=n_clusters, affinity=affinity, memory=None, connectivity=None, compute_full_tree=compute_full_tree, linkage=linkage)
    agglomerative_clustering.fit(inputarr)
    input_table[prediction_col] = agglomerative_clustering.labels_
    
    children = agglomerative_clustering.children_
    distance = np.arange(children.shape[0])
    no_of_observations = np.arange(2, children.shape[0] + 2)
    linkage_matrix = np.column_stack([children, distance, no_of_observations]).astype(float)
    plt.figure(figsize=(figw, figh))
    dendrogram(linkage_matrix)
    plot_dendrogram = plt2MD(plt) 
    plt.clf()
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Agglomerative Clustering Result
    | {plot_dendrogram}
    """.format(plot_dendrogram=plot_dendrogram)))
    
    agglomerative_clustering_result = {'model':agglomerative_clustering, 'input_cols':input_cols, '_repr_brtc_':rb.get()}
    
    return {'out_table': input_table, 'agglomerative_result':agglomerative_clustering_result}
