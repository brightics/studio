from brightics.common.repr import BrtcReprBuilder
import pandas_profiling as pd_profiling
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import validate, greater_than_or_equal_to, \
    greater_than


def profile_table(table, group_by=None, **params):
    check_required_parameters(_profile_table, params, ['table'])
    if group_by is not None:
        return _function_by_group(_profile_table, table, group_by=group_by, **params)
    else:
        return _profile_table(table, **params)

    
def _profile_table(table, bins=10, check_correlation=False, correlation_threshold=0.9, correlation_overrides=None):
    
    validate(greater_than_or_equal_to(bins, 1, 'bins'),
             greater_than(correlation_threshold, 0.0, 'correlation_threshold'))
    
    rb = BrtcReprBuilder()
    
    profile = pd_profiling.ProfileReport(table, bins=bins, check_correlation=check_correlation, correlation_threshold=correlation_threshold, correlation_overrides=correlation_overrides)
    rb.addHTML(profile.html)
    summary = dict()
    summary['_repr_brtc_'] = rb.get()
    
    return {'result': summary}
