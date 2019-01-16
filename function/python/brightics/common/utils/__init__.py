from brightics.common.exception import BrighticsCoreException
from brightics.common.exception import BrighticsFunctionException

import time


def get_required_parameters(func):
    import inspect

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
