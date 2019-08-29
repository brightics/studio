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


def read_csv(path, delimiter, na_filter, strip_col):
    try:
        result = pd.read_csv(path, engine='python', quoting=3, encoding='utf-8-sig', na_filter = na_filter, sep = delimiter)
    except Exception:
        result = pd.read_csv(path, engine='python', quoting=3, na_filter = na_filter, sep = delimiter)
    if strip_col:
        result.columns = result.columns.str.strip()
    return result


def read_parquet(path):
    df = pd.read_parquet(path=path, engine='pyarrow')
    data_util.validate_column_name(df)
    return df
