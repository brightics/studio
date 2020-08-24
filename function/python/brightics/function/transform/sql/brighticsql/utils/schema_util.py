import json
import numpy as np
from collections import OrderedDict

from .dtype_util import infer_dtype

# # CONSTANTS
VERSION = "0.0.1"
DEFAULTSCHEMA = "brtc"
TABLEFACTORY = "com.samsung.sds.brightics.agent.context.python.calcitePandas.pandasTableFactory"
TABLETYPE = "custom"


def get_model_json_str(dataframes, dfs_dtypes=None):
    return json.dumps(get_model_json(dataframes, dfs_dtypes),
                      ensure_ascii=False,
                      indent="\t")


def to_java_type(x):
    _dataTypes = {
        np.dtype('float64'): 'double',
        np.dtype('int64'): 'integer',
        np.dtype('str'): 'string',
        np.dtype('object'): 'string',
        np.dtype('bool'): 'boolean'
    }

    try:
        return _dataTypes[x]

    except KeyError:
        raise TypeError('unsupported data type')


def get_table_json(name, dataframe, dtypes=None):
    col_names = dataframe.columns.tolist()
    if dtypes is None:
        dtypes = [infer_dtype(dataframe[col]) for col in col_names]

    dtypes = [to_java_type(x) for x in dtypes]

    cols = OrderedDict(zip(col_names, dtypes))

    return OrderedDict(type=TABLETYPE,
                       name=name,
                       factory=TABLEFACTORY,
                       operand={'columns': cols})


def get_schema_json(schema_name, dataframes, dfs_dtypes=None):
    if dfs_dtypes is None:
        return OrderedDict(
            name=schema_name,
            tables=[get_table_json(nm, df) for (nm, df) in dataframes.items()])
    else:
        return OrderedDict(
            name=schema_name,
            tables=[get_table_json(nm, dataframes[nm], dfs_dtypes[nm]) for nm
                    in dataframes.keys()])


def get_model_json(dataframes, dfs_dtypes=None):
    schemas = [get_schema_json(DEFAULTSCHEMA, dataframes, dfs_dtypes)]

    return OrderedDict(version=VERSION,
                       defaultSchema=DEFAULTSCHEMA,
                       schemas=schemas)
