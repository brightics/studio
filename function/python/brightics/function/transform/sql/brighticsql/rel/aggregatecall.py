import numpy as np
from pandas.core.dtypes.missing import isna

from brighticsql.functions.aggregate_functions import (
    aggregate_functions)
from brighticsql.utils.group_util import get_distinct_elem


class AggReturn:
    def __init__(self, value, dtype):
        self.value = value
        self.dtype = dtype

    def __iter__(self):
        yield self.value
        yield self.dtype


class AggregateCall:
    def __init__(self, arglist, distinct, aggfunc):
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
