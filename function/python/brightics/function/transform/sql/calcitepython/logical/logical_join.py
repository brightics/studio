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

from ..calcite2pd_utils.rand_util import gen_colname
from ..calcite2pd_utils.rexnode_util import RexNodeTool

# pandas seems to have an issue regarding missing values;
# pandas merge operation matches NaN and None.
# see:
#     https://stackoverflow.com/questions/53688988/why-does-pandas-merge-on-nan
#     https://github.com/pandas-dev/pandas/issues/22491
#     https://github.com/pandas-dev/pandas/issues/22618
#
# a simple remedy is to use 'right.dropna(subset=[rightRefCol])'

# There is no direct method in pandas to implement sql join with condition:
#   ex) "select df1.A, df1.g2, df2.GG, df2.GGG
#        from df1 left join df2 on df1.g2 > df2.ggg"
# For the time being, we implement the method __conditional_join
# using pandas merge method with query,
# however, the method __conditional_join in still incomplete.
# the method __conditional_join is memory inefficient
# and cannot be used for large table.
# the method should be re-written using cython
# for performance and integrity in later versions.


# TODO: rewrite __conditional_join using cython so that the method covers all join condntions uniformly.


def __check_cross_join(condition, join_type):
    if join_type == 'INNER':
        if condition['rexTypeName'] == 'RexLiteral':
            RexNodeTool.clear()
            value = RexNodeTool.rexLiteral_get_value(condition)

            if isinstance(value, bool) and value and join_type == 'INNER':
                return True

    return False


def __cross_join(left, right):

    idxL, idxR = np.broadcast_arrays(*np.ogrid[:len(left), :len(right)])
    df = pd.DataFrame(np.column_stack(
        [left.values[idxL.ravel()], right.values[idxR.ravel()]]))

    try:
        tmp_field = [f'c{i}' for i in range(len(df.columns))]

    except:
        tmp_field = ['c'+str(i) for i in range(len(df.columns))]

    df.columns = tmp_field

    return df


def __check_simple_cond(condition):

    if condition['rexTypeName'] == 'RexCall':
        if condition['opKind'] == 'EQUALS':
            operands = condition['operands']
            oprd0 = operands[0]
            oprd1 = operands[1]
            if oprd0['rexTypeName'] == oprd1['rexTypeName'] == 'RexInputRef':
                return [oprd0['index'], oprd1['index']]

    return False


def __simple_eqcond_join(left, right, field, join_type,
                         left_on, right_on):

    if join_type == 'INNER' or join_type == 'LEFT':
        merged = left.merge(
            right.dropna(subset=[right_on]),
            left_on=left_on,
            right_on=right_on,
            how=join_type.lower())

    elif join_type == 'RIGHT':
        merged = left.dropna(subset=[left_on]).merge(
            right,
            left_on=left_on,
            right_on=right_on,
            how='right')

    elif join_type == 'FULL':
        # this method is inefficient should be re-written for performance
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
            oprd = _lset[right_on].values
            _lset = _lset.loc[
                np.array([x is None or (isinstance(x, float) and np.isnan(x))
                          for x in oprd])]

        else:
            oprd = _rset[left_on].values
            _rset = _rset.loc[
                np.array([x is None or (isinstance(x, float) and np.isnan(x))
                          for x in oprd])]

        merged = pd.concat([_lset, _rset])

    else:
        raise ValueError('unknown join_type')

    return merged


def __conditional_join(left, right, field, join_type, condition):
    # this method is memory inefficient
    # should be re-written
    # currently supports inner join only
    if join_type == 'INNER':
        _table = __cross_join(left, right)
        RexNodeTool.clear()
        condition_exp = RexNodeTool.unparse(condition, _table.columns.tolist())

    else:
        raise ValueError('unsupported join condition')

    return _table.query(condition_exp)


def logical_join(rel, table_space, field_space):

    join_type = rel['joinType']
    field = rel['field']
    left = table_space[rel['inputs'][0]]
    right = table_space[rel['inputs'][1]]
    condition = rel['condition']
    enum_name = rel['enum_name']

    # cross join
    if __check_cross_join(condition, join_type):
        join_table = __cross_join(left, right)

    else:
        # check if the condition is colref1 == colref2
        simple_col_ref = __check_simple_cond(condition)

        if simple_col_ref:

            tmp_fields = list(gen_colname(25, left.shape[1] + right.shape[1]))

            left_on = tmp_fields[simple_col_ref[0]]
            right_on = tmp_fields[simple_col_ref[1]]

            left.columns = tmp_fields[0:left.shape[1]]
            right.columns = tmp_fields[
                left.shape[1]:left.shape[1] + right.shape[1]]

            join_table = __simple_eqcond_join(
                left, right, field, join_type, left_on, right_on)

        else:
            join_table = __conditional_join(
                left, right, field, join_type, condition)

    table_space[enum_name] = join_table
    field_space[enum_name] = field
