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

import json
import pickle
import numpy


def decode(obj):
    def redis_read_hook(o):
        if '__inf__' in o:
            return float(o['__inf__'])
        if '__set__' in o:
            return set(o['__set__'])
        if '__tuple__' in o:
            return tuple(o['__tuple__'])
        if '__numpy__' in o:
            return numpy.array(o['__numpy__'])
        # TODO add more support types
        if '__pickled__' in o:
            import array
            return pickle.loads(array.array('B', o['__pickled__']).tobytes())
        return o

    return json.loads(obj, object_hook=redis_read_hook)
