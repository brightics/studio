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

import json

import pandas as pd

from brighticsql.utils.schema import get_model_json_str
from brighticsql.utils.random import gen_colname
# from brighticsql.gateway import get_connection
from brighticsql.base import TableSpace
from brighticsql.factory import ItemFactory

__all__ = ['BrighticSQL']


class BrtcConn:
    def query_planner(self, schema_model_json):
        from brightics.network.brightics_grpc_client import brightics_storage_client
        brightics_storage_client.set_schema_model(schema_model_json)

    def sql_to_pdplan_json(self, stmt):
        from brightics.network.brightics_grpc_client import brightics_storage_client
        return brightics_storage_client.parse_sql(stmt)


class BrighticSQL:

    def __init__(self):
        self.connection_type = None
        self.port = None
        # self.sql2pd = None
        self.sql2pd = BrtcConn()
        self.schema_model_json = None
        self.table_space = TableSpace()
        self.factory = ItemFactory()
        # self.calcite_jar_path = '/libs/calcitePython-0.0.1-SNAPSHOT.jar'
        # self.calcite_process = None

    # def start_calcite(self):
    #     import subprocess
    #     import os
    #     path = os.path.dirname(__file__) + self.calcite_jar_path
    #     # path = 'D:/brighticsql/brighticsql' + self.calcite_jar_path
    #     cmd = ' '.join(['java', '-jar', path])
    #     self.calcite_process = subprocess.Popen(cmd, shell=True)
    #
    # @property
    # def is_calcite_running(self):
    #     return self.calcite_process.poll() is None
    #
    # def stop_calcite(self):
    #     if self.is_calcite_running:
    #         self.calcite_process.terminate()
    #     for i in range(10):
    #         if self.is_calcite_running:
    #             import time
    #             time.sleep(0.1)
    #             self.stop_calcite()
    #         else:
    #             return
    #     if self.is_calcite_running:
    #         raise Exception('Subprocess does not terminated after 10 attempts.')
    #
    # def connect(self, connection_type=None, port=50051):
    #     if connection_type is None:
    #         connection_type = 'localhost'
    #     self.connection_type = connection_type
    #     self.port = port
    #     self.sql2pd = get_connection(self.connection_type)
    #     self.sql2pd.connect(port=self.port)

    def set_tables(self, input_dataframes=None):
        if not input_dataframes or input_dataframes is None:
            col = list(gen_colname(20, 3))
            input_dataframes = {col[0]: pd.DataFrame({col[1]: [col[2]]})}

        if input_dataframes:
            self.table_space.input_dfs = dict(
                (k.upper(), v) for k, v in input_dataframes.items())
        self.schema_model_json = get_model_json_str(input_dataframes)
        self.sql2pd.query_planner(self.schema_model_json)

    def parsesql(self, statement, debug=False):
        """parse sql and return result in json string."""
        parsed = self.sql2pd.sql_to_pdplan_json(statement)
        if debug:
            print('\n +++ Parsed +++ \n')
            print(parsed)
        return parsed

    def make_relroot(self, rel_json, debug=False):
        """convert parsing result to rel objects."""
        dct = json.loads(rel_json)['root']
        relroot = self.factory.make_relroot(dct)
        if debug:
            from brighticsql.printer import RelVisitPrinter
            printer = RelVisitPrinter()
            print('\n +++ Logical Plan +++\n')
            print(printer.tostring(relroot))
        return relroot

    def execute(self, statement, debug=False):
        # debug = True
        rel_json = self.parsesql(statement, debug)
        relroot = self.make_relroot(rel_json, debug)
        res_ename = relroot.enum_name
        relroot(table_space=self.table_space, corrvar_space={})
        res = self.table_space.pop(res_ename)
        if res.dstruct == 'dict':
            return res.data
        return res.toDataFrame()

    def reset(self):
        self.table_space = TableSpace()
        self.schema_model_json = None

    def print_schema_model(self):
        print(self.schema_model_json)
