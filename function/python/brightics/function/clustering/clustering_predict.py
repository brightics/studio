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

from brightics.common.validation import raise_runtime_error
from .hierarchical_clustering import hierarchical_clustering_post
from .agglomerative_clustering import agglomerative_clustering_predict
from .gaussian_mixture import gaussian_mixture_predict
from .kmeans import kmeans_predict
from .mean_shift import mean_shift_predict
from .spectral_clustering import spectral_clustering_predict

import numpy as np


def clustering_predict(model, num_clusters, cluster_col='cluster'):
    if '_grouped_data' in model:
        tmp_model = model['_grouped_data']['data']
        tmp_model = list(tmp_model.values())[0]
    else:
        tmp_model = model
    if tmp_model['_type'] == 'hierarchical_clustering':
        return hierarchical_clustering_post(model=model, num_clusters=num_clusters, cluster_col=cluster_col)
    raise_runtime_error('''It is not supported yet.''')


def clustering_predict2(table, model, prediction_col='prediction'):
    if '_grouped_data' in model:
        tmp_model = model['_grouped_data']['data']
        tmp_model = list(tmp_model.values())[0]
    else:
        tmp_model = model

    if tmp_model['_type'] == 'agglomerative_clustering':
        return agglomerative_clustering_predict(table=table, model=model, prediction_col=prediction_col)

    if tmp_model['_type'] == 'gaussian_mixture_train':
        return gaussian_mixture_predict(table=table, model=model, prediction_col_name=prediction_col)

    if 'kmeans' in tmp_model['_type']:
        return kmeans_predict(table=table, model=model, prediction_col=prediction_col)

    if tmp_model['_type'] == 'mean_shift':
        return mean_shift_predict(table=table, model=model, prediction_col=prediction_col)

    if tmp_model['_type'] == 'spectral_clustering':
        return spectral_clustering_predict(table=table, model=model, prediction_col=prediction_col)

    raise_runtime_error('''It is not supported yet.''')
