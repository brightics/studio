from brightics.common.exception import BrighticsCoreException


def get_required_parameters(func):
    import inspect

    def _check_required(param):
        return param.default is inspect.Parameter.empty and (param.kind is not inspect.Parameter.VAR_POSITIONAL and param.kind is not inspect.Parameter.VAR_KEYWORD)

    signature = inspect.signature(func)
    return [p.name for p in signature.parameters.values() if _check_required(p)]


def check_required_parameters(func, params, excluded_paramkeys=[]):
    required_params = get_required_parameters(func)
    for rp in required_params:
        if rp not in params and rp not in excluded_paramkeys:
            raise BrighticsCoreException('3109', rp)
