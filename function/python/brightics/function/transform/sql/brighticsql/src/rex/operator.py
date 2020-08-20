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


import numpy as np

from ..utils.dtype_util import (
    infer_dtype, default_val, is_bool_dtype, is_numeric_dtype, both_comparable,
    both_numeric, both_boolean, supertype_of_two, is_string_like_dtype,
    supertype_of_all)
from ..utils.rand_util import gen_colname
from ..base import RexReturn, SqlOperator, fbase
from ..functions.builtin_functions import (
    binary_operators, numeric_functions, prefix_operators, postfix_operators,
    sqlin_operators, string_functions, _truncate)
from ..functions.userdefined_functions import userdefined_functions
from ..tableclass import QueryTable


class ScalarQuery(SqlOperator):

    def __init__(self, kind, name, operands, **kwargs):
        super().__init__(kind, name, operands, **kwargs)
        self.op = fbase('SCALAR_QUERY', None, None, None, None, None)

    def eval_op(self, table, subq_table, get_naidx=True, filter_index=False,
                **kwargs):
        nrows, ncols = subq_table.shape
        if ncols != 1:
            raise Exception(
                'Scalar subquery result supposed to have a single column.')
        if nrows == 1:
            res = subq_table.slice_rows([0])[0]
            naidx = subq_table.get_naval_idx(0)
        elif nrows == 0:
            res = np.array([None])
            naidx = np.array([True])
        else:
            raise Exception(
                'Scalar subquery result supposed to have a single row.')
        return RexReturn(res, subq_table.get_dtype(0), naidx)


class SqlInOperator(SqlOperator):
    def __init__(self, kind, name, operands, **kwargs):
        super().__init__(kind, name, operands, **kwargs)
        self.op = sqlin_operators[self.kind]
        cpkind = kwargs.get('comparisonKind')
        if cpkind is not None:
            self.comparisonkind = binary_operators[cpkind['name']]
        else:
            self.comparisonkind = None

    def eval_op(self, table, subq_table, subq_tb_oprds, get_naidx=True,
                filter_index=False, **kwargs):
        kw_l = {'table': table, 'get_naidx': True,
                'filter_index': False,
                'table_space': kwargs.get('table_space'),
                'corrvar_space': kwargs.get('corrvar_space')}
        kw_r = {'table': subq_table, 'get_naidx': True,
                'filter_index': False,
                'table_space': kwargs.get('table_space'),
                'corrvar_space': kwargs.get('corrvar_space')}
        if self.comparisonkind is None:
            oprd_len = len(self.operands)
            _, func, _, ret_dtype, arr_dtype, fillval = self.op
            if oprd_len == 1:
                left = self.operands[0](**kw_l)
                right = subq_tb_oprds[0](**kw_r)
                naidx = left.naidx
                l_len = left.shape[0]
                lset = left.value
                rset = right.value
            else:  # oprd_len > 1
                l_data = [oprd(**kw_l) for oprd in self.operands]
                l_naidx = [o.naidx for o in l_data]
                l_data = [o.value for o in l_data]
                naidx = np.logical_and(l_naidx[0], l_naidx[1])
                for n in l_naidx[2:]:
                    naidx = np.logical_and(n, naidx)
                l_len = len(l_data[0])
                r_len = subq_table.shape[0]
                subq_table.append_rows(
                    QueryTable(l_data, subq_table.get_field()))
                (grp_idx, _) = subq_table.group_idx(
                    subq_table.get_field_index())
                rset, lset = grp_idx[:r_len], grp_idx[r_len:]

            if np.any(naidx):
                if filter_index:
                    arr_dtype = 'bool'
                    fillval = False
                    naidx = np.full(l_len, False)
                res = np.empty(l_len, dtype=arr_dtype)
                eidx = np.logical_not(naidx)
                res[naidx] = fillval
                res[eidx] = func(lset, rset)
            else:
                res = func(lset, rset)

        else:
            left = self.operands[0](**kw_l)
            right = subq_tb_oprds[0](**kw_r)
            naidx = left.naidx
            oprdlen = left.shape[0]
            _, func, _, ret_dtype, arr_dtype, fillval = self.comparisonkind
            if np.any(naidx):
                if filter_index:
                    arr_dtype = 'bool'
                    fillval = False
                    naidx = np.full(oprdlen, False)
                res = np.empty(oprdlen, dtype=arr_dtype)
                eidx = np.logical_not(naidx)
                ref = right.value[np.logical_not(right.naidx)]
                res[eidx] = [np.any(func(v, ref)) for v in left.value[eidx]]
                res[naidx] = fillval
            else:
                res = np.array([np.any(func(v, right.value))
                                for v in left.value])
        return RexReturn(res, ret_dtype, naidx)


