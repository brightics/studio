import brightics.common.json as data_json
import json
import codecs
import os
import pandas as pd
import io
import boto3
from brightics.common.datasource import DbEngine
from brightics.function.validation import raise_runtime_error


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


def write_to_db(table, tableName, datasource, ifExists='fail'):
    if not isinstance(table, pd.DataFrame):
        raise_runtime_error('table is not pandas.DataFrame')

    with DbEngine(**datasource) as engine:
        table.to_sql(tableName, engine, if_exists=ifExists, index=False)
