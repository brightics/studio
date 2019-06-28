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

from brightics.common.exception import BrighticsFunctionException


def validate(*bfe):
    elist = []
    for e in bfe:
        if e is not None and type(e) is tuple and len(e) == 2:
            elist.append({e[0]: e[1]})
    if len(elist) > 0:
        print(elist)
        raise BrighticsFunctionException.from_errors(elist)


def get_error(true_condition, error_code, error_message_params):
    if not true_condition:
        return (error_code, error_message_params)
    else:
        None


def error(error_code, error_message_params, true_condition=False):
    return get_error(true_condition, error_code, error_message_params)


def runtime_error(error_message, true_condition=False):
    return get_error(true_condition, '0100', [error_message])


def require_param(var_name):
    return error('0033', [var_name])


def greater_than(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(params[var_name] > criteria, '0008', [var_name, criteria])
    else:
        return None


def greater_than_or_equal_to(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(params[var_name] >= criteria, '0010', [var_name, criteria])
    else:
        return None


def less_than(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(params[var_name] < criteria, '0012', [var_name, criteria])
    else:
        return None


def less_than_or_equal_to(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(params[var_name] <= criteria, '0014', [var_name, criteria])
    else:
        return None


def from_to(params, from_v, to_v, var_name):
    if params[var_name] is not None:
        return get_error(from_v <= params[var_name] <= to_v, '0004', [var_name, from_v, to_v])
    else:
        return None


def from_under(params, from_v, under_v, var_name):
    if params[var_name] is not None:
        return get_error(from_v <= params[var_name] < under_v, '0006', [var_name, from_v, under_v])
    else:
        return None


def over_to(params, over_v, to_v, var_name):
    if params[var_name] is not None:
        return get_error(over_v < params[var_name] <= to_v, '0006', [var_name, over_v, to_v])
    else:
        return None


def over_under(params, over_v, under_v, var_name):
    if params[var_name] is not None:
        return get_error(over_v < params[var_name] < under_v, '0006', [var_name, over_v, under_v])
    else:
        return None


def all_elements_greater_than(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(all([x > criteria for x in params[var_name]]), '0009', [var_name, criteria])
    else:
        return None


def all_elements_greater_than_or_equal_to(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(all([x >= criteria for x in params[var_name]]), '0011', [var_name, criteria])
    else:
        return None


def all_elements_less_than(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(all([x < criteria for x in params[var_name]]), '0013', [var_name, criteria])
    else:
        return None


def all_elements_less_than_or_equal_to(params, criteria, var_name):
    if params[var_name] is not None:
        return get_error(all([x <= criteria for x in params[var_name]]), '0015', [var_name, criteria])
    else:
        return None


def all_elements_from_to(params, from_v, to_v, var_name):
    if params[var_name] is not None:
        return get_error(all([from_v <= x <= to_v for x in params[var_name]]), '0005', [var_name, from_v, to_v])
    else:
        return None


def all_elements_from_under(params, from_v, under_v, var_name):
    if params[var_name] is not None:
        return get_error(all([from_v <= x < under_v for x in params[var_name]]), '0007', [var_name, from_v, under_v])
    else:
        return None


def all_elements_over_to(params, over_v, to_v, var_name):
    if params[var_name] is not None:
        return get_error(all([over_v < x <= to_v for x in params[var_name]]), '0017', [var_name, over_v, to_v])
    else:
        return None


def all_elements_over_under(params, over_v, under_v, var_name):
    if params[var_name] is not None:
        return get_error(all([over_v < x < under_v for x in params[var_name]]), '0019', [var_name, over_v, under_v])
    else:
        return None


def raise_error(error_code, error_message_params=[], true_condition=False):
    if not true_condition:
        raise BrighticsFunctionException(error_code, error_message_params)


def raise_runtime_error(error_message, true_condition=False):
    if not true_condition:
        raise BrighticsFunctionException('0100', [error_message])
