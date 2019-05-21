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

from brightics.common.validation import raise_error
import numpy as np

def check_col_type(table,feature_cols):
    test_table=table[feature_cols]
    if(check_list(test_table)):
        test_table = table[feature_cols[0]].tolist()
        feature_names=[feature_cols[0]+'_{}'.format(i) for i in range(len(test_table[0]))]
        return feature_names, test_table
    elif(check_all_numbers(test_table)):
        return feature_cols, test_table
    else:
        raise_error('0720', 'feature_cols')
    
def check_list(table):
    if(len(table.columns)==1):
        if(table.dtypes[0]!=object):
            return False
        return True

def check_all_numbers(table):
    for i in table.dtypes:
        if(i!=np.dtype(float) and i!= np.dtype(int)):
            return False
    return True        
