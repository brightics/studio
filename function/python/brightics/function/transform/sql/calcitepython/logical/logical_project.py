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

from ..calcite2pd_utils.rexnode_util import RexNodeTool
from ..calcite2pd_utils.rand_util import gen_colname

from itertools import chain


def __is_trivial_project(exps, len_fields):

    if len(exps) == 1:
        exp = exps[0]
        if exp['rexTypeName'] == 'RexLiteral':
            if RexNodeTool.rexLiteral_get_value(exp) == 0:
                return True

    if len_fields == len(exps):

        gen_from_rex = (exp['index'] if exp['rexTypeName'] == 'RexInputRef'
                        else -1 for exp in exps)
        gen_ref = (e for e in range(0, len(exps)))

        if all(a == b for a, b in zip(gen_from_rex, gen_ref)):
            return True

    return False


def __gen_field_names(field, input_field, exps):

    it_fd = iter(field)
    for exp in exps:
        fname = next(it_fd)
        if fname.lower().startswith('expr$') or fname.lower().startswith('$f'):
            RexNodeTool.clear()
            yield RexNodeTool.unparse(exp, input_field, tofield=True)
        else:
            yield fname


def __gen_project(table, result_field, exps):

    fields = table.columns.tolist()
    result_field = iter(result_field)

    toSeries = RexNodeTool.check_toSeries(exps)

    for exp in exps:
        rexTypeName = exp['rexTypeName']
        if rexTypeName == 'RexInputRef':
            yield next(result_field), table.iloc[:, exp['index']]

        elif rexTypeName == 'RexLiteral':
            RexNodeTool.clear()
            if toSeries:
                yield next(result_field),\
                    [RexNodeTool.rexLiteral_get_value(exp)]
            else:
                yield next(result_field),\
                    RexNodeTool.rexLiteral_get_value(exp)

        elif rexTypeName == 'RexCall':
            RexNodeTool.clear()
            unparsed = RexNodeTool.unparse(exp, fields, 'table')

            # pd.eval with engine='numexpr' does not support
            #                  //(floordivide) operation
            # see:
            # https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.eval.html

            try:
                col = pd.eval(unparsed, engine='numexpr')
            except:
                col = pd.eval(unparsed, engine='python')

            # if not isinstance(col, pd.Series) and not isinstance(col, list):
            #     if toSeries:
            #         col = [col]

            yield next(result_field), col


def __get_max_len(data_dict):
    for col in data_dict.values():
        try:
            yield len(col)
        except:
            yield 1


def __broadcast_data(data_dict):

    maxlen = max(list(__get_max_len(data_dict)))

    for nm, col in data_dict.items():
        if not isinstance(col, pd.Series) and not isinstance(col, list):
            newcol = np.empty(maxlen, dtype=type(col))
            newcol.fill(col)
            data_dict[nm] = newcol


def logical_project(rel, table_space, field_space):

    field = rel['field']
    exps = rel['exps']
    enum_name = rel['enum_name']
    input_enum_name = rel['inputs'][0]
    input_table = table_space[input_enum_name]
    input_field = field_space[input_enum_name]
    field_space[enum_name] = list(__gen_field_names(field, input_field, exps))

    try:
        tmp_field = [f'c{i}' for i in range(len(field))]
    except:
        tmp_field = ['c'+str(i) for i in range(len(field))]

    if __is_trivial_project(exps, len(input_table.columns)):
        table_space[enum_name] = input_table

    else:
        data_dict = dict(__gen_project(input_table, tmp_field, exps))
        __broadcast_data(data_dict)
        result_table = pd.DataFrame(data_dict)
        table_space[enum_name] = result_table
