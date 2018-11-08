import base64
import json
import os
from io import BytesIO
from urllib.parse import urlparse

import matplotlib
import pandas as pd
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


def view_data(key):
    data_info = get_data_info(key)
    if not data_info or 'data' not in data_info:
        raise Exception('no data for ' + key)

    data = data_info['data']
    type_name = status_gateway.get_field(data_info['status'], 'typeName')
    if isinstance(data, pd.DataFrame):
        return data_json.to_json({
            'type': 'table',
            'data': {
                'count': data.shape[0],
                'bytes': -1,
                'schema': [{'column-name': c, 'column-type': data.dtypes[c].name} for c in data.columns.to_series()],
                'data': [[d[col_name] for col_name in data.columns] for index, d in data.iterrows()]
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
        data_type = _get_data_type(data)
    status = gateway.data_status(key, data_type, label)

    data_dict[key] = {'data': _generate_matplotlib_data(data) if data_type == 'image' else data, 'status': status}

    gateway.notify_data_updated(key, status)


def read_parquet(path):
    return table_reader.read_parquet(data_util.make_data_path(path))


def read_redis(key):
    return KVStoreClient.get(key)


def _get_data_status_json(data):
    return json.loads(data['status'].toJson())


def _write_dataframe(dataframe, path):
    path = data_util.make_data_path(path)

    _make_directory_if_needed(path)

    table = pa.Table.from_pandas(dataframe, preserve_index=False)
    pq.write_table(table, path)


def _make_directory_if_needed(path):
    """
    Make directory to local file system when the path scheme is not hdfs and the path directory is not exist.

    :param path: File location full path
    """
    parsed_uri = urlparse(path)
    if parsed_uri.scheme == 'hdfs':  # Doesn't need to make dirs
        return

    directory_path = os.path.dirname(parsed_uri.path)
    if not os.path.exists(directory_path):
        os.makedirs(directory_path)


def _generate_matplotlib_data(p):  # common?
    img = BytesIO()
    p.savefig(img, format='png')
    p.clf()  # clear the current figure

    return _png2uri(img.getvalue().strip())


def _png2uri(png_str):
    img_str = b"data:image/png;base64,"
    img_str += base64.b64encode(png_str)
    img_str = img_str.decode('ascii')

    return img_str


def _get_data_type(data):
    if isinstance(data, pd.DataFrame) or (psdf and isinstance(data, psdf.DataFrame)):
        return 'table'
    elif hasattr(data, 'savefig'):
        return 'image'
    elif isinstance(data, str):
        return 'text'
    return type(data).__name__
