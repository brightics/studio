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

# -*- coding: utf-8 -*-


import abc
import enum
from collections import namedtuple

fbase = namedtuple(
    'fbase', ['fexp', 'func', 'nargs', 'ret_dtype', 'arr_dtype', 'fillval'])


class DataClassBase:
    pass


class RelNodeABC(abc.ABC):
    """ABC for relnode."""

    def __init__(self, rel_typename, _id, inputs, field, variableSet,
                 **kwargs):
        self.rel_typename = rel_typename
        self.id = _id
        self.inputs = inputs
        self.field = field
        self.variableset = variableSet
        self.parent = None
        self.enum_name = self.rel_typename + str(self.id)
        self.has_subquery = False
        self.has_corr_subquery = False
        self._cid = set()
        for k, v in kwargs.items():
            setattr(self, k, v)

    def __call__(self, table_space, corrvar_space, **kwargs):
        self._eval(table_space, corrvar_space, **kwargs)

    @property
    def correlation_id(self):
        return self._cid

    def accept(self, visitor):
        visitor.visit(self)


class RexNodeABC(abc.ABC):
    __counter = 0

    def __init__(self, **kwargs):
        cls = self.__class__
        _nm = cls.__name__
        _idx = cls.__counter
        self.rex_typename = _nm
        self.name = '{}#{}'.format(_nm, _idx)
        cls.__counter += 1
        self.parent = None
        self.owner = None  # indicate to which relnode this rexnode belongs
        self._cid = set()
        self.has_subquery = False

        for k, v in kwargs.items():
            setattr(self, k, v)

    def __call__(self, **kwargs):
        return self.eval_rex(**kwargs)

    def __repr__(self):
        return self.name

    @abc.abstractmethod
    def eval_rex(self, **kwargs): pass

    @property
    def correlation_id(self):
        return self._cid

    def accept(self, visitor):
        visitor.visit(self)


class SqlOperator(abc.ABC):
    def __init__(self, kind, name, operands, op=None, **kwargs):
        self.kind = kind
        self.name = name
        self.operands = operands
        self.op = op
        self.eval_plan = 'i'  # 'i' or 'c'(correlated)
        self.parent = None
        self.owner = None
        self._cid = set()
        for o in self.operands:
            self._cid.update(o.correlation_id)

        for k, v in kwargs.items():
            setattr(self, k, v)

    def __call__(self, **kwargs):
        return self.eval_op(**kwargs)

    def __repr__(self):
        _oprds = ', '.join([str(o) for o in self.operands])
        # return self.name + '(' + self.op[0] + _oprds + ')'
        return self.name + '(' + _oprds + ')'

    @abc.abstractmethod
    def eval_op(self, **kwargs):
        pass

    @property
    def correlation_id(self):
        return self._cid


class RexReturn:
    __counter = 0

    def __init__(self, value, dtype, naidx):
        cls = self.__class__
        _nm = cls.__name__
        _idx = cls.__counter
        cls.__counter += 1
        self.name = '{}#{}'.format(_nm, _idx)
        self.value = value
        self.dtype = dtype
        self.naidx = naidx
        try:
            self.shape = value.shape
        except Exception:
            self.shape = (1, 1)

    def __repr__(self):
        s = self.name + '\n' + 'dtype: ' + \
            str(self.dtype) + '\n' + 'value: ' + \
            str(self.value) + '\n' + 'naidx: ' + str(self.naidx)
        return s

    def __iter__(self):
        yield self.value
        yield self.dtype
        yield self.naidx


class TableSpace:
    def __init__(self, input_dfs=None):
        self.input_dfs = {} if input_dfs is None else input_dfs
        self.space = {}

    def add(self, table_name, table):
        self.space[table_name] = table

    def remove(self, table_name):
        del self.space[table_name]

    def get_input_df(self, table_name):
        return self.input_dfs[table_name.upper()]

    def pop(self, table_name):
        return self.space.pop(table_name)

    def get(self, table_name):
        return self.space.get(table_name)


class CorrvarSpace:
    def __init__(self):
        self.space = {}
        self.fimaps = {}
        self.dtmaps = {}

    def add_dtmap(self, corrvar, dtmap):
        self.dtmaps[corrvar] = dtmap

    def add_fimap(self, corrvar, fdmap):
        self.fimaps[corrvar] = fdmap

    def field_to_index(self, corrvar, field):
        return self.fimaps[corrvar][field]

    def getval(self, corrvar, index):
        return self.space[corrvar][index]

    def getdtype(self, corrvar, index):
        return self.dtmaps[corrvar][index]


class VisitorABC(abc.ABC):
    @abc.abstractmethod
    def visit(self, elem): ...
