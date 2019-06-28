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

import pickle
import numpy as np
from brightics.common.datatypes import get_logical_type_from_numpy


def _serialize(obj):
    return pickle.dumps(obj)


def _deserialize(serialized_obj):
    return pickle.loads(serialized_obj)


def _get_serialized_cols(table):
    cols = table.columns
    if len(table.index) != 0:    
        return [_ for _ in cols if _is_serialized(table[_][0])]
    else:
        return []


def _is_serialized(obj):
    try:
        _deserialize(obj)
        return True
    except:
        return False


def _get_deserialized_table(table):
    cols_to_deserialize = _get_serialized_cols(table)
    for col in cols_to_deserialize:
        table[col] = table[col].apply(lambda _: _deserialize(_)) 
    
    return table


def _get_serialized_table(table, cols_to_serialize):
    out_table = table.copy()
    for col in cols_to_serialize:
        out_table[col] = out_table[col].apply(lambda _: _serialize(_)) 
    
    return out_table


def _get_columns_to_serialize(table):
    dtypes = table.dtypes
    cols = dtypes.index

    def _need_serialize(col, dtype, table):
        tpe = get_logical_type_from_numpy(table[col])

        if np.issubdtype(dtype, np.datetime64):
            need_serialize = True
        elif dtype == 'object':
            need_serialize = True
            if tpe == 'bytes':
                need_serialize = False
            elif tpe == 'string':
                need_serialize = False
        else:
            need_serialize = False

        return need_serialize

    def _is_string(series):
        n_sample = np.min((series.size, 100))
        sample = series.sample(n_sample)

        for elem in sample:
            if elem is None:
                pass
            
            elif isinstance(elem, str):
                pass
            
            else:
                return False
            
        return True
    
    return [col for col, tpe in zip(cols, dtypes) if _need_serialize(col, tpe, table) ]
