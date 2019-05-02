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

import io
import json
import os
import codecs
import shutil

import pandas as pd
import boto3

import brightics.common.json as data_json
from brightics.common.datasource import DbEngine
from brightics.common.validation import raise_runtime_error
from brightics.brightics_data_api import _write_dataframe
import brightics.common.data.utils as data_utils
from brightics.common.utils import check_required_parameters

def unload(table, partial_path):
    path = data_utils.make_data_path_from_key(partial_path[0])
    if os.path.isdir(path):
        shutil.rmtree(path)
    _write_dataframe(table, path)


def write_csv(table, path):
    table.to_csv(path, index=False)


def unload_model(model, path):
    dir_ = os.path.dirname(path)
    if not os.path.exists(dir_):
        os.makedirs(dir_)
    with open(path, 'wb') as fp:
        json.dump(data_json.to_json(model, for_redis=True), codecs.getwriter('utf-8')(fp), ensure_ascii=False)


def write_to_s3(table, datasource, object_key):
    client = boto3.client(
        's3',
        aws_access_key_id=datasource['accessKeyId'],
        aws_secret_access_key=datasource['secretAccessKey'],
        use_ssl=False
    )
    csv_buffer = io.StringIO()
    table.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    client.put_object(Bucket=datasource['bucketName'], Key=object_key, Body=csv_buffer.getvalue())
    
def write_to_db(table, **params):
    check_required_parameters(_write_to_db, params, ['table'])
    return _write_to_db(table, **params)


def _write_to_db(table, tableName, datasource, ifExists='fail'):
    if not isinstance(table, pd.DataFrame):
        raise_runtime_error('table is not pandas.DataFrame')

    with DbEngine(**datasource) as engine:
        table.to_sql(tableName, engine, if_exists=ifExists, index=False)
