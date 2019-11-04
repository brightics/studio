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
from ..functions.aggregate_functions import aggregate_functions

from itertools import compress
from itertools import chain


def __gen_field_names(field, input_field, aggcalls, groupset):

    it_grpset = iter(groupset)
    it_aggcalls = iter(aggcalls)

    for fd in field:
        try:
            colid = next(it_grpset)
            yield input_field[colid]

        except:
            aggcall = next(it_aggcalls)
            if fd.lower().startswith('expr$'):
                argList = aggcall['argList']
                agg_func = aggcall['aggFunc']

                if not argList:
                    if agg_func == 'COUNT':
                        agg_arg = '*'
                    else:
                        raise ValueError(
                            'Unknown aggregate function with no argument')
                else:
                    agg_arg = input_field[argList[0]]

                _fd = [agg_func.lower(), '(']
                if aggcall['distinct']:
                    _fd.append('distinct ')
                _fd.append(agg_arg)
                _fd.append(')')

                yield ''.join(_fd)

            else:
                yield fd


def logical_aggregate(rel, table_space, field_space):

    aggcalls = rel['aggregateCalls']
    groupset = rel['GroupSet']
    input_enum_name = rel['inputs'][0]
    input_table = table_space[input_enum_name]
    field = rel['field']
    enum_name = rel['enum_name']
    input_table_fields = input_table.columns.tolist()
    input_field = field_space[input_enum_name]

    groupby_cols = [input_table_fields[col] for col in groupset]

    agg_funcs = list()
    agg_args = list()
    distinct = list()

    for aggcall in aggcalls:
        agg_func = aggcall['aggFunc']
        argList = aggcall['argList']

        if not argList:
            if agg_func == 'COUNT':
                agg_func = 'SIZE'
                agg_arg = input_table_fields[0]
            else:
                raise ValueError('Unknown aggregate function with no argument')
        else:
            agg_arg = input_table_fields[argList[0]]

        agg_funcs.append(aggregate_functions[agg_func])
        agg_args.append(agg_arg)
        distinct.append(aggcall['distinct'])

    res_field = list(__gen_field_names(field, input_field, aggcalls, groupset))

    try:
        tmp_field = [f'c{i}' for i in range(len(field))]
    except:
        tmp_field = ['c'+str(i) for i in range(len(field))]

    if groupby_cols and agg_funcs:
        agg_table = __groupby_aggregate(
            input_table, tmp_field, agg_funcs,
            agg_args, distinct, groupby_cols)

    elif groupby_cols and not agg_funcs:
        agg_table = __groupby(
            input_table, tmp_field, groupby_cols)

    elif not groupby_cols and agg_funcs:
        agg_table = __aggregate(
            input_table, tmp_field, agg_funcs, agg_args, distinct)

    else:
        raise Exception(
            'at least one of groupby_cols or agg_funcs should be nonempty')

    table_space[enum_name] = agg_table
    field_space[enum_name] = res_field


def __gen_grp(group, groupby_cols, group_col):

    group = group.set_index(group_col)
    for col in groupby_cols:
        yield col, group[col]


def __gen_gby_agg(table, fields, agg_funcs, agg_args, group_col):

    table = table.groupby(group_col, as_index=True)
    for field, func, arg in zip(fields, agg_funcs, agg_args):
        yield field, table.agg({arg: func})[arg]


def __gen_gby_agg_dist(table, fields, agg_funcs, agg_args, group_col):

    for field, func, arg in zip(fields, agg_funcs, agg_args):
        yield field, table[[arg, group_col]].drop_duplicates()\
            .groupby(group_col, as_index=True).agg(func)[arg]


def __groupby_aggregate(
        table, fields, agg_funcs, agg_args, distinct, groupby_cols):

    fields_agg = fields[
        len(groupby_cols):len(groupby_cols)+len(agg_funcs)]

    group_col = next(gen_colname(20, 1, set(table.columns)))
    group = table[groupby_cols].drop_duplicates()
    group[group_col] = np.arange(group.shape[0])
    table = table.merge(group, on=groupby_cols)

    gen_agg_table = __gen_grp(group, groupby_cols, group_col)

    if distinct.__contains__(False):
        filp_distinct = [not d for d in distinct]
        gen_agg_table = chain(gen_agg_table, __gen_gby_agg(
            table,
            compress(fields_agg, filp_distinct),
            compress(agg_funcs, filp_distinct),
            compress(agg_args, filp_distinct),
            group_col))

    if distinct.__contains__(True):
        gen_agg_table = chain(gen_agg_table, __gen_gby_agg_dist(
            table,
            compress(fields_agg, distinct),
            compress(agg_funcs, distinct),
            compress(agg_args, distinct),
            group_col))

    agg_table = pd.DataFrame(dict(gen_agg_table), columns=fields)
    agg_table.index.name = None

    return agg_table


def __groupby(table, fields, groupby_cols):

    group = table[groupby_cols].drop_duplicates()
    group.rename(columns=dict(zip(groupby_cols, fields)), inplace=True)

    return group


def __gen_agg(table, agg_funcs, agg_args, distinct):

    for func, arg, dist in zip(agg_funcs, agg_args, distinct):
        if dist:
            yield [table[arg].drop_duplicates().agg(func)]
        else:
            yield [table[arg].agg(func)]


def __aggregate(table, fields, agg_funcs, agg_args, distinct):

    agg = list(__gen_agg(table, agg_funcs, agg_args, distinct))
    agg_table = pd.DataFrame(dict(zip(fields, agg)))
    agg_table.index.name = None

    return agg_table
