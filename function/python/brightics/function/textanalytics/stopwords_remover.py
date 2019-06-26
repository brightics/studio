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

from nltk.corpus import stopwords
import pandas as pd
from brightics.common.utils import check_required_parameters

def stopwords_remover(table, **params):
    check_required_parameters(_stopwords_remover, params, ['table'])   
    return _stopwords_remover(table, **params)

def stopwords_remover_user_dict(table, **params):
    check_required_parameters(_stopwords_remover, params, ['table'])   
    return _stopwords_remover(table, **params)

def _stopwords_remover(table, input_cols, hold_cols=None, default_dict=False, stop_words=None, prefix='stopwords', user_dict=pd.DataFrame()):
    
    len_table = len(table)
    out_table = pd.DataFrame()
    
    if hold_cols is None:
        hold_cols = []
    for column in hold_cols:
        out_table[column] = table[column]    
    
    if stop_words is None:
        stop_words = []        
    if (user_dict.empty == False):
        stop_words.extend(user_dict[user_dict.keys()[0]].values.tolist())
    if (default_dict == True):
        stop_words.extend(stopwords.words('english'))  # global variable ���Խ� language variable ���� �ѱۻ����� �߰� ����
    
    for column in input_cols:
        result_table = [[] for i in range(len_table)]
        for i in range(0, len_table):
            for j in table[column][i]:
                if (j not in stop_words):
                    result_table[i].append(j)        
        out_table['{}_{}'.format(prefix, column)] = result_table    

    return {'out_table': out_table}