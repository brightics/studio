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
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from datetime import datetime
from brightics.common.exception import BrighticsFunctionException as BFE


def shift_datetime(table, **params):
    params = get_default_from_parameters_if_required(params, _shift_datetime)
    check_required_parameters(_shift_datetime, params, ['table'])
    return _shift_datetime(table, **params)


def _shift_datetime(table, input_cols, interval, shift_unit):
    out_table = table.copy()
    if shift_unit == 'year':
        time_leap = pd.DateOffset(years=interval)
    elif shift_unit == 'month':
        time_leap = pd.DateOffset(months=interval)
    elif shift_unit == 'day':
        time_leap = pd.DateOffset(days=interval)
    elif shift_unit == 'hour':
        time_leap = pd.DateOffset(hours=interval)
    elif shift_unit == 'minute':
        time_leap = pd.DateOffset(minutes=interval)
    elif shift_unit == 'second':
        time_leap = pd.DateOffset(seconds=interval)
    for col in input_cols:
        out_columns = []
        for ind, t_str in enumerate(table[col]):
            try:
                current_date = datetime(year=int(t_str[0:4]), month=int(
                    t_str[4:6]), day=int(t_str[6:8]), hour=int(t_str[8:10]),
                    minute=int(t_str[10:12]), second=int(t_str[12:14]))
            except:
                raise BFE.from_errors(
                    [{'0100': 'Invalid Datetime format at column {}, index {}.'.format(col, ind + 1)}])
            next_time = current_date + time_leap
            tmp_string = format_time(next_time)
            out_columns.append(tmp_string)
        out_table[col + '_timeshift_result'] = out_columns
    return {'out_table': out_table}


def format_time(input_time):
    # string representation of time stamp
    input_time_str = input_time.strftime('%Y%m%d%H%M%S')
    # Pad zero if needed
    input_time_str = '0' * (14 - len(input_time_str)) + input_time_str
    return input_time_str
