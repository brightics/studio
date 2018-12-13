# -*- coding: utf-8 -*-

import dateutil.parser
import datetime
import numpy as np
import math
from .serializer import _serialize
from .serializer import _deserialize
import re

""" 
constants 
"""


def e():
    return np.math.e


def pi():
    return np.math.pi

"""
lambda functions
"""
log = lambda _: np.math.log(_) if _ is not None else np.math.nan #?
ln = lambda _: np.math.log(_)
log10 = lambda _: np.math.log10(_)
log2 = lambda _: np.math.log2(_)
exp = lambda _: np.math.exp(_)
exp2 = lambda _: np.math.pow(2,_)
sqrt = lambda _: np.math.sqrt(_)
ceil = lambda _: np.math.ceil(_)
floor = lambda _: np.math.floor(_)
sign = lambda _: int(np.sign(_))
    
factorial = lambda _: np.math.factorial(_)

pow = lambda a, b: np.math.pow(a,b)

lpad = lambda str, length, lpad_str: str.ljust(length, lpad_str)
rpad = lambda str, length, rpad_str: str.rjust(length, rpad_str)


is_null = lambda _: 1 if _ is None else 0

"""
regular expression related functions
"""

regexp = lambda exp, str: False if re.search(exp, str) is None else True
regexp_replace = lambda initial_str, pattern, replacement: re.sub(pattern, replacement, initial_str)


def regexp_extract(subject, pattern, *index):  # todo index??

    def _is_empty(tup):
        return not tup
    
    if _is_empty(index):
        return re.search(pattern, subject).group(1)
    else:
        return re.search(pattern, subject).group(index[0])
    
"""
datetime related functions
"""
# todo weekofmonth, datediff, timediff


def strftime_a(isotime):
    return dateutil.parser.parse(isotime).strftime('%a')


def strftime_aa(isotime):
    return dateutil.parser.parse(isotime).strftime('%A')


def strftime_aak(isotime):
    w_dict = {'Monday':'월요일',
              'Tuesday':'화요일',
              'Wednesday':'수요일',
              'Thursday':'목요일',
              'Friday':'금요일',
              'Saturday':'토요일',
              'Sunday':'일요일',
        }
    return w_dict[dateutil.parser.parse(isotime).strftime('%A')]


def strftime_ak(isotime):
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


def split(str, *sep):
    nargs = len(sep)
    if nargs == 0:
        return _serialize(np.array(str.split()))
    else:  # todo elif nargs == 1:
        return _serialize(np.array(str.split(sep[0])))
    
