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

import brightics.common.validation as common_validation

'''
*** NOTE *** 
This is a deprecated module. Use brightics.common.validation alternatively.
'''


def validate(*bfe):
    common_validation.validate(*bfe)


def get_error(true_condition, error_code, error_message_params):
    return common_validation.get_error(true_condition, error_code, error_message_params)


def error(error_code, error_message_params, true_condition=False):
    return get_error(true_condition, error_code, error_message_params)


def runtime_error(error_message, true_condition=False):
    return get_error(true_condition, '0100', [error_message])

    
def require_param(var_name):
    return error('0033', [var_name])

    
def greater_than(var, criteria, var_name):
    return get_error(var > criteria, '0008', [var_name, criteria])


def greater_than_or_equal_to(var, criteria, var_name):
    return get_error(var >= criteria, '0010', [var_name, criteria])


def less_than(var, criteria, var_name):
    return get_error(var < criteria, '0012', [var_name, criteria])


def less_than_or_equal_to(var, criteria, var_name):
    return get_error(var <= criteria, '0014', [var_name, criteria])


def from_to(var, from_v, to_v, var_name):
    return get_error(from_v <= var <= to_v, '0004', [var_name, from_v, to_v])


def from_under(var, from_v, under_v, var_name):
    return get_error(from_v <= var < under_v, '0006', [var_name, from_v, under_v])


def over_to(var, over_v, to_v, var_name):
    return get_error(over_v < var <= to_v, '0006', [var_name, over_v, to_v])


def over_under(var, over_v, under_v, var_name):
    return get_error(over_v < var < under_v, '0006', [var_name, over_v, under_v])


def all_elements_greater_than(var, criteria, var_name):
    return get_error(all([x > criteria for x in var]), '0009', [var_name, criteria])


def all_elements_greater_than_or_equal_to(var, criteria, var_name):
    return get_error(all([x >= criteria for x in var]), '0011', [var_name, criteria])


def all_elements_less_than(var, criteria, var_name):
    return get_error(all([x < criteria for x in var]), '0013', [var_name, criteria])


def all_elements_less_than_or_equal_to(var, criteria, var_name):
    return get_error(all([x <= criteria for x in var]), '0015', [var_name, criteria])


def all_elements_from_to(var, from_v, to_v, var_name):
    return get_error(all([from_v <= x <= to_v for x in var]), '0005', [var_name, from_v, to_v])


def all_elements_from_under(var, from_v, under_v, var_name):
    return get_error(all([from_v <= var < under_v for x in var]), '0007', [var_name, from_v, under_v])


def all_elements_over_to(var, over_v, to_v, var_name):
    return get_error(all([over_v < var <= to_v for x in var]), '0017', [var_name, over_v, to_v])


def all_elements_over_under(var, over_v, under_v, var_name):
    return get_error(all([over_v < var < under_v for x in var]), '0019', [var_name, over_v, under_v])


def raise_error(error_code, error_message_params, true_condition=False):
    common_validation.raise_error(error_code, error_message_params, true_condition)


def raise_runtime_error(error_message, true_condition=False):
    common_validation.raise_runtime_error(error_message, true_condition)
