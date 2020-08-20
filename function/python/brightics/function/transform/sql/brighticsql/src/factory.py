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


from collections import namedtuple

from .rex.rexnode import (RexCall, RexInputRef, RexLiteral, RexSubQuery,
                             RexCorrelVariable, RexFieldAccess)
from .rex.operator import sqlOperators
from .rel.logicals import *
from .rel.aggregatecall import AggregateCall
from .enums import Rex, Rel, RelItem, RexItem

# switch_rex = dict((r.name, globals()[r.name]) for r in Rex)
switch_rel = dict((r.name, globals()[r.name]) for r in Rel)
# switch_rel = {
#     Rel.LogicalTableScan: LogicalTableScan,
#     Rel.LogicalValues: LogicalValues,
#     Rel.LogicalUnion: LogicalUnion,
#     Rel.LogicalSort: LogicalSort,
#     Rel.LogicalProject: LogicalProject,
#     Rel.LogicalFilter: LogicalFilter,
#     Rel.LogicalAggregate: LogicalAggregate,
#     Rel.LogicalJoin: LogicalJoin
# }

RelDatatypeField = namedtuple('Field', 'name type')
Table = namedtuple('Table', 'schema table')
RelFieldCollation = namedtuple(
    'RelFieldCollation', 'field_index null_direction direction')
Collation = namedtuple('Collation', 'fieldCollations')


class factory:

    @staticmethod
    def makeitem(k, v):
        # items in relnode
        if k == RelItem.fieldList:
            return [RelDatatypeField(it['left'], it['right']) for it in v]
        if k == RelItem.variableSet:
            return v
        if k == RelItem.inputs:
            return [factory.make_relnode(it) for it in v]
        if k == RelItem.table:
            return Table(v[0]['right'], v[1]['right'])
        if k == RelItem.exps:
            return [factory.make_rexnode(it) for it in v]
        if k == RelItem.groupset:
            return v
        if k == RelItem.aggcalls:
            return [AggregateCall(d['arglist'], d.get('distinct', False),
                                  d['aggfunc']) for d in v]
        if k == RelItem.fetch:
            return factory.make_rexnode(v)
        if k == RelItem.collation:
            fcs = v.get('fieldCollations', None)
            if fcs is not None:
                fcs = [RelFieldCollation(**it) for it in fcs]
            else:
                fcs = []
            return Collation(fcs)
        if k == RelItem.tuples:
            return [[factory.make_rexnode(t) for t in v[0]]]

        # items in rexnode
        if k == RexItem.operator:
            return factory.make_sqloperator(v)
        if k == RexItem.operands:
            return [factory.make_rexnode(it) for it in v]

        if isinstance(v, dict):
            node_type = v.get('node_type', None)
            if node_type is None:
                return v
            elif node_type == 'rexNode':
                return factory.make_rexnode(v)
            elif node_type == 'relNode':
                return factory.make_relnode(v)
        if isinstance(v, str) or isinstance(v, int) or isinstance(v, float):
            return v
        else:
            print("++", k, v)
            raise Exception('code should not be reached.')

    @staticmethod
    def make_rexnode(root):
        if root is None:
            return None
        try:
            rextype = root['rex_typename']
        except KeyError:
            raise NotImplementedError('Unimplemented rexnode type.')
        if rextype == Rex.RexLiteral:
            return RexLiteral(root['value'], root['value_instance'])
        if rextype == Rex.RexCall:
            oprds = factory.makeitem('operands', root['operands'])
            return RexCall(factory.make_sqloperator(root['operator'], oprds))
        if rextype == Rex.RexSubQuery:
            oprds = factory.makeitem('operands', root['operands'])
            rel = factory.make_relnode(root.pop('rel'))
            return RexSubQuery(
                factory.make_sqloperator(root['operator'], oprds), rel)
        if rextype == Rex.RexInputRef:
            return RexInputRef(root['index'])
        if rextype == Rex.RexCorrelVariable:
            return RexCorrelVariable(root['name'])
        if rextype == Rex.RexFieldAccess:
            expr = factory.make_rexnode(root['expr'])
            return RexFieldAccess(root['field'], expr)

    @ staticmethod
    def make_relnode(root):
        try:
            reltype = root.pop('rel_typename')
        except KeyError:
            raise NotImplementedError('Unimplemented relnode type.')
        for k, v in root.items():
            root[k] = factory.makeitem(k, v)
        return switch_rel[reltype](
            reltype, root.pop('id'), root.pop('inputs'),
            root.pop('fieldList'), root.pop('variableSet'), **root)

    def make_relroot(self, relroot_json):
        relroot = factory.make_relnode(relroot_json)
        factory.set_correlation_option(relroot)
        return relroot

    @ staticmethod
    def make_sqloperator(operator, operands):
        _instance = operator.pop('instance')
        kind = operator.pop('kind')
        name = operator.pop('name')
        sqlop = sqlOperators[_instance]
        if kind == 'OTHER' and name == '||':
            kind = 'CONCAT'
        if name == 'SQRT':
            operands = [operands[0]]
        if _instance == 'SqlFunction':
            category = operator['sqlfunction_category']
            return sqlop(kind, name, operands, category)
        else:
            return sqlop(kind, name, operands, **operator)


    @staticmethod
    def set_correlation_option(root):
        rel_dct = {}

        def check_rel(root, parent_name=''):
            rel_dct[root.enum_name] = root
            root.parent = parent_name
            if root.rel_typename == 'LogicalProject':
                for e in root.exps:
                    root.exps_has_subq.append(check_rex(e, root.enum_name))
            elif root.rel_typename == 'LogicalJoin':
                check_rex(root.condition, root.enum_name)
            elif root.rel_typename == 'LogicalFilter':
                check_rex(root.condition, root.enum_name)
            else:
                pass
            for r in root.inputs:
                check_rel(r, root.enum_name)
        def check_rex(root, owner, parent=''):
            root.owner = owner
            root.parent = parent
            if root.rex_typename == 'RexCall':
                root.operator.owner = owner
                for o in root.operator.operands:
                    return check_rex(o, owner, root.name)
            elif root.rex_typename == 'RexSubQuery':
                _owner = rel_dct[owner]
                _owner.has_subquery = True
                has_corr_exps = 'S'
                if root.has_corr_subquery:
                    _owner.has_corr_subquery = True
                    has_corr_exps = 'C'
                check_rel(root.rel)
                return has_corr_exps
            else:
                return 'N'
        check_rel(root)
