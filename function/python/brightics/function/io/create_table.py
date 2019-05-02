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

import pandas as pd
import numpy as np


def create_table(col_names, data_array, type_array):

    new_data_array = data_array.copy()
    string_to_type = {'int' : int, 'string' : str, 'double' : float}
    
    for j in range(0, len(col_names)):
        for i in range(0, len(data_array)):
            if type_array[j] != 'string':
                if data_array[i][j] == None:
                    new_data_array[i][j] = np.nan
                else:
                    new_data_array[i][j] = string_to_type[type_array[j]](data_array[i][j])
            else:
                if data_array[i][j] == None:
                    new_data_array[i][j] = ''                    
    
    out_table = pd.DataFrame(new_data_array, columns=col_names)
    
    return {'out_table': out_table}
