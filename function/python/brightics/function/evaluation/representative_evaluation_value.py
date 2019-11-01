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

from brightics.common.utils import check_required_parameters
from brightics.common.validation import raise_runtime_error


def representative_evaluation_value(table, group_by=None, **params):
    check_required_parameters(_representative_evaluation_value, params, ['table'])
    _representative_evaluation_value(table, **params)

    
def _representative_evaluation_value(table, input_col):
    col_name = input_col
    col_value =table.ix[0][col_name]

    if table.shape[0] > 1:
       raise_runtime_error("Only one column with one row is allowed")

    raw_data = "{'accuracy_index': " +  col_name + ",'accuracy_value': " + str(col_value) + " }"
    print(raw_data)
