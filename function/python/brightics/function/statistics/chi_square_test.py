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

from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.utils import _model_dict

from scipy import stats
import pandas as pd
import numpy as np
import math


def chi_square_test_of_independence(table, group_by=None, **params):
    check_required_parameters(_chi_square_test_of_independence, params, ['table'])
    if group_by is not None:
        return _function_by_group(_chi_square_test_of_independence, table, group_by=group_by, **params)
    else:
        return _chi_square_test_of_independence(table, **params)


def _chi_square_test_of_independence(table, feature_cols, label_col, correction=False):
        
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Chi-square Test of Independence Result
    |  - H0: the two categorical variables are independent.
    |  - H1: the two categorical variables are dependent.
    """))
    
    model = _model_dict('chi_square_test_of_independence')
    
    for idx, feature_col in enumerate(feature_cols):
        contingency_table = pd.crosstab(table[feature_col], table[label_col], margins=True)
        feature_index = len(contingency_table) - 1 
        label_index = len(contingency_table.columns) - 1
        temporary = contingency_table.iloc[0:feature_index, 0:label_index]
        
        test = stats.chi2_contingency(np.array(temporary), correction, 1)
        stat_chi = test[0]
        dof = test[2]
        p_chi = test[1]
        
        if p_chi < 0.05:
            dependence = 'Reject the null hypothesis that two categorical variables are independent at 5% significance level.'
        elif p_chi >= 0.05:
            dependence = 'No association was found between two categorical variables at 5% significance level.'
        elif math.isnan(p_chi):
            dependence = 'Independence of two categorical variables cannot be decided.'
            
        data = {
            'estimate': stat_chi,
            'df': dof,
            'p_value': p_chi
        }
            
        result_table = pd.DataFrame([data], columns=['estimate', 'df', 'p_value'])
        
        model['result{}'.format(idx)] = result_table
        
        rb.addMD(strip_margin("""
        |### Label: {label}, Feature: {feature}
        |###### Result Table {idx}
        |  
        |{result_table}
        |
        |{dependence}
        |
        |
        """.format(label=label_col, feature=feature_col, idx=idx, result_table=pandasDF2MD(result_table), dependence=dependence)))
    
    model['_repr_brtc_'] = rb.get()
    
    return {'model':model}