class SqlBinaryOperator(SqlOperator):
    def __init__(self, kind, name, operands, **kwargs):
        super().__init__(kind, name, operands, **kwargs)
        self.op = binary_operators[self.kind]

    def eval_op(self, table, get_naidx=True, filter_index=False,
                table_space=None, corrvar_space=None, **kwargs):
        _kw = {'table': table,
               'get_naidx': get_naidx,
               'filter_index': filter_index,
               'table_space': table_space,
               'corrvar_space': corrvar_space,
               'fdmap': kwargs.get('fdmap'),
               'dtypes': kwargs.get('dtypes')}
        _, func, _, ret_dtype, arr_dtype, fillval = self.op
        left = self.operands[0](**_kw)
        for oprd in self.operands[1:]:
            right = oprd(**_kw)

            if not isinstance(ret_dtype, np.dtype):
                ret_dtype = supertype_of_two(left.dtype, right.dtype)
            naidx = np.logical_or(left.naidx, right.naidx)
            if np.any(naidx):

                oprdlen = max(left.shape[0], right.shape[0])
                if filter_index:
                    arr_dtype = 'bool'
                    fillval = False
                    ret_naidx = np.full(oprdlen, False)
                else:
                    ret_naidx = naidx

                res = np.empty(oprdlen, dtype=arr_dtype)
                eidx = np.logical_not(naidx)
                res[naidx] = fillval
                if left.shape[0] < oprdlen:
                    left.value = np.full(oprdlen, left.value[0])
                if right.shape[0] < oprdlen:
                    right.value = np.full(oprdlen, right.value[0])
                res[eidx] = func(left.value[eidx], right.value[eidx])
            else:
                res = func(left.value, right.value)
                ret_naidx = naidx
            left = RexReturn(res, ret_dtype, ret_naidx)

        return left


class SqlPrefixOperator(SqlOperator):
    def __init__(self, kind, name, operands, **kwargs):
        super().__init__(kind, name, operands, **kwargs)
        self.op = prefix_operators[self.kind]

    def eval_op(self, table, get_naidx=True, filter_index=False, **kwargs):
        _, func, _, ret_dtype, arr_dtype, fillval = self.op
        _kw = {'table': table, 'get_naidx': get_naidx,
               'filter_index': filter_index,
               'table_space': kwargs.get('table_space'),
               'corrvar_space': kwargs.get('corrvar_space')}
        oprd = self.operands[0](**_kw)
        if not isinstance(ret_dtype, np.dtype):
            ret_dtype = oprd.dtype
        if np.any(oprd.naidx):
            eidx = np.logical_not(oprd.naidx)
            res = np.empty(oprd.shape[0], dtype=arr_dtype)
            res[oprd.naidx] = fillval
            res[eidx] = func(oprd.value[eidx])
        else:
            res = func(oprd.value)
        return RexReturn(res, ret_dtype, oprd.naidx)


class SqlPostfixOperator(SqlOperator):
    def __init__(self, kind, name, operands, **kwargs):
        super().__init__(kind, name, operands, **kwargs)
        self.op = postfix_operators[self.kind]

    def eval_op(self, table, get_naidx=True, filter_index=True, **kwargs):
        _, func, _, ret_dtype, _, _ = self.op
        if self.kind in {'IS_NOT_NULL', 'IS_NULL'} and not filter_index:
            raise ValueError('Current usage of ' +
                             self.kind + ' is not understood.')
        _kw = {'table': table, 'get_naidx': get_naidx,
               'filter_index': filter_index,
               'table_space': kwargs.get('table_space'),
               'corrvar_space': kwargs.get('corrvar_space')}
        oprd = self.operands[0](**_kw)
        res = func(oprd.value)
        if self.kind == 'IS_NOT_NULL':
            res = ~res
        naidx = np.full(oprd.shape[0], False)
        return RexReturn(res, ret_dtype, naidx)


class SqlCastFunction(SqlOperator):
    def __init__(self, kind, name, operands, **kwargs):
        super().__init__(kind, name, operands, **kwargs)
        self.op = fbase('CAST', None, None, None, None, None)

    def eval_op(self, table, get_naidx=False, filter_index=False, **kwargs):
        _kw = {'table': table, 'get_naidx': get_naidx,
               'filter_index': filter_index,
               'table_space': kwargs.get('table_space'),
               'corrvar_space': kwargs.get('corrvar_space')}
        if self.kind == 'CAST':
            oprd = self.operands[0]
            nm = oprd.name.split('#')[0]
            if nm == 'RexInputRef' or nm == 'RexFieldAccess':
                # _kw['get_naidx'] = _kw.get('get_naidx', False)
                return oprd(**_kw)
            else:
                raise ValueError('not implemented. operand name: ', oprd.name)
        else:
            raise ValueError('not implemented')


