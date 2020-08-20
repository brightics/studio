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

# -*- coding: utf-8 -*-

import pandas as pd
import json

from .src.utils.schema_util import getModelJsonStr
from .src.utils.rand_util import gen_colname
from .src.base import TableSpace
from .src.factory import factory

from brightics.brightics_java_gateway import brtc_java_gateway


class BrighticSQL:

    def __init__(self):
        self.connection_type = None
        self.port = None
        self.sql2pd = brtc_java_gateway.sql2Pandas
        self.schema_model_json = None
        self.table_space = TableSpace()
        self.factory = factory()

    def __call__(self, *args, **kwargs):
        classname = type(self).__name__
        return globals()[classname]

    def set_tables(self, input_dataframes=None):
        if not input_dataframes or input_dataframes is None:
            col = list(gen_colname(20, 3))
            input_dataframes = {col[0]: pd.DataFrame({col[1]: [col[2]]})}

        if input_dataframes:
            self.table_space.input_dfs = dict(
                (k.upper(), v) for k, v in input_dataframes.items())
        self.schema_model_json = getModelJsonStr(input_dataframes)
        self.sql2pd.queryPlanner(self.schema_model_json)

    def parsesql(self, statement, debug=False):
        """parse sql and return result in json string."""
        parsed =  self.sql2pd.sqlToPdPlanJson(statement)
        if debug:
            print('\n +++ Parsed +++ \n')
            print(parsed)
        return parsed

    def make_relroot(self, rel_json, debug=False):
        """convert parsing result to rel objects."""
        dct = json.loads(rel_json)['root']
        relroot = self.factory.make_relroot(dct)
        if debug:
            from src.printer import RelVisitPrinter
            printer = RelVisitPrinter()
            print('\n +++ Logical Plan +++\n')
            print(printer.toString(relroot))
        return relroot

    def execute_sql_query(self, statement, debug=False):
        rel_json = self.parsesql(statement, debug)
        relroot = self.make_relroot(rel_json, debug)
        res_ename = relroot.enum_name
        relroot(table_space=self.table_space, corrvar_space={})
        res = self.table_space.pop(res_ename)
        if res.dstruct == 'dict':
            return res.data
        return res.toDataFrame()

    def reset(self):
        self.input_dfs = {'tmp_table': pd.DataFrame({'null': [None]})}
        self.t_space = TableSpace()
        self.schema_model_json = None

    def print_schema_model(self):
        print(self.schema_model_json)

BrighticSQL = BrighticSQL()