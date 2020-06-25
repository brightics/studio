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

import numpy as np
import pandas as pd
from pandas.core.dtypes.missing import isna
from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error


def explode(table, **params):
    check_required_parameters(_explode, params, ['table'])
    return _explode(table, **params)


def _explode(table, input_col):
    col = table[input_col]
    is_arr_col_list = [isinstance(item, np.ndarray) or isinstance(item, list) for item in col]
    is_non_arr_col_list = [not item for item in is_arr_col_list]
    is_arr_col = all(is_arr_col_list)
    is_non_arr_col = all(is_non_arr_col_list)
    if not is_arr_col and not is_non_arr_col:
        raise_runtime_error("{} is an invalid column to explode or un-explode.".format(input_col))
    elif is_arr_col:  # explode
        values = np.array(col)
        values_flattened = np.concatenate(values).ravel()
        counts = [len(item) for item in values]
        col_exploded = pd.Series(values_flattened, index=col.index.repeat(counts), name=col.name)
        out_table = table.drop([input_col], axis=1).join(col_exploded).reindex(columns=table.columns, copy=False)
    else:  # un-explode
        group_cols = table.columns.tolist()
        group_cols.remove(input_col)

        group_id = 'tmp_group_id'
        while group_id in table.columns:
            group_id += '_'
        group_idx = table[group_cols].drop_duplicates()
        group_idx[group_id] = np.arange(group_idx.shape[0])
        table = table.merge(group_idx, on=group_cols)

        out_table = table.groupby(group_id)[input_col].apply(list).reset_index(name=input_col) \
            .merge(group_idx, on=group_id).reindex(columns=table.columns).drop(group_id, axis=1)
        out_table[input_col] = out_table[input_col].map(lambda lst: [item for item in lst if not isna(item)])

    return {'out_table': out_table}
