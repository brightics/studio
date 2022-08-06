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

import dateutil.parser
import numpy as np
from .serializer import _serialize
from .serializer import _deserialize
import re
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.validation import validate
""" 
constants 
"""

"""
Trigonometric functions
"""
def sin(x):
    return np.math.sin(x)


def cos(x):
    return np.math.cos(x)


def tan(x):
    return np.math.tan(x)


def cot(x):
    if tan(x)==0:
        return np.nan
    return 1 / tan(x)


def asin(x):
    if x < -1 or x > 1:
        return np.nan
    return np.math.asin(x)


def acos(x):
    if x < -1 or x > 1:
        return np.nan
    return np.math.acos(x)


def atan(x):
    return np.math.atan(x)


def acot(x):
    if (x==0):
        return pi()/2
    return atan(1/x)


def e():
    return np.math.e


def pi():
    return np.math.pi

"""
lambda functions
"""
log = lambda _: np.math.log(_) if _ is not None else np.math.nan  # ?
ln = lambda _: np.math.log(_)
log10 = lambda _: np.math.log10(_)
log2 = lambda _: np.math.log2(_)
exp = lambda _: np.math.exp(_)
exp2 = lambda _: np.math.pow(2, _)
sqrt = lambda _: np.math.sqrt(_)
ceil = lambda _: np.math.ceil(_)
floor = lambda _: np.math.floor(_)
sign = lambda _: int(np.sign(_))
    
factorial = lambda _: np.math.factorial(_)

pow = lambda a, b: np.math.pow(a, b)

ljust = lambda item, length, lpad_str: str(item).ljust(length, lpad_str)  # ?
rjust = lambda item, length, rpad_str: str(item).rjust(length, rpad_str)  # ?

is_null = lambda _: 1 if _ is None else 0

"""
regular expression related functions
"""

regexp = lambda str_, exp: False if re.search(exp, str_) is None else True

regexp_replace = lambda initial_str, pattern, replacement: re.sub(pattern, replacement, initial_str)

def regexp_extract(subject, pattern, *index):  # todo index??

    def _is_empty(tup):
        return not tup
    
    if _is_empty(index):
        return re.search(pattern, subject).group(1)
    else:
        return re.search(pattern, subject).group(index[0])

# NOTE: String index start from 1 in SQL and 0 in Python
def _validate_params(params):
    position = 1
    occurrence = 1
    return_option = 0
    param_validation_check = []
    # validate value of return_option
    if len(params) >= 3:
        return_option = params[2]
        param_validation_check.append(greater_than_or_equal_to(params, 0, 2))
    # validate value of occurrence
    if len(params) >= 2:
        occurrence = params[1]
        param_validation_check.append(greater_than_or_equal_to(params, 1, 1))
    # validate value of position
    if len(params) >= 1:
        position = params[0]
        param_validation_check.append(greater_than_or_equal_to(params, 1, 0))
    validate(*param_validation_check)
    return position-1, occurrence-1, return_option


def regexp_like(subject, pattern):
    if re.search(pattern, subject) is None:
        return False
    return True


def regexp_count(subject, pattern, *params):
    position, _, _ = _validate_params(params)
    return len(re.findall(pattern, subject[position:]))


def regexp_substr(subject, pattern, *params):
    position, occurrence, _ = _validate_params(params)
    start, end = _regexp_common(subject, pattern, position, occurrence)
    return subject[start:end]


def regexp_instr(subject, pattern, *params):
    position, occurrence, return_option = _validate_params(params)
    if return_option == 0:
        return _regexp_common(subject, pattern, position, occurrence)[0] + 1
    return _regexp_common(subject, pattern, position, occurrence)[1] + 1


def _regexp_common(subject, pattern, position, occurrence):
    start = -1
    end = -1
    ret = re.finditer(pattern, subject[position:])
    for ind, r in enumerate(ret):
        if (ind == occurrence):
            start = r.start()
            end = r.end()
            break
    return start, end

"""
datetime related functions
"""
# todo weekofmonth, datediff, timediff


def datediff(end_isotime, start_isotime):
    end_datetime = dateutil.parser.parse(end_isotime)
    start_datetime = dateutil.parser.parse(start_isotime)
    diff_datetime = end_datetime - start_datetime
    return diff_datetime.days


def strftime_a(isotime):  # ?
    return dateutil.parser.parse(isotime).strftime('%a')


def strftime_aa(isotime):  # ?
    return dateutil.parser.parse(isotime).strftime('%A')


def strftime_aak(isotime):  # ?
    w_dict = {'Monday':'월요일',
              'Tuesday':'화요일',
              'Wednesday':'수요일',
              'Thursday':'목요일',
              'Friday':'금요일',
              'Saturday':'토요일',
              'Sunday':'일요일',
        }
    return w_dict[dateutil.parser.parse(isotime).strftime('%A')]


def strftime_ak(isotime):  # ?
    w_dict = {'Monday':'월',
              'Tuesday':'화',
              'Wednesday':'수',
              'Thursday':'목',
              'Friday':'금',
              'Saturday':'토',
              'Sunday':'일',
        }
    return w_dict[dateutil.parser.parse(isotime).strftime('%A')]

""" 
array related functions  
"""


def array(*args):
    return _serialize(np.array(list(args)))


def get_array_element(serialized_list, index):
    return _deserialize(serialized_list)[index]


def concat_ws(sep, serialized_list):
    arr = _deserialize(serialized_list)
    return sep.join([str(item) for item in arr])


def split(str_, *sep):
    nargs = len(sep)
    if nargs == 0:
        return _serialize(str_.split())
    else:  # todo elif nargs == 1:
        return _serialize(str_.split(sep[0]))

    
def size(serialized_list):
    arr = _deserialize(serialized_list)
    return len(arr)
