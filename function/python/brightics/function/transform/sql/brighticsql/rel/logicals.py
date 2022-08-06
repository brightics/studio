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

from brighticsql.base import RelNode, CorrvarSpace
from brighticsql.tableclass import NullTable, QueryTable, ModelOutput
from brighticsql.utils.grouping import sort_indexer
from brighticsql.utils.random import gen_colname
from brighticsql.fieldgenerator import make_projectfield

__all__ = ['LogicalTableScan',
           'LogicalValues',
           'LogicalUnion',
           'LogicalSort',
           'LogicalProject',
           'LogicalFilter',
           'LogicalAggregate',
           'LogicalJoin']


class LogicalTableScan(RelNode):

    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.table = kwargs.pop('table')
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)

    def __repr__(self):
        return f'{self.enum_name}(table=[[{self.table.schema}, {self.table.table}]])'

    def __call__(self, table_space, corrvar_space, **kwargs):
        if self.table.table in {'ml', 'stats'}:
            table = NullTable()
        else:
            table = QueryTable(table_space.get_input_df(self.table.table))
        table_space.add(self.enum_name, table)


class LogicalValues(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.tuples = kwargs.pop('tuples')
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)

    def __repr__(self):
        valuestr = '(tuples=[[{{' + self.tuples[0][0].value + '}}]]'
        return self.enum_name + valuestr

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        value = self.tuples[0][0].value
        table = QueryTable([np.array([value])], [str(value)])
        table_space.add(self.enum_name, table)


class LogicalUnion(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.all = kwargs.pop('all')
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)

    def __repr__(self):
        return f'{self.enum_name}(all=[{self.all}])'

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        top, bottom = self.inputs
        top(table_space, corrvar_space)
        top = table_space.pop(top.enum_name)
        bottom(table_space, corrvar_space)
        bottom = table_space.pop(bottom.enum_name)
        top.append(bottom)
        if not self.all:
            top.drop_duplicates()
        table_space.add(self.enum_name, top)


class LogicalSort(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.collation = kwargs.pop('collation')
        self.fetch = kwargs.pop('fetch', None)
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)

    def __repr__(self):
        s = []
        if self.fetch is not None:
            s.append(f'fetch=[{",".join([str(self.fetch)])}]')
        if self.collation.fieldCollations:
            g = zip(range(len(self.collation.fieldCollations)),
                    self.collation.fieldCollations)
            lst = []
            for i, fc in g:
                _s = f'[${fc.field_index}-{fc.null_direction}-{fc.direction}]'
                lst.append(f'sort{i}=' + _s)
            s.append(', '.join(lst))
        return f'{self.enum_name}({", ".join(s)})'

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        self.inputs[0](table_space=table_space, corrvar_space=corrvar_space)
        table = table_space.pop(self.inputs[0].enum_name)
        if self.collation.fieldCollations:
            fis, nds, ds = [], [], []
            for fc in self.collation.fieldCollations:
                fis.append(fc.field_index)
                nds.append(fc.null_direction)
                ds.append(fc.direction)
            cols = [table.slice_col(i) for i in fis]
            indexer = sort_indexer(cols, ds, nds)
            table = table.slice_rows(indexer, totable=True)
        if self.fetch is not None:
            if self.fetch.rex_typename == 'RexLiteral':
                nrows = min(self.fetch().value[0], table.shape[0])
                table = table.slice_rows(np.arange(nrows), totable=True)
        table_space.add(self.enum_name, table)


