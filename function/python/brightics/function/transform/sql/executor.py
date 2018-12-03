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


def execute(tables, query):
    sqlite3.enable_callback_tracebacks(True)
    con = sqlite3.connect(':memory:')
    
    _create_functions(con, functions)
    _create_aggregate_functions(con, aggregate_functions)
    
    con.execute("PRAGMA temp_store = MEMORY")
    con.execute("PRAGMA journal_mode = OFF")
    
    # write tables?
    for idx, table in enumerate(tables):
        cols_to_pickle = _get_columns_to_serialize(table)
        pickled_table = _get_serialized_table(table, cols_to_pickle)
        pickled_table.to_sql('df%i' % idx, con, index=False)
    
    res = sql.read_sql(query, con)
    _get_deserialized_table(res, _get_serialized_cols(res))
    # data_utils.validate_column_name(res)
    
    con.close()  # delete tables?
    
    return res


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
            
            print(sig)
            
        
def _create_functions(con, *modules):
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
    for param in params:
        if(param.kind == param.VAR_POSITIONAL):
            return True 
    
    return False
