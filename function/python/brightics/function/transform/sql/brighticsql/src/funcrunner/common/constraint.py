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


class ConstraintABC(abc.ABC):
    """ABC for a parameter constraint."""

    def __call__(self, val):
        return self._check(val)

    @abc.abstractmethod
    def _check(self, val):
        pass


class GreaterThan(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return '{v} > {c}.'.format(v='{VARNAME}', c=self.c)

    def _check(self, val):
        return val > self.c


class GreaterThanOrEqualTo(ConstraintABC):
    def __init__(self,  criteria):
        self.c = criteria

    def __repr__(self):
        return '{v} >= {c}.'.format(v='{VARNAME}', c=self.c)

    def _check(self, val):
        return val >= self.c


class GreaterThanOrEqualToOrEqualTo(ConstraintABC):
    def __init__(self, criteria, equalto):
        self.c = criteria
        self.e = equalto

    def __repr__(self):
        return '{v} >= {c} or {v} == {e}.'.format(
            v='{VARNAME}', c=self.c, e=self.e)

    def _check(self, val):
        return val >= self.c or val == self.e


class LessThan(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return '{v} < {c}.'.format(v='{VARNAME}', c=self.c)

    def _check(self, val):
        return val < self.c


class LessThanOrEqualTo(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return '{v} <= {c}.'.format(v='{VARNAME}', c=self.c)

    def _check(self, val):
        return val <= self.c


class FromTo(ConstraintABC):
    def __init__(self, _from, _to):
        self.a = _from
        self.b = _to

    def __repr__(self):
        return '{a} <= {v} <= {b}.'.format(v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return self.a <= val <= self.b


class FromUnder(ConstraintABC):
    def __init__(self, _from, _under):
        self.a = _from
        self.b = _under

    def __repr__(self):
        return '{a} <= {v} < {b}.'.format(v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return self.a <= val < self.b


class OverTo(ConstraintABC):
    def __init__(self, _over, _to):
        self.a = _over
        self.b = _to

    def __repr__(self):
        return '{a} < {v} <= {b}.'.format(v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return self.a < val <= self.b


class OverUnder(ConstraintABC):
    def __init__(self, _over, _under):
        self.a = _over
        self.b = _under

    def __repr__(self):
        return '{a} < {v} < {b}.'.format(v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return self.a < val < self.b


class AllElemGreaterThan(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return 'e > {c} for all elements e of {v}.'.format(
            v='{VARNAME}', c=self.c)

    def _check(self, val):
        return all(e is not None and e > self.c for e in val)


class AllElemGreaterThanOrEqualTo(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return 'e >= {c} for all elements e of {v}.'.format(
            v='{VARNAME}', c=self.c)

    def _check(self, val):
        return all(e is not None and e >= self.c for e in val)


class AllElemLessThan(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return 'e < {c} for all elements e of {v}.'.format(
            v='{VARNAME}', c=self.c)

    def _check(self, val):
        return all(e is not None and e < self.c for e in val)


class AllElemLessThanOrEqualTo(ConstraintABC):
    def __init__(self, criteria):
        self.c = criteria

    def __repr__(self):
        return 'e <= {c} for all elements e of {v}.'.format(
            v='{VARNAME}', c=self.c)

    def _check(self, val):
        return all(e is not None and e <= self.c for e in val)


class AllElemFromTo(ConstraintABC):
    def __init__(self, _from, _to):
        self.a = _from
        self.b = _to

    def __repr__(self):
        return '{a} <= e <= {b} for all elements e of {v}.'.format(
            v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return all(e is not None and self.a <= e <= self.b for e in val)


class AllElemFromUnder(ConstraintABC):
    def __init__(self, _from, _under):
        self.a = _from
        self.b = _under

    def __repr__(self):
        return '{a} <= e < {b} for all elements e of {v}.'.format(
            v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return all(e is not None and self.a <= e < self.b for e in val)


class AllElemOverTo(ConstraintABC):
    def __init__(self, _over, _to):
        self.a = _over
        self.b = _to

    def __repr__(self):
        return '{a} < e <= {b} for all elements e of {v}.'.format(
            v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return all(e is not None and self.a < e <= self.b for e in val)


class AllElemOverUnder(ConstraintABC):
    def __init__(self, _from, _to):
        self.a = _from
        self.b = _to

    def __repr__(self):
        return '{a} < e < {b} for all elements e of {v}.'.format(
            v='{VARNAME}', a=self.a, b=self.b)

    def _check(self, val):
        return all(e is not None and self.a < e < self.b for e in val)


class ElemInSet(ConstraintABC):
    def __init__(self, criteria):
        self.criteria = criteria

    def __repr__(self):
        return '{v} in a set {c}.'.format(v='{VARNAME}', c=self.criteria)

    def _check(self, val):
        return val in self.criteria
