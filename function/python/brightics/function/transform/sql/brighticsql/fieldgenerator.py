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

from brighticsql.utils.random import gen_colname


class ProjectField:
    """ Field name generator for LogicalProject"""

    def __init__(self):
        self.rex = None
        self.fields = None
        self.tablename = None
        self.explained = []

    def __call__(self, rex=None, field=None, tablename=None):
        return self.field_from_rex(rex, field, tablename)

    def field_from_rex(self, rex, field, tablename):
        self.rex = rex
        self.field = field  # TODO do we need this field? remove if this field is not required.
        self.tablename = tablename
        self.explained = []
        self._explain_rex(rex)
        return ''.join(self.explained)

    def _explain_rex(self, rex):
        nm = rex.name.split('#')[0]
        if nm == 'RexInputRef':
            self._explain_rexinputref(rex)
        elif nm == 'RexLiteral':
            self._explain_rexliteral(rex)
        elif nm == 'RexCall':
            self._explain_rexcall(rex)
        elif nm == 'RexFieldAccess':
            self._explain_rexfieldaccess(rex)
        elif nm == 'RexSubQuery':
            self._explain_rexsubquery(rex)
        else:
            raise ValueError('unknown rexnode type: ', nm)

    def _explain_rexfieldaccess(self, rex):
        try:
            corr_name = rex.expr.corr_name
        except Exception:  # TODO specify this exception.
            corr_name = rex.expr
        self.explained.append(corr_name + '.' + rex.field)

    def _explain_rexsubquery(self, rex):
        # TODO: Maybe we need the original subquery from calcite-side to
        #  provide better field name.
        g = gen_colname(7, 1)
        self.explained.append('SUBQUERY#' + next(g))

    def _explain_rexinputref(self, rex):
        fd = self.field[rex.index]
        if self.tablename is not None:
            self.explained.append(self.tablename + '.' + fd)
        else:
            self.explained.append(fd)

    def _explain_rexliteral(self, rex):
        value = rex.value
        value_instance = rex.value_instance
        if value_instance == 'NlsString':
            self.explained.append('\'')
            self.explained.append(value)
            self.explained.append('\'')
        else:
            self.explained.append(str(value))

    def _explain_rexcall(self, rex):
        op = rex.operator
        _instance = op.__class__.__name__
        kind = op.kind
        oprd = op.operands
        fexp = op.op.fexp

        if kind == 'FLOORDIVIDE':
            kind = 'DIVIDE'

        if _instance == 'SqlBinaryOperator':
            self._explain_sql_binary_operator(fexp, oprd)
        elif _instance == 'IdentityFunc':
            # we need to check the function name of identityFunc in calcite
            self._explain_sql_identity_function(oprd)
        elif _instance == 'SqlPrefixOperator':
            self._explain_sql_prefix_operator(fexp, oprd)
        elif _instance == 'SqlFunction':
            _category = op.sqlfunction_category
            self._explain_sqlfunction(kind, _category, fexp, oprd)
        else:
            raise ValueError('Unimplemented rexcall')

    def _explain_sql_binary_operator(self, operator, operands):
        if operator == 'CONCAT':
            self.explained.append(operator)
            self.explained.append('(')
            self._explain_rex(operands[0])
            self.explained.append(',')
            self._explain_rex(operands[1])
            self.explained.append(')')
        else:
            self.explained.append('(')
            self._explain_rex(operands[0])
            self.explained.append(operator)
            self._explain_rex(operands[1])
            self.explained.append(')')

    def _explain_sql_identity_function(self, operands):
        self._explain_rex(operands[0])

    def _explain_sql_prefix_operator(self, operator, operands):
        self.explained.append(operator)
        self._explain_rex(operands[0])

    def _explain_sqlfunction(
            self, kind, sqlfunction_category, operator, operands):
        # kind seems to be unused.

        if sqlfunction_category == 'NUMERIC':
            self._explain_numeric_function(operator, operands)
        elif sqlfunction_category == 'STRING':
            self._explain_string_function(operator, operands)

    def _explain_string_function(self, operator, operands):

        if operator == 'TRIM':
            self.explained.append('TRIM')
            self.explained.append('(')
            self._explain_rex(operands[0])
            self.explained.append(' ')
            self._explain_rex(operands[1])
            self.explained.append(' from ')
            self._explain_rex(operands[2])
            self.explained.append(')')
            return

        if operator == 'OVERLAY':
            self.explained.append('OVERLAY')
            self.explained.append('(')
            self._explain_rex(operands[0])
            self.explained.append(' PLACING ')
            self._explain_rex(operands[1])
            self.explained.append(' FROM ')
            self._explain_rex(operands[2])
            if len(operands) == 4:
                self.explained.append(' FOR ')
                self._explain_rex(operands[3])
            self.explained.append(')')
            return

        if operands:
            self.explained.append(operator)
            self.explained.append('(')
            for oprd in operands:
                self._explain_rex(oprd)
                self.explained.append(',')
            del self.explained[-1]
            self.explained.append(')')
        else:
            self.explained.append(operator)

    def _explain_numeric_function(self, operator, operands):

        if operator == 'POSITION':
            self.explained.append('POSITION')
            self.explained.append('(')
            self._explain_rex(operands[0])
            self.explained.append(' IN ')
            self._explain_rex(operands[1])
            if len(operands) == 3:
                self.explained.append(' FROM ')
                self._explain_rex(operands[2])
            self.explained.append(')')
            return

        if operands:
            self.explained.append(operator)
            self.explained.append('(')
            for oprd in operands:
                self._explain_rex(oprd)
                self.explained.append(',')
            del self.explained[-1]
            self.explained.append(')')
        else:
            self.explained.append(operator)


make_projectfield = ProjectField()
