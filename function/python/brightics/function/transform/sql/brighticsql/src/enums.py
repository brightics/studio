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

import enum


class Rex(enum.Enum):
    RexInputRef = 0
    RexLiteral = 1
    RexCall = 2
    RexCorrelVariable = 3
    RexFieldAccess = 4
    RexSubQuery = 5

    def __eq__(self, other):
        if isinstance(other, str):
            return self.name == other
        return super().__eq__(other)


class Rel(enum.Enum):
    LogicalTableScan = 0
    LogicalValues = 1
    LogicalUnion = 2
    LogicalSort = 3
    LogicalProject = 4
    LogicalFilter = 5
    LogicalAggregate = 6
    LogicalJoin = 7

    def __eq__(self, other):
        if isinstance(other, str):
            return self.name == other
        return super().__eq__(other)


class RelItem(enum.Enum):
    id = 0
    node_type = 1
    rel_typename = 2
    fieldList = 3
    variableSet = 4
    inputs = 5
    table = 6
    exps = 7
    condition = 8
    jointype = 9
    groupset = 10
    aggcalls = 11
    fetch = 12
    collation = 13
    tuples = 14
    all = 15

    def __eq__(self, other):
        if isinstance(other, str):
            return self.name == other
        return super().__eq__(other)

class RexItem(enum.Enum):
    node_type = 1
    rex_typename = 2
    operator = 3
    operands = 4
    index = 5
    value_instance = 6
    value = 7
    expr = 8
    field = 9
    name = 10

    def __eq__(self, other):
        if isinstance(other, str):
            return self.name == other
        return super().__eq__(other)
