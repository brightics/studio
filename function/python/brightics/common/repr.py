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

from brightics.brightics_data_api import _generate_matplotlib_data, _png2uri
import re
import numpy as np
from brightics.common.datasets import load_iris


class BrtcReprBuilder:

    def __init__(self):
        self.res = {'contents': []}

    def addPlt(self, plt):
        self.res['contents'].append({'text': plt2MD(plt), 'type': 'md'})

    def addMD(self, str_):
        self.res['contents'].append({'text': str_, 'type': 'md'})

    def addRawTextMD(self, str_):
        self.res['contents'].append({'text': """```
        {str_}
        ```""".format(str_=str_), 'type': 'md'})

    def addHTML(self, str_):
        self.res['contents'].append({'text': str_, 'type': 'html'})

    def addMDFront(self, str_):
        self.res['contents'] = [{'text': str_, 'type': 'md'}] + self.res['contents']

    def addHTMLFront(self, str_):
        self.res['contents'] = [{'text': str_, 'type': 'html'}] + self.res['contents']

    def get(self):
        return self.res

    def merge(self, other_res):
        self.res['contents'].extend(other_res['contents'])


def plt2MD(plt):
    return '![image]({image})'.format(image=_generate_matplotlib_data(plt))


def png2MD(png):
    return '![image]({image})'.format(image=_png2uri(png))


def strip_margin(text):
    return re.sub('\n[ \t]*\|', '\n', text)


def pandasDF2MD(table, num_rows=20, precision=None, col_max_width=None):
    if precision is None:
        _table = table[:num_rows].copy()
    else:
        _table = table[:num_rows].copy().round(precision)

    COL_DIVIDER = '|'
    md_line = []

    cols = list(_table.columns)
    types = _table.dtypes.values

    def get_align(dtype):
        return '--:' if np.issubdtype(dtype, np.number) else ':--'

    def to_string(v, col_max_width=None):
        if not isinstance(v, str):
            return str(v)
        else:
            s = str(v)
            l = len(s)
            if col_max_width is None or col_max_width < 10 or l < col_max_width:
                return str(v)
            else:
                return s[0:col_max_width - 3] + '...'

    data = _table.values

    md_line.append(COL_DIVIDER + COL_DIVIDER.join([str(c) for c in cols]) + COL_DIVIDER)
    md_line.append(COL_DIVIDER + COL_DIVIDER.join([get_align(dt) for dt in types]) + COL_DIVIDER)

    for row in data:
        md_line.append(COL_DIVIDER + COL_DIVIDER.join([to_string(c, col_max_width) for c in row]) + COL_DIVIDER)
        # for c in row:

    return '\n'.join(md_line)


def keyValues2MD(keys, values, precision=6):
    return '\n'.join(['- {key}: {value}'.format(key=key, value=_display_value(value, precision)) for key, value in
                      zip(keys, values)])


def dict2MD(dict_, precision=6):  # 
    return '\n'.join(
        ['- {key}: {value}'.format(key=key, value=_display_value(value, precision)) for key, value in dict_.items()])


def _display_value(value, precision=6):
    if isinstance(value, float):
        return '{:.{prec}f}'.format(value, prec=precision)
    else:
        return value
