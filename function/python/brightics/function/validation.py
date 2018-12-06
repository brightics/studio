from brightics.common.exception import BrighticsFunctionException


def validate(*bfe):
    elist = []
    for e in bfe:
        if e is not None and type(e) is tuple and len(e) == 2:
            elist.append({e[0]: e[1]})
    if len(elist) > 0:
        raise BrighticsFunctionException.from_errors(elist)

def error(true_condition, error_code, error_message_params):
    if not true_condition:
        return (error_code, error_message_params)
    else:
        None
        
def default_error(true_condition, error_message):
    error(true_condition, '0100', [error_message])
    
def greater_than(var, criteria, var_name):
    return error(var > criteria, '0008', [var_name, criteria])

def greater_than_or_equal_to(var, criteria, var_name):
    return error(var >= criteria, '0010', [var_name, criteria])

def less_than(var, criteria, var_name):
    return error(var < criteria, '0012', [var_name, criteria])

def less_than_or_equal_to(var, criteria, var_name):
    return error(var <= criteria, '0014', [var_name, criteria])

def from_to(var, from_v, to_v, var_name):
    return error(from_v <= var <= to_v, '0004', [var_name, from_v, to_v])

def from_under(var, from_v, under_v, var_name):
    return error(from_v <= var < under_v, '0006', [var_name, from_v, under_v])

def over_to(var, over_v, to_v, var_name):
    return error(over_v < var <= to_v, '0006', [var_name, over_v, to_v])

def over_under(var, over_v, under_v, var_name):
    return error(over_v < var < under_v, '0006', [var_name, over_v, under_v])


def raise_exception(true_condition, error_code, error_message_params):
    if not true_condition:
        raise BrighticsFunctionException(error_code, error_message_params)

def raise_default_exception(true_condition, error_message):
    if not true_condition:
        raise BrighticsFunctionException('0100', [error_message])

def raise_greater_than(var, criteria, var_name):
    raise_exception(var > criteria, '0008', [var_name, criteria])

def raise_greater_than_or_equal_to(var, criteria, var_name):
    raise_exception(var >= criteria, '0010', [var_name, criteria])
    
def raise_less_than(var, criteria, var_name):
    raise_exception(var < criteria, '0012', [var_name, criteria])
    
def raise_less_than_or_equal_to(var, criteria, var_name):
    raise_exception(var <= criteria, '0014', [var_name, criteria])
    
def raise_from_to(var, from_v, to_v, var_name):
    raise_exception(var >= from_v and var <= to_v, '0004', [var_name, from_v, to_v])
