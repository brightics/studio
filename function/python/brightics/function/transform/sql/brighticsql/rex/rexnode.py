import numpy as np

from pandas.core.dtypes.missing import isna
from brighticsql.base import (RexNodeABC, RexReturn)
from brighticsql.tableclass import QueryTable

__all__ = ['RexCall',
           'RexInputRef',
           'RexLiteral',
           'RexSubQuery',
           'RexCorrelVariable',
           'RexFieldAccess'
           ]


class RexInputRef(RexNodeABC):
    def __init__(self, index, **kwargs):
        super().__init__(**kwargs)
        self.index = index

    def __repr__(self):
        return '$' + str(self.index)

    def eval_rex(self, table=None, get_naidx=False, get_index=False, **kwargs):
        if get_index:
            return self.index
        naidx = table.get_naval_index(self.index) if get_naidx else None
        _col = table.slice_col(self.index)
        _dt = table.get_dtypes(self.index)
        return RexReturn(_col, _dt, naidx)


class RexLiteral(RexNodeABC):
    def __init__(self, value, value_instance, **kwargs):
        super().__init__(**kwargs)
        self.value = value
        self.value_instance = value_instance

    def __repr__(self):
        return str(self.value)

    def eval_rex(self, get_naidx=False, **kwargs):
        value = self.value
        naidx = np.array([isna(value)]) if get_naidx else None

        if self.value_instance == 'BigDecimal':
            value = float(value)
            if value.is_integer():
                value = np.array([int(value)])
                ret_dtype = np.dtype('int64')
            else:
                value = np.array([value])
                ret_dtype = np.dtype('float64')
        elif self.value_instance == 'NlsString':
            ret_dtype = np.dtype(str)
            value = np.array([value])
        elif self.value_instance == 'Boolean':
            ret_dtype = np.dtype(bool)
            value = np.array([value])
        elif self.value_instance == 'SqlTrimFunction$Flag':
            ret_dtype = np.dtype(str)
            value = np.array([value])
        else:
            raise ValueError('UnImplemented rexLiteral Type')
        return RexReturn(value, ret_dtype, naidx)


class RexCall(RexNodeABC):
    def __init__(self, operator, **kwargs):
        super().__init__(**kwargs)
        self.operator = operator
        self._cid.update(self.operator.correlation_id)

    def __repr__(self):
        return str(self.operator)

    def eval_rex(self, **kwargs):
        kwargs['get_naidx'] = kwargs.get('get_naidx', True)
        kwargs['filter_index'] = kwargs.get('filter_index', False)
        return self.operator(**kwargs)


class RexCorrelVariable(RexNodeABC):
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.corr_name = name
        self._cid = {self.corr_name}

    def __repr__(self):
        return self.corr_name

    def eval_rex(self, corrvar_space, **kwargs):
        return corrvar_space[self.corr_name]


class RexFieldAccess(RexNodeABC):
    def __init__(self, field, expr, **kwargs):
        super().__init__(**kwargs)
        self.field = field.upper()
        self.expr = expr
        self.field_idx = None  # To raise an IndexError on the first call
        self.field_dtype = None
        self.corrv = None
        self._cid.update(self.expr.correlation_id)

    def __repr__(self):
        return f'{self.expr}.{self.field}'

    def eval_rex(self, table_space, corrvar_space, **kwargs):
        try:
            _val = corrvar_space.getval(self.expr, self.field_idx)
        except Exception:  # TODO specify Exception if needed.
            self.expr = self.expr.corr_name
            self.field_idx = corrvar_space.field_to_index(
                self.expr, self.field)
            self.field_dtype = corrvar_space.getdtype(
                self.expr, self.field_idx)
            _val = corrvar_space.getval(self.expr, self.field_idx)
        _naidx = np.array([isna(_val)])
        return RexReturn(np.array([_val]), self.field_dtype, _naidx)


