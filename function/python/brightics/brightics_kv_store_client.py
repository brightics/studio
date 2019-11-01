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

import brightics.common.json as data_json
from brightics.brightics_java_gateway import brtc_java_gateway as gateway


class KVStoreClient:
    @staticmethod
    def set(key, data):
        gateway.put_kv_data(key, data_json.to_json(data, for_redis=True))

    @staticmethod
    def get(key):
        return data_json.from_json(gateway.get_kv_data(key))
