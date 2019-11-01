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
from datetime import datetime, timedelta
from brightics.common.exception import BrighticsFunctionException as BFE
from brightics.function.extraction.shift_datetime import format_time


def extend_datetime(table, **params):
    params = get_default_from_parameters_if_required(params, _extend_datetime)
    check_required_parameters(_extend_datetime, params, ['table'])
    return _extend_datetime(table, **params)


def _extend_datetime(table, input_col, impute_unit):
    arr_order = []
    datetime_list = []
    for ind, t_str in enumerate(table[input_col]):
        try:
            if impute_unit == 'year':
                arr_order.append(
                    datetime(year=int(t_str[0:4]), month=1, day=1))
            elif impute_unit == 'month':
                arr_order.append(datetime(year=int(t_str[0:4]), month=int(
                    t_str[4:6]), day=1))
            elif impute_unit == 'day':
                arr_order.append(datetime(year=int(t_str[0:4]), month=int(
                    t_str[4:6]), day=int(t_str[6:8])))
            elif impute_unit == 'hour':
                arr_order.append(datetime(year=int(t_str[0:4]), month=int(
                    t_str[4:6]), day=int(t_str[6:8]), hour=int(t_str[8:10])))
            elif impute_unit == 'minute':
                arr_order.append(datetime(year=int(t_str[0:4]), month=int(
                    t_str[4:6]), day=int(t_str[6:8]), hour=int(t_str[8:10]),
                    minute=int(t_str[10:12])))
            datetime_list.append(datetime(year=int(t_str[0:4]), month=int(
                t_str[4:6]), day=int(t_str[6:8]), hour=int(t_str[8:10]),
                minute=int(t_str[10:12]), second=int(t_str[12:14])))
        except:
            raise BFE.from_errors(
                [{'0100': 'Invalid Datetime format at column {}, index {}.'.format(input_col, ind + 1)}])
    # check for ascending order
    # If not -> log message error.
    tmp = check_ascending(arr_order)
    if not tmp[0]:
        log_message = 'Date time coulumn should be in strictly ascending order with the unit {}. '.format(
            impute_unit)
        log_message += 'The following is the first five invalid data: {}'.format(
            table[input_col][tmp[1]:tmp[1] + 5].tolist())
        raise BFE.from_errors([{'0100': log_message}])
    out_table = insert_datetime(
        table.copy(), input_col, arr_order, datetime_list, impute_unit)
    return {'out_table': out_table}


def insert_datetime(table, input_col, arr_order, datetime_list, impute_unit):
    new_col = 'datetime_estimation_info'
    origin_cols = table.columns.tolist()
    input_col_index = origin_cols.index(input_col)
    if impute_unit == 'year':
        time_leap = pd.DateOffset(years=1)
    elif impute_unit == 'month':
        time_leap = pd.DateOffset(months=1)
    elif impute_unit == 'day':
        time_leap = pd.DateOffset(days=1)
    elif impute_unit == 'hour':
        time_leap = pd.DateOffset(hours=1)
    elif impute_unit == 'minute':
        time_leap = pd.DateOffset(minutes=1)
    length = len(arr_order)
    table_arr = table.values
    out_table_list = []
    new_info_list = []
    for index in range(length - 1):
        # add data of original row
        if index == 0:
            if arr_order[index] + time_leap in arr_order:
                new_info_list.append('n')
            else:
                new_info_list.append('s')
        else:
            if arr_order[index] + time_leap in arr_order:
                if arr_order[index] - time_leap in arr_order:
                    new_info_list.append('n')
                else:
                    new_info_list.append('e')
            else:
                if arr_order[index] - time_leap in arr_order:
                    new_info_list.append('s')
                else:
                    new_info_list.append('e/s')
        out_table_list.append(table_arr[index])
        # fill missing datetime
        tmp_time = arr_order[index]
        while True:
            tmp_time = tmp_time + time_leap
            if tmp_time >= arr_order[index + 1]:
                break
            new_info_list.append('f')
            hold_value = table_arr[index].copy()
            hold_value[input_col_index] = format_time(tmp_time)
            out_table_list.append(hold_value)
    if arr_order[length - 1] - time_leap in arr_order:
        new_info_list.append('n')
    else:
        new_info_list.append('e')
    out_table_list.append(table_arr[length - 1])
    out_table = pd.DataFrame(out_table_list, columns=origin_cols)
    out_table[new_col] = new_info_list
    return out_table


def check_ascending(arr_order):
    for ind in range(len(arr_order) - 1):
        if arr_order[ind] >= arr_order[ind + 1]:
            return False, ind
    return True, 0
