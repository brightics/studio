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


def transpose_time_series(table, **params):
    check_required_parameters(_transpose_time_series, params, ['table'])
    return _transpose_time_series(table, **params)

    
def _transpose_time_series(table, input_cols, output_col1, output_col2, sort_by=None, keep_sort_by=False):
    out_table = pd.DataFrame()
    if sort_by:
        out_table[output_col1] = input_cols if not keep_sort_by else input_cols + [sort_by]
        dt = np.array(table[[sort_by] + input_cols])
        dt = dt[dt[:, 0].argsort()]
        tmp = list()
        for i in range(len(input_cols)):
            tmp_d = list()
            for d in dt[:, i + 1]:
                if type(d) == list:
                    tmp_d += d
                elif type(d) == np.ndarray:
                    tmp_d += list(d)
                else:
                    tmp_d.append(d)
            tmp.append(tmp_d)
        if keep_sort_by:
            tmp.append([])
        out_table[output_col2] = tmp
        if keep_sort_by:
            tmp = [[]] * len(input_cols)
            tmp.append(dt[:, 0])
            out_table[sort_by] = tmp
    else:
        out_table[output_col1] = input_cols
        dt = np.array(table[input_cols])
        tmp = list()
        for i in range(len(input_cols)):
            tmp_d = list()
            for d in dt[:, i]:
                if type(d) == list:
                    tmp_d += d
                elif type(d) == np.ndarray:
                    tmp_d += list(d)
                else:
                    tmp_d.append(d)
            tmp.append(tmp_d)
        out_table[output_col2] = tmp
        
    return {'out_table': out_table}
