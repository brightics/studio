# -*- coding: utf-8 -*-

import dateutil.parser
import datetime
import numpy as np
from .serializer import _serialize
from .serializer import _deserialize
""" 
constants 
"""


def e():
    return np.e


def pi():
    return np.pi

"""
lambda functions
"""
log = lambda _: np.log(_)
ln = lambda _: np.log(_)
log10 = lambda _: np.log10(_)
log2 = lambda _: np.log2(_)
exp = lambda _: np.exp(_)
exp2 = lambda _: np.exp2(_)
sqrt = lambda _: np.sqrt(_)
ceil = lambda _: np.ceil(_)
floor = lambda _: np.floor(_)
sign = lambda _: np.sign(_)
factorial = lambda _: np.math.factorial(_)

pow = lambda a, b: np.power(a, b)
# todo lpad, rpad
# todo regexp

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
    
