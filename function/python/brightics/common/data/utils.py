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

import re
from urllib.parse import urlparse

from brightics.brightics_java_gateway import brtc_java_gateway as gateway


def validate_column_name(df):
    invalid_column_chars = " ,;{}()\n\t="
    for column_name in df.columns:
        if any(elem in column_name for elem in invalid_column_chars):
            raise Exception("{column_name} contains invalid character(s) among {invalid_column_chars}"
                            .format(column_name=column_name, invalid_column_chars=repr(invalid_column_chars)))


def make_data_path(path):
    fs_path = gateway.default_fs_path
    if path.startswith('/') and fs_path.endswith('/'):
        path = path[1:]
    elif not path.startswith('/') and not fs_path.endswith('/'):
        path = '/' + path

    parsed_uri = urlparse(fs_path + path)
    if parsed_uri.scheme == 'hdfs':
        return fs_path + path

    if re.match('^/.+:/*', parsed_uri.path):
        return parsed_uri.path[1:]
    return parsed_uri.path


def make_data_path_from_key(key):
    return make_data_path(gateway.data_root + key)
