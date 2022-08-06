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

from brighticsql.frompd import isna
from brighticsql.base import fbase

DT_FLOAT = np.dtype('float64')
DT_INT = np.dtype('int64')
DT_BOOL = np.dtype(bool)
DT_ARG = 'arg_dtype'
DT_SP_ARGS = 'super_args'
DT_STR = np.dtype(str)

RDT_FLOAT = 'float64'
RDT_OBJECT = 'object'

FV_NAN = np.nan
FV_NONE = None

NARGS_O = 'one'
NARGS_T = 'two'
NARGS_C = 'const'
NARGS_M = 'multiple'

# numeric functions

numeric_functions = {
    'PI': fbase('pi', np.pi, NARGS_C, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'ABS': fbase('ABS', np.abs, NARGS_O, DT_ARG, RDT_FLOAT, FV_NAN),
    'ACOS': fbase('ACOS', np.arccos, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'ASIN': fbase('ASIN', np.arcsin, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'ATAN': fbase('ATAN', np.arctan, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'CEIL': fbase('CEIL', np.ceil, NARGS_O, DT_INT, RDT_FLOAT, FV_NAN),
    'COS': fbase('COS', np.cos, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'DEGREES': fbase(
        'DEGREES', np.degrees, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'EXP': fbase('EXP', np.exp, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'FLOOR': fbase('FLOOR', np.floor, NARGS_O, DT_INT, RDT_FLOAT, FV_NAN),
    'LN': fbase('LN', np.log, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'LOG10': fbase('LOG10', np.log10, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'RADIANS': fbase(
        'RADIANS', np.radians, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'SIGN': fbase('SIGN', np.sign, NARGS_O, DT_INT, RDT_FLOAT, FV_NAN),
    'SIN': fbase('SIN', np.sin, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'SQRT': fbase('SQRT', np.sqrt, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'TAN': fbase('TAN', np.tan, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'ATAN2': fbase('ATAN2', np.arctan2, NARGS_T, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'MOD': fbase('MOD', np.remainder, NARGS_T, DT_INT, RDT_FLOAT, FV_NAN),
    'POWER': fbase('POWER', np.power, NARGS_T, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'ROUND': fbase('ROUND', np.around, NARGS_T, DT_FLOAT, RDT_FLOAT, FV_NAN),
    'RAND': fbase(
        'RAND', np.random.random, NARGS_O, DT_FLOAT, RDT_FLOAT, FV_NAN)
}


def truncate_(num, decimals=0):
    if decimals == 0:
        return np.trunc(num)
    else:
        f = 10.0 ** decimals
        return np.trunc(num * f) / f


numeric_functions['TRUNCATE'] = fbase(
    'TRUNCATE', truncate_, NARGS_T, DT_FLOAT, RDT_FLOAT, FV_NAN)

# binary operators
binary_operators = {
    'EQUALS': fbase('==', np.equal, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'NOT_EQUALS': fbase(
        '!=', np.not_equal, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'LESS_THAN': fbase('<', np.less, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'LESS_THAN_OR_EQUAL': fbase(
        '<=', np.less_equal, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'GREATER_THAN': fbase(
        '>', np.greater, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'GREATER_THAN_OR_EQUAL': fbase(
        '>=', np.greater_equal, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'AND': fbase('and', np.logical_and, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'OR': fbase('or', np.logical_or, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'PLUS': fbase('+', np.add, NARGS_T, DT_SP_ARGS, RDT_FLOAT, FV_NAN),
    'MINUS': fbase('-', np.subtract, NARGS_T, DT_SP_ARGS, RDT_FLOAT, FV_NAN),
    'TIMES': fbase('*', np.multiply, NARGS_T, DT_SP_ARGS, RDT_FLOAT, FV_NAN),
    'DIVIDE': fbase('/', np.divide, NARGS_T, DT_SP_ARGS, RDT_FLOAT, FV_NAN),
    'FLOORDIVIDE': fbase(
        '/', np.floor_divide, NARGS_T, DT_SP_ARGS, RDT_FLOAT, FV_NAN)
}

sqlin_operators = {
    'IN': fbase('IN', np.isin, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE),
    'SOME': fbase('SOME', np.isin, NARGS_T, DT_BOOL, RDT_OBJECT, FV_NONE)
}

# postfix_operators

postfix_operators = {
    # do not delete white space in ' is not null' and ' is null
    'IS_NOT_NULL': fbase(
        ' IS NOT NULL', isna, NARGS_O, DT_BOOL, RDT_OBJECT, FV_NONE),
    'IS_NULL': fbase(' IS NULL', isna, NARGS_O, DT_BOOL, RDT_OBJECT, FV_NONE)
}

# prefix_operators
prefix_operators = {
    'MINUS_PREFIX': fbase(
        '-', np.negative, NARGS_O, DT_ARG, RDT_FLOAT, FV_NAN),
    # do not delete trailing white space in 'not '
    'NOT': fbase(
        'NOT ', np.logical_not, NARGS_O, DT_BOOL, RDT_OBJECT, FV_NONE),
    'EXISTS': fbase('EXISTS ', np.isin, NARGS_O, DT_BOOL, RDT_OBJECT, FV_NONE)
}


# string_functions

# We will not use np.char.lower and np.char.upper to avoid type conversion from
# object type array to str or unicode type array using .astype('str').
# Type conversion requires additional resource and is time consuming.

def _lower(arg):
    # for loop in arg.tolist() is faster than for loop in arg.
    return np.array([s.lower() for s in arg.tolist()])


def _upper(arg):
    # for loop in arg.tolist() is faster than for loop in arg.
    return np.array([s.upper() for s in arg.tolist()])


def _charlen(arg):
    if arg.dtype == 'object':
        arg = arg.astype('U')
    _view = arg.view(np.uint32).reshape(arg.size, -1)
    ret = np.argmin(_view, 1)
    ret[_view[np.arange(len(_view)), ret] > 0] = _view.shape[-1]
    return ret


def _concat(arg1, arg2):
    # np.char.add seems slower than list comprehension.
    l1, l2 = arg1.shape[0], arg2.shape[0]
    if l1 == 1 and l2 > 1:
        x = arg1[0]
        return np.array([x + y for y in arg2.tolist()])
    elif l1 > 1 and l2 == 1:
        y = arg2[0]
        return np.array([x + y for x in arg1.tolist()])
    elif l1 == l2:
        return np.array([x + y for x, y in zip(arg1.tolist(), arg2.tolist())])
    else:
        raise ValueError('This should not be reached.')


def _reverse(arg1):
    return np.array([x[::-1] for x in arg1.tolist()])


def _trim(flag, ref, arg):
    if arg.dtype == 'object':
        arg = arg.astype('U')
    reflen = len(ref[0])
    flag = flag[0]

    if reflen == 1:
        if flag == 'BOTH':
            return np.char.strip(arg, ref)
        elif flag == 'TRAILING':
            return np.char.rstrip(arg, ref)
        elif flag == 'LEADING':
            return np.char.lstrip(arg, ref)
        else:
            raise ValueError('This should not be reached.')
    else:
        # TODO: Implement more efficient subroutine for trailing.
        def __trim(_flag, _ref, _arg):
            v = _arg.view('uint32').reshape(_arg.size, -1)
            lp = len(_ref[0])
            if v.shape[1] < lp:
                return _arg
            if _flag == 'TRAILING':
                _arg = np.array([x[::-1] for x in _arg.tolist()])
                v = _arg.view('uint32').reshape(_arg.size, -1)
                _ref[0] = _ref[0][::-1]
            p = _ref.view('uint32')
            rmax = v.shape[1] if v.shape[1] % lp == 0 else v.shape[1] - lp
            mask = np.all(v[:, :lp] == p, axis=1)
            sidx = np.full(v.shape[0], 0, dtype=int)
            sidx[mask] = lp
            for i in range(lp, rmax, lp):
                mask = np.logical_and(mask, np.all(v[:, i:i + lp] == p, axis=1))
                sidx[mask] += lp
            slen = v.shape[1] - np.min(sidx)
            if slen == 0:
                return np.array([''] * v.shape[0])
            if _flag == 'TRAILING':
                it = (a[s:][::-1] for a, s in zip(_arg.tolist(), sidx.tolist()))
            else:
                it = (a[s:] for a, s in zip(_arg.tolist(), sidx.tolist()))
            return np.fromiter(it, dtype='U' + str(slen))

        if flag == 'BOTH':
            return __trim('TRAILING', ref, __trim('LEADING', ref, arg))
        elif flag == 'TRAILING':
            return __trim('TRAILING', ref, arg)
        elif flag == 'LEADING':
            return __trim('LEADING', ref, arg)
        else:
            raise ValueError('This should not be reached.')


def _left(arg, take):
    if arg.dtype == 'object':
        arg = arg.astype('U')
    _view = arg.view('uint32').reshape(arg.size, -1)
    take = take[0]
    if take > _view.shape[1]:
        take = _view.shape[1]
    return np.asarray(_view[:, :take],
                      order='C').view('U' + str(take)).reshape(arg.size)


def _right(arg, take):
    take = take[0]
    return np.array([a[-take:] for a in arg.tolist()])


def _replace(arg, target, rep):
    t, r = target[0], rep[0]
    return np.array([x.replace(t, r) for x in arg.tolist()])


def _overlay(arg, rep, pos, nchar=None):
    sp = pos[0] - 1
    if nchar is None:
        ep = sp + len(rep[0])
    else:
        ep = sp + nchar[0]
    _s = arg[0]
    return np.array([str(_s[:sp]) + str(rep[0]) + str(_s[ep:])])


def _repeat(arg, times):
    n = times[0]
    return np.array([str(x) * n for x in arg.tolist()])


def _space(nspace):
    return np.array([' ' * nspace[0]])


def _ascii(arg):
    if arg.dtype == 'object':
        arg = arg.astype('U')
    return np.asarray(arg.view('uint32').reshape(arg.size, -1)[:, 0])


def _position(subs, arg, start=None):
    # case insensitive search
    p = str(subs[0]).lower()
    if start is None or start < 2:
        return np.array([str(x).lower().find(p) + 1 for x in arg.tolist()])
    elif start:
        res = np.array([str(x).lower().find(p) + 1 for x in arg.tolist()])
        return np.where(res >= start, res, 0)


def _substring(arg, start, take):
    if arg.dtype == 'object':
        arg = arg.astype('U')
    _view = arg.view('uint32').reshape(arg.size, -1)
    start, take = start[0] - 1, take[0]
    if start > _view.shape[1] - 1:
        return np.array([''] * arg.size)
    if take + start > _view.shape[1]:
        take = _view.shape[1] - start
    return np.asarray(_view[:, start:start + take],
                      order='C').view('U' + str(take)).reshape(arg.size)


string_functions = {
    'LOWER': fbase('LOWER', _lower, NARGS_O, DT_STR, RDT_OBJECT, FV_NONE),
    'UPPER': fbase('UPPER', _upper, NARGS_O, DT_STR, RDT_OBJECT, FV_NONE),
    'CONCAT': fbase('CONCAT', _concat, NARGS_T, DT_STR, RDT_OBJECT, FV_NONE),
    'REVERSE': fbase(
        'REVERSE', _reverse, NARGS_O, DT_STR, RDT_OBJECT, FV_NONE),
    'TRIM': fbase('TRIM', _trim, NARGS_M, DT_STR, RDT_OBJECT, FV_NONE),
    'LEFT': fbase('LEFT', _left, NARGS_T, DT_STR, RDT_OBJECT, FV_NONE),
    'REPLACE': fbase(
        'REPLACE', _replace, NARGS_M, DT_STR, RDT_OBJECT, FV_NONE),
    'OVERLAY': fbase(
        'OVERLAY', _overlay, NARGS_M, DT_STR, RDT_OBJECT, FV_NONE),
    'SPACE': fbase('SPACE', _space, NARGS_O, DT_STR, RDT_OBJECT, FV_NONE),
    'RIGHT': fbase('RIGHT', _right, NARGS_T, DT_STR, RDT_OBJECT, FV_NONE),
    'REPEAT': fbase('REPEAT', _repeat, NARGS_T, DT_STR, RDT_OBJECT, FV_NONE),
    'ASCII': fbase('ASCII', _ascii, NARGS_O, DT_STR, RDT_OBJECT, FV_NONE),
    'SUBSTRING': fbase(
        'SUBSTRING', _substring, NARGS_M, DT_STR, RDT_OBJECT, FV_NONE)
}

binary_operators['CONCAT'] = fbase(
    'CONCAT', _concat, NARGS_T, DT_STR, RDT_OBJECT, FV_NONE)

numeric_functions['CHAR_LENGTH'] = fbase(
    'CHAR_LENGTH', _charlen, NARGS_O, DT_INT, RDT_FLOAT, FV_NAN)

numeric_functions['POSITION'] = fbase(
    'POSITION', _position, NARGS_M, DT_INT, RDT_FLOAT, FV_NAN)
