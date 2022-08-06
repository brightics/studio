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
import numpy as np
from brighticsql.frompd import isna
from brighticsql.base import DataClassBase
from brighticsql.utils.dtypes import (infer_array_dtype, are_dtypes_compatible,
                                      upcast)
from brighticsql.utils.grouping import (get_distinct_elem, get_group_index,
                                        array_groupby)


class ModelOutput(DataClassBase):
    """Internal data structure to model output.

        MODEL DATA is intended to store non-table result as dict container
        at the last step(Logical Project) when an expression contains an
        evaluation of a user defined function which results in non-table type
        result. e.g. MLTRAIN.

        # MODEL DATA
        Possible input combinations:
            (dict)
    """

    def __init__(self, dataset=None, **kwargs):
        self.data = dataset
        self.dstruct = 'dict'


class TableClass(DataClassBase):
    """Base class for Table object."""

    def __init__(self, data, fields):
        self.data = data
        self.fields = fields


class QueryTable(TableClass):
    """Internal data structure to carry out SQL operations.

        Data will be stored as following three types, although implemenataion
        is ugly, for efficient and convenient intermediate operations.
        - pandas dataframe
        - numpy ndarray
        - list of numpy 1-d arrays

        Possible input combinations:
            (pd.DataFrame)
            (pd.DataFrame, list)
            (pd.DataFrame, list, list)

            (ndarray, list)
            (ndarray, list, list)

            (list(of 1-d arrays), list)
            (list(of 1-d arrays), list, list)

        Examples
        --------

        # Instantiate a QueryTable from a pandas dataframe.

        >>> df1 = pd.DataFrame({'lkey': ['foo', 'bar', 'baz', 'foo'], 'value': [1, 2, 3, 5]})
        >>> dc1 = QueryTable(df1)
        >>> dc1.data
        lkey  value
        0  foo      1
        1  bar      2
        2  baz      3
        3  foo      5
        >>> dc1.fields
        ['LKEY', 'VALUE']
        >>> dc1.field_index
        {'LKEY': 0, 'VALUE': 1}
        >>> dc1.dtypes
        [dtype('<U'), dtype('int64')]

        # Instantiate a QueryTable from a numpy array with specified fields.
        >>> npdata = df1.values
        >>> npdata
        array([['foo', 1],
               ['bar', 2],
               ['baz', 3],
               ['foo', 5]], dtype=object)
        >>> dc2 = QueryTable(npdata, ['lkey', 'value'])

        # Instantiate a QueryTable from a list of 1-d numpy arrays with specified fields.
        >>> lstdata
        [array(['foo', 'bar', 'baz', 'foo'], dtype=object), array([1, 2, 3, 5], dtype=object)]
        >>> dc3 = QueryTable(lstdata, ['lkey', 'value'])
        >>> dc3.data
        [array(['foo', 'bar', 'baz', 'foo'], dtype=object), array([1, 2, 3, 5], dtype=object)]
        >>> dc3.data
        array([['foo', 1],
               ['bar', 2],
               ['baz', 3],
               ['foo', 5]], dtype=object)
    """

    def __init__(self, data, fields=None, dtypes=None):
        """dataset: pandas dataframe, numpy array, list of numpy 1-d arrays
           fields: list or None
           dtypes: list or None
        """
        super().__init__(data, fields)
        if isinstance(data, pd.DataFrame):
            self.dstruct = 'pd'
            self.shape = data.shape
            self.fields = data.columns.tolist()
        elif isinstance(data, np.ndarray):
            assert fields is not None and len(fields) == data.shape[1]
            self.dstruct = 'np'
            self.shape = data.shape
            self.fields = fields
        elif isinstance(data, list):
            assert fields is not None and len(data) == len(fields)
            self.dstruct = 'li'
            if data:
                self.shape = (max([col.shape[0] for col in data]),
                              len(data))
            else:
                self.shape = (0, 0)
            self.fields = fields
        else:
            raise ValueError('need dataset as pd.DataFrame/np.ndarray/list')
        if dtypes is not None:
            assert len(dtypes) == self.shape[1]
            if isinstance(dtypes, list):
                dtypes = dict(enumerate(dtypes))
            self._dtypes = dtypes
        else:
            self._dtypes = {}
        self.fields = [fd.upper() for fd in self.fields]
        self.naidx = {}
        self._field_index = None

    @property
    def field_index(self):
        """Return a map of (field, index)."""
        if self._field_index is None:
            self._field_index = dict((f, i) for i, f in enumerate(self.fields))
        return self._field_index

    @property
    def dtypes(self):
        if len(self._dtypes) < self.shape[1]:
            for i in range(self.shape[1]):
                if i not in self._dtypes:
                    self._dtypes[i] = infer_array_dtype(self.slice_col(i))
        return [self._dtypes[i] for i in range(self.shape[1])]

    def slice_col(self, colidx, distinct=False):
        """Returns a single column as numpy 1darray."""
        if self.dstruct == 'pd':
            col = self.data.iloc[:, colidx].values
        elif self.dstruct == 'np':
            col = self.data[:, colidx]
        elif self.dstruct == 'li':
            col = self.data[colidx]
            if col.shape[0] < self.shape[0]:
                col = np.full((self.shape[0]), col[0])
        else:
            raise Exception('Code should not be reached.')
        return get_distinct_elem(col) if distinct else col

    def slice_cols(self, colidx=None, totable=False):
        """ returns columns correspond to given indices.
            Returns entire data if colidx is not given.
            If totable=True then returns TableClass object.
            Use slice_col if a single column is desired."""
        if colidx is None:
            return self if totable else self.data

        if not set(colidx) <= set(range(self.shape[1])):
            raise ValueError('input indices contains invalid field index')
        if self.dstruct == 'pd':
            res = self.data.iloc[:, colidx]
        elif self.dstruct == 'li':
            res = [np.full((self.shape[0]), self.data[idx][0])
                   if self.data[idx].shape[0] < self.shape[0]
                   else self.data[idx] for idx in colidx]
        elif self.dstruct == 'np':
            res = self.data[:, colidx]
        else:
            raise Exception('Code should not be reached.')
        return QueryTable(res, self.fields) if totable else res

    def get_dtypes(self, colidx=None):
        """Returns dtype of a column or columns.
        It returns dtypes for all columns if colidx is not given."""
        if colidx is None:
            return self.dtypes
        if isinstance(colidx, int):
            if colidx not in self._dtypes:
                self._dtypes[colidx] = infer_array_dtype(self.slice_col(colidx))
            return self._dtypes[colidx]
        for i in colidx:
            if i not in self._dtypes:
                self._dtypes[i] = infer_array_dtype(self.slice_col(i))
        return [self._dtypes[i] for i in colidx]

    def field_to_index(self, fields):
        """Returns indices of corresponding to fields."""
        if isinstance(fields, str):
            return self.field_index[fields.upper()]
        return [self.field_index[fd.upper()] for fd in fields]

    def fields_to_index_map(self):
        return dict((f, i) for i, f in enumerate(self.fields))

    def to_ndarray(self):
        """Convert data to np.ndarray."""
        if self.dstruct == 'np':
            return
        elif self.dstruct == 'pd':
            self.data = self.data.values
        elif self.dstruct == 'li':
            _types = []
            for i, col in enumerate(self.data):
                if col.shape[0] < self.shape[0]:
                    self.data[i] = np.full(self.shape[0], col[0])
                _types.append(col.dtype)
            _type = upcast(_types)
            if _type == np.dtype('object'):
                if not any([d == np.dtype('object') for d in _types]):
                    self.data[0] = self.data[0].astype('object')
            self.data = np.stack(self.data, axis=-1)
        else:
            raise Exception('Code should not be reached.')
        self.dstruct = 'np'

    def toDataFrame(self):
        """Returns a dataframe object of underlying data."""
        if self.dstruct == 'pd':
            return self.data
        elif self.dstruct == 'np':
            return pd.DataFrame(self.data, columns=self.fields)
        elif self.dstruct == 'li':
            self.data = [
                np.full(self.shape[0], c) if c.shape[0] < self.shape[0] else c
                for c in self.data]
            return pd.DataFrame(dict(zip(self.fields, self.data)),
                                columns=self.fields)
        else:
            raise Exception('Code should not be reached.')

    def slice_rows(self, rowidx=None, totable=False):
        """ returns rows correspond to given indices.
            return type is same as original data structure.
            Returns entire data if colidx is not given.
            If totable=True then returns TableClass object.
        """
        if rowidx is None:
            return self if totable else self.data

        if not isinstance(rowidx, list) and \
                not isinstance(rowidx, np.ndarray):
            raise ValueError('colidx should be a list of indices')

        if isinstance(rowidx, list):
            rowidx = np.array(rowidx)
        if self.dstruct == 'pd':
            res = self.data.iloc[rowidx]
        elif self.dstruct == 'li':
            len_row = len(rowidx)
            res = [np.full(len_row, self.data[i][0])
                   if self.data[i].shape[0] < len_row
                   else self.data[i][rowidx] for i in range(self.shape[1])]
        elif self.dstruct == 'np':
            res = self.data[rowidx]
        return QueryTable(res, self.fields) if totable else res

    def rowiter(self):
        """ Returns row iterator."""
        self.to_ndarray()
        return iter(self.data)

    def coliter(self):
        """ Returns column iterator."""
        self.to_ndarray()
        return iter(self.data.T)

    def append(self, other, check_compatibility=True):
        """Append TableClass to the current TableClass."""

        if not isinstance(other, QueryTable):
            raise Exception('other should be an instance of dataclass')

        if self.shape[1] != other.shape[1]:
            raise Exception('column lengths are different.')

        if check_compatibility:
            if not are_dtypes_compatible(self.dtypes, other.dtypes):
                raise Exception('Incompatible date types.')

        if self.dstruct == other.dstruct == 'pd':
            other.data.columns = self.data.columns
            self.data.append(other.data)
        else:
            self.to_ndarray()
            other.to_ndarray()
            self.data = np.vstack((self.data, other.data))
            self.dstruct = 'np'
            self._dtypes = {}

    def drop_duplicates(self):
        """Drop duplicated rows in data."""
        if self.dstruct == 'pd':
            self.data = self.data.drop_duplicates()
            self.shape = self.data.shape
        else:
            self.to_ndarray()
            grp = get_group_index(
                self.data, group_index=False, duplicated_index=True)
            self.data = self.data[np.logical_not(grp)]
            self.shape = self.data.shape

    def group_index(self, groupby_cols=None, duplicated_index=False):
        """Returns groupby indices for unique rows."""
        if groupby_cols is None:
            groupby_cols = list(range(self.shape[1]))
        self.to_ndarray()
        grp_idx = get_group_index(
            self.data, groupby_cols, duplicated_index=duplicated_index)
        return grp_idx, np.unique(grp_idx)

    def group(self, groupby_cols):
        self.to_ndarray()
        grp = get_group_index(
            self.data, groupby_cols, group_index=False, duplicated_index=True)
        return self.data[np.logical_not(grp)]

    def groupby(self, groupby_cols):
        """Returns dict(group_id, group), dict(group_id, grouped_data)."""
        self.to_ndarray()
        return array_groupby(self.data, groupby_cols)

    def get_naval_index(self, colidx):
        """ Find np.nan and None index of a column.
            Returns boolean indexing.
            Computed values will be cached for repeated use."""

        if colidx not in set(self.naidx.keys()):
            self.naidx[colidx] = isna(self.slice_col(colidx))

        return self.naidx[colidx]


class NullTable(TableClass):
    """Auxiliary dummy table. Do nothing."""

    def __init__(self):
        super().__init__(None, None)
        self.name = 'nulltable'
