from brightics.common.exception import BrighticsFunctionException


def validate(*bfe):
    elist = []
    for e in bfe:
        if e is not None and type(e) is tuple and len(e) == 2:
            elist.append({e[0]: e[1]})
    if len(elist) > 0:
        print(elist)
        raise BrighticsFunctionException.from_errors(elist)


def get_error(true_condition, error_code, error_message_params):
    if not true_condition:
        return (error_code, error_message_params)
    else:
        None


def error(error_code, error_message_params, true_condition=False):
    return get_error(true_condition, error_code, error_message_params)


def runtime_error(error_message, true_condition=False):
    return get_error(true_condition, '0100', [error_message])

    
def require_param(var_name):
    return error('0033', [var_name])

    
def greater_than(var, criteria, var_name):
    return get_error(var > criteria, '0008', [var_name, criteria])


def greater_than_or_equal_to(var, criteria, var_name):
    return get_error(var >= criteria, '0010', [var_name, criteria])


def less_than(var, criteria, var_name):
    return get_error(var < criteria, '0012', [var_name, criteria])


def less_than_or_equal_to(var, criteria, var_name):
    return get_error(var <= criteria, '0014', [var_name, criteria])


def from_to(var, from_v, to_v, var_name):
    return get_error(from_v <= var <= to_v, '0004', [var_name, from_v, to_v])


def from_under(var, from_v, under_v, var_name):
    return get_error(from_v <= var < under_v, '0006', [var_name, from_v, under_v])


def over_to(var, over_v, to_v, var_name):
    return get_error(over_v < var <= to_v, '0006', [var_name, over_v, to_v])


def over_under(var, over_v, under_v, var_name):
    return get_error(over_v < var < under_v, '0006', [var_name, over_v, under_v])


def all_elements_greater_than(var, criteria, var_name):
    return get_error(all([x > criteria for x in var]), '0009', [var_name, criteria])


def all_elements_greater_than_or_equal_to(var, criteria, var_name):
    return get_error(all([x >= criteria for x in var]), '0011', [var_name, criteria])


def all_elements_less_than(var, criteria, var_name):
    return get_error(all([x < criteria for x in var]), '0013', [var_name, criteria])


def all_elements_less_than_or_equal_to(var, criteria, var_name):
    return get_error(all([x <= criteria for x in var]), '0015', [var_name, criteria])


def all_elements_from_to(var, from_v, to_v, var_name):
    return get_error(all([from_v <= x <= to_v for x in var]), '0005', [var_name, from_v, to_v])


def all_elements_from_under(var, from_v, under_v, var_name):
    return get_error(all([from_v <= var < under_v for x in var]), '0007', [var_name, from_v, under_v])


def all_elements_over_to(var, over_v, to_v, var_name):
    return get_error(all([over_v < var <= to_v for x in var]), '0017', [var_name, over_v, to_v])


def all_elements_over_under(var, over_v, under_v, var_name):
    return get_error(all([over_v < var < under_v for x in var]), '0019', [var_name, over_v, under_v])


def raise_error(error_code, error_message_params, true_condition=False):
    if not true_condition:
        raise BrighticsFunctionException(error_code, error_message_params)


def raise_runtime_error(error_message, true_condition=False):
    if not true_condition:
        raise BrighticsFunctionException('0100', [error_message])
