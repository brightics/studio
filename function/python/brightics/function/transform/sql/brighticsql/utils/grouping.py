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

from brighticsql.frompd import hashtable as htb
from brighticsql.frompd.core import sorting
from brighticsql.frompd.core.algorithms import factorize
#from brighticsql.frompd.core.dtypes.common import ensure_platform_int
from brighticsql.frompd import isna

"""This module provides group-by and sorting utilities. Most parts of source 
code is reproduced from pandas.sorting with slight modification. 
"""


def get_distinct_elem(col: np.ndarray) -> np.ndarray:
    """Return distinct elements of an input column."""
    size_hint = min(col.shape[0], htb._SIZE_HINT_LIMIT)
    labels, _ = factorize(col, size_hint)
    labels.astype('i8', copy=False)
    effidx = np.logical_not(htb.duplicated_int64(labels, 'first'))
    return col[effidx]


def get_group_index(array: np.ndarray, col_index=None, group_index=True,
                    duplicated_index=False):
    """Returns group_index of numpy.ndarray data, considering certain columns.
    Set duplicated_index=True to get boolean indexing of duplicated rows."""

    def _factorize(_cols):
        _labels, _shape = factorize(_cols, size_hint)
        return _labels.astype('i8', copy=False), len(_shape)

    if not isinstance(array, np.ndarray):
        raise ValueError('array should be the np.ndarray.')

    if array.ndim == 1:
        array = array.reshape(len(array), 1)

    if col_index is None or not col_index:
        col_index = range(array.shape[1])
    elif isinstance(col_index, int):
        col_index = [col_index]

    size_hint = min(array.shape[0], htb._SIZE_HINT_LIMIT)
    cols = (array[:, idx] for idx in col_index)
    labels, shape = map(list, zip(*map(_factorize, cols)))
    idx = sorting.get_group_index(labels, shape, sort=False, xnull=False)

    if group_index and not duplicated_index:
        return idx
    elif group_index and duplicated_index:
        return idx, htb.duplicated_int64(idx, 'first')
    elif not group_index and duplicated_index:
        return htb.duplicated_int64(idx, 'first')
    else:
        raise ValueError(
            'One of group_index or duplicated_index need to be True.')


def array_groupby(array: np.ndarray, groupby_cols=None):
    """Return grouped array according to groupby_cols.
    All the columns of the input array will be chosen as groupby_cols
    if groupby_cols is not given.

    Return:
        dict(group_id, group), dict(group_id, grouped_data)
    """
    if array.ndim == 1:
        array = array.reshape(len(array), 1)

    if groupby_cols is None or not groupby_cols:
        groupby_cols = list(range(array.shape[1]))

    grp_idx = get_group_index(array, groupby_cols)

    def f():
        for idx in np.unique(grp_idx):
            val = array[grp_idx == idx]
            yield (idx, val[0, groupby_cols]), (idx, val)

    return map(dict, zip(*f()))


def sort_indexer(cols, direction, null_pos):
    """Returns sort index."""

    def lexsort(_cols, _direction, _null_pos):
        labels = list()
        shape = list()

        for col, order, napos in zip(_cols, _direction, _null_pos):
            label, items = factorize(col, sort=True)
            mask = (label == -1)
            nitem = len(items)

            if order == 'ASCENDING':
                if napos == 'LAST':
                    label = np.where(mask, nitem, label)
                elif napos == 'FIRST':
                    label += 1
            elif order == 'DESCENDING':
                if napos == 'LAST':
                    label = np.where(mask, nitem, (nitem - 1) - label)
                elif napos == 'FIRST':
                    label = np.where(mask, 0, nitem - label)
            else:
                raise ValueError('Unknown sort direction.')

            if mask.any():
                nitem += 1

            labels.append(label)
            shape.append(nitem)
        _idx = sorting.indexer_from_factorized(labels, shape)
        return _idx
        #return ensure_platform_int(_idx)

    def quicksort(col, order, napos):
        naidx = isna(col)
        if np.any(naidx):
            nas = np.nonzero(naidx)[0]
            naidx = ~naidx
            _idx = np.nonzero(naidx)[0]
            _idx = _idx[np.argsort(col[naidx])]
            if order == 'DESCENDING':
                _idx = _idx[::-1]
            if napos == 'FIRST':
                _idx = np.concatenate([nas, _idx])
            elif napos == 'LAST':
                _idx = np.concatenate([_idx, nas])
        else:
            _idx = np.argsort(col)
            if order == 'DESCENDING':
                _idx = _idx[::-1]
        return _idx

    if len(cols) > 1:
        idx = lexsort(cols, direction, null_pos)
    else:
        idx = quicksort(cols[0], direction[0], null_pos[0])
    return idx
