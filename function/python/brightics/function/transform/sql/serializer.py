import pickle
import numpy as np

def _serialize(obj):
    return pickle.dumps(obj)

def _deserialize(serialized_obj):
    return pickle.loads(serialized_obj)


def _get_serialized_cols(table):
    cols = table.columns
    return [_ for _ in cols if _is_serialized(table[_][0])]


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
    
    def _need_serialize(col, tpe, table):
        return (tpe == 'object' and not _is_string(table[col])) or np.issubdtype(tpe, np.datetime64)
    
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

