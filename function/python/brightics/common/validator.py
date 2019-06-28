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

from functools import wraps

import pandas as pd


def valid_value(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.valid_value:
            return method(self, *args, **kwargs)
        return self

    return wrapper


class ParamValidator(object):
    def __init__(self, name, value):
        self.name = name
        self.value = value
        self.errors = []
        self.valid_value = True  # TODO check empty list, blank str, etc.

    def among(self, target):
        if self.value not in target:
            self.errors.append(('BR-0000', '{name} not in {target}'.format(name=self.name, target=', '.join(str(t) for t in target))))

        return self

    def result(self):
        return self.errors


class DataFrameValidator(ParamValidator):
    def __init__(self, name, value):
        super(DataFrameValidator, self).__init__(name, value)

        if not isinstance(self.value, pd.DataFrame):
            self.errors.append(('BR-0000', '{name} is not a pandas dataframe'.format(name=self.name)))
            self.valid_value = False

    @valid_value
    def has_columns(self, columns):
        df_columns = self.value.columns
        non_existing_cols = [col_name for col_name in columns if col_name not in df_columns]
        if len(non_existing_cols) != 0:
            self.errors.append(('BR-0000', ', '.join(non_existing_cols) + ' are not in dataframe columns ' + ', '.join(df_columns)))

        return self


class NumberValidator(ParamValidator):
    def __init__(self, name, value):
        super(NumberValidator, self).__init__(name, value)

        if not isinstance(self.value, (int, float, complex)):
            try:
                self.value = float(self.value)
            except ValueError:
                self.errors.append(('BR-0000', str(self.name) + ' is not a number'))
                self.valid_value = False

    @valid_value
    def less_than(self, criteria):
        if self.value >= criteria:
            self.errors.append(('BR-0000', str(self.name) + ' should be less than ' + str(criteria)))
        return self

    @valid_value
    def less_than_or_equal_to(self, criteria):
        if self.value > criteria:
            self.errors.append(('BR-0000', str(self.name) + ' should be less than or equal to ' + str(criteria)))
        return self

    @valid_value
    def greater_than(self, criteria):
        if self.value <= criteria:
            self.errors.append(('BR-0000', str(self.name) + ' should be greater than ' + str(criteria)))
        return self

    @valid_value
    def greater_than_or_equal_to(self, criteria):
        if self.value < criteria:
            self.errors.append(('BR-0000', str(self.name) + ' should be greater than or equal to ' + str(criteria)))
        return self