class LogicalProject(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.exps = kwargs.pop('exps')
        self.exps_has_subq = []
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)
        for i in self.inputs:
            self._cid.update(i.correlation_id)
        for e in self.exps:
            self._cid.update(e.correlation_id)

    def __repr__(self):
        s = [f'{fd.name}=[{e}]' for fd, e in zip(self.field, self.exps)]
        return f'{self.enum_name}({", ".join(s)})'

    @property
    def is_model_result(self):
        if len(self.exps) == 1:
            exp = self.exps[0]
            if exp.rex_typename == 'RexCall':
                name = exp.operator.name
                if name in {'MLTRAIN', 'STATS'}:
                    return True
        return False

    def is_trivial_project(self, input_field):
        """Returns: is_trivial_project, update_newfield"""
        if len(self.exps) == 1:
            exp = self.exps[0]
            if exp.name.split('#')[0] == 'RexLiteral':
                if exp().value == 0:
                    return True, False
        if len(input_field) == len(self.exps):
            from_rex = (exp.index if exp.rex_typename == 'RexInputRef' else -1
                        for exp in self.exps)

            if all(a == b for a, b in zip(from_rex, range(len(self.exps)))):
                return True, True
        return False, False

    def gen_field(self, input_field):
        it_fd = iter(fd.name for fd in self.field)
        for exp in self.exps:
            fname = next(it_fd)
            if (fname.lower().startswith('expr$')
                    or fname.lower().startswith('$f')):
                yield make_projectfield(exp, input_field)
            else:
                yield fname

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        self.inputs[0](table_space=table_space, corrvar_space=corrvar_space)
        table = table_space.pop(self.inputs[0].enum_name)
        res_dlen = table.shape[0]
        input_field = table.fields
        trivial_project, new_field = self.is_trivial_project(input_field)
        if self.is_model_result:
            table_space.add(self.enum_name, ModelOutput(
                self.exps[0](**{'table': table.toDataFrame()})))
            return

        if trivial_project:
            if new_field:
                new_fd = list(self.gen_field(input_field))
                table.fields = new_fd
            table_space.add(self.enum_name, table)
        else:
            # TODO current routine for subquery execution is messy.
            #  We need to rewrite this.
            if self.has_subquery:
                _data = []
                for ehs, e in zip(self.exps_has_subq, self.exps):
                    if ehs in {'N', 'S'}:
                        value = e(**{'table': table,
                                     'table_space': table_space,
                                     'corrvar_space': corrvar_space}).value
                    elif ehs == 'C':
                        cnames = list(e.correlation_id)
                        cvspace = CorrvarSpace()
                        for cnm in cnames:
                            cvspace.add_fimap(cnm, table.fields_to_index_map())
                            cvspace.add_dtmap(cnm, table.get_dtypes())
                        _kw = {'table': table,
                               'table_space': table_space,
                               'filter_index': True,
                               'corrvar_space': cvspace}

                        len_cnms = len(cnames)
                        if len_cnms == 1:
                            cnm = cnames[0]
                            g = table.rowiter()

                            def f():
                                for item in g:
                                    cvspace.space[cnm] = item
                                    yield e(**_kw).value

                        else:
                            g = table.rowiter()

                            def f():
                                for item in g:
                                    for cname in cnames:
                                        cvspace.space[cname] = item
                                    yield e(**_kw).value

                        value = np.array(list(f()))
                        value = value.reshape(len(value))
                    else:
                        raise ValueError('Should not reach here.')
                    _data.append(value)
            else:
                _kw = {'table': table, 'table_space': table_space,
                       'corrvar_space': corrvar_space}
                _data = [exp(**_kw).value for exp in self.exps]
            fields = list(self.gen_field(input_field))
            _data = [d if len(d) == res_dlen else np.array(
                [d[0]] * res_dlen) for d in _data]
            table_space.add(self.enum_name, QueryTable(_data, fields))


class LogicalFilter(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.condition = kwargs.pop('condition')
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)
        self._cid.update(self.condition.correlation_id)
        # if self.condition.has_subquery:
        #     self.has_subquery = True

    def __repr__(self):
        s = f'condition=[{self.condition}]'
        if self.variableset:
            s += f', variableSet=[{self.variableset}]'
        return f'{self.enum_name}({s})'

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        self.inputs[0](table_space=table_space, corrvar_space=corrvar_space)
        table = table_space.pop(self.inputs[0].enum_name)
        if self.has_corr_subquery:
            cnames = list(self.correlation_id)
            # Assume len(cnames) == 1
            g = table.rowiter()
            cvspace = CorrvarSpace()
            for c in cnames:
                cvspace.add_fimap(c, table.fields_to_index_map())
                cvspace.add_dtmap(c, table.get_dtypes())
            _kw = {'table': table,
                   'table_space': table_space,
                   'filter_index': True,
                   'corrvar_space': cvspace}

            def f():
                for item in g:
                    for cnm in cnames:
                        cvspace.space[cnm] = item
                    bool_index = self.condition(**_kw).value
                    yield bool_index

            bool_idx = np.array(list(f()))
            bool_idx = bool_idx.reshape(len(bool_idx))
        # elif self.has_subquery:
        #     _kw = {'table': table,
        #            'table_space': table_space,
        #            'corrvar_space': corrvar_space,
        #            'filter_index': True}
        #     bool_idx, _, _ = self.condition(**_kw)
        # if bool_idx.shape[0] == 1 and table.shape[0] > 1:
        #     bool_idx = np.array([bool_idx[0]]*table.shape[0])
        else:
            _kw = {'table': table,
                   'table_space': table_space,
                   'corrvar_space': corrvar_space,
                   'filter_index': True}
            bool_idx = self.condition(**_kw).value
            if bool_idx.shape[0] == 1 and table.shape[0] > 1:
                bool_idx = np.array([bool_idx[0]] * table.shape[0])
        filtered = table.slice_rows(bool_idx, totable=True)
        table_space.add(self.enum_name, filtered)


