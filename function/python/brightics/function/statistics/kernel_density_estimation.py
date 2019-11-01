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

import numpy as np
import pandas as pd
from sklearn.neighbors import KernelDensity
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.classify_input_type import check_col_type
from brightics.common.exception import BrighticsFunctionException
from brightics.common.groupby import _function_by_group


def kernel_density_estimation(table, group_by=None, **params):
    check_required_parameters(_kernel_density_estimation, params, ['table'])
    params = get_default_from_parameters_if_required(params, _kernel_density_estimation)
    param_validation_check = [greater_than(params, 0, 'bandwidth')]
    validate(*param_validation_check)
    try:
        points = [np.float64(params['points'])]
    except:
        try:
            points_str = params['points'].split(',')
            points = [np.float64(point) for point in points_str]
        except:
            try:
                p0 = params['points'].split(' to ')
                _from = np.float64(p0[0])
                p1 = p0[1].split(' by ')
                _to = np.float64(p1[0])
                _step = np.float64(p1[1])
                points = np.arange(_from, _to, _step)
            except:
                raise BrighticsFunctionException.from_errors([{'0100':'Points is not of Array[Double] type.'}])
    params['points'] = points
    if group_by is not None:
        grouped_model = _function_by_group(_kernel_density_estimation, table, group_by=group_by, **params)
        return grouped_model
    else:
        return _kernel_density_estimation(table, **params)
    
def _kernel_density_estimation(table, input_col, points, bandwidth=1.0, kernel='gaussian'):
    kd = KernelDensity(kernel=kernel, bandwidth=bandwidth)
    kd.fit(table[[input_col]])
    out_table = pd.DataFrame({'input':points, 'input_estimated':np.exp(kd.score_samples(np.array(points).reshape(-1,1)))})
    return {'out_table' : out_table}
