from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to


def random_sampling(table, group_by=None, **params):
    check_required_parameters(_random_sampling, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _random_sampling)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'num')]
    validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_random_sampling, table, group_by=group_by, **params)
    else:
        return _random_sampling(table, **params)


def _random_sampling(table, num_or_frac='num', num=1, frac=50, replace=False, seed=None):
    
    if num_or_frac == 'num':
        out_table = table.sample(n=num, replace=replace, random_state=seed)
    else:  # 'frac'
        out_table = table.sample(frac=frac/100, replace=replace, random_state=seed)
    return {'table' : out_table}
