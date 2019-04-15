import pandas as pd
import pyarrow

import brightics.common.data.utils as data_util


def read_parquet_or_csv(path):
    try:
        # try parquet data storage first using path as key
        df = pd.read_parquet(path=data_util.make_data_path_from_key(path),
                             engine='pyarrow')
    except pyarrow.lib.ArrowIOError:
        df = read_csv(path)

    data_util.validate_column_name(df)

    return df


def read_csv(path):
    return pd.read_csv(path, engine='python', quoting=3, encoding='utf-8', na_filter = False)


def read_parquet(path):
    df = pd.read_parquet(path=path, engine='pyarrow')
    data_util.validate_column_name(df)
    return df