class LogicalAggregate(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.groupset = kwargs.pop('groupset')
        self.aggcalls = kwargs.pop('aggcalls')
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)

    def __repr__(self):
        s = ['group=[{{' + ", ".join([str(i) for i in self.groupset]) + '}}]']
        if self.aggcalls:
            for f, a in zip(self.field, self.aggcalls):
                s.append(f'{f.name}=[{a}]')
        return f'{self.enum_name}({", ".join(s)})'

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        self.inputs[0](table_space=table_space, corrvar_space=corrvar_space)
        table = table_space.pop(self.inputs[0].enum_name)
        agg_fields = list(self.gen_field(table.fields))

        if self.groupset and not self.aggcalls:
            res = QueryTable(table.group(self.groupset), agg_fields)
        elif not self.groupset and self.aggcalls:
            def g():
                for agg in self.aggcalls:
                    index = agg.arglist[0] if agg.arglist else 0
                    yield agg(table.slice_col(index), table.get_dtypes(index))

            agg_res, agg_dtypes = map(list, zip(*g()))
            res = QueryTable(agg_res, agg_fields, agg_dtypes)
        elif self.groupset and self.aggcalls:
            grp_idx, grp_lst = table.group_index(self.groupset, False)
            l1 = []
            for idx in self.groupset:
                arg = table.slice_col(idx)
                l1.append(np.array([arg[g == grp_idx][0] for g in grp_lst]))
            l2 = []
            for aggcall in self.aggcalls:
                idx = aggcall.arglist[0] if aggcall.arglist else 0
                arg = table.slice_col(idx)
                dt = table.get_dtypes(idx)
                l2.append(np.array([
                    aggcall(arg[g == grp_idx], dt).value[0] for g in grp_lst]))
            res = QueryTable(l1 + l2, agg_fields)
        else:
            raise NotImplementedError('Code should not be reached.')
        table_space.add(self.enum_name, res)

    def gen_field(self, input_field):
        it_grpset = iter(self.groupset)
        it_aggcalls = iter(self.aggcalls)

        for fd in self.field:
            try:
                colid = next(it_grpset)
                yield input_field[colid]
            except StopIteration:
                agg = next(it_aggcalls)
                # we don't need try-except here since
                #   len(field) = len(group)+len(it_aggcalls)
                if fd.name.lower().startswith('expr$'):
                    if not agg.arglist:
                        if agg.aggfunc == 'SIZE':
                            aggarg = '*'
                        else:
                            raise Exception('Unimplemented aggregate function')
                    else:
                        aggarg = input_field[agg.arglist[0]]

                    _fd = [agg.func.fexp.lower(), '(']
                    if agg.distinct:
                        _fd.append('distinct ')
                    _fd.append(aggarg)
                    _fd.append(')')
                    yield ''.join(_fd)
                else:
                    yield fd.name


