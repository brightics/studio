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
from gensim import matutils
from scipy import sparse


def term_term_mtx(table, model, group_by=None, **params):
    check_required_parameters(_term_term_mtx, params, ['table', 'model'])
    params = get_default_from_parameters_if_required(params, _term_term_mtx)
    param_validation_check = []
    validate(*param_validation_check)
    if '_grouped_data' in model:
        return _function_by_group(_term_term_mtx, table, model, group_by=group_by, **params)
    else:
        return _term_term_mtx(table, model, **params)


def _term_term_mtx(table, model, input_col, result_type='sparse'):
    corpus = table[input_col].tolist()
    
    dictionary = model['dictionary']
     
    bow_corpus = []
    for doc in corpus:
        bow_corpus.append(dictionary.doc2bow(doc))
    
    csr_matrix = matutils.corpus2csc(bow_corpus).T
    csr_matrix.data = np.array([1 for _ in range(len(csr_matrix.data))])
    term_term = (csr_matrix.T @ csr_matrix).tocoo()
    
    if result_type == 'sparse':
        term_term = sparse.triu(term_term, k=1)
        out_table = pd.DataFrame([dictionary[i] for i in term_term.row], columns=['term1'])
        out_table['term2'] = [dictionary[j] for j in term_term.col]
        out_table['number_of_documents_containing_terms'] = term_term.data

    elif result_type == 'dense':
        if model['add_words'] is None:
            model['add_words'] = []       
        num_origin = len(dictionary) - len(model['add_words'])
        terms = [term for term in dictionary.token2id.keys()][:num_origin]
        doc_idx = ['doc_{}'.format(i) for i in range(len(corpus))]
        out_table = pd.DataFrame(term_term.todense())
        out_table.insert(loc=0, column=' ', value=terms)
        out_table.columns = np.append(" ", terms)

    else:
        raise_runtime_error("Please check 'result_type'.")
        
    rb = BrtcReprBuilder()
    model = _model_dict('term_term_mtx')
    model['term_term_mtx'] = term_term
    model['_repr_brtc_'] = rb.get()
    
    return {'out_table' : out_table}
