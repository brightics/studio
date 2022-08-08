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
import json
from .calcite2pd_utils.schema_util import getModelJsonStr

from .logical.logical_join import logical_join
from .logical.logical_union import logical_union
from .logical.logical_aggregate import logical_aggregate
from .logical.logical_filter import logical_filter
from .logical.logical_project import logical_project
from .logical.logical_sort import logical_sort
from .logical.logical_table_scan import logical_table_scan
from .logical.logical_values import logical_values

# from py4j.java_gateway import JavaGateway
from brightics.brightics_java_gateway import brtc_java_gateway


class Sql2Pandas(object):

    def __init__(self):
        # gateway = JavaGateway()
        # self.sql2pd = gateway.entry_point.get()
        self.sql2pd = brtc_java_gateway.sql2Pandas
        self.input_dataframes = {'tmp_table': pd.DataFrame()}
        self._table_space = dict()
        self._field_space = dict()
        self._table_cols_init_state = dict()

    def __call__(self, *args, **kwargs):
        classname = type(self).__name__
        return globals()[classname]

    def set_tables(self, input_dataframes):

        if input_dataframes:
            self.input_dataframes.clear()

            for table_name in input_dataframes.keys():
                input_dataframes[table_name.upper()] = \
                    input_dataframes.pop(table_name)

            self.input_dataframes = input_dataframes

        ModelJsonStr = getModelJsonStr(self.input_dataframes)
        self.sql2pd.queryPlanner(ModelJsonStr)

    def execute_sql_query(self, statement):

        rel_tree_json = self.sql2pd.sqlToPdPlanJson(statement)
        root = json.loads(rel_tree_json)['root']

        rel_list = list()
        self.__reltree_to_rellist(root, rel_list)

        return self.__executeRels(rel_list)

    def __reltree_to_rellist(self, root, rel_list):
        inputs = root['inputs']

        for rel in inputs:
            self.__reltree_to_rellist(rel, rel_list)

        root['enum_name'] = root['relTypeName']+str(root['id'])
        root['inputs'] = [rel['relTypeName']+str(rel['id']) for rel in inputs]

        rel_list.append(root)

    def __executeRels(self, rel_list):

        rel_collection = {
            'LogicalAggregate': logical_aggregate,
            'LogicalFilter': logical_filter,
            'LogicalJoin': logical_join,
            'LogicalProject': logical_project,
            'LogicalSort': logical_sort,
            'LogicalTableScan': logical_table_scan,
            'LogicalValues': logical_values,
            'LogicalUnion': logical_union}

        for rel in rel_list:
            relTypeName = rel['relTypeName']

            if relTypeName == 'LogicalTableScan':
                rel_collection[relTypeName](
                    rel, self._table_space, self._field_space,
                    self.input_dataframes, self._table_cols_init_state)

            else:
                rel_collection[relTypeName](
                    rel, self._table_space, self._field_space)

        result_enum_name = rel_list[-1]['enum_name']
        result_table = self._table_space[result_enum_name]
        result_table.columns = self._field_space[result_enum_name]

        # check if result_table is one of input tables
        # if true returns copy of result_table
        flag = [
                True if result_table is table else False
                for nm, table in self.input_dataframes.items()
            ].__contains__(True)

        if flag:
            return result_table.copy()
        else:
            return result_table

    def reset(self):

        for table, fields in self._table_cols_init_state.items():
            self.input_dataframes[table].columns = fields

        self.input_dataframes = {'tmp_table': pd.DataFrame()}
        self._table_space.clear()
        self._table_cols_init_state.clear()
        self._field_space.clear()


Sql2Pandas = Sql2Pandas()
