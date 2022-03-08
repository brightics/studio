from brightics.common.datasource import DbEngine
import pandas as pd
import brightics.common.data.utils as util

def create_csvfile_from_db(sql, db_type, username, password, ip, port, db_name, outfile, chunk_size=100000):
    datasource = {}
    datasource['dbType'] = db_type
    datasource['username'] = username
    datasource['password'] = password
    datasource['ip'] = ip
    datasource['port'] = port
    datasource['dbName'] = db_name
    with DbEngine(**datasource) as engine:
        df_gen = pd.read_sql_query(sql, engine, chunksize=chunk_size)
    first_try = True
    for df in df_gen:
        if first_try:
            util.validate_column_name(df)
            df.to_csv(outfile, mode='w', header=True, index=False)
            first_try = False
        else:
            df.to_csv(outfile, mode='a', header=False, index=False)
