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

def all_elements_greater_than(var, criteria, var_name):
    return error(all([x > criteria for x in var]), '0009', [var_name, criteria])

def all_elements_greater_than_or_equal_to(var, criteria, var_name):
    return error(all([x >= criteria for x in var]), '0011', [var_name, criteria])

def all_elements_less_than(var, criteria, var_name):
    return error(all([x < criteria for x in var]), '0013', [var_name, criteria])

def all_elements_less_than_or_equal_to(var, criteria, var_name):
    return error(all([x <= criteria for x in var]), '0015', [var_name, criteria])

def all_elements_from_to(var, from_v, to_v, var_name):
    return error(all([from_v <= x <= to_v for x in var]), '0005', [var_name, from_v, to_v])

def all_elements_from_under(var, from_v, under_v, var_name):
    return error(all([from_v <= var < under_v for x in var]), '0007', [var_name, from_v, under_v])

def all_elements_over_to(var, over_v, to_v, var_name):
    return error(all([over_v < var <= to_v for x in var]), '0017', [var_name, over_v, to_v])

def all_elements_over_under(var, over_v, under_v, var_name):
    return error(all([over_v < var < under_v for x in var]), '0019', [var_name, over_v, under_v])



def raise_error(true_condition, error_code, error_message_params):
    if not true_condition:
        raise BrighticsFunctionException(error_code, error_message_params)

def raise_default_error(true_condition, error_message):
    if not true_condition:
        raise BrighticsFunctionException('0100', [error_message])
