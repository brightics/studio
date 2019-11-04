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

from base64 import b64encode
from os import urandom
from string import ascii_letters
from string import digits
from random import choice

__letters = [c.encode() for c in ascii_letters]
__num_to_byte = dict([(c.encode()[0], c.encode()) for c in digits])


def gen_colname(length, count, existing_cols=None):
    # if length is too short then the while loop get stuck in infinite loop

    if existing_cols is None or len(existing_cols) == 0:
        existing_cols = set()
    else:
        if isinstance(existing_cols, list):
            existing_cols = set(existing_cols)
        elif isinstance(existing_cols, set):
            pass
        else:
            raise TypeError('existing_cols should be list or set')

    generated_cnt = 0
    while generated_cnt < count:

        candidate = b64encode(
            urandom(((length + 1) * 3) // 4),
            b'//',
        )[:length]

        while b'/' in candidate:
            candidate = candidate.replace(b'/', choice(__letters), 1)

        first = candidate[0]
        if first in __num_to_byte:
            candidate = candidate.replace(
                __num_to_byte[first], choice(__letters), 1)

        if candidate not in existing_cols:
            existing_cols.add(candidate)
            generated_cnt += 1
            yield candidate.decode()