class RexSubQuery(RexCall):
    def __init__(self, operator, rel, **kwargs):
        super().__init__(operator, **kwargs)
        self.rel = rel
        self._cid.update(self.rel.correlation_id)
        if self._cid:
            self.has_corr_subquery = True
        else:
            self.has_corr_subquery = False

    def __repr__(self):
        s_rel = self.get_ep()
        if self.operator.kind == 'IN' and len(self.operator.operands) == 1:
            s = 'IN(' + \
                str(self.operator.operands[0]) + ',\n{' + s_rel + '})'
            return s
        elif self.operator.kind == 'SCALAR_QUERY':
            return '$SCALAR_QUERY({\n' + str(s_rel) + '\n})'
        elif self.operator.kind == 'EXISTS' and not self.operator.operands:
            s = 'EXISTS' + '({\n' + str(s_rel) + '\n})'
            return s
        else:
            return super().__repr__()

    def get_ep(self):
        def _print_rel(root, level, _lst):
            h = '  ' * level
            _lst.append(h + str(root))
            for r in root.inputs:
                _print_rel(r, level + 1, _lst)

        lst = []
        _print_rel(self.rel, 0, lst)
        return '\n'.join(lst)

    def eval_rex(self, table, table_space, corrvar_space, **kwargs):
        self.rel(table_space=table_space,
                 corrvar_space=corrvar_space, **kwargs)
        subq_table = table_space.pop(self.rel.enum_name)
        kind = self.operator.kind
        if kind in {'IN', 'SOME'}:
            kw_l = {'table': table, 'get_naidx': True,
                    'filter_index': False,
                    'table_space': kwargs.get('table_space'),
                    'corrvar_space': kwargs.get('corrvar_space')}
            operands = self.operator.operands
            # print(operands)
            ret_dtype = np.dtype('bool')
            arr_dtype = np.dtype('bool')
            fillval = False
            comparisonkind = self.operator.comparisonkind
            if comparisonkind is None:
                _, func, _, _, _, _ = self.operator.op
                if len(operands) == 1:
                    left = operands[0](**kw_l)
                    naidx = left.naidx
                    lset = left.value
                    rset = subq_table.slice_col(0)
                    l_len = 1
                else:
                    l_data = [oprd(**kw_l) for oprd in operands]
                    l_naidx = [o.naidx for o in l_data]
                    l_data = [o.value for o in l_data]
                    naidx = np.logical_and(l_naidx[0], l_naidx[1])
                    for n in l_naidx[2:]:
                        naidx = np.logical_and(n, naidx)
                    l_len = len(l_data[0])
                    r_len = subq_table.shape[0]
                    subq_table.append(QueryTable(l_data, subq_table.fields))
                    (grp_idx, _) = subq_table.group_index()
                    rset, lset = grp_idx[:r_len], grp_idx[r_len:]

                if np.any(naidx):
                    res = np.empty(l_len, dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    res[naidx] = fillval
                    res[eidx] = func(lset, rset)
                else:
                    res = func(lset, rset)
            else:
                left = operands[0](**kw_l)
                right = subq_table.slice_col(0)
                naidx = left.naidx
                oprdlen = left.value.shape[0]
                _, func, _, _, arr_dtype, fillval = comparisonkind
                if np.any(naidx):
                    res = np.empty(oprdlen, dtype=arr_dtype)
                    eidx = np.logical_not(naidx)
                    ref = right.value[np.logical_not(right.naidx)]
                    res[eidx] = [np.any(func(v, ref))
                                 for v in left.value[eidx]]
                    res[naidx] = fillval
                else:
                    res = np.array([np.any(func(v, right))
                                    for v in left.value])
            return RexReturn(res, ret_dtype, naidx)

        elif kind == 'SCALAR_QUERY':
            nrows, ncols = subq_table.shape
            if ncols != 1:
                raise Exception(
                    'Scalar subquery result supposed to have a single column.')
            if nrows == 1:
                res = subq_table.slice_rows([0])[0]
                naidx = subq_table.get_naval_index(0)
            elif nrows == 0:
                res = np.array([None])
                naidx = np.array([True])
            else:
                raise Exception(
                    'Scalar subquery result supposed to have a single row.')
            return RexReturn(res, subq_table.get_dtypes(0), naidx)

        elif kind == 'EXISTS':
            naidx = np.array([False])
            ret_dtype = np.dtype('bool')
            if subq_table.shape[0] > 0:
                res = np.array([True])
            else:
                res = np.array([False])
            return RexReturn(res, ret_dtype, naidx)
