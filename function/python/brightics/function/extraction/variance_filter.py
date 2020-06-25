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

from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, pandasDF2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than, greater_than_or_equal_to

import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats
import pandas as pd
import numpy as np
from sklearn.feature_selection import VarianceThreshold

def variance_filter(table, group_by=None, **params):
    check_required_parameters(_variance_filter, params, ['table'])
    
    if group_by is not None:
        return _function_by_group(_variance_filter, table, group_by=group_by, **params)
    else:
        return _variance_filter(table, **params)


def _variance_filter(table, feature_cols, threshold=0.0):
    data = table[feature_cols]
    selector = VarianceThreshold(threshold=threshold)
    selector.fit(data)
    remain_label_index = selector.get_support()
    output = selector.transform(data)
    out_table = pd.DataFrame(output, columns=pd.Series(feature_cols)[remain_label_index])

    return {'out_table': out_table}