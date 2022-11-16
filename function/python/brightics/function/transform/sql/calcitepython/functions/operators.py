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

binary_operators = dict(
    PLUS='+',
    MINUS='-',
    TIMES='*',
    DIVIDE='/',
    FLOORDIVIDE='//',
    EQUALS='==',
    LESS_THAN='<',
    GREATER_THAN='>',
    GREATER_THAN_OR_EQUAL='>=',
    LESS_THAN_OR_EQUAL='<=',
    AND='and',
    OR='or',
    NOT_EQUALS='!='
)

identity_function = dict(IDENTITY='Id')

prefix_operators = dict(
    # do not delete trailing white space
    MINUS_PREFIX='-',
    NOT='not '
)
