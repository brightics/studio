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
import numpy as np
import pandas as pd
import boto3

from brightics.function.utils import _model_dict_scala, _model_dict
import brightics.common.datajson as data_json
from brightics.common.datasource import DbEngine
from brightics.common.validation import raise_runtime_error
from brightics.brightics_data_api import _write_dataframe
import brightics.common.data.utils as data_utils
from brightics.common.utils import check_required_parameters
import brightics.common.data.table_data_reader as table_reader
from brightics.brightics_java_gateway import brtc_java_gateway as gateway


def could_delete_path(path):
    path = path if path[-1] == '/' else  path + '/'
    if gateway.data_root in path and gateway.data_root != path:
        return True
    return False


def unload(table, partial_path, mode="overwrite"):
    path = partial_path[0] if isinstance(partial_path, list) else partial_path
    if path[0].startswith('.'):
        raise_runtime_error('Cannot use a string to start with ".(dot)".')
    if '..' in path:
        raise_runtime_error('Cannot use a string "..(double dot)".')
    path = path if path[0].startswith('/') else '/' + path
    path = data_utils.make_data_path_from_key(path)
    if not could_delete_path(path):
        raise_runtime_error(
            'Please check a path String and a type of path. Cannot use a root of directory for the path.')
    if os.path.isdir(path):
        shutil.rmtree(path)
    if mode == "append":
        try:
            old_frame = table_reader.read_parquet(path)
            new_frame = pd.concat([old_frame, table], axis=0, ignore_index=True)
            _write_dataframe(new_frame, path)
        except:
            _write_dataframe(table, path)
    else:
        _write_dataframe(table, path)


def write_csv(table, path, mode='overwrite'):
    dir_data = os.getcwd() + '/data'
    path = os.path.join(dir_data, path)
    dir_ = os.path.dirname(path)
    if not os.path.exists(dir_):
        os.makedirs(dir_)
    if mode == 'append':
        try:
            old_frame = pd.read_csv(path)
            new_frame = pd.concat([old_frame, table], axis=0, ignore_index=True)
            new_frame.to_csv(path, index=False)
        except:
            table.to_csv(path, index=False)
    else:
        table.to_csv(path, index=False)


def _change_capital_to_under_bar(a):
    if a.isupper():
        return '_' + a.lower()
    else:
        return a


def unload_model(path, **params):
    linked = params['linked']
    if 'outputs' in linked:
        outputs = linked['outputs']
    else:
        outputs = linked['outData']
    param = linked['param']

    def getDataFromInputs(data):
        _data = params.get(data)
        if _data is None:
            _data = {}
        return _data

        # for k, v in params.items():
        #     if k is data:
        #         return v
        # return {}

    if 'model' in outputs:
        model = getDataFromInputs(outputs['model'])
    else:
        model_table = dict()
        i = 0
        if isinstance(outputs, list):
            for v in outputs:
                model_table['table_{}'.format(i + 1)] = getDataFromInputs(v)
                i += 1
        else:
            for k, v in outputs.items():
                model_table['table_{}'.format(i + 1)] = getDataFromInputs(v)
                i += 1
        if ('groupby' in param and param['groupby']) or ('group_by' in param and param['group_by']):
            if 'groupby' in param:
                group_by = param['groupby']
            else:
                group_by = param['group_by']
            sample_table = model_table['table_1']
            groups = sample_table[group_by].drop_duplicates().values
            group_keys = np.array([_group_key_from_list(row) for row in groups])
            group_key_dict = {k: v.tolist() for k, v in zip(group_keys, groups)}
            model = {
                '_grouped_data': _grouped_data(group_by=group_by, group_key_dict=group_key_dict)
            }
            for group_key in group_key_dict:
                group_key_row = group_key_dict[group_key]
                tmp_model_table = model_table.copy()
                for k, v in tmp_model_table.items():
                    for group_by_col, group in zip(group_by, group_key_row):
                        v = v[v[group_by_col] == group]
                    tmp_model_table[k] = v.reset_index(drop=True)
                model['_grouped_data']['data'][group_key] = _unload_model(tmp_model_table, linked, param)
        else:
            model = _unload_model(model_table, linked, param)
    dir_ = os.path.dirname(path)
    if not os.path.exists(dir_):
        os.makedirs(dir_)
    with open(path, 'wb') as fp:
        json.dump(data_json.to_json(model, for_redis=True), codecs.getwriter('utf-8')(fp), ensure_ascii=False)
    return {'model': model}


def _grouped_data(group_by, group_key_dict):
    grouped_data = {
        'data': dict(),
        'group_by': group_by,
        'group_key_dict': group_key_dict
    }
    return grouped_data


def _group_key_from_list(list_):
    GROUP_KEY_SEPA = '\u0002'
    return GROUP_KEY_SEPA.join([str(item) for item in list_])


def _unload_model(model, linked, param):
    if 'brightics' in linked['name']:
        name = linked['name'].split("$")[-1]
        name = name.replace('train', 'model')
        out_model = _model_dict(name)
    else:
        name = ''
        for i in linked['name']:
            name += _change_capital_to_under_bar(i)
        name = name[1:]
        name = name.replace('train_for_classification', 'classification_model')
        name = name.replace('train_for_regression', 'regression_model')
        name = name.replace('train', 'model')
        name = name.replace('g_b_t', 'gbt')
        name = name.replace('s_v_m', 'svm')
        out_model = _model_dict_scala(name)
    for k, v in param.items():
        if v == "false":
            v = False
        elif v == "true":
            v = True
        if k == 'intercept' or k == 'fit-intercept':
            out_model['fit_intercept'] = v
        elif k == 'ycolumn' or k == 'label-col-name':
            out_model['label_col'] = v[0]
        elif k == 'xcolumns' or k == 'columns':
            out_model['feature_cols'] = v[0]
        else:
            out_model[k.replace('-', '_')] = v
    for k, v in model.items():
        out_model[k] = v
    return out_model


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


def write_to_s3_2(table, object_key, access_key_id, secret_access_key, bucket_name):
    datasource = {'accessKeyId': access_key_id, 'secretAccessKey': secret_access_key, 'bucketName': bucket_name}
    write_to_s3(table, datasource, object_key)


def write_to_db(table, **params):
    check_required_parameters(_write_to_db, params, ['table'])
    return _write_to_db(table, **params)


def _write_to_db(table, tableName, datasource, schema=None, ifExists='fail'):
    if not isinstance(table, pd.DataFrame):
        raise_runtime_error('table is not pandas.DataFrame')

    with DbEngine(**datasource) as engine:
        table.to_sql(tableName, engine, schema=schema, if_exists=ifExists, index=False)
