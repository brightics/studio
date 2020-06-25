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
from scipy.stats import mannwhitneyu
import itertools


def mann_whitney_test(table, group_by=None, **params):
    check_required_parameters(_mann_whitney_test, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _mann_whitney_test)
    
    if group_by is not None:
        return _function_by_group(_mann_whitney_test, table, group_by=group_by, **params)
    else:
        return _mann_whitney_test(table, **params)


def _mann_whitney_test(table, response_col, factor_col, use_continuity=True):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Mann Whitney test Result""")
    
    groups = dict()
    uniq_factor = table[factor_col].unique()
    for name in uniq_factor:
        groups[name] = np.array(table[response_col])[np.where(table[factor_col] == name)]
    group_name = []
    stats = []
    pvals = []
    for name1, name2 in itertools.combinations(uniq_factor, 2):
        name = str(name1) + ' vs ' + str(name2)
        stat, pval = mannwhitneyu(groups[name1], groups[name2], use_continuity=use_continuity)
        group_name.append(name)
        stats.append(stat)
        pvals.append(pval)
            
        result[name] = dict()
        result[name]['Statistics'] = stat
        result[name]['P value'] = pval
        
    rb.addMD(strip_margin("""
    | {table}
    """.format(table=pandasDF2MD(pd.DataFrame({'': group_name, 'Test Statistics': stats, 'P Value': pvals})))))
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
