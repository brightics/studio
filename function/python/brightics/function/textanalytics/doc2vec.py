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

from random import randint
import pandas as pd
from gensim.models.doc2vec import Doc2Vec, TaggedDocument

from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to
from brightics.common.repr import BrtcReprBuilder 
from brightics.common.repr import strip_margin
from brightics.function.utils import _model_dict
from brightics.common.repr import dict2MD


def doc2vec(table, **params):
    check_required_parameters(_doc2vec, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _doc2vec)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'vector_size'),
                              greater_than_or_equal_to(params, 1, 'window'),
                              greater_than_or_equal_to(params, 1, 'min_count'),
                              greater_than_or_equal_to(params, 1, 'train_epoch'),
                              greater_than_or_equal_to(params, 1, 'workers'),
                              greater_than_or_equal_to(params, 1, 'negative')]
    validate(*param_validation_check) 
    return _doc2vec(table, **params)


def _doc2vec(table, input_col, dm=1, vector_size=100, window=10, min_count=1,
             max_vocab_size=None, train_epoch=100, workers=1, alpha=0.025,
             min_alpha=0.025, seed=None, hs=1, negative=5, ns_exponent=0.75,
             hashfxn=hash):

    if seed is None:
        random_state = seed
        seed = randint(0, 0xffffffff)
    else:
        random_state = seed

    docs = table[input_col]
    tagged_docs = [TaggedDocument(doc, [i]) for i, doc in enumerate(docs)]

    # hs = 1 if hs is True else 0
    if isinstance(dm, str):
        dm = int(dm)
    algo = {1: 'PV-DM', 0: 'PV_DBOW'}[dm]

    d2v = Doc2Vec(documents=tagged_docs,
                  dm=dm,
                  vector_size=vector_size,
                  window=window,
                  alpha=alpha,
                  min_alpha=min_alpha,
                  seed=seed,
                  min_count=min_count,
                  max_vocab_size=max_vocab_size,
                  workers=workers,
                  epochs=train_epoch,
                  hs=hs,
                  negative=negative,
                  ns_exponent=ns_exponent,
                  hashfxn=hashfxn)

    vocab = d2v.wv.vocab

    params = {'Input column': input_col,
              'Training algorithm': algo,
              'Dimension of Vectors': vector_size,
              'Window': window,
              'Minimum count': min_count,
              'Max vocabulary size': max_vocab_size,
              'Train epoch': train_epoch,
              'Number of workers': workers,
              'Alpha': alpha,
              'Minimum alpha': min_alpha,
              'Seed': random_state,
              'Hierarchical softmax': hs,
              'Negative': negative,
              'Negative sampling exponent': ns_exponent}

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Doc2Vec Result
    |
    | ### Parameters
    | {params}
    """.format(params=dict2MD(params))))

    model = _model_dict('doc2vec_model')
    model['params'] = params
    model['d2v'] = d2v
    model['_repr_brtc_'] = rb.get()
    model['hash_val(Brightics)'] = hashfxn('Brightics')

    out_table1 = table.copy()
    out_table1['document_vectors'] = [
        d2v.infer_vector(doc.words).tolist() for doc in tagged_docs]
    out_table2 = pd.DataFrame(
        {'words': d2v.wv.index2word, 'word_vectors': d2v.wv[vocab].tolist()})

    return {'model': model, 'doc_table': out_table1, 'word_table': out_table2}


def doc2vec_model(table, model, **params):
    check_required_parameters(_doc2vec_model, params, ['table', 'model'])
    return _doc2vec_model(table, model, **params)


def _doc2vec_model(table, model):
    docs = table[model['params']['Input column']]
    d2v_model = model['d2v']
    
    tagged_docs = [TaggedDocument(doc, [i]) for i, doc in enumerate(docs)]

    out_table = table.copy()
    out_table['document_vectors'] = [d2v_model.infer_vector(doc.words).tolist() for doc in tagged_docs]

    return {'out_table': out_table}
