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

import numpy as np
import pandas as pd
import locale
import datetime
from brightics.common.utils import check_required_parameters
from brightics.common.exception import BrighticsFunctionException

format_dict = {"%y":"%y",
               "%Y":"%Y",
               "%Y%m":"%Y%m",
               "%Y%m%d":"%Y%m%d",
               "%Y%m%d%H%M%S":"%Y%m%d%H%M%S",
               "%Y-%m-%d":"%Y-%m-%d",
               "%Y-%m-%d %H:%M:%S":"%Y-%m-%d %H:%M:%S",
               "%Y-%b-%d":"%Y-%b-%d",
               "%Y-%b":"%Y-%b","%Y%b":"%Y%b",
               "%Y-%m-%d %H:%M":"%Y-%m-%d %H:%M",
               "%y/%m/%d":"%y/%m/%d",
               "%Y/%m/%d":"%Y/%m/%d",
               "yyyymmdd_ko":"%Y년%m월%d일",
               "yyyymm_ko":"%y년 %m월",
               "mmdd_ko":"%m월%d일",
               "yyyymmdd_zh":"%Y年%m月%d日",
               "HHMMSS_ko":"%H시 %M분 %S초"}

def str_to_datetime(d_str, d_format):
    return datetime.datetime.strptime(d_str, d_format)

def datetime_to_str(d, d_format):
    return d.strftime(d_format)

def datetime_formatter(table, **params):
    check_required_parameters(_datetime_formatter, params, ['table'])
    return _datetime_formatter(table, **params)

def _datetime_formatter(table, input_cols, display_mode='replace', in_format="%Y%m%d%H%M%S", out_format="%Y-%m-%d %H:%M:%S", in_language="en_US", out_language="en_US"):
    _in_format = format_dict[in_format]
    _out_format = format_dict[out_format]
    out_table = table.copy()
    v_str_to_datetime = np.vectorize(str_to_datetime)
    v_datetime_to_str = np.vectorize(datetime_to_str)
    for col in input_cols:
        locale.setlocale(locale.LC_ALL, in_language)
        try:
            tmp = v_str_to_datetime(table[col], _in_format)
        except:
            raise BrighticsFunctionException.from_errors([{'0100':col + ' does not follow ' + _in_format + ' format.'}])
        locale.setlocale(locale.LC_ALL, out_language)
        if display_mode == 'replace':
            out_table[col] = v_datetime_to_str(tmp, _out_format)
        else:
            out_table['reformat_' + col] = v_datetime_to_str(tmp, _out_format)
        
    return {'out_table': out_table}