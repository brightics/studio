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
import numpy as np
from collections import OrderedDict

# # CONSTANTS
version = "0.0.1"
defaultSchema = "defaultSchema"
tableFactory = "com.samsung.sds.brightics.agent.context.python.calcitepython.S2pTableFactory"
tableType = "custom"


def getModelWithSqlStmt(dataFrames, sql_stmt):
    return json.dumps(OrderedDict(
            schemaModel=_getModelJson(dataFrames),
            sqlStmt=sql_stmt),
            ensure_ascii=False,
            separators=(',', ':'))


def getModelJsonStr(dataFrames):
    return json.dumps(
            _getModelJson(dataFrames),
            ensure_ascii=False,
            indent="\t")


def _getDataType(x):
    _dataTypes = {
        np.dtype('float64'): 'double',
        np.dtype('int64'): 'integer',
        np.dtype('int32'): 'integer',
        np.dtype('object'): 'string',
        np.dtype('bool'): 'boolean'
    }

    try:
        return _dataTypes[x]
    except:
        raise TypeError('unsupported data type')


def _getTableJson(name, dataframe):
    cols = OrderedDict(zip(
        dataframe.columns.tolist(),
        [_getDataType(x) for x in dataframe.dtypes.tolist()]))

    return OrderedDict(
        type=tableType,
        name=name,
        factory=tableFactory,
        operand={'columns': cols})


def _getSchemaJson(SchemaName, dataFrames):
    return OrderedDict(
        name=SchemaName,
        tables=[_getTableJson(nm, df) for (nm, df) in dataFrames.items()])


def _getModelJson(dataFrames):
    return OrderedDict(
        version=version,
        defaultSchema=defaultSchema,
        schemas=[_getSchemaJson(defaultSchema, dataFrames)])
