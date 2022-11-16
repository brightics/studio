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

def logical_table_scan(rel,
                       table_space,
                       field_space,
                       input_tables,
                       table_cols_init_state):
    table_name = rel['tableName']
    field = rel['field']
    enum_name = rel['enum_name']

    table_cols_init_state[table_name] =\
        input_tables[table_name].columns.tolist()

    try:
        tmp_field = [f'c{i}' for i in range(len(field))]
    except:
        tmp_field = ['c'+str(i) for i in range(len(field))]

    input_tables[table_name].columns = tmp_field
    table_space[enum_name] = input_tables[table_name]
    field_space[enum_name] = field
