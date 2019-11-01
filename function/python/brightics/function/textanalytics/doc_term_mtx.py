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

from brightics.common.repr import BrtcReprBuilder, strip_margin, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import validate

import pandas as pd
import numpy as np
from gensim import corpora, matutils


def doc_term_mtx(table, model, group_by=None, **params):
    check_required_parameters(_doc_term_mtx, params, ['table', 'model'])
    params = get_default_from_parameters_if_required(params, _doc_term_mtx)
    param_validation_check = []
    validate(*param_validation_check)
    if '_grouped_data' in model:
        return _function_by_group(_doc_term_mtx, table, model, group_by=group_by, **params)
    else:
        return _doc_term_mtx(table, model, **params)


def _doc_term_mtx(table, model, input_col, result_type='doc_to_bow_token'):
    corpus = table[input_col].tolist()
    
    dictionary = model['dictionary']    
    
    bow_corpus = []
    for doc in corpus:
        bow_corpus.append(dictionary.doc2bow(doc))
    
    doc_to_bow = []
    for i in range(len(corpus)):
        token_cnt = []
        for j in range(len(bow_corpus[i])):
            token_cnt.append('({token}, {cnt})'.format(token=dictionary[bow_corpus[i][j][0]], cnt=bow_corpus[i][j][1]))
        doc_to_bow.append(token_cnt)
    doc_to_bow_list = []
    for doc in doc_to_bow:
        doc_to_bow_list.append('{}'.format(list(doc)))
        
    doc_idx = ['doc_{}'.format(i) for i in range(len(corpus))]
    terms = [term for term in dictionary.token2id.keys()]
        
    if result_type == 'doc_to_bow_token':
        out_table = pd.DataFrame(data=doc_to_bow_list, columns=['doc_to_bow'])
        out_table.insert(loc=0, column='doc_idx', value=doc_idx)
    elif result_type == 'doc_term_mtx':
        out_table = pd.DataFrame(matutils.corpus2dense(bow_corpus, num_terms=len(dictionary.token2id)).T)
        out_table.insert(loc=0, column=' ', value=doc_idx)
        out_table.columns = np.append('', terms)
    elif result_type == 'term_doc_mtx':
        out_table = pd.DataFrame(matutils.corpus2dense(bow_corpus, num_terms=len(dictionary.token2id)))
        out_table.insert(loc=0, column=' ', value=terms)
        out_table.columns = np.append('', doc_idx)
    else:
        raise_runtime_error("Please check 'result_type'.")
        
    rb = BrtcReprBuilder()
    model = _model_dict('doc_term_mtx')
    model['bow_corpus'] = bow_corpus
    model['_repr_brtc_'] = rb.get()
    
    return {'out_table' : out_table}
