from brightics.common.exception import BrighticsFunctionException


def get_required_parameters(func):
    import inspect

    def _check_required(param):
        return param.default is inspect.Parameter.empty and (param.kind is not inspect.Parameter.VAR_POSITIONAL and param.kind is not inspect.Parameter.VAR_KEYWORD)

    signature = inspect.signature(func)
    return [p.name for p in signature.parameters.values() if _check_required(p)]


def is_empty(value):
    if isinstance(value, list) or isinstance(value, str):
        return not value

    return False


def check_required_parameters(func, params, excluded_param_keys=None):
    if excluded_param_keys is None:
        excluded_param_keys = []

    required_params = get_required_parameters(func)
    params_to_check = [param for param in required_params if param not in excluded_param_keys]

    for rp in params_to_check:
        if (rp not in params) or is_empty(params[rp]):
            raise BrighticsFunctionException.from_errors([{'0033': [rp]}])
