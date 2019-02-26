from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.validation import validate, greater_than_or_equal_to

import statsmodels.api as sm
import matplotlib.pyplot as plt


def timeseries_decomposition(table, group_by=None, **params):
    check_required_parameters(_timeseries_decomposition, params, ['table'])
    if group_by is not None:
        return _function_by_group(_timeseries_decomposition, table, group_by=group_by, **params)
    else:
        return _timeseries_decomposition(table, **params)

    
def _timeseries_decomposition(table, input_col, frequency, model_type='additive', filteration=None, two_sided=True, extrapolate_trend=0):
    param_validation_check = [greater_than_or_equal_to(frequency, 1, 'frequency'),
                              greater_than_or_equal_to(extrapolate_trend, 0, 'extrapolate_trend')]
        
    validate(*param_validation_check)
    
    out_table = table.copy()
    decomposition = sm.tsa.seasonal_decompose(out_table[input_col], model=model_type, filt=filteration, freq=frequency, two_sided=two_sided, extrapolate_trend=extrapolate_trend)
    decomposition.plot()
    plt2 = plt2MD(plt)
    plt.clf()
    
    out_table['trend'] = decomposition.trend
    out_table['seasonal'] = decomposition.seasonal
    out_table['residual'] = decomposition.resid
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Time Series Decomposition Result
    | Model Type : {model_type}
    |
    | {image2}
    |
    """.format(model_type=model_type, image2=plt2)))
    
    model = _model_dict('timeseries_decomposition')
    model['model_type'] = model_type
    model['_repr_brtc_'] = rb.get()
    
    return {'out_table':out_table, 'model':model}
