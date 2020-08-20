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

from pandas.core.dtypes.missing import isna
import numpy as np

from ..utils.group_util import get_distinct_elem
from ..functions.aggregate_functions import (
    numeric_agg, aggregate_functions)


class AggReturn:
    def __init__(self, value, dtype):
        self.value = value
        self.dtype = dtype

    def __iter__(self):
        yield self.value
        yield self.dtype


class AggregateCall:
    def __init__(self, arglist, distinct, aggfunc, **kwargs):
        self.arglist = arglist
        self.distinct = distinct
        if aggfunc == 'COUNT' and not arglist:
            aggfunc = 'SIZE'
        self.aggfunc = aggfunc
        self.func = aggregate_functions[aggfunc]

    def __repr__(self):
        return f'{self.aggfunc}({",".join([f"${i}" for i in self.arglist])})'

    def __call__(self, arg, dtype):
        _, agg, ret_dtype = self.func
        if not isinstance(ret_dtype, np.dtype):
            ret_dtype = dtype
        if self.distinct:
            arg = get_distinct_elem(arg)
        if self.aggfunc != 'SIZE':
            naidx = isna(arg)
            eidx = np.logical_not(naidx)
            arg = eidx if self.aggfunc == 'COUNT' else arg[eidx]
        try:
            retval = agg(arg)
        except ZeroDivisionError:
            retval = np.nan
        return AggReturn(np.array([retval]), ret_dtype)
