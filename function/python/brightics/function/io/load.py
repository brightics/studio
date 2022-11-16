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
import os

import boto3
import pandas as pd

import brightics.common.data.table_data_reader as table_reader
import brightics.common.data.utils as util
import brightics.common.datajson as data_json
from brightics.common.datasource import DbEngine
from brightics.common.validation import raise_runtime_error
from brightics.common.exception import BrighticsFunctionException as BFE


def read_csv(path, engine='python', delimiter=',', na_filter=False, strip_col=False, quoting=3, encoding='utf-8'):
    if quoting == True:
        quoting = 0
    elif quoting == False:
        quoting = 3
    dir_data = os.getcwd() + '/data'
    path = os.path.join(dir_data, path)
    res = pd.DataFrame()
    if os.path.isfile(path):
        res = table_reader.read_csv(path, engine, delimiter, na_filter, strip_col, quoting, encoding)
    elif os.path.isdir(path):
        for f in os.listdir(path):
            if f.endswith('.csv'):
                f_path = os.path.join(path, f)
                try:
                    tmp = table_reader.read_csv(f_path, engine, delimiter, na_filter, strip_col, quoting, encoding)
                except:
                    raise BFE.from_errors([{'0100': 'Can not read ' + f_path + '.'}])
                if res.shape != (0, 0) and not res.columns.equals(tmp.columns):
                    raise BFE.from_errors([{'0100': 'Files under ' + path + ' do not have same schema.'}])
                res = pd.concat([res, tmp])
    else:
        raise BFE.from_errors([{'0100': 'Path ' + path + ' is incorrect.'}])
    for i, col in enumerate(res.columns):
        res = res.rename(columns={'Unnamed: {i}'.format(i=i): 'Unnamed_{i}'.format(i=i)})

    return {'table': res}


def load_model(path):
    with open(path, 'rb') as fp:
        js = json.load(fp)

    return {'model': data_json.from_json(js)}


def read_from_s3_2(object_key, access_key_id, secret_access_key, bucket_name):
    datasource = {'accessKeyId':access_key_id, 'secretAccessKey':secret_access_key, 'bucketName':bucket_name}
    return read_from_s3(datasource, object_key)

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
    import re
    sqlToken = re.sub(' +',' ',sql.lower().replace("(", " ( ").replace(")", " ) " )).replace(". ", ".").split(" ")
    for i in range(len(sqlToken)):
        if sqlToken[i] == 'from':
            tmp_token = sqlToken[i+1].split('.')
            if len(tmp_token) == 2 and tmp_token[1] in sys_table_lists:
                raise Exception('Cannot access system tables from Brightics: {}'.format(sqlToken[i+1]))
    with DbEngine(**datasource) as engine:
        df = pd.read_sql_query(sql, engine)
        util.validate_column_name(df)
        return {'table': df}


def read_parquet_or_csv(path):
    return {'table': table_reader.read_parquet_or_csv(path)}


def load(partial_path=['/brightics@samsung.com/upload/sample_iris.csv']):
    if isinstance(partial_path, list):
        partial_path = partial_path[0]

    if partial_path.endswith("/"):
        partial_path = partial_path[:-1]
        
    return {'table': table_reader.read_parquet(util.make_data_path_from_key(partial_path))}


sys_table_lists = set(['pg_statistic', 'pg_type', 'pg_roles', 'pg_shadow', 'pg_authid',
       'pg_group', 'pg_user', 'pg_rules', 'pg_views', 'pg_tables',
       'pg_matviews', 'pg_indexes', 'pg_stats', 'pg_settings', 'pg_locks',
       'pg_cursors', 'pg_available_extensions',
       'pg_available_extension_versions', 'pg_prepared_xacts',
       'pg_prepared_statements', 'pg_seclabels', 'pg_timezone_abbrevs',
       'pg_timezone_names', 'pg_stat_all_tables',
       'pg_stat_xact_all_tables', 'pg_stat_sys_tables',
       'pg_stat_xact_sys_tables', 'pg_stat_user_tables',
       'pg_stat_xact_user_tables', 'pg_statio_all_tables',
       'pg_statio_sys_tables', 'pg_statio_user_tables', 'pg_attribute',
       'pg_proc', 'pg_statio_all_indexes', 'pg_statio_sys_indexes',
       'pg_statio_user_indexes', 'pg_statio_all_sequences',
       'pg_statio_sys_sequences', 'pg_statio_user_sequences',
       'pg_stat_activity', 'pg_stat_replication', 'pg_replication_slots',
       'pg_stat_database', 'pg_stat_database_conflicts',
       'pg_stat_user_functions', 'pg_stat_xact_user_functions',
       'pg_stat_archiver', 'pg_stat_bgwriter', 'pg_user_mappings',
       'pg_user_mapping', 'pg_attrdef', 'pg_constraint', 'pg_index',
       'pg_operator', 'pg_opfamily', 'pg_opclass', 'pg_am', 'pg_amop',
       'pg_amproc', 'pg_language', 'pg_database', 'pg_stat_all_indexes',
       'pg_stat_sys_indexes', 'pg_stat_user_indexes',
       'information_schema_catalog_name', 'applicable_roles',
       'administrable_role_authorizations', 'pg_aggregate', 'pg_rewrite',
       'pg_trigger', 'pg_event_trigger', 'pg_description', 'pg_cast',
       'pg_enum', 'pg_namespace', 'pg_conversion', 'pg_depend',
       'pg_db_role_setting', 'pg_tablespace', 'pg_pltemplate',
       'pg_auth_members', 'pg_shdepend', 'pg_shdescription',
       'pg_ts_config', 'pg_ts_config_map', 'pg_ts_dict', 'pg_ts_parser',
       'pg_ts_template', 'pg_extension', 'pg_foreign_data_wrapper',
       'pg_foreign_server', 'pg_foreign_table', 'pg_default_acl',
       'pg_seclabel', 'pg_shseclabel', 'pg_collation', 'pg_range',
       'pg_largeobject', 'attributes', 'character_sets',
       'check_constraint_routine_usage', 'check_constraints',
       'collations', 'collation_character_set_applicability',
       'column_domain_usage', 'column_privileges', 'column_udt_usage',
       'columns', 'constraint_column_usage', 'constraint_table_usage',
       'domain_constraints', 'domain_udt_usage', 'domains',
       'enabled_roles', 'key_column_usage', 'parameters',
       'referential_constraints', 'role_column_grants',
       'routine_privileges', 'role_routine_grants', 'routines',
       'schemata', 'sequences', 'sql_implementation_info',
       'sql_languages', 'sql_packages', 'table_constraints',
       'table_privileges', 'role_table_grants', 'tables',
       'triggered_update_columns', 'triggers', 'udt_privileges',
       'role_udt_grants', 'usage_privileges', 'role_usage_grants',
       'user_defined_types', 'view_column_usage', 'view_routine_usage',
       'view_table_usage', 'views', 'data_type_privileges',
       'element_types', '_pg_foreign_table_columns', 'column_options',
       '_pg_foreign_data_wrappers', 'foreign_data_wrapper_options',
       'foreign_data_wrappers', '_pg_foreign_servers',
       'foreign_server_options', 'foreign_servers', '_pg_foreign_tables',
       'foreign_table_options', 'foreign_tables', '_pg_user_mappings',
       'user_mapping_options', 'user_mappings', 'sql_sizing',
       'sql_sizing_profiles', 'pg_class', 'pg_largeobject_metadata',
       'pg_inherits', 'sql_features', 'sql_parts'])