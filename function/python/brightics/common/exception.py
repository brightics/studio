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


class BrighticsCoreException(Exception):
    def __init__(self, code, message):
        super().__init__(code, message)

        self.code = code
        self.message = message
        
    def add_detail_message(self, detailed_cause):
        self.detailed_cause = detailed_cause
        return self

class BrighticsFunctionException(Exception):
    def __init__(self, code, params=None):
        super().__init__(code)
        
        self.errors = []
        self.add_error(code, params)

    @classmethod
    def from_errors(cls, errors):
        new_instance = cls('0000')
        new_instance.errors.clear()
        for error in errors :
            for code, params in error.items():
                new_instance.add_error(code, params)
        return new_instance
        
    def add_error(self, code, params=None):
        params_list = params if isinstance(params, list) else [params] if params else []
        self.errors.append({code: params_list})
	
    def add_detail_message(self, detailed_cause):
        self.detailed_cause = detailed_cause
        return self