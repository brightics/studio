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


import json
import numpy as np
from collections import OrderedDict
from .dtype_util import infer_dtype

# # CONSTANTS
version = "0.0.1"
defaultSchema = "brtc"
tableFactory = "com.samsung.sds.brightics.agent.context.python.calcitePandas.pandasTableFactory"
tableType = "custom"


def getModelJsonStr(dataFrames, dfs_dtypes=None):
    return json.dumps(
        getModelJson(dataFrames),
        ensure_ascii=False,
        indent="\t")


def _toJavaDataType(x):
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


def getTableJson(name, dataframe, dtypes=None):
    col_names = dataframe.columns.tolist()
    if dtypes is None:
        dtypes = [infer_dtype(dataframe[col]) for col in col_names]

    dtypes = [_toJavaDataType(x) for x in dtypes]

    cols = OrderedDict(zip(col_names, dtypes))

    return OrderedDict(
        type=tableType,
        name=name,
        factory=tableFactory,
        operand={'columns': cols})


def getSchemaJson(schema_name, dataframes, dfs_dtypes=None):

    if dfs_dtypes is None:
        return OrderedDict(
            name=schema_name,
            tables=[getTableJson(nm, df) for (nm, df) in dataframes.items()])
    else:
        return OrderedDict(
            name=schema_name,
            tables=[getTableJson(nm, dataframes[nm], dfs_dtypes[nm]) for nm
                    in dataframes.keys()]
        )


def getModelJson(dataFrames, dfs_dtypes=None):

    schemas = [getSchemaJson(defaultSchema, dataFrames, dfs_dtypes)]

    return OrderedDict(
        version=version, defaultSchema=defaultSchema, schemas=schemas)
