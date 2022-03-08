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

import base64
import json
import os
from io import BytesIO

import matplotlib
import pandas as pd
from pandas.core.dtypes.missing import isna
import numpy as np
import py4j.java_gateway as status_gateway
import pyarrow as pa
import pyarrow.parquet as pq

import brightics.common.data.table_data_reader as table_reader
import brightics.common.data.utils as data_util
import brightics.common.json as data_json
from brightics.brightics_java_gateway import brtc_java_gateway as gateway
from brightics.brightics_kv_store_client import KVStoreClient

matplotlib.use("agg")

try:
    import pyspark.sql.dataframe as psdf
except:
    psdf = None

data_dict = {}


def get_data_info(key):
    if key in data_dict:
        return data_dict[key]
    else:
        return None


def get_data_status(key):
    data_status = get_data_info(key)
    if data_status:
        return _get_data_status_json(data_status)
    else:
        return None


def get_data(key):
    data_status = get_data_info(key)
    if data_status:
        return data_status['data']
    else:
        return None


def list_status():
    return [_get_data_status_json(status) for status in data_dict.values()]


def view_data(key, min=0, max=1000, column_index=None):
    data_info = get_data_info(key)
    if not data_info or 'data' not in data_info:
        raise Exception('no data for ' + key)

    data = data_info['data']
    type_name = status_gateway.get_field(data_info['status'], 'typeName')
    if isinstance(data, pd.DataFrame):
        def schema_map(df):
            _dtypemap = {
                'int': 'long',
                'int32': 'int',
                'int64': 'long',
                'float64': 'double',
                'U': 'string',
                'S': 'string',
                'object': 'string',
                'string': 'string',
                'bool': 'boolean',
                'boolean': 'boolean',
                'array(double)': 'array(double)',
                'array(int)': 'array(int)',
                'array(long)': 'array(long)',
                'array(string)': 'array(string)',
                'array(boolean)': 'array(string)'
            }

            def col_dtype(col):
                for elem in col:
                    if isinstance(elem, np.ndarray):
                        if elem.dtype.kind in {'S', 'U'}:
                            return 'array(string)'
                        else:
                            return 'array(' + _dtypemap[elem.dtype.name] + ')'
                    elif isinstance(elem, list):
                        return 'array(' + col_dtype(elem) + ')'
                    else:
                        if not isna(elem):
                            if isinstance(elem, str):
                                return 'string'
                            elif isinstance(elem, bool):
                                return 'boolean'
                            elif isinstance(elem, int):
                                return 'long'
                            elif isinstance(elem, float):
                                return 'double'
                return 'object'

            if column_index :
                for i, (colname, dtype) in enumerate(zip(df.columns, df.dtypes)):
                    if column_index.__contains__(i):
                        dt = col_dtype(df[colname]) \
                            if dtype.name == 'object' else dtype.name
                        yield {'column-name': colname, 'column-type': _dtypemap[dt]}
            else:
                for colname, dtype in zip(df.columns, df.dtypes):
                    dt = col_dtype(df[colname]) \
                        if dtype.name == 'object' else dtype.name
                    yield {'column-name': colname, 'column-type': _dtypemap[dt]}

        def ensure_none(df):
            if column_index :
                inner_df = df.iloc[min:max , column_index ]
            else:
                inner_df = df.iloc[min:max , ]
            val = inner_df.values
            if isna(val).any():
                val[isna(inner_df.values)] = None
            return val

        column_list = list(schema_map(data))
        row_values = ensure_none(data)
        return data_json.to_json({
            'type': 'table',
            'data': {
                'count': row_values.__len__(),
                'bytes': -1,
                'schema': column_list,
                'data': row_values,
                'columnCount':column_list.__len__()
            }
        })
    elif psdf and isinstance(data, psdf.DataFrame):
        return data_json.to_json({
            'type': 'table',
            'data': {
                'count': data.count(),
                'bytes': -1,
                'schema': [{'column-name': c[0], 'column-type': c[1]} for c in data.dtypes],
                'data': [[col for col in row] for row in data.collect()]
            }
        })
    else:
        return data_json.to_json({
            'type': type_name,
            'data': data
        })


