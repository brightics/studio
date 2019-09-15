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

import os
import sqlalchemy
from sqlalchemy.pool import NullPool


class DbEngine:
    dialect_dict = {
        'postgre': 'postgresql+pg8000',
        'oracle': 'oracle+cx_oracle',
        'mysql': 'mysql+pymysql',
        'mariadb': 'mysql+pymysql',
        'mssql' : 'mssql+pymssql'
    }
    required_keys = {'dbType', 'username', 'password', 'ip', 'port', 'dbName'}

    def __init__(self, **kwargs):
        os.environ['NLS_LANG'] = '.UTF8'
        diff = self.required_keys - kwargs.keys()
        if diff:
            raise Exception(diff.pop() + ' is required parameter')

        datasource = {}
        datasource.update(kwargs)
        datasource.update({'driver': self._resolve_dialect(datasource.get('dbType'))})
        self.url = "{driver}://{username}:{password}@{ip}:{port}/{dbName}".format(**datasource)

    def __enter__(self):
        self.engine = sqlalchemy.create_engine(self.url, poolclass=NullPool)
        return self.engine

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.engine = None

    def _resolve_dialect(self, db_type):
        if self.dialect_dict.get(db_type) is None:
            raise Exception(db_type + ' is not supported')
        return self.dialect_dict.get(db_type)
