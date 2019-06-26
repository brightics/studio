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

from brightics.common.repr import BrtcReprBuilder
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than

import matplotlib.pyplot as plt
import seaborn as sns


def pairplot(table, group_by=None, **params):
    check_required_parameters(_pairplot, params, ['table'])
    params = get_default_from_parameters_if_required(params, _pairplot)
    param_validation_check = [greater_than(params, 0.0, 'height'),
                              greater_than(params, 0.0, 'aspect')]
    validate(*param_validation_check)
    
    if group_by is not None:
        return _function_by_group(_pairplot, table, group_by=group_by, **params)
    else:
        return _pairplot(table, **params)


def _pairplot(table, x_vars, y_vars=None, kind='scatter', diag_kind='auto', markers=None, palette=None, height=2.5, aspect=1, dropna=True, hue=None):
    s_default = plt.rcParams['lines.markersize'] ** 2.
    plot_kws = {"s": s_default * height / 6.4}
    
    if y_vars is None:
        y_vars = x_vars
    
    if kind == 'scatter':    
        g = sns.pairplot(table, x_vars=x_vars, y_vars=y_vars, kind=kind, diag_kind=diag_kind, markers=markers, height=height, aspect=aspect, \
                         dropna=dropna, hue=hue, palette=palette, plot_kws=plot_kws)
    else:
        scatter_kws = {'scatter_kws':plot_kws}
        g = sns.pairplot(table, x_vars=x_vars, y_vars=y_vars, kind=kind, diag_kind=diag_kind, markers=markers, height=height, aspect=aspect, \
                         dropna=dropna, hue=hue, palette=palette, plot_kws=scatter_kws)
    
    if height <= 2.5:
        for ax in g.axes.flatten():
            for label in ax.get_xticklabels():
                label.set_rotation(90 * (2.5 - height))
    
    rb = BrtcReprBuilder()
    rb.addPlt(plt)
    plt.clf()
    
    return {'result': {'_repr_brtc_':rb.get()} }
