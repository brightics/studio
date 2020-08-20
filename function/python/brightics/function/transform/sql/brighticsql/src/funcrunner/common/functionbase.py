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

from .param import (Column, Param, IntParam, ListParam, HasParam,
                    StrParam, ESTR_PARAMNOTEXIST)
from .exception import (ParamInitialValueException,
                        ColumnDoesNotExistException)
from .group_util import group_index
from sklearn.base import clone


ESTR_REQUIREDPARAM = '\'{}\' is a required parameter.'


class FunctionBase(HasParam):
    """ABC for function objects.
       This class is responsible for param initialization.
       Child class of this class should implement a method _run.
    """

    def __init__(self, *args, **kwargs):
        super().__init__()
        attr = self.__class__.__dict__
        # set param values from input **kwargs
        for k, v in kwargs.items():
            if not (k in attr and isinstance(attr[k], Param)):
                _nm = self.__class__.__name__
                raise AttributeError(ESTR_PARAMNOTEXIST.format(_nm, k))
            setattr(self, k, v)
        # check param values if they are not set.
        # Set param value to None if it allow None value.

        for k, v in attr.items():
            if isinstance(v, Param):
                print(v.name)
                try:
                    getattr(self, v.name)
                except AttributeError:
                    if v.allowNone:
                        setattr(self, k, None)
                    else:
                        raise ParamInitialValueException(
                            ESTR_REQUIREDPARAM.format(k))

    def __call__(self, *args, **kwargs):
        attr = self.__class__.__dict__
        for k, v in attr.items():
            if isinstance(v, Param):
                kwargs[k] = getattr(self, k)
        return self._run(*args, **kwargs)

    def getparams(self):
        p = {}
        for k, v in self.__dict__.items():
            _k = k.split('#')[1]
            p[_k] = v
        return p

    def _run(self, *args, **kwargs):
        pass


class GroupByFunctionBase(FunctionBase):
    """ Base class for functions having group by options.
        Child class of this Class should implement followings:
            before_run: method.
            run_co: coroutine
    """
    group_by = ListParam(str, allowNone=True)

    def __init__(self, *args, **kwargs):
        self.group_by = kwargs.pop('group_by', None)
        super().__init__(*args, **kwargs)

    def _run(self, *args, **kwargs):
        self.before_run(*args, **kwargs)
        table = kwargs.pop('table')
        _data = table.values
        coro = self.run_co(*args, **kwargs)
        next(coro)
        res = {}
        if self.group_by is not None and self.group_by:
            idx_gb_cols = list(self.map_fd[nm] for nm in self.group_by)
            grp_idx = group_index(_data, idx_gb_cols)
            grp_lst = np.unique(grp_idx)
            for idx in grp_lst:
                data_i = _data[grp_idx == idx]
                rep_data = data_i[0, idx_gb_cols]
                grp_res = coro.send(data_i)
                res[idx] = (rep_data, grp_res)
        else:
            _res = coro.send(_data)
            res[0] = (None, _res)
        coro.close()
        ret = {'group_by': self.group_by, 'result': res}
        return ret

    def before_run(self, *args, **kwargs):
        try:
            tb = kwargs['table']
            self.map_fd = dict(Column(nm, idx)
                               for (idx, nm) in enumerate(tb.columns))
        except KeyError as e:
            raise ColumnDoesNotExistException(e)
        return args, kwargs

    def run_co(self, *args, **kwargs):
        # set parameters from **kwargs
        # pass
        co_res = None
        while True:
            data = yield co_res
            # do specific job with data
            co_res = data


class MlTrainFunctionBase(GroupByFunctionBase):
    """ Base class for ML train functions.
        Child class of this Class should implement followings:
            before_run: method.
            run_co: coroutine
    """

    feature_cols = ListParam(str)
    label_col = StrParam(allowNone=True)

    def __init__(self, *args, **kwargs):
        self.feature_cols = kwargs.pop('feature_cols', None)
        self.label_col = kwargs.pop('label_col', None)
        super().__init__(*args, **kwargs)

    def before_run(self, *args, **kwargs):
        super().before_run(*args, **kwargs)
        self.idx_features = [self.map_fd[nm] for nm in self.feature_cols]
        if self.label_col is not None:
            self.idx_label = self.map_fd[self.label_col]
        else:
            self.idx_label = None
        return args, kwargs


class ClassificationTrainBase(MlTrainFunctionBase):
    """ Base class for Regression function."""

    def __init__(self, *args, **kwargs):

        super().__init__(*args, **kwargs)
        _p = self.getparams()
        del _p['feature_cols']
        del _p['label_col']
        del _p['group_by']
        self.settrain(**_p)

    def settrain(self, **kwargs):
        self.trainargs = {}
        self.classifier = None

    def run_co(self, *args, **params):
        co_res = None
        while True:
            data = yield co_res
            X = data[:, self.idx_features]
            y = data[:, self.idx_label]
            _classifier = clone(self.classifier)
            co_res = _classifier.fit(X, y, **self.trainargs)


class RegressionTrainBase(MlTrainFunctionBase):
    """ Base class for Regression function."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        _p = self.getparams()
        del _p['feature_cols']
        del _p['label_col']
        del _p['group_by']
        self.settrain(**_p)

    def settrain(self, **kwargs):
        self.trainargs = {}
        self.regressor = None

    def run_co(self, *args, **params):
        co_res = None
        while True:
            data = yield co_res
            X = data[:, self.idx_features]
            y = data[:, self.idx_label]
            _regressor = clone(self.regressor)
            co_res = _regressor.fit(X, y, **self.trainargs)
