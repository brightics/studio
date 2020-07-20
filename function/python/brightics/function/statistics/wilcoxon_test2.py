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
from brightics.common.exception import BrighticsFunctionException as BFE

import pandas as pd
import numpy as np
from scipy.stats import wilcoxon
import itertools


def wilcoxon_test2(table, group_by=None, **params):
    check_required_parameters(_wilcoxon_test2, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _wilcoxon_test2)
    
    if group_by is not None:
        return _function_by_group(_wilcoxon_test2, table, group_by=group_by, **params)
    else:
        return _wilcoxon_test2(table, **params)


def _wilcoxon_test2(table, first_col, second_col, zero_method='wilcox', correction=False):
    result = dict()
    rb = BrtcReprBuilder()
    rb.addMD("""## Wilcoxon Test Result""")

    alter_hypothesis = []
    stats = []
    pvals = []

    stat, pval = wilcoxon(x=table[first_col], y=table[second_col], zero_method=zero_method, correction=correction)
    alter_hypothesis.append('Median of the differences != 0')
    stats.append(stat)
    pvals.append(pval)

    result_table = pd.DataFrame({'Alternative hypothesis': alter_hypothesis, 'Sum of differences ranks': stats, 'P-value': pvals})
        
    rb.addMD(strip_margin("""
    | {table}
    """.format(table=pandasDF2MD(result_table))))
    result['_repr_brtc_'] = rb.get()
        
    return {'result': result}
