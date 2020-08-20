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


import numpy as np

from pandas.core.dtypes.missing import isna
from pandas.core.dtypes.inference import (
    is_bool,
    is_integer,
    is_float,
)

from pandas.core.dtypes.common import (
    is_bool_dtype,
    is_integer_dtype,
    is_float_dtype,
    is_numeric_dtype,
    is_object_dtype,
    is_string_like_dtype
)


def infer_dtype(col):
    """
        Infer true dtype of the first non na element in a col.
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

    return ValueError('Unsupported data type')


def is_comparable(arr_or_dtype):
    """
    Check if an object has a comparable dtype (i.e. numeric or string).
    """

    return is_numeric_dtype(arr_or_dtype) or is_string_like_dtype(arr_or_dtype)


def both_comparable(a, b):
    """
    Check if both objects have comparable dtypes (i.e. numeric or string).
    """
    return is_comparable(a) and is_comparable(b)


def both_boolean(a, b):
    """
    Check if both objects have comparable dtypes (i.e. numeric or string).
    """
    return is_bool_dtype(a) and is_bool_dtype(b)


def both_numeric(a, b):
    """
    Check if both objects have numeric dtypes.
    """
    return is_numeric_dtype(a) and is_numeric_dtype(b)


def both_float(a, b):
    """
    Check if both objects have float dtypes.
    """
    return is_float_dtype(a) and is_float_dtype(b)


def both_integer(a, b):
    """
    Check if both objects have integer dtypes.
    """
    return is_integer_dtype(a) and is_integer_dtype(b)


def both_string(a, b):
    """
    Check if both objects have string dtypes.
    """
    return is_string_like_dtype(a) and is_string_like_dtype(b)


def supertype_of_two(a, b):
    """
    Determine the least common supertype of two objects.
    """
    if both_numeric(a, b):
        if is_float_dtype(a) or is_float_dtype(b):
            return np.dtype('float64')
        else:
            return np.dtype('int64')
    else:
        raise ValueError('Not implemented yet.')


def supertype_of_all(dtype_lst):
    """
    Determine the least common supertype of all objects.
    """

    check_numeric = [is_numeric_dtype(item) for item in dtype_lst]
    check_str = [is_string_like_dtype(item) for item in dtype_lst]
    check_bool = [is_bool_dtype(item) for item in dtype_lst]

    if all(check_numeric):
        if all([is_integer_dtype(item) for item in dtype_lst]):
            return np.dtype('int64')
        else:
            return np.dtype('float64')
    elif all(check_str):
        return np.dtype('str')
    elif all(check_bool):
        return np.dtype('bool')
    else:
        return np.dtype('object')


def dtypes_compatible(dtypes1, dtypes2):
    """
    Functionality to check if dtypes1 and dtypes2 are compatible.
    """
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


class DefaultValue(object):
    def __init__(self):
        self.name = 'default'


default_val = DefaultValue()
