import json

import boto3
import pandas as pd

import brightics.common.data.table_data_reader as table_reader
import brightics.common.data.utils as util
import brightics.common.json as data_json
from brightics.common.datasource import DbEngine
from brightics.function.validation import raise_runtime_error


def read_csv(path):
    return {'table': table_reader.read_csv(path)}


def load_model(path):
    with open(path, 'rb') as fp:
        js = json.load(fp)

    return {'model': data_json.from_json(js)}


def read_from_s3(datasource, object_key):
    client = boto3.client(
            's3',
            aws_access_key_id=datasource['accessKeyId'],
            aws_secret_access_key=datasource['secretAccessKey'],
            use_ssl=False
    )
    obj = client.get_object(Bucket=datasource['bucketName'], Key=object_key)
    return {'table': pd.read_csv(obj['Body'])}


def read_from_db(datasource, sql):
    if sql is None:
        raise_runtime_error('sql is required parameter')

    with DbEngine(**datasource) as engine:
        df = pd.read_sql_query(sql, engine)
        util.validate_column_name(df)
        return {'table': df}


def read_parquet_or_csv(path):
    return {'table': table_reader.read_parquet_or_csv(path)}


def load(partial_path=['/brightics@samsung.com/upload/sample_iris.csv']):
    return {'table': table_reader.read_parquet(util.make_data_path_from_key(partial_path[0]))}
