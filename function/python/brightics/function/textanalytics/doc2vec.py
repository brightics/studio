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

from gensim.models.doc2vec import Doc2Vec, TaggedDocument

def doc2vec(table, input_col, vector_size=100, window=10, min_count=1, max_vocab_size=None,     
            train_epoch=100, dm=1, workers=4, alpha=0.025, min_alpha=0.025, seed=1, hs=1, negative=5):
    
    docs = table[input_col]
    tagged_docs = [TaggedDocument(doc, [i]) for i, doc in enumerate(docs)]
    
    d2v = Doc2Vec(dm=dm,
                  vector_size=vector_size,
                  window=window, 
                  alpha=alpha, 
                  min_alpha=min_alpha, 
                  seed=seed, 
                  min_count=min_count,
                  max_vocab_size=max_vocab_size,
                  train_epoch=train_epoch,
                  workers=workers,
                  hs=hs,
                  negative=negative)
    
    d2v.build_vocab(tagged_docs)
    corpus_count = d2v.corpus_count
    epochs = d2v.epochs
    
    if dm == 1:
        algo = 'PV-DM'
    else:
        algo = 'PV-DBOW'
        
    params = {'Input column': input_col,
              'Dimension of Vectors': vector_size,
              'Window': window,
              'Min count': min_count,
              'Max vocabulary size': max_vocab_size,
              'Train epoch': train_epoch,
              'Training algorithm': algo,
              'Number of workers': workers,
              'Alpha': alpha,
              'Min alpha': min_alpha,
              'Seed': seed,
              'Hierarchical softmax': hs, 
              'Negative': negative,
              'Corpus count': corpus_count,
              'Epochs': epochs}
    
    out_table = table.copy()
    out_table['document_vectors'] = [d2v.infer_vector(doc.words).tolist() for doc in tagged_docs]
    return {'out_table': out_table} 
