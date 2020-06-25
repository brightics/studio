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
from scipy.stats import friedmanchisquare


def friedman_test(table, group_by=None, **params):
    check_required_parameters(_friedman_test, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _friedman_test)
    
    if group_by is not None:
        return _function_by_group(_friedman_test, table, group_by=group_by, **params)
    else:
        return _friedman_test(table, **params)


def _friedman_test(table, response_cols, factor_col):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Friedman test Result""")
    
    groups = dict()
    for name, group in table.groupby(factor_col):
        groups[name] = group
    min_length = min([x.shape[0] for x in groups.values()])
    samples = dict()
    for name in groups.keys():
        if groups[name].shape[0] == min_length:
            samples[name] = groups[name]
        else:
            samples[name] = groups[name].sample(n=min_length)
    group_name = []
    stats = []
    pvals = []
    for response_col in response_cols:
        stat, pval = friedmanchisquare(*[x[response_col] for x in samples.values()])
        group_name.append(response_col + ' by ' + factor_col)
        stats.append(stat)
        pvals.append(pval)
            
        name = response_col + '_' + factor_col
        result[name] = dict()
        result[name]['Statistics'] = stat
        result[name]['P value'] = pval
        
    rb.addMD(strip_margin("""
    | {table}
    """.format(table=pandasDF2MD(pd.DataFrame({'': group_name, 'Test Statistics': stats, 'P Value': pvals})))))
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
