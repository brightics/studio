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

from sklearn.manifold import TSNE as tSNE
import pandas as pd
import matplotlib.pyplot as plt
from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, plt2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_to
import seaborn as sns
import numpy as np
import matplotlib.cm as cm
from matplotlib.patches import Patch
from brightics.common.validation import validate, greater_than_or_equal_to


def tsne2(table, group_by=None, **params):
    check_required_parameters(_tsne, params, ['table'])
    params = get_default_from_parameters_if_required(params, _tsne)
    param_validation_check = [from_to(params, 1, len(params['input_cols']), 'n_components')]
    validate(*param_validation_check)
    if group_by is not None:
        grouped_model = _function_by_group(_tsne, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _tsne(table, **params)
    
    
def _tsne(table, input_cols, new_column_name='projected_', n_components=2, perplexity=30.0,
            early_exaggeration=12.0, learning_rate=200.0, n_iter=1000,
            n_iter_without_progress=300, min_grad_norm=1e-7,
            metric="euclidean", init="random", verbose=0,
            seed=None, method='barnes_hut', angle=0.5):
    
    num_feature_cols = len(input_cols)
    if n_components is None:
        n_components = num_feature_cols
    
    tsne = tSNE(n_components=n_components, perplexity=perplexity, early_exaggeration=early_exaggeration, 
                learning_rate=learning_rate, n_iter=n_iter, n_iter_without_progress=n_iter_without_progress,
                min_grad_norm=min_grad_norm, metric=metric, init=init, verbose=verbose, 
                random_state=seed, method=method, angle=angle)

    tsne_result = tsne.fit_transform(table[input_cols])

    column_names = []
    for i in range(0, n_components):
        column_names.append(new_column_name + str(i))

    out_df = pd.DataFrame(data=tsne_result[:, :n_components], columns=[column_names])
    
    out_df = pd.concat([table.reset_index(drop=True), out_df], axis=1)
    out_df.columns = table.columns.values.tolist() + column_names

    return {'out_table': out_df}