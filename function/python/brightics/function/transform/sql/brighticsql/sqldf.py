import json

import pandas as pd

from brighticsql.utils.schema_util import get_model_json_str
from brighticsql.utils.rand_util import gen_colname
from brighticsql.base import TableSpace
from brighticsql.factory import ItemFactory

from brightics.brightics_java_gateway import brtc_java_gateway


class BrighticSQL:

    def __init__(self):
        self.connection_type = None
        self.port = None
        self.sql2pd = brtc_java_gateway.sql2Pandas
        self.schema_model_json = None
        self.table_space = TableSpace()
        self.factory = ItemFactory()

    def set_tables(self, input_dataframes=None):
        if not input_dataframes or input_dataframes is None:
            col = list(gen_colname(20, 3))
            input_dataframes = {col[0]: pd.DataFrame({col[1]: [col[2]]})}

        if input_dataframes:
            print(type(self.table_space))
            self.table_space.input_dfs = dict(
                (k.upper(), v) for k, v in input_dataframes.items())
        self.schema_model_json = get_model_json_str(input_dataframes)
        self.sql2pd.queryPlanner(self.schema_model_json)

    def parsesql(self, statement, debug=False):
        """parse sql and return result in json string."""
        parsed = self.sql2pd.sqlToPdPlanJson(statement)
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