class LogicalJoin(RelNode):
    def __init__(self, rel_typename, _id, inputs, field, variableSet, **kwargs):
        self.condition = kwargs.pop('condition')
        self.jointype = kwargs.pop('jointype')
        super().__init__(rel_typename, _id, inputs, field, variableSet,
                         **kwargs)
        if self.condition.has_subquery:
            self.has_subquery = True

    def __repr__(self):
        condstr = f'(condition=[{self.condition}], joinType=[{self.jointype}])'
        return self.enum_name + condstr

    @property
    def is_crossjoin(self):
        if self.jointype == 'INNER':
            if self.condition.rex_typename == 'RexLiteral':
                if self.condition.value is True:
                    return True
        return False

    @staticmethod
    def _crossjoin(left, right, field):
        idx_left, idx_right = np.broadcast_arrays(
            *np.ogrid[:left.shape[0], :right.shape[0]])
        new_dtypes = left.get_dtypes() + right.get_dtypes()
        if left.dstruct == pd.DataFrame:
            left = left.data.values[idx_left.ravel()]
        else:
            left.to_ndarray()
            left = left.data[idx_left.ravel()]
        if right.dstruct == pd.DataFrame:
            right = right.data.values[idx_right.ravel()]
        else:
            right.to_ndarray()
            right = right.data[idx_right.ravel()]
        return QueryTable(np.column_stack([left, right]), field, new_dtypes)

    @property
    def is_simple_cond(self):
        cond = self.condition
        if cond.rex_typename == 'RexCall':
            if cond.operator.kind == 'EQUALS':
                oprd0, oprd1 = cond.operator.operands
                if oprd0.rex_typename == oprd1.rex_typename == 'RexInputRef':
                    return [oprd0.index, oprd1.index]
        return False

    @staticmethod
    def _simple_eqcond_join(left, right, fields, jointype, simple_colref):
        tmp_fields = list(gen_colname(25, left.shape[1] + right.shape[1]))
        left_on = tmp_fields[simple_colref[0]]
        right_on = tmp_fields[simple_colref[1]]
        left = left.toDataFrame()
        right = right.toDataFrame()
        if left is right:
            right = left.copy()
        left.columns = tmp_fields[0:left.shape[1]]
        right.columns = tmp_fields[left.shape[1]:]
        if jointype == 'INNER' or jointype == 'LEFT':
            merged = left.merge(
                right.dropna(subset=[right_on]),
                left_on=left_on,
                right_on=right_on,
                how=jointype.lower())
        elif jointype == 'RIGHT':
            merged = left.dropna(subset=[left_on]).merge(
                right,
                left_on=left_on,
                right_on=right_on,
                how='right')
        elif jointype == 'FULL':
            _lset = left.merge(
                right.dropna(subset=[right_on]),
                left_on=left_on,
                right_on=right_on,
                how='left')
            _rset = left.dropna(subset=[left_on]).merge(
                right,
                left_on=left_on,
                right_on=right_on,
                how='right')
            if _lset.shape[0] < _rset.shape[0]:
                _lset = _lset.loc[pd.isnull(_lset[right_on].values)]
            else:
                _rset = _rset.loc[pd.isnull(_rset[left_on].values)]
            merged = pd.concat([_lset, _rset])
        else:
            raise ValueError('unknown jointype')
        merged.columns = [fd.name for fd in fields]
        return QueryTable(merged)

    @staticmethod
    def _conditional_join(left, right, field, jointype, condition):
        # TODO Need to improve this method.
        #  this method is memory inefficient
        #  currently supports inner join only
        if jointype == 'INNER':
            _table = LogicalJoin._crossjoin(left, right, field)
            fields_joined = _table.fields
            _table = _table.toDataFrame()
            condition_exp = make_projectfield(condition, fields_joined)
            return QueryTable(_table.query(condition_exp))
        else:
            raise NotImplementedError('Unsupported join condition')

    def __call__(self, table_space, corrvar_space, *args, **kwargs):
        self.inputs[0](table_space=table_space, corrvar_space=corrvar_space)
        self.inputs[1](table_space=table_space, corrvar_space=corrvar_space)
        left = table_space.pop(self.inputs[0].enum_name)
        right = table_space.pop(self.inputs[1].enum_name)
        field = self.field
        jointype = self.jointype

        if self.is_crossjoin:
            if isinstance(left, NullTable):
                joined = right
            elif isinstance(right, NullTable):
                joined = left
            else:
                joined = LogicalJoin._crossjoin(
                    left, right, [fd.name for fd in self.field])
        else:
            # Check if the condition is colref1 == colref2
            # We don't need this case if we have better join method
            # that works for arbitrary join conditon
            simple_colref = self.is_simple_cond
            if simple_colref:
                joined = LogicalJoin._simple_eqcond_join(
                    left, right, field, jointype, simple_colref)
            else:
                joined = LogicalJoin._conditional_join(
                    left, right, [fd.name for fd in field], jointype,
                    self.condition)
        table_space.add(self.enum_name, joined)
