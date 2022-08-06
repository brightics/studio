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

from typing import Union, List

import numpy as np

from brighticsql.frompd.core.dtypes.inference import (is_bool, is_float,
                                                      is_integer)
from brighticsql.frompd.core.dtypes.common import (is_bool_dtype,
                                                   is_integer_dtype,
                                                   is_float_dtype,
                                                   is_numeric_dtype,
                                                   is_object_dtype,
                                                   is_string_like_dtype)
from brighticsql.frompd import isna

TYPE_U_ARR_LIST = Union[np.ndarray, list]
TYPE_U_ARR_DTYPE = Union[np.ndarray, np.dtype]
TYPE_DTYPE_LIST = List[np.dtype]


def infer_array_dtype(col: TYPE_U_ARR_LIST) -> np.dtype:
    """
    Returns array dtype for constructing new numpy ndarray.
    The return dtype is determined by dtype of the first non na element of the
    input 'col' and dtypes are upcasted by the following rules:
    bool -> bool
    integer -> int64
    float -> float64
    string -> string
    else -> object.
    Returns np.dtype('object') if all the elements in the 'col' are na values.

    Args:
        col (numpy.ndarray)

    return:
        np.dtype
    """

    for x in col:
        if not isna(x):
            if is_bool(x):
                return np.dtype('bool')
            elif is_integer(x):
                return np.dtype('int64')
            elif is_float(x):
                return np.dtype('float64')
            else:
                _dtype = np.dtype(type(x))
                if _dtype.kind in ('S', 'U'):
                    return np.dtype('str')
                elif is_object_dtype(_dtype):
                    return np.dtype('object')
    return np.dtype('object')


def upcast(lst: TYPE_DTYPE_LIST) -> np.dtype:
    """Determine the least common supertype of all dtypes in the 'lst'."""

    if all(is_string_like_dtype(item) for item in lst):
        return np.dtype('str')
    elif all(is_bool_dtype(item) for item in lst):
        return np.dtype('bool')
    elif all(is_numeric_dtype(item) for item in lst):
        if all(is_integer_dtype(item) for item in lst):
            return np.dtype('int64')
        else:
            return np.dtype('float64')
    else:
        return np.dtype('object')


def are_dtypes_compatible(dtypes1: TYPE_DTYPE_LIST,
                          dtypes2: TYPE_DTYPE_LIST) -> bool:
    """Returns if dtypes1 and dtypes2 are compatible lists of dtypes."""
    for dt1, dt2, in zip(dtypes1, dtypes2):
        if both_numeric(dt1, dt2):
            pass
        elif both_boolean(dt1, dt2):
            pass
        elif both_string(dt1, dt2):
            pass
        else:
            return False
    return True


def is_comparable(arr_or_dtype: TYPE_U_ARR_DTYPE) -> bool:
    """Returns if an object has a comparable dtype (numeric or string)."""
    return is_numeric_dtype(arr_or_dtype) or is_string_like_dtype(arr_or_dtype)


def both_comparable(a: np.dtype, b: np.dtype) -> bool:
    """Check if both objects have comparable dtypes (numeric or string)."""
    return is_comparable(a) and is_comparable(b)


def both_boolean(a: np.dtype, b: np.dtype) -> bool:
    """Check if both objects have boolean dtypes."""
    return is_bool_dtype(a) and is_bool_dtype(b)


def both_numeric(a: np.dtype, b: np.dtype) -> bool:
    """Check if both objects have numeric dtypes."""
    return is_numeric_dtype(a) and is_numeric_dtype(b)


def both_float(a: np.dtype, b: np.dtype) -> bool:
    """Check if both objects have float dtypes."""
    return is_float_dtype(a) and is_float_dtype(b)


def both_integer(a: np.dtype, b: np.dtype) -> bool:
    """Check if both objects have integer dtypes."""
    return is_integer_dtype(a) and is_integer_dtype(b)


def both_string(a: np.dtype, b: np.dtype) -> bool:
    """Check if both objects have string dtypes."""
    return is_string_like_dtype(a) and is_string_like_dtype(b)


class DefaultValue(object):
    def __init__(self):
        self.name = 'default'


default_val = DefaultValue()
