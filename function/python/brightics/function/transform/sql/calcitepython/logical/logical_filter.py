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

from ..calcite2pd_utils.rexnode_util import RexNodeTool


def logical_filter(rel, table_space, field_space):

    enum_name = rel['enum_name']
    input_enum_name = rel['inputs'][0]
    input_table = table_space[input_enum_name]
    input_field = field_space[input_enum_name]
    condition = rel['condition']

    try:
        tmp_field = [f'c{i}' for i in range(len(input_field))]
    except:
        tmp_field = ['c'+str(i) for i in range(len(input_field))]

    input_table.columns = tmp_field

    RexNodeTool.clear()
    exps = RexNodeTool.unparse(condition, tmp_field)

    if len(input_table) > 10000:
        try:
            filtered_table = input_table[
                input_table.eval(exps, engine='numexpr')]
        except:
            filtered_table = input_table[
                input_table.eval(exps, engine='python')]
    else:
        filtered_table = input_table[
            input_table.eval(exps, engine='python')]

    table_space[enum_name] = filtered_table
    field_space[enum_name] = input_field
