from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than_or_equal_to


def random_sampling(table, group_by=None, **params):
    check_required_parameters(_random_sampling, params, ['table'])
    if group_by is not None:
        return _function_by_group(_random_sampling, table, group_by=group_by, **params)
    else:
        return _random_sampling(table, **params)


def _random_sampling(table, num_or_frac='num', num=1, frac=0.5, replace=False, seed=None):
    validate(greater_than_or_equal_to(num, 1, 'num'))
    
    if num_or_frac == 'num':
        out_table = table.sample(n=num, replace=replace, random_state=seed)
    else:  # 'frac'
        out_table = table.sample(frac=frac, replace=replace, random_state=seed)
    return {'table' : out_table}
