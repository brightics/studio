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

# -*- coding: utf-8 -*-

from collections import namedtuple
import numpy as np


aggfbase = namedtuple('aggfbase', ['fexp', 'func', 'ret_dtype'])


non_numeric_agg = {
    'COUNT': aggfbase('count', np.sum, np.dtype('int64')),
    'SIZE': aggfbase('count', np.size, np.dtype('int64'))
}

numeric_agg = {
    'AVG': aggfbase('avg', np.mean, np.dtype('float64')),
    'MAX': aggfbase('max', np.max, 'argdtype'),
    'MIN': aggfbase('min', np.min, 'argdtype'),
    'SUM': aggfbase('sum', np.sum, 'argdtype')
}

aggregate_functions = dict()
aggregate_functions.update(numeric_agg)
aggregate_functions.update(non_numeric_agg)
