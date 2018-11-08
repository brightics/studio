import sqlalchemy
from sqlalchemy.pool import NullPool


class DbEngine:
    dialect_dict = {
        'postgre': 'postgresql+psycopg2',
        'oracle': 'oracle+cx_oracle',
        'mysql': 'mysql+pymysql',
        'mariadb': 'mysql+pymysql'
    }
    required_keys = {'dbType', 'username', 'password', 'ip', 'port', 'dbName'}

    def __init__(self, **kwargs):
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
