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
from scipy.stats import wilcoxon
import itertools


def wilcoxon_test(table, group_by=None, **params):
    check_required_parameters(_wilcoxon_test, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _wilcoxon_test)
    
    if group_by is not None:
        return _function_by_group(_wilcoxon_test, table, group_by=group_by, **params)
    else:
        return _wilcoxon_test(table, **params)


def _wilcoxon_test(table, response_col, factor_col, zero_method='wilcox', correction=False):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Wilcoxon Test Result""")
    
    groups = dict()
    for name, group in table.groupby(factor_col):
        groups[name] = group
    for name1, name2 in itertools.combinations(groups.keys(), 2):
        stats, pval = wilcoxon(x=groups[name1][response_col], y=groups[name2][response_col], zero_method=zero_method, correction=correction)
        rb.addMD(strip_margin("""
        | ## {name1} vs {name2}
        |
        | ### The sum of the ranks of the differences: {stats}
        |
        | ### The two-sided p-value for the test: {pval}
        """.format(name1=name1, name2=name2, stats=stats, pval=pval)))
            
        name = str(name1) + '_' + str(name2)
        result[name] = dict()
        result[name]['Statistics'] = stats
        result[name]['P value'] = pval
        
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
