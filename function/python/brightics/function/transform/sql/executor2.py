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

from .calcitepython.Sql2Pandas import Sql2Pandas


def execute2(tables=[pd.DataFrame()], query="select 1"):
    """
        tables: list of Pandas dataframes
        query: SQL query statement, ex) 'select 5'
    """

    enum_table_names = ['TABLE' + str(i) for i in range(0, len(tables))]
    input_tables = dict(zip(enum_table_names, tables))

    for i, enum_name in enumerate(enum_table_names):
        query = query.replace("""#{{DF({i})}}""".format(i=i), enum_name)

    Sql2Pandas.set_tables(input_tables)
    result_df = Sql2Pandas.execute_sql_query(query)
    Sql2Pandas.reset()

    return {'out_table': result_df}
