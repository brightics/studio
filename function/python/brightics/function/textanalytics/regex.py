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

from brightics.common.utils import check_required_parameters
from brightics.common.exception import BrighticsFunctionException
from .data import regex_format_dict
import re


def regex(table, **params):
    check_required_parameters(_regex, params, ['table'])
    return _regex(table, **params)


def _regex(table, input_cols, transformation_mode='extract', find_mode='all', pattern='',
           user_dict_pattern='', custom_pattern='', replacement_string='', user_dict=None):
    out_table = table.copy()
    pattern_dict = regex_format_dict.pattern_dict
    user_pattern_dict = {}
    if user_dict is not None:
        user_patterns = user_dict.values
        for user_pattern in user_patterns:
            user_pattern_name = user_pattern[0]
            user_pattern_content = user_pattern[1]
            user_pattern_dict[user_pattern_name] = user_pattern_dict.get(user_pattern_name, []) + [user_pattern_content]
    user_pattern_dict = {key: r'|'.join(value) for key, value in user_pattern_dict.items()}

    if pattern == '':
        raise BrighticsFunctionException.from_errors([{'0100': "Please choose a pattern."}])
    if pattern == 'custom':
        raw_pattern = custom_pattern
    elif pattern == 'user_dictionary':
        raw_pattern = user_pattern_dict.get(user_dict_pattern)
        if raw_pattern is None:
            raise BrighticsFunctionException.from_errors(
                [{'0100': user_dict_pattern + " is not a valid pattern name in the user dictionary."}])
    else:
        raw_pattern = pattern_dict.get(pattern)
    regex_pattern = re.compile(raw_pattern)

    def transformation(text):
        if transformation_mode == 'extract':
            if find_mode == 'first':
                result = regex_pattern.search(text)
                if result is None:
                    return ""
                else:
                    return result.group()
            else:  # find_mode == 'all'
                return regex_pattern.findall(text)
        elif transformation_mode == 'replace':
            if find_mode == 'first':
                return regex_pattern.sub(replacement_string, text, 1)
            else:  # find_mode == 'all'
                return regex_pattern.sub(replacement_string, text)
        elif transformation_mode == 'remove':
            if find_mode == 'first':
                return regex_pattern.sub("", text, 1)
            else:  # find_mode == 'all'
                return regex_pattern.sub("", text)
        else:  # transformation_mode == 'split'
            if find_mode == 'first':
                return regex_pattern.split(text, 1)
            else:  # find_mode == 'all'
                return regex_pattern.split(text)

    for col in input_cols:
        result_col = table[col].apply(transformation)
        out_table['regex_' + col] = result_col

    return {'out_table': out_table}
