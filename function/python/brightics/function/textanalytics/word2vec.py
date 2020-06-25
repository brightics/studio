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
                              greater_than_or_equal_to(params, 1, 'train_epoch'),
                              greater_than_or_equal_to(params, 1, 'workers'),
                              greater_than_or_equal_to(params, 1, 'negative'),
                              greater_than_or_equal_to(params, 1, 'topn')]
    validate(*param_validation_check) 
    return _word2vec(table, **params)


def _word2vec(table, input_col, sg=1, size=100, window=5, min_count=1,
              max_vocab_size=None, train_epoch=100, workers=1, alpha=0.025,
              min_alpha=0.025, seed=None, hs=1, negative=5, ns_exponent=0.75,
              topn=30, hashfxn=hash):

    if isinstance(sg, str):
        sg = int(sg)
    algo = {1: 'Skip-gram', 0: 'CBOW'}[sg]
        
    tagged_sents = table[input_col].apply(list).tolist()
    w2v = Word2Vec(sentences=tagged_sents,
                   sg=sg,
                   size=size,
                   window=window,
                   alpha=alpha,
                   min_alpha=min_alpha,
                   seed=seed,
                   min_count=min_count,
                   max_vocab_size=max_vocab_size,
                   workers=workers,
                   iter=train_epoch,
                   hs=hs,
                   negative=negative,
                   ns_exponent=ns_exponent,
                   hashfxn=hashfxn)

    w2v.init_sims(replace=True)
    vocab = w2v.wv.vocab

    analogies_score, sections = w2v.wv.evaluate_word_analogies(
        'brightics/function/textanalytics/data/word2vec_questions_words.txt')
    pearson_1, spearman_1, oov_ratio_1 = w2v.wv.evaluate_word_pairs(
        'brightics/function/textanalytics/data/word2vec_wordsim353.tsv')
    pearson_2, spearman_2, oov_ratio_2 = w2v.wv.evaluate_word_pairs(
        'brightics/function/textanalytics/data/word2vec_simlex999.tsv')

    params = {'Input column': input_col,
              'Training algorithm': algo,
              'Word vector dimensionality': size,
              'Window': window,
              'Minimum word count': min_count,
              'Max vocabulary size': max_vocab_size,
              'Train epoch': train_epoch,
              'Number of workers': workers,
              'Alpha': alpha,
              'Minimum alpha': min_alpha,
              'Seed': seed,
              'Hierarchical softmax': hs,
              'Negative': negative,
              'Negative sampling exponent': ns_exponent}
    
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
    | ### Word analogy score
    | {analogies_score}
    |
    | ### Word correlation scores
    | #### Pearson correlation coefficient with 2-tailed p-value (WordSim353)
    | {pearson_1_1}, {pearson_1_2}
    | #### Spearman rank-order correlation coefficient with 2-tailed p-value (WordSim353)
    | {spearman_1_1}, {spearman_1_2}
    | #### The ratio of pairs with unknown words (WordSim353) 
    | {oov_ratio_1}
    | #### Pearson correlation coefficient with 2-tailed p-value (SimLex999)
    | {pearson_2_1}, {pearson_2_2}
    | #### Spearman rank-order correlation coefficient with 2-tailed p-value (SimLex999)
    | {spearman_2_1}, {spearman_2_2}
    | #### The ratio of pairs with unknown words (SimLex999)
    | {oov_ratio_2}
    |
    | ### Parameters
    | {params}
    """.format(length=length, analogies_score=analogies_score,
               pearson_1_1=pearson_1[0], pearson_1_2=pearson_1[1], spearman_1_1=spearman_1[0],
               spearman_1_2=spearman_1[1], oov_ratio_1=oov_ratio_1,
               pearson_2_1=pearson_2[0], pearson_2_2=pearson_2[1], spearman_2_1=spearman_2[0],
               spearman_2_2=spearman_2[1], oov_ratio_2=oov_ratio_2,
               topn=topn, topn_words=topn_words, params=dict2MD(params), fig=fig)))
    
    vocab = list(w2v.wv.vocab)
    
    model = _model_dict('word2vec_model')
    model['params'] = params
    model['vocab'] = vocab
    model['w2v'] = w2v
    model['_repr_brtc_'] = rb.get()
    
    out_table = pd.DataFrame({'words': vocab, 'word_vectors': w2v.wv[vocab].tolist()})
    return {'model': model, 'out_table': out_table}


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


def word2vec_similarity2(table, model, **params):
    check_required_parameters(_word2vec_similarity2, params, ['table', 'model'])
    
    params = get_default_from_parameters_if_required(params, _word2vec_similarity2)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'topn')]
    validate(*param_validation_check) 
    return _word2vec_similarity2(table, model, **params)


def _split_token(text):
    if text is not None: 
        return [token.strip() for token in text.split(",")]
    return None


def _w2v_sim_pos(model, positive, topn=1):  
    split_positive = _split_token(positive)  
    result = model['w2v'].wv.most_similar(positive=split_positive, topn=topn)
    res = [[positive] + list(result[i]) for i in range(len(result))]
    return res


def _w2v_sim_neg(model, negative, topn=1):      
    split_negative = _split_token(negative)       
    result = model['w2v'].wv.most_similar(negative=split_negative, topn=topn)
    res = [[negative] + list(result[i]) for i in range(len(result))]    
    return res


def _w2v_sim_both(model, positive=None, negative=None, topn=1):      
    split_positive = _split_token(positive)
    split_negative = _split_token(negative)       
    result = model['w2v'].wv.most_similar(positive=split_positive, negative=split_negative, topn=topn)    
    if positive is None:
        res = [[None] + [negative] + list(result[i]) for i in range(len(result))]
    elif negative is None:
        res = [[positive] + [None] + list(result[i]) for i in range(len(result))]
    else:
        res = [[positive] + [negative] + list(result[i]) for i in range(len(result))]    
    return res


def _word2vec_similarity2(table, model, positive_col=None, negative_col=None, topn=1):   
    if positive_col is None and negative_col is None:
        raise ValueError('The similarity cannot be computed with no input.')
    
    if positive_col is None:
        columns = [negative_col]
    elif negative_col is None:
        columns = [positive_col]
    else:
        columns = [positive_col, negative_col]

    df_dropped = table[columns].dropna(how='all')

    if positive_col is None:
        res = df_dropped.apply(lambda _: _w2v_sim_neg(model, negative=_[negative_col], topn=topn), axis=1)
    elif negative_col is None:
        res = df_dropped.apply(lambda _: _w2v_sim_pos(model, positive=_[positive_col], topn=topn), axis=1)
    else:
        res = df_dropped.apply(
            lambda _: _w2v_sim_both(model, positive=_[positive_col], negative=_[negative_col], topn=topn), axis=1)

    out_table = pd.DataFrame(sum(res, []), columns=columns + ['synonym', 'similarity'])
    return {'out_table': out_table}

