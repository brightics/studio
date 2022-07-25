"""
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to, from_under
from brightics.common.data_export import PyPlotData, PyPlotMeta

import statsmodels.api as sm
import matplotlib
matplotlib.rcParams['axes.unicode_minus'] = False
import matplotlib.pyplot as plt


def timeseries_decomposition(table, group_by=None, **params):
    len_table = len(table)
    check_required_parameters(_timeseries_decomposition, params, ['table'])
    params = get_default_from_parameters_if_required(params, _timeseries_decomposition)
    param_validation_check = [from_under(params, 1, len_table, 'frequency'),
                              greater_than_or_equal_to(params, 0, 'extrapolate_trend')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_timeseries_decomposition, table, group_by=group_by, **params)
    else:
        return _timeseries_decomposition(table, **params)


def _timeseries_decomposition(table, input_col, frequency, model_type='additive', filteration=None, two_sided=True, extrapolate_trend=0):
    out_table = table.copy()
    decomposition = sm.tsa.seasonal_decompose(out_table[input_col], model=model_type, filt=filteration, freq=frequency, two_sided=two_sided, extrapolate_trend=extrapolate_trend)
    decomposition.plot()

    figs = PyPlotData()
    figs.addpltfig('plt2', plt)
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
    """.format(model_type=model_type, image2=figs.getMD('plt2'))))

    model = _model_dict('timeseries_decomposition')
    model['model_type'] = model_type
    model['_repr_brtc_'] = rb.get()
    model['figures'] = figs.tojson()

    return {'out_table':out_table, 'model':model}
