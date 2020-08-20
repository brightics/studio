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


from base64 import b64encode
from os import urandom
import string
import random


__letters = [c.encode() for c in string.ascii_letters]
__num_to_byte = dict([(c.encode()[0], c.encode()) for c in string.digits])


def gen_colname(length, cnt, existing_cols=None, toupper=False):
    """ if length is too short then the while loop get stuck in infinite loop
    """

    if existing_cols is None or len(existing_cols) == 0:
        existing_cols = set()
    else:
        if isinstance(existing_cols, list):
            existing_cols = set(existing_cols)
        elif isinstance(existing_cols, set):
            pass
        else:
            raise TypeError

    if toupper:
        existing_cols = set(item.upper() for item in existing_cols)

    generated_cnt = 0
    while generated_cnt < cnt:
        candidate = b64encode(
            urandom(((length + 1) * 3) // 4), b'//',)[:length]

        while b'/' in candidate:
            candidate = candidate.replace(b'/', random.choice(__letters), 1)

        first = candidate[0]
        if first in __num_to_byte:
            candidate = candidate.replace(
                __num_to_byte[first], random.choice(__letters), 1)

        if toupper:
            candidate = candidate.upper()

        if candidate not in existing_cols:
            existing_cols.add(candidate)
            generated_cnt += 1
            yield candidate.decode()
