from brightics.common.exception import BrighticsCoreException
from brightics.common.exception import BrighticsFunctionException


def get_required_parameters(func):
    import inspect

    def _check_required(param):
        return param.default is inspect.Parameter.empty and (param.kind is not inspect.Parameter.VAR_POSITIONAL and param.kind is not inspect.Parameter.VAR_KEYWORD)

    signature = inspect.signature(func)
    return [p.name for p in signature.parameters.values() if _check_required(p)]


def check_required_parameters(func, params, excluded_paramkeys=[]):
    required_params = get_required_parameters(func)
    required_parames_error = []
    for rp in required_params:
        if rp not in params and rp not in excluded_paramkeys:
            error_parameters.append({'3109':[rp]})
        if required_parames_error:
            raise BrighticsFunctionException.from_errors(required_parames_error)