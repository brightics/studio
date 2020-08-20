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

"""
Most of the source code in this file is the copy of the pandas project.
We choose to write this file because we need group-by functionality but with slight modifications.
"""

# -*- coding: utf-8 -*-

from pandas._libs import hashtable as htb
from pandas.core.sorting import (get_group_index, indexer_from_factorized)
from pandas.core.algorithms import factorize
# from pandas.core.dtypes.common import ensure_platform_int
from pandas.core.dtypes.missing import isna

import numpy as np


def get_distinct_elem(col):
    """
    Return distinct elements of an input column.
    """
    size_hint = min(col.shape[0], htb._SIZE_HINT_LIMIT)
    labels, _ = factorize(col, size_hint)
    labels.astype('i8', copy=False)
    effidx = np.logical_not(htb.duplicated_int64(labels, 'first'))
    return col[effidx]


def group_index(array, colidx=None, group_index=True, duplicated_index=False):
    """
    Returns group_index of numpy.ndarray data, considering certain columns.
    Set duplicated_index=True to get boolean indexing of duplicated rows.
    """

    if colidx is None:
        colidx = []

    if not isinstance(array, np.ndarray):
        raise ValueError('data should be np.ndarray.')

    if array.ndim == 1:
        array = array.reshape(len(array), 1)

    size_hint = min(array.shape[0], htb._SIZE_HINT_LIMIT)

    def _factorize(cols):
        labels, shape = factorize(cols, size_hint)
        return labels.astype('i8', copy=False),  len(shape)

    if isinstance(colidx, int):
        colidx = [colidx]

    if not colidx:
        colidx = range(array.shape[1])

    cols = (array[:, idx] for idx in colidx)
    labels, shape = map(list, zip(*map(_factorize, cols)))

    idx = get_group_index(labels, shape, sort=False, xnull=False)

    if group_index and not duplicated_index:
        return idx
    elif group_index and duplicated_index:
        return idx, htb.duplicated_int64(idx, 'first')
    elif not group_index and duplicated_index:
        return htb.duplicated_int64(idx, 'first')
    else:
        raise ValueError(
            'One of group_index or duplicated_index need to be True.')


def array_groupby(array, groupby_cols=None):
    """
    Return grouped array according to groupby_cols.
    All the columns of the input array will be chosen as groupby_cols
    if groupby_cols is not given.

    Return:
        dict(group_id, group), dict(group_id, grouped_data)
    """

    if groupby_cols is None:
        groupby_cols = []

    if array.ndim == 1:
        array = array.reshape(len(array), 1)

    if not groupby_cols:
        groupby_cols = list(range(array.shape[1]))
    grp_idx = group_index(array, groupby_cols)
    g_idx = np.unique(grp_idx)

    def f():
        for idx in g_idx:
            val = array[grp_idx == idx]
            yield (idx, val[0, groupby_cols]), (idx, val)

    return map(dict, zip(*f()))


def sort_indexer(cols, direction, null_pos):
    """Return sort index."""

    def lexsort(cols, direction, null_pos):

        labels = list()
        shape = list()

        for col, order, napos in zip(cols, direction, null_pos):

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
        idx = indexer_from_factorized(labels, shape)
        return idx
        # return ensure_platform_int(idx)

    def quicksort(col, order, napos):

        naidx = isna(col)
        if np.any(naidx):
            nas = np.nonzero(naidx)[0]
            naidx = ~naidx
            idx = np.nonzero(naidx)[0]
            idx = idx[np.argsort(col[naidx])]

            if order == 'DESCENDING':
                idx = idx[::-1]
            if napos == 'FIRST':
                idx = np.concatenate([nas, idx])
            elif napos == 'LAST':
                idx = np.concatenate([idx, nas])

        else:
            idx = np.argsort(col)
            if order == 'DESCENDING':
                idx = idx[::-1]

        return idx

    if len(cols) > 1:
        idx = lexsort(cols, direction, null_pos)
    else:
        idx = quicksort(cols[0], direction[0], null_pos[0])

    return idx
