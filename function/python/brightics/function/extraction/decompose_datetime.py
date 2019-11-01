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
import datetime
from brightics.common.utils import check_required_parameters


def decompose_datetime(table, **params):
    check_required_parameters(_decompose_datetime, params, ['table'])
    return _decompose_datetime(table, **params)

    
def _decompose_datetime(table, input_cols):
    weekday_dict = {1:'Monday', 2:'Tuesday', 3:'Wednesday', 4:'Thursday', 5:'Friday', 6:'Saturday', 7:'Sunday'}
    out_table = table.copy()
    for col in input_cols:
        year = []
        month = []
        day = []
        hour = []
        week = []
        weekday = []
        for t_str in table[col]:
            try:
                tmp = datetime.datetime(year=int(t_str[0:4]), month=int(t_str[4:6]), day=int(t_str[6:8]), hour=int(t_str[8:10]))
                year.append(tmp.year)
                month.append(tmp.month)
                day.append(tmp.day)
                _week, _weekday = tmp.isocalendar()[1:]
                week.append(_week)
                weekday.append(weekday_dict[_weekday])
            except:
                year.append(None)
                month.append(None)
                day.append(None)
                week.append(None)
                weekday.append(None)
        out_table[col + '_year'] = year
        out_table[col + '_month'] = month
        out_table[col + '_day'] = day
        out_table[col + '_week'] = week
        out_table[col + '_dayname'] = weekday
    return {'out_table': out_table}

