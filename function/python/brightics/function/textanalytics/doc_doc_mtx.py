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
from scipy import sparse


def doc_doc_mtx(table, model, group_by=None, **params):
    check_required_parameters(_doc_doc_mtx, params, ['table', 'model'])
    params = get_default_from_parameters_if_required(params, _doc_doc_mtx)
    param_validation_check = []
    validate(*param_validation_check)
    if '_grouped_data' in model:
        return _function_by_group(_doc_doc_mtx, table, model, group_by=group_by, **params)
    else:
        return _doc_doc_mtx(table, model, **params)


def _doc_doc_mtx(table, model, input_col, result_type='sparse'):
    corpus = table[input_col].tolist()

    dictionary = model['dictionary'] 
    
    bow_corpus = []
    for doc in corpus:
        bow_corpus.append(dictionary.doc2bow(doc))
        
    csr_matrix = matutils.corpus2csc(bow_corpus).T
    csr_matrix.data = np.array([1 for _ in range(len(csr_matrix.data))])
    doc_doc = (csr_matrix @ (csr_matrix.T)).tocoo()
    
    if result_type == 'sparse':
        doc_doc = sparse.triu(doc_doc, k=1)
        out_table = pd.DataFrame(doc_doc.row, columns=['1st_document_idx'])
        out_table['2nd_document_idx'] = doc_doc.col
        out_table['number_of_common_terms'] = doc_doc.data
    elif result_type == 'dense':
        doc_idx = ['doc_{}'.format(i) for i in range(len(corpus))]
        out_table = pd.DataFrame(doc_doc.todense())
        out_table.insert(loc=0, column=' ', value=doc_idx)
        out_table.columns = np.append("", doc_idx)
    else:
        raise_runtime_error("Please check 'result_type'.") 
    
    rb = BrtcReprBuilder()
    model = _model_dict('doc_doc_mtx')
    model['input_col'] = input_col
    model['doc_doc_mtx'] = doc_doc
    model['_repr_brtc_'] = rb.get()
    
    return {'out_table' : out_table}