class SqlDefaultOperator(SqlOperator):
    def eval_op(self, **kwargs):
        return RexReturn(default_val, None, None)


class ArrayValueConstructor(SqlOperator):
    def _set_func(self):
        pass

    def eval_op(self, **kwargs):
        elem = [oprd().value for oprd in self.operands]
        return RexReturn(np.array(elem), infer_dtype(elem), None)


class SqlFunction(SqlOperator):
    def __init__(self, kind, name, operands, sqlfunction_category, **kwargs):
        self.sqlfunction_category = sqlfunction_category
        super().__init__(kind, name, operands, **kwargs)
        if self.sqlfunction_category == 'NUMERIC':
            if name == 'RAND' and len(operands) == 0:
                self.op = fbase('RAND', np.random.random, 'zero', np.dtype(
                    'float64'), 'float64', np.nan)
            elif name == "TRUNCATE" and len(operands) == 1:
                self.op = fbase('TRUNCATE', _truncate, 'one',
                                np.dtype('float64'), 'float64', np.nan)
            else:
                self.op = numeric_functions[self.name]
        elif self.sqlfunction_category == 'STRING':
            self.op = string_functions[self.name]
        elif self.sqlfunction_category == 'USER_DEFINED_FUNCTION':
            self.op = userdefined_functions[self.name]
        else:
            raise ValueError('not implemented')

    def eval_op(self, table, filter_index=False, **kwargs):
        if self.sqlfunction_category == 'NUMERIC':
            fexp, func, nargs, ret_dtype, arr_dtype, fillval = self.op
            if nargs == 'one':
                _kw = {'table': table, 'get_naidx': True,
                       'filter_index': filter_index,
                       'table_space': kwargs.get('table_space'),
                       'corrvar_space': kwargs.get('corrvar_space')}
                oprd = self.operands[0](**_kw)
                if not isinstance(ret_dtype, np.dtype):
                    ret_dtype = oprd.dtype
                if np.any(oprd.naidx):
                    eidx = np.logical_not(oprd.naidx)
                    res = np.empty(oprd.shape[0], dtype=arr_dtype)
                    res[oprd.naidx] = fillval
                    res[eidx] = func(oprd.value[eidx])
                else:
                    res = func(oprd.value)
                return RexReturn(res, ret_dtype, oprd.naidx)
            elif nargs == 'two':
                _kw = {'table': table, 'get_naidx': True,
                       'filter_index': filter_index,
                       'table_space': kwargs.get('table_space'),
                       'corrvar_space': kwargs.get('corrvar_space')}
                oprd0 = self.operands[0](**_kw)
                oprd1 = self.operands[1](**_kw)
                naidx = np.logical_or(oprd0.naidx, oprd1.naidx)

                if np.any(naidx):
                    oprdlen = max(oprd0.shape[0], oprd1.shape[1])
                    res = np.empty(oprdlen, dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[eidx] = fillval

                    if oprd0.shape[0] < oprdlen:
                        oprd0.value = np.full(oprdlen, oprd0.value[0])
                    if oprd1.shape[1] < oprdlen:
                        oprd1.value = np.full(oprdlen, oprd1.value[0])

                    res[eidx] = func(oprd0.value[eidx], oprd1.value[eidx])
                else:
                    if fexp == 'ROUND':
                        oprd1.value = oprd1.value[0]
                    res = func(oprd0.value, oprd1.value)
                return RexReturn(res, ret_dtype, naidx)
            elif nargs == 'zero':
                res = func()
                if not isinstance(res, np.ndarray):
                    res = np.array([res])
                return RexReturn(res, ret_dtype, np.array([False]))
            elif nargs == 'const':
                res = np.array([func])
                return RexReturn(res, ret_dtype, np.array([False]))
            elif self.name == 'POSITION':
                _kw = {'table': table,
                       'get_naidx': True,
                       'filter_index': filter_index,
                       'table_space': kwargs.get('table_space'),
                       'corrvar_space': kwargs.get('corrvar_space')}
                subs = self.operands[0](**_kw).value
                arg = self.operands[1](**_kw)
                if len(self.operands) == 3:
                    start = self.operands[2](**_kw).value
                else:
                    start = None
                naidx = arg.naidx
                if np.any(naidx):
                    res = np.empty(arg.shape[0], dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[naidx] = fillval
                    res[eidx] = func(subs, arg.value[eidx], start)
                else:
                    res = func(subs, arg.value, start)
                return RexReturn(res, ret_dtype, naidx)

        elif self.sqlfunction_category == 'STRING':
            _kw = {'table': table,
                   'get_naidx': True,
                   'filter_index': False,
                   'table_space': kwargs.get('table_space'),
                   'corrvar_space': kwargs.get('corrvar_space')}
            _, func, nargs, ret_dtype, arr_dtype, fillval = self.op
            if nargs == 'one':
                oprd = self.operands[0](**_kw)
                if not isinstance(ret_dtype, np.dtype):
                    ret_dtype = oprd.dtype
                if np.any(oprd.naidx):
                    eidx = np.logical_not(oprd.naidx)
                    res = np.empty(oprd.shape[0], dtype=arr_dtype)
                    res[oprd.naidx] = fillval
                    res[eidx] = func(oprd.value[eidx])
                else:
                    res = func(oprd.value)
                    if isinstance(res, str):
                        res = np.array([res])
                return RexReturn(res, ret_dtype, oprd.naidx)
            elif nargs == 'two':
                left = self.operands[0](**_kw)
                right = self.operands[1](**_kw)
                naidx = np.logical_or(left.naidx, right.naidx)
                if np.any(naidx):
                    oprdlen = max(left.shape[0], right.shape[0])
                    if filter_index:
                        arr_dtype = 'bool'
                        fillval = False
                        ret_naidx = np.full(oprdlen, False)
                    else:
                        ret_naidx = naidx

                    res = np.empty(oprdlen, dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[naidx] = fillval
                    if left.shape[0] < oprdlen:
                        left.value = np.full(oprdlen, left.value[0])
                    if right.shape[0] < oprdlen:
                        right.value = np.full(oprdlen, right.value[0])
                    res[eidx] = func(left.value[eidx], right.value[eidx])
                else:
                    res = func(left.value, right.value)
                    ret_naidx = naidx
                return RexReturn(res, ret_dtype, ret_naidx)
            elif self.kind == 'TRIM':
                flag = self.operands[0](**_kw).value
                ref = self.operands[1](**_kw).value
                arg = self.operands[2](**_kw)
                naidx = arg.naidx
                if np.any(naidx):
                    res = np.empty(arg.shape[0], dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[naidx] = fillval
                    res[eidx] = func(flag, ref, arg.value[eidx])
                else:
                    res = func(flag, ref, arg.value)
                return RexReturn(res, ret_dtype, naidx)
            elif self.name == 'REPLACE':
                arg = self.operands[0](**_kw)
                target = self.operands[1](**_kw).value
                rep = self.operands[2](**_kw).value
                naidx = arg.naidx
                if np.any(naidx):
                    res = np.empty(arg.shape[0], dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[naidx] = fillval
                    res[eidx] = func(arg.value[eidx], target, rep)
                else:
                    res = func(arg.value, target, rep)
                return RexReturn(res, ret_dtype, naidx)
            elif self.name == 'OVERLAY':
                arg = self.operands[0](**_kw).value
                rep = self.operands[1](**_kw).value
                pos = self.operands[2](**_kw).value
                if len(self.operands) == 4:
                    nchar = self.operands[3](**_kw).value
                else:
                    nchar = None
                res = func(arg, rep, pos, nchar)
                return RexReturn(res, ret_dtype, np.array([False]))
            elif self.name == 'SUBSTRING':
                arg = self.operands[0](**_kw)
                start = self.operands[1](**_kw).value
                take = self.operands[2](**_kw).value
                naidx = arg.naidx
                if np.any(naidx):
                    res = np.empty(arg.shape[0], dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[naidx] = fillval
                    res[eidx] = func(arg.value[eidx], start, take)
                else:
                    res = func(arg.value, start, take)
                return RexReturn(res, ret_dtype, naidx)

        elif self.sqlfunction_category == 'USER_DEFINED_FUNCTION':
            return self.op(table, **self.operands)

        else:
            raise ValueError('Not implemented.')


sqlOperators = {'SqlBinaryOperator': SqlBinaryOperator,
                'SqlPrefixOperator': SqlPrefixOperator,
                'SqlPostfixOperator': SqlPostfixOperator,
                'SqlCastFunction': SqlCastFunction,
                'SqlDefaultOperator': SqlDefaultOperator,
                'SqlFunction': SqlFunction,
                'ARRAY_VALUE_CONSTRUCTOR': ArrayValueConstructor,
                'SCALAR_QUERY': ScalarQuery,
                'SqlInOperator': SqlInOperator,
                'SqlQuantifyOperator': SqlInOperator}
