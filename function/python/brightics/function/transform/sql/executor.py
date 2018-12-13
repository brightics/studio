# -*- coding: utf-8 -*-

import sqlite3
from pandas.io import sql
import numpy as np

from . import functions
from . import aggregate_functions
from .serializer import _get_columns_to_serialize
from .serializer import _get_serialized_cols
from .serializer import _get_serialized_table
from .serializer import _get_deserialized_table
from .serializer import _is_serialized
from inspect import signature
from inspect import getmembers
from inspect import isfunction
from inspect import isclass
# from common.exception import BrighticsFunctionException
import sys
import traceback

import uuid


def execute(tables, query):
#     from sqlalchemy import create_engine
#     engine = create_engine('sqlite:///:memory:', echo=True)
    sqlite3.enable_callback_tracebacks(True)
    con = sqlite3.connect(':memory:', detect_types=sqlite3.PARSE_DECLTYPES)
    
    _register_adapters(sqlite3)
    _register_converters(sqlite3)
    _create_functions(con, functions)
    _create_aggregate_functions(con, aggregate_functions)
    
    con.execute("PRAGMA temp_store = MEMORY")
    con.execute("PRAGMA journal_mode = OFF")
    
    table_names = _write_table(tables, con)
    
    for i, table_name in enumerate(table_names):
        query = query.replace("""#{{DF({i})}}""".format(i=i), table_name)
    res = _get_deserialized_table(sql.read_sql(query, con))
        
#     except Exception as e:
#         exc_info = sys.exc_info()
#         print(e.args)
#         print(traceback.format_stack())
#         raise e

        # raise BrighticsFunctionException("0100",str(e)).add_detail_message()
                      
    # data_utils.validate_column_name(res)
    
    con.close()  # delete tables?
    
    return {'out_table': res}


def _write_table(tables, con):
    table_names = []
    for idx, table in enumerate(tables):
        cols_to_pickle = _get_columns_to_serialize(table)
        pickled_table = _get_serialized_table(table, cols_to_pickle)
        table_name = 'df_' + str(uuid.uuid4())[:8]
        table_names.append(table_name)
        print(table_name)
        pickled_table.to_sql(table_name, con, index=False)

    return table_names


def _register_adapters(sqlite3):
    pass
#     sqlite3.register_adapter(np.int8, int)
    
    
def _register_converters(sqlite3):
    pass
    # sqlite3.register_converter("numpy.int32", np.int32)
    

def _create_aggregate_functions(con, *modules):

    def _get_name(cls):
        if hasattr(cls, 'name'):
            return cls.name
        else:
            return cls.__name__

    for module in list(modules):
        udaf_list = [o for o in getmembers(module) if isclass(o[1])]
        for _, udaf_class in udaf_list:
            sig = signature(udaf_class.step)
            params = sig.parameters.values()
            n_params = len(params) - 1  # self
            
            if _contains_var_positional(params):
                con.create_aggregate(_get_name(udaf_class), -1, udaf_class)
                
            else:
                con.create_aggregate(_get_name(udaf_class), n_params, udaf_class)
            
        
def _create_functions(con, *modules):
    con.create_function('if', 3, lambda cond, true_value, false_value: true_value if cond else false_value)
    
    for module in list(modules):
        udf_list = [o for o in getmembers(module) if isfunction(o[1])]
        
        for udf_name, udf in udf_list:
            sig = signature(udf)
            params = sig.parameters.values()
            n_params = len(params)
            
            if _contains_var_positional(params):
                con.create_function(udf_name, -1, udf)
                
            else:
                con.create_function(udf_name, n_params, udf)


def _contains_var_positional(params):
    return any(param.kind == param.VAR_POSITIONAL for param in params)
