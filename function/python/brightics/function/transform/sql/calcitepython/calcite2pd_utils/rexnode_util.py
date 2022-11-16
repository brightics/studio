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

from ..functions.operators import binary_operators
from ..functions.operators import prefix_operators


class RexNodeTool(object):

    def __init__(self):
        self.__rextree = None
        self.__fields = None
        self.__tablename = None
        self.__explained = []
        self.__binary_ops = binary_operators
        self.__prefix_ops = prefix_operators

    def set_fields(self, fields):
        self.__fields = fields

    def set_rextree(self, root):
        self.__rextree = root

    def set_tablename(self, tablename):
        self.__tablename = tablename

    def clear(self):
        self.__tablename = None
        self.__rextree = None
        self.__fields = None
        self.__explained.clear()

    def check_toSeries(self, exps, flag=True):

        for exp in exps:
            flag = self.__check_toSeries(exp, flag)

        return flag

    def __check_toSeries(self, exp, flag):
        rexTypeName = exp['rexTypeName']
        if rexTypeName == 'RexInputRef':
            flag = False
        elif rexTypeName == ['RexCall']:
            operands = exp['operands']
            for oprd in operands:
                flag = self.__check_toSeries(oprd, flag)
        return flag

    def unparse(self,
                rextree=None,
                fields=None,
                tablename=None,
                tofield=False):

        if rextree is not None:
            self.__rextree = rextree

        if fields is not None:
            self.__fields = fields

        self.__explain_rexnode(rextree, tablename, tofield=tofield)

        return ''.join(self.__explained)

    def __explain_rexinputref(self, rexnode):
        index = rexnode['index']
        fd = self.__fields[index]
        if self.__tablename is not None:
            self.__explained.append(self.__tablename + '.' + fd)
        else:
            self.__explained.append(fd)

    def __explain_rexliteral(self, rexnode):
        value = rexnode['value']
        valueInstance = rexnode['valueInstance']
        if valueInstance == 'NlsString':
            self.__explained.append('\'')
            self.__explained.append(value)
            self.__explained.append('\'')
        else:
            self.__explained.append(str(value))

    def __explain_rexcall(self, rexnode, tofield=False):

        op_supertype = rexnode['opInstance']
        operands = rexnode['operands']
        opkind = rexnode['opKind']

        if opkind == 'FLOORDIVIDE' and tofield:
            opkind = 'DIVIDE'

        if op_supertype == 'SqlBinaryOperator':
            operator = self.__binary_ops[opkind]
            self.__explain_binary_operator(operator, operands, tofield=tofield)

        # we need to check the function name of identityFunc in calcite
        elif op_supertype == 'IdentityFunc':
            self.__explain_identity_function(operands)

        elif op_supertype == 'SqlPrefixOperator':
            operator = self.__prefix_ops[opkind]
            self.__explain_prefix_operator(operator, operands)

        elif op_supertype == 'SqlCastFunction':
            if opkind == 'CAST':
                oprd = operands[0]
                if oprd['rexTypeName'] == 'RexInputRef':
                    self.__explain_rexinputref(oprd)

        else:
            raise ValueError

    def __explain_binary_operator(self, operator, operands, tofield=False):

        self.__explained.append('(')
        self.__explain_rexnode(operands[0], tofield=tofield)
        self.__explained.append(operator)
        self.__explain_rexnode(operands[1], tofield=tofield)
        self.__explained.append(')')

    def __explain_prefix_operator(self, operator, operands, tofield=False):

        self.__explained.append('(')
        self.__explained.append(operator)
        self.__explain_rexnode(operands[0], tofield=tofield)
        self.__explained.append(')')

    def __explain_identity_function(self, operands, tofield=False):

        self.__explain_rexnode(operands[0], tofield=tofield)

    def __explain_rexnode(self, rexnode, tablename=None, tofield=False):

        if tablename is not None:
            self.__tablename = tablename

        rexnode_type = rexnode['rexTypeName']

        if rexnode_type == 'RexInputRef':
            self.__explain_rexinputref(rexnode)

        elif rexnode_type == 'RexLiteral':
            self.__explain_rexliteral(rexnode)

        elif rexnode_type == 'RexCall':
            self.__explain_rexcall(rexnode, tofield=tofield)

        else:
            raise ValueError('unknown rexnode_type')

    def rexLiteral_get_value(self, exp):
        valueInstance = exp['valueInstance']
        value = exp['value']
        if valueInstance == 'BigDecimal':
            val = float(value)
            if val.is_integer():
                return int(val)
            else:
                return val
        elif valueInstance == 'NlsString':
            return value
        elif valueInstance == 'Boolean':
            return value
        else:
            raise ValueError('Unknown or UnImplemented rexLiteral Type')


RexNodeTool = RexNodeTool()