def view_schema(key):
    data_info = get_data_info(key)
    if not data_info or 'data' not in data_info:
        raise Exception('no data for ' + key)

    data = data_info['data']
    if isinstance(data, pd.DataFrame):
        return data_json.to_json({
            'type': 'table',
            'data': {
                'count': -1,
                'bytes': -1,
                'schema': [{'column-name': c, 'column-type': data.dtypes[c].name} for c in data.columns.to_series()]
            }
        })
    elif psdf and isinstance(data, psdf.DataFrame):
        return data_json.to_json({
            'type': 'table',
            'data': {
                'count': -1,
                'bytes': -1,
                'schema': [{'column-name': c[0], 'column-type': c[1]} for c in data.dtypes]
            }
        })


def write_data(key, path):
    data_info = get_data_info(key)
    if not data_info:
        return None

    if isinstance(data_info['data'], pd.DataFrame):
        _write_dataframe(data_info['data'], path)
        gateway.update_context_type(data_info['status'], path)
    elif psdf and isinstance(data_info['data'], psdf.DataFrame):
        dataframe = data_info['data'].toPandas()
        _write_dataframe(dataframe, path)
        gateway.update_context_type(data_info['status'], path)
    else:
        KVStoreClient.set(key, data_info['data'])
        gateway.update_context_type(data_info['status'], path, 'kv_store')

    gateway.notify_data_updated(key, data_info['status'])

    data_info['data'] = None  # Delete data from data dictionary after write

    return data_info['status'].toJson()


def delete_data(key):
    if key in data_dict:
        del data_dict[key]

        gateway.notify_data_deleted(key)

        return True
    return False


def put_data(key, data, label="Python data", data_type=None):
    if data_type is None:
        data, data_type = _get_data_type(data)
    status = gateway.data_status(key, data_type, label)

    data_dict[key] = {'data': data, 'status': status}

    gateway.notify_data_updated(key, status)


def read_parquet(path):
    return table_reader.read_parquet(data_util.make_data_path(path))


def read_redis(key):
    return KVStoreClient.get(key)


def _get_data_status_json(data):
    return json.loads(data['status'].toJson())


def _write_dataframe(dataframe, path):
    if dataframe.columns.empty:
        raise Exception('Empty DataFrame cannot be written.')

    if not path.startswith('hdfs://'):
        path = data_util.make_data_path(path)

    _make_directory_if_needed(path)

    table = pa.Table.from_pandas(dataframe, preserve_index=False)
    pq.write_table(table, path)


def _make_directory_if_needed(path):
    """
    Make directory to local file system when the path scheme is not hdfs and the path directory is not exist.

    :param path: File location full path
    """
    directory_path = os.path.dirname(path)
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)


def _generate_pil_data(p):
    buffered = BytesIO()
    p.save(buffered, format="PNG")
    return _png2uri(buffered.getvalue())


def _generate_matplotlib_data(p):
    img = BytesIO()
    p.savefig(img, format='png')
    p.close()  # clear the current figure
    return _png2uri(img.getvalue().strip())


def _png2uri(png_str):
    img_str = b"data:image/png;base64,"
    img_str += base64.b64encode(png_str)
    img_str = img_str.decode('ascii')
    return img_str


def _get_data_type(data):
    if isinstance(data, pd.DataFrame) or (psdf and isinstance(data, psdf.DataFrame)):
        return data, 'table'
    elif hasattr(data, 'savefig'):
        return _generate_matplotlib_data(data), 'image'
    elif 'PIL' in str(type(data)):
        return _generate_pil_data(data), 'image'
    # TODO numpy.ndarray sometimes means image from cv2 that must be parsed by this way.
    #    import cv2
    #    retval, buffer = cv2.imencode('.png', img)
    #    return _png2uri(base64.b64encode(buffer))
    elif isinstance(data, str):
        return data, 'text'
    return data, type(data).__name__
