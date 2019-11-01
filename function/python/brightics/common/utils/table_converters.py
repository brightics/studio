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

import re

import pandas as pd


def _replace_col_name(col_name):
    if col_name == '':
        return 'unnamed'
    else:
        return re.sub('[ ,;{}()\n\t=]', '_', col_name)


def _replace_column_names(col_name_list):
    if col_name_list is None:
        return None
    else:
        return [_replace_col_name(col_name) for col_name in col_name_list]


def _header(simple_table):
    if simple_table[0].datatype == 'header':
        return simple_table[0].data
    else:
        return None


def _to_float(df):
    for col in df.columns:
        try:
            df = df.astype({col:float})
        except:
            pass

    return df


def simple_table2df(simple_table, drop_index=False):
    header = _replace_column_names(_header(simple_table))
    if header is not None:
        simple_table = simple_table[1:]  # header
        if drop_index:
            index = [row.data[0] for row in simple_table]
            data = [row.data[1:] for row in simple_table]
            table = _to_float(pd.DataFrame(data, columns=header[1:], index=index))
        else:
            data = [row.data for row in simple_table]
            table = _to_float(pd.DataFrame(data, columns=header))
    else:
        data = [row.data for row in simple_table]
        table = _to_float(pd.DataFrame(data))
    return table


def simple_tables2df_list(simple_tables, drop_index=False):
    table_list = []
    for simple_table in simple_tables:
        table_list.append(simple_table2df(simple_table, drop_index))

    return table_list
