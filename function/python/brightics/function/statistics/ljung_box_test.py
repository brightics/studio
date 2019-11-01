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

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, \
    pandasDF2MD, keyValues2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import from_under

import pandas as pd
import numpy as np
from statsmodels.stats.diagnostic import acorr_ljungbox


def ljung_box_test(table, group_by=None, **params):
    check_required_parameters(_ljung_box_test, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _ljung_box_test)
    
    if group_by is not None:
        return _function_by_group(_ljung_box_test, table, group_by=group_by, **params)
    else:
        return _ljung_box_test(table, **params)


def _ljung_box_test(table, input_cols, lags=None):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Ljung Box test Result""")
    
    for input_col in input_cols:
        lbvalue, pvalue = acorr_ljungbox(x=table[input_col], lags=lags)
        
        lb_res = dict()
        lb_res['lags'] = range(1, len(lbvalue) + 1)
        lb_res['test statistic'] = lbvalue
        lb_res['p-value based on chi-square distribution'] = pvalue
        lb_res = pd.DataFrame(lb_res)
            
        rb.addMD(strip_margin("""
        | ## {input_col} test result
        |
        | {lb_res}
        """.format(input_col=input_col,
            lb_res=pandasDF2MD(lb_res, num_rows=lb_res.shape[0]))))
            
        result[input_col] = lb_res
        
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
