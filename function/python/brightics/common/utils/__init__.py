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

from brightics.common.exception import BrighticsCoreException
from brightics.common.exception import BrighticsFunctionException
import inspect
import time

def get_default_from_parameters_if_required(params,func):
    default=[(p.name,p.default) for p in inspect.signature(func).parameters.values() if p.default is not inspect.Parameter.empty]
    for name,value in default:
        if name not in params:
            params[name] = value
    return params


def get_required_parameters(func):
    def _check_required(param):
        return param.default is inspect.Parameter.empty and (param.kind is not inspect.Parameter.VAR_POSITIONAL and param.kind is not inspect.Parameter.VAR_KEYWORD)

    signature = inspect.signature(func)
    return [p.name for p in signature.parameters.values() if _check_required(p)]


def check_required_parameters(func, params, excluded_paramkeys=[]):
    required_params = get_required_parameters(func)
    required_params_error = []
    for rp in required_params:
        if rp not in params and rp not in excluded_paramkeys:
            required_params_error.append({'0033':[rp]})
    if required_params_error:
        raise BrighticsFunctionException.from_errors(required_params_error)

        
def time_usage(func):

    def wrapper(*args, **kwargs):
        start = time.time()
        res = func(*args, **kwargs)
        end = time.time()
        print("{} elapsed time: {} s".format(func, end - start))
        return res

    return wrapper
