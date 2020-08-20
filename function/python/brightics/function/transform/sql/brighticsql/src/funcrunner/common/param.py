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

import abc
import collections
from .exception import ParamConstraintException, ParamInitialValueException


ESTR_PARAMINIT = 'Cannot set the initial value {} of type {} to {}.'
ESTR_PARAMTYPE = 'Cannot set the value {} of type {} to {}.'
ESTR_PARAMTYPELIST = 'Cannot set the value {} of type {} as an element of {}.'
ESTR_PARAMNOTEXIST = '{} does not have a parameter {}.'
ESTR_PARAMCONSTR = 'The parameter {} = {} does not meet the constraint: {}.'

Column = collections.namedtuple('Column', ['name', 'index'])


class ValueDescriptor:
    """Descriptor class for a parameter value."""
    __counter = 0

    def __init__(self):
        cls = self.__class__
        _nm = cls.__name__
        _idx = cls.__counter
        self.name = '_{}#{}'.format(_nm, _idx)
        cls.__counter += 1

    def __get__(self, instance, owner):
        if instance is None:
            return self
        else:
            return getattr(instance, self.name)

    def __set__(self, instance, value):
        setattr(instance, self.name, value)


class ValidatedABC(abc.ABC, ValueDescriptor):
    """ABC reponsible for type validation and constraint check."""

    def __set__(self, instance, value):
        value = self.check_type(instance, value)
        value = self.check_constraint(instance, value)
        super().__set__(instance, value)

    @abc.abstractmethod
    def check_type(self, instance, value):
        """Should return a validated value or raise an TypeError."""

    @abc.abstractmethod
    def check_constraint(self, instance, value):
        """Should return a legal value or raise a ValueError"""


class Param(ValidatedABC):
    """ABC for various parameter classes."""

    _type = None

    def __init__(self, init=None, allowNone=None, constraint=None):
        self.init = init
        self.allowNone = False if allowNone is None else allowNone
        self.constraint = [] if constraint is None else constraint
        super().__init__()

    def __set__(self, instance, value):
        if value is None:
            if self.allowNone:
                # avode validation and constraint check
                setattr(instance, self.name, value)
            else:
                _nm = self.name.split('#', 1)[1]
                raise ValueError(
                    'allowNone=False but the value {} is None.'.format(_nm))
        else:
            super().__set__(instance, value)

    def check_constraint(self, instance, value):
        if self.allowNone and value is None:
            return value
        for c in self.constraint:
            if not c(value):
                _nm = self.name.split('#', 1)[1]
                _s = (str(c)).format(VARNAME=_nm)
                raise ParamConstraintException(
                    ESTR_PARAMCONSTR.format(_nm, value, _s.format(_nm)))
        return value

    def _raiseParamTypeError(self, value):
        _t = str(type(value)).split()[-1][:-1]
        _nm = self.__class__.__name__
        raise TypeError(ESTR_PARAMTYPE.format(value, _t, _nm))


class AnyParam(Param):
    def check_type(self, instance, value):
        return value


class IntParam(Param):
    _type = int

    def check_type(self, instance, value):
        try:
            f_val = float(value)  # we can't use int('1.0')
            if f_val == int(f_val):
                return int(f_val)
            else:
                raise TypeError
        except Exception:
            self._raiseParamTypeError(value)


class FloatParam(Param):
    _type = float

    def check_type(self, instance, value):
        try:
            return float(value)
        except Exception:
            self._raiseParamTypeError(value)


class StrParam(Param):
    _type = str

    def check_type(self, instance, value):
        if not isinstance(value, str):
            self._raiseParamTypeError(value)
        return value


class BoolParam(Param):
    _type = bool

    def check_type(self, instance, value):
        if not isinstance(value, bool):
            self._raiseParamTypeError(value)
        return value


class ListParam(Param):
    """dtype=None allows any item can be put in the list."""
    _type = list

    def __init__(self, dtype=None, init=None, allowNone=None,
                 constraint=None):
        self.dt = dtype
        self.init = init
        super().__init__(init, allowNone, constraint)

    def check_type(self, instance, value):
        if not isinstance(value, list):
            self._raiseParamTypeError(value)

        if self.dt is not None:
            for v in value:
                if not isinstance(v, self.dt):
                    _t = str(type(v)).split()[-1][:-1]
                    _dt = str(self.dt).split()[-1][:-1]
                    _nm = self.__class__.__name__ + '(' + _dt + ')'
                    raise TypeError(
                        ESTR_PARAMTYPELIST.format(v, _t, _nm))
        return value


class DictParam(Param):
    _type = dict

    def __init__(self, init=None, allowNone=None, constraint=None):
        super().__init__(init, allowNone, constraint)

    def check_type(self, instance, value):
        if not isinstance(value, dict):
            self._raiseParamTypeError(value)


class UnionParam(Param):
    """Param for union types.
    Example:
        class A(HasParam):
            a = UnionParam([IntParam(constraint=[GreaterThan(4)]),
                            StrParam()])
    """

    def __init__(self, init=None, params=None, allowNone=None,
                 constraint=None):
        self.params = params
        self._instance = None
        super().__init__(init, allowNone, constraint)

    def __set__(self, instance, value):
        if value is None:
            if self.allowNone:
                setattr(instance, self.name, value)
            else:
                _nm = self.name.split('#', 1)[1]
                raise ValueError(
                    'allowNone=False but the value {} is None.'.format(_nm))
        for p in self.params:
            try:
                self._instance = None
                p.__set__(instance, value)
                instance.__dict__[self.name] = instance.__dict__.pop(p.name)
                self._instance = p
            except Exception:
                pass
            else:
                break
            finally:
                if self._instance is None:
                    _t = str(type(value)).split()[-1][:-1]
                    _nm = self.__class__.__name__ + \
                        '('+','.join(
                            p.__class__.__name__ for p in self.params)+')'
                    raise ValueError(ESTR_PARAMTYPE.format(value, _t, _nm))

    def check_type(self):
        pass


class HasParamMeta(type):
    """MetaClass for HasParam.
       This metaclass is responsible for paramter validation."""

    def __init__(cls, name, tup, dct):
        super().__init__(name, tup, dct)
        for k, v in dct.items():
            if isinstance(v, ValidatedABC):
                v.name = '_{}#{}'.format(type(v).__name__, k)


class HasParam(metaclass=HasParamMeta):
    """Base Class for objects with validated parameters."""

    def __init__(self, *args, **kwargs):
        attr = self.__class__.__dict__
        for k, v in attr.items():
            if isinstance(v, Param):
                if v.init is not None:
                    try:
                        setattr(self, k, v.init)
                    except Exception as e:
                        raise ParamInitialValueException(str(e))
