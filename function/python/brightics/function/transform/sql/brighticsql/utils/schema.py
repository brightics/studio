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
from collections import OrderedDict

import numpy as np

from brighticsql.utils.dtypes import infer_array_dtype

# # CONSTANTS
VERSION = "0.0.1"
DEFAULTSCHEMA = "brtc"
package_prepend = "com.samsung.sds.brightics.storage.common.calcite"
TABLEFACTORY = package_prepend + ".pandasTableFactory"
TABLETYPE = "custom"

python_java_type_mapping = {
    np.dtype('float64'): 'double',
    np.dtype('int8'): 'integer',
    np.dtype('int16'): 'integer',
    np.dtype('int32'): 'integer',
    np.dtype('int64'): 'integer',
    np.dtype('str'): 'string',
    np.dtype('object'): 'string',
    np.dtype('bool'): 'boolean'
}


def get_model_json_str(dataframes, dfs_dtypes=None):
    return json.dumps(get_model_json(dataframes, dfs_dtypes),
                      ensure_ascii=False,
                      indent="\t")


def to_java_type(x):
    try:
        return python_java_type_mapping[x]
    except KeyError:
        raise NotImplementedError(f'Unimplemented data type {x}.')


def get_table_json(name, dataframe, dtypes=None):
    col_names = dataframe.columns.tolist()
    if dtypes is None:
        dtypes = [infer_array_dtype(dataframe[col]) for col in col_names]

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
