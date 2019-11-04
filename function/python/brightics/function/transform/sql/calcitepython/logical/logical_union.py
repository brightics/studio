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


def logical_union(rel, table_space, field_space):

    is_all = rel['all']
    fields = rel['field']
    enum_name = rel['enum_name']
    inputs = rel['inputs']
    top = table_space[inputs[0]]
    bottom = table_space[inputs[1]]

    bottom.columns = top.columns
    union_table = pd.concat([top, bottom])
    field_space[enum_name] = field_space[inputs[0]]

    if not is_all:
        union_table.drop_duplicates(inplace=True)

    table_space[enum_name] = union_table
