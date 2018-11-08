from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters


def random_sample(table, group_by=None, **params):
    check_required_parameters(_random_sample, params, ['table'])
    if group_by is not None:
        return _function_by_group(_random_sample, table, group_by=group_by, **params)
    else:
        return _random_sample(table, **params)

def _random_sample(table, axis='0', num_or_frac='num', num=1, frac=0.5, replace=False, seed=None):
    if num_or_frac == 'num':
        out_table = table.sample(n=num, replace=replace, random_state=seed, axis=int(axis))
    else:  # 'frac'
        out_table = table.sample(frac=frac, replace=replace, random_state=seed, axis=int(axis))
    return {'table' : out_table}