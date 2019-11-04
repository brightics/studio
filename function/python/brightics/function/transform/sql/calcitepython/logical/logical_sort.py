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
import json

from ..calcite2pd_utils.rexnode_util import RexNodeTool


def logical_sort(rel, table_space, field_space):

    input_enum_name = rel['inputs'][0]
    table = table_space[input_enum_name]
    collationDirection = rel['collationDirection']
    collationFieldIndex = rel['collationFieldIndex']
    enum_name = rel['enum_name']
    fetch = rel['fetch']

    input_field = table.columns.tolist()
    sortby = [input_field[idx] for idx in collationFieldIndex]
    ascending = [True if asc == 'ASCENDING' else False for
                 asc in collationDirection]

    if sortby:
        table = table.sort_values(by=sortby, ascending=ascending)

    if fetch is None:
        table_space[enum_name] = table

    else:
        if fetch['rexTypeName'] == 'RexLiteral':
            fetch = RexNodeTool.rexLiteral_get_value(fetch)

        table_space[enum_name] = table.head(fetch)

    field_space[enum_name] = field_space[input_enum_name]
