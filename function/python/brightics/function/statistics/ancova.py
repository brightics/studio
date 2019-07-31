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

import seaborn as sns
import matplotlib.pyplot as plt
from pingouin import ancova as pg_ancova
import numpy as np
import pandas as pd

def ancova(table, group_by=None, **params):
    check_required_parameters(_ancova, params, ['table'])
    
    if group_by is not None:
        return _function_by_group(_ancova, table, group_by=group_by, **params)
    else:
        return _ancova(table, **params)
    
    
def _ancova(table, response_cols, factor_col, between_col):
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    ## Analysis of Covariance Result
    """))
    groups = table[between_col].unique()
    groups.sort()
    sum_len = np.sum([len(str(group)) for group in groups])
    
    result = dict()
    result['_grouped_data'] = dict()
    
    for response_col in response_cols:
        data = table[response_col]
        result['_grouped_data'][response_col] = dict()
        
        ax = sns.boxplot(x=between_col, y=response_col, data=table, order=groups)
        if sum_len > 512:
            ax.set_xticklabels(ax.get_xticklabels(), rotation=90)
        elif sum_len > 64:
            ax.set_xticklabels(ax.get_xticklabels(), rotation=45)
            
        fig_box = plt2MD(plt)
        plt.clf()

        ancova_res = pg_ancova(data=table, dv=response_col, covar=factor_col, between=between_col)
        ancova_df = pandasDF2MD(ancova_res)
            
        rb.addMD(strip_margin("""
        | ## {response_col} by {between_col}
        | {fig_box}
        |
        | ### ANCOVA
        | {ancova_df}
        """.format(response_col=response_col, between_col=between_col, fig_box=fig_box, ancova_df=ancova_df)))
        
    result['_repr_brtc_'] = rb.get()
    return {'result': result}