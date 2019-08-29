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

from gensim.models import Word2Vec
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
import pandas as pd
import numpy as np

from brightics.common.repr import BrtcReprBuilder 
from brightics.common.repr import strip_margin
from brightics.function.utils import _model_dict
from brightics.common.repr import dict2MD
from brightics.common.repr import plt2MD
from brightics.common.repr import pandasDF2MD
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate
from brightics.common.validation import greater_than_or_equal_to


def word2vec(table, **params):
    check_required_parameters(_word2vec, params, ['table'])
    
    params = get_default_from_parameters_if_required(params, _word2vec)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'size'),
                              greater_than_or_equal_to(params, 1, 'window'),
                              greater_than_or_equal_to(params, 1, 'min_count'),
                              greater_than_or_equal_to(params, 1, 'workers'),
                              greater_than_or_equal_to(params, 1, 'topn')]
    validate(*param_validation_check) 
    return _word2vec(table, **params)


def _word2vec(table, input_col, size=100, window=5, min_count=1, seed=None, workers=1, sg=1, topn=30): 

    w2v = Word2Vec(table[input_col].apply(list).tolist(), size=size, window=window, min_count=min_count, seed=seed, workers=workers, sg=sg)
    w2v.init_sims(replace=True)
    
    vocab = w2v.wv.vocab
    
    algo = 'Skip-gram'
    if sg == '0':
        algo = 'CBOW'  
    
    params = {'Input column': input_col,
              'Word vector dimensionality': size,
              'Context window size': window,
              'Minimum word count': min_count,
              'Worker threads': workers,
              'Training algorithm': algo}
    
    # tsne visualization   
    length = len(vocab)
    if length < topn:
        topn = length     
    topn_words = sorted(vocab, key=vocab.get, reverse=True)[:topn]
    
    X = w2v[topn_words]
    tsne = TSNE(n_components=min(2, topn), random_state=seed)
    X_tsne = tsne.fit_transform(X)
    df = pd.DataFrame(X_tsne, index=topn_words, columns=['x', 'y'])
    
    fig = plt.figure()
    fig.set_size_inches(50, 40)
    ax = fig.add_subplot(1, 1, 1)
    
    ax.scatter(df['x'], df['y'], s=1000)
    ax.tick_params(axis='both', which='major', labelsize=50)
    
    for word, pos in df.iterrows():
        ax.annotate(word, pos, fontsize=80)
    plt.show()  
    fig = plt2MD(plt)
    plt.clf()
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Word2Vec Result
    |
    | ### Total Number of words
    | {length}
    |
    | ### Top {topn} Words
    | {topn_words}
    | {fig}
    |
    | ### Parameters
    | {params}
    """.format(length=length, topn=topn, topn_words=topn_words, params=dict2MD(params), fig=fig)))
    
    vocab = list(w2v.wv.vocab)
    
    model = _model_dict('word2vec_model')
    model['params'] = params
    model['vocab'] = vocab
    model['w2v'] = w2v
    model['_repr_brtc_'] = rb.get()
    
    out_table = pd.DataFrame()
    out_table['words'] = vocab
    out_table['word_vectors'] = w2v.wv[vocab].tolist()
    # plt.figure(figsize=(6.4,4.8))
    return {'model': model, 'out_table': out_table}

# def word2vec_update(table, model):


def _feature_vec(words, model, num_features):
    feature_vector = np.zeros(num_features, dtype="float64")
    word_set = set(model.wv.index2word)    
    num_words = 0
    for word in words:
        if word in word_set:
            feature_vector = np.add(feature_vector, model[word])
            num_words = num_words + 1.
    feature_vector = np.divide(feature_vector, num_words)
    return feature_vector


def _avg_feature_vecs(docs, model, num_features):
    doc_feature_vectors = np.zeros((len(docs), num_features), dtype="float64")
    counter = 0.
    for doc in docs:
        doc_feature_vectors[int(counter)] = _feature_vec(doc, model, num_features)   
        counter = counter + 1.
    return doc_feature_vectors


def word2vec_model(table, model, **params):
    check_required_parameters(_word2vec_model, params, ['table', 'model'])
    return _word2vec_model(table, model, **params)


def _word2vec_model(table, model):
    doc = table[model['params']['Input column']]
    word_vec_model = model['w2v']
    num_features = model['params']['Word vector dimensionality']
    
    out_table = table.copy()
    out_table['feature_vectors'] = _avg_feature_vecs(doc, word_vec_model, num_features).tolist()
    return {'out_table': out_table}


def word2vec_similarity(model, **params):
    check_required_parameters(_word2vec_similarity, params, ['model'])
    
    params = get_default_from_parameters_if_required(params, _word2vec_similarity)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'topn')]
    validate(*param_validation_check) 
    return _word2vec_similarity(model, **params)


def _word2vec_similarity(model, positive=None, negative=None, topn=1):
    if positive is None and negative is None:
        length = 0
    else:    
        result = model['w2v'].wv.most_similar(positive=positive, negative=negative, topn=topn)
        length = len(result)
    
    out_table = pd.DataFrame()
    out_table['most_similar_words'] = [result[i][0] for i in range(length)]
    out_table['similarity'] = [result[i][1] for i in range(length)] 
    return {'out_table': out_table}
