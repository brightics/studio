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

from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import validate, greater_than_or_equal_to, greater_than, from_to
from brightics.common.exception import BrighticsFunctionException

from sklearn.feature_extraction.text import CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.preprocessing import normalize
import numpy as np
import pandas as pd
import pyLDAvis
import pyLDAvis.sklearn as ldavis


def lda4(table, group_by=None, **params):
    check_required_parameters(_lda4, params, ['table'])
    params = get_default_from_parameters_if_required(params, _lda4)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'num_voca'),
                              greater_than_or_equal_to(params, 2, 'num_topic'),
                              from_to(
                                  params, 2, params['num_voca'], 'num_topic_word'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 1.0, 'learning_offset')]

    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_lda4, table, group_by=group_by, **params)
    else:
        return _lda4(table, **params)


def _lda4(table, input_col, topic_name='topic', num_voca=1000, num_topic=5, num_topic_word=10, max_iter=20,
          learning_method='online', learning_offset=10., random_state=None):
    # generate model
    corpus = np.array(table[input_col])
    if isinstance(corpus[0], np.ndarray):
        tf_vectorizer = CountVectorizer(
            preprocessor=' '.join, stop_words='english', max_df=0.95, min_df=2, max_features=num_voca)
    else:
        tf_vectorizer = CountVectorizer(
            max_df=0.95, min_df=2, max_features=num_voca, stop_words='english')
    term_count = tf_vectorizer.fit_transform(corpus)
    tf_feature_names = tf_vectorizer.get_feature_names()
    if learning_method == 'online':
        lda_model = LatentDirichletAllocation(n_components=num_topic, max_iter=max_iter,
                                              learning_method=learning_method,
                                              learning_offset=learning_offset, random_state=random_state).fit(
            term_count)
    elif learning_method == 'batch':
        lda_model = LatentDirichletAllocation(
            n_components=num_topic, max_iter=max_iter, learning_method=learning_method, random_state=random_state).fit(
            term_count)
    else:
        raise_runtime_error("Please check 'learning_method'.")
    log_likelihood = lda_model.score(term_count)
    perplexity = lda_model.perplexity(term_count)

    # create topic table
    vocab_weights_list = []
    vocab_list = []
    weights_list = []
    topic_term_prob = normalize(lda_model.components_, norm='l1')
    for vector in topic_term_prob:
        pairs = []
        for term_idx, value in enumerate(vector):
            pairs.append((abs(value), tf_feature_names[term_idx]))
        pairs.sort(key=lambda x: x[0], reverse=True)
        vocab_weights = []
        vocab = []
        weights = []
        for pair in pairs[:num_topic_word]:
            vocab_weights.append("{}: {}".format(pair[1], pair[0]))
            vocab.append(pair[1])
            weights.append(pair[0])
        vocab_weights_list.append(vocab_weights)
        vocab_list.append(vocab)
        weights_list.append(weights)
    topic_table = pd.DataFrame(
        {'vocabularies_weights': vocab_weights_list, 'vocabularies': vocab_list, 'weights': weights_list})
    topic_table['index'] = [idx + 1 for idx in topic_table.index]
    topic_table = topic_table[['index', 'vocabularies_weights', 'vocabularies', 'weights']]

    # create output table
    doc_topic = lda_model.transform(term_count)
    out_table = pd.DataFrame.copy(table, deep=True)
    topic_dist_name = topic_name + '_distribution'
    if topic_name in table.columns or topic_dist_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Existing table contains Topic Column Name. Please choose again."}])
    out_table[topic_name] = [doc_topic[i].argmax() + 1 for i in range(len(corpus))]
    out_table[topic_dist_name] = doc_topic.tolist()

    # pyLDAvis
    prepared_data = ldavis.prepare(lda_model, term_count, tf_vectorizer)
    html_result = pyLDAvis.prepared_data_to_html(prepared_data)

    # generate report
    params = {'Input column': input_col,
              'Topic column name': topic_name,
              'Number of topics': num_topic,
              'Number of words for each topic': num_topic_word,
              'Maximum number of iterations': max_iter,
              'Learning method': learning_method,
              'Learning offset': learning_offset,
              'Seed': random_state}
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Latent Dirichlet Allocation Result
    | ### Summary
    |
    """))
    rb.addHTML(html_result)
    rb.addMD(strip_margin("""
    |
    | ### Log Likelihood
    | {log_likelihood}
    |
    | ### Perplexity
    | {perplexity}
    |
    | ### Parameters
    | {params}
    """.format(log_likelihood=log_likelihood, perplexity=perplexity, params=dict2MD(params))))

    # create model
    model = _model_dict('lda_model')
    model['params'] = params
    model['lda_model'] = lda_model
    model['_repr_brtc_'] = rb.get()

    return {'out_table': out_table, 'topic_table': topic_table, 'model': model}


def lda3(table, group_by=None, **params):
    check_required_parameters(_lda3, params, ['table'])
    params = get_default_from_parameters_if_required(params, _lda3)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'num_voca'),
                              greater_than_or_equal_to(params, 2, 'num_topic'),
                              from_to(
                                  params, 2, params['num_voca'], 'num_topic_word'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 1.0, 'learning_offset')]

    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_lda3, table, group_by=group_by, **params)
    else:
        return _lda3(table, **params)


def _lda3(table, input_col, topic_name='topic', num_voca=1000, num_topic=3, num_topic_word=3, max_iter=20, learning_method='online', learning_offset=10., random_state=None):
    corpus = np.array(table[input_col])
    if isinstance(corpus[0], np.ndarray):
        tf_vectorizer = CountVectorizer(
            preprocessor=' '.join, stop_words='english', max_df=0.95, min_df=2, max_features=num_voca)
    else:
        tf_vectorizer = CountVectorizer(
            max_df=0.95, min_df=2, max_features=num_voca, stop_words='english')
    term_count = tf_vectorizer.fit_transform(corpus)
    tf_feature_names = tf_vectorizer.get_feature_names()

    if learning_method == 'online':
        lda_model = LatentDirichletAllocation(n_components=num_topic, max_iter=max_iter, learning_method=learning_method,
                                              learning_offset=learning_offset, random_state=random_state).fit(term_count)
    elif learning_method == 'batch':
        lda_model = LatentDirichletAllocation(
            n_components=num_topic, max_iter=max_iter, learning_method=learning_method, random_state=random_state).fit(term_count)
    else:
        raise_runtime_error("Please check 'learning_method'.")
    voca_weights_list = []
    for weights in lda_model.components_:
        pairs = []
        for term_idx, value in enumerate(weights):
            pairs.append((abs(value), tf_feature_names[term_idx]))
        pairs.sort(key=lambda x: x[0], reverse=True)
        voca_weights = []
        for pair in pairs[:num_topic_word]:
            voca_weights.append("{}: {}".format(pair[1], pair[0]))
        voca_weights_list.append(voca_weights)

    doc_topic = lda_model.transform(term_count)
    out_table = pd.DataFrame.copy(table, deep=True)
    if topic_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Existing table contains Topic Column Name. Please choose again."}])
    out_table[topic_name] = [doc_topic[i].argmax() for i in range(len(corpus))]
    weight_list = []
    for ind in out_table[topic_name]:
        weight_list.append(voca_weights_list[ind])
    out_table['topic_vocabularies'] = weight_list
    return {'out_table': out_table}


def lda2(table, group_by=None, **params):
    check_required_parameters(_lda2, params, ['table'])
    params = get_default_from_parameters_if_required(params, _lda2)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'num_voca'),
                              greater_than_or_equal_to(params, 2, 'num_topic'),
                              from_to(params, 2, params['num_voca'], 'num_topic_word'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 1.0, 'learning_offset')]
    
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_lda2, table, group_by=group_by, **params)
    else:
        return _lda2(table, **params)


def _lda2(table, input_col, num_voca=1000, num_topic=3, num_topic_word=3, max_iter=20, learning_method='online', learning_offset=10., random_state=None):
    corpus = np.array(table[input_col])
    if isinstance(corpus[0], np.ndarray):
        tf_vectorizer = CountVectorizer(preprocessor=' '.join, stop_words='english', max_df=0.95, min_df=2, max_features=num_voca) 
    else:
        tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=num_voca, stop_words='english')
    term_count = tf_vectorizer.fit_transform(corpus)
    tf_feature_names = tf_vectorizer.get_feature_names()

    if learning_method == 'online':
        lda_model = LatentDirichletAllocation(n_components=num_topic, max_iter=max_iter, learning_method=learning_method, learning_offset=learning_offset, random_state=random_state).fit(term_count)
    elif learning_method == 'batch':
        lda_model = LatentDirichletAllocation(n_components=num_topic, max_iter=max_iter, learning_method=learning_method, random_state=random_state).fit(term_count)
    else:
        raise_runtime_error("Please check 'learning_method'.")
    
    topic_model = pd.DataFrame([])
    topic_idx_list = []
    voca_weights_list = []
    for topic_idx, weights in enumerate(lda_model.components_):
        topic_idx_list.append("Topic {}".format(topic_idx))
        pairs = []
        for term_idx, value in enumerate(weights):
            pairs.append((abs(value), tf_feature_names[term_idx]))
        pairs.sort(key=lambda x: x[0], reverse=True)
        voca_weights = []
        for pair in pairs[:num_topic_word]:
            voca_weights.append("{}: {}".format(pair[1], pair[0]))
        voca_weights_list.append(voca_weights)
    topic_model['topic idx'] = topic_idx_list
    topic_model['topic vocabularies'] = voca_weights_list

    doc_topic = lda_model.transform(term_count)

    out_table = pd.DataFrame({'documents':[doc for doc in corpus],
                              'top_topic': ["Topic {}".format(doc_topic[i].argmax()) for i in range(len(corpus))]})
    
    params = {
        'Input Column': input_col,
        'Number of Vocabularies': num_voca,
        'Number of Topics': num_topic,
        'Number of Terminologies': num_topic_word,
        'Iterations': max_iter,
        'Learning Method': learning_method,
    }
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""# Latent Dirichlet Allocation Result"""))
    rb.addMD(strip_margin("""
    |
    |### Parameters
    |
    | {display_params}
    |
    |### Topic Model
    |
    |{topic_model}
    |
    """.format(display_params=dict2MD(params), topic_model=pandasDF2MD(topic_model, num_rows=num_topic + 1))))
    
    model = _model_dict('lda')
    model['parameter'] = params
    model['topic_model'] = topic_model
    model['_repr_brtc_'] = rb.get()

    return {'out_table': out_table, 'model' : model}


def lda(table, group_by=None, **params):
    check_required_parameters(_lda, params, ['table'])
    params = get_default_from_parameters_if_required(params, _lda)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'num_voca'),
                              greater_than_or_equal_to(params, 2, 'num_topic'),
                              from_to(params, 2, params['num_voca'], 'num_topic_word'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than(params, 1.0, 'learning_offset')]
    
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_lda, table, group_by=group_by, **params)
    else:
        return _lda(table, **params)


def _lda(table, input_col, num_voca=1000, num_topic=3, num_topic_word=3, max_iter=20, learning_method='online', learning_offset=10., random_state=None):
    corpus = table[input_col]
    tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2, max_features=num_voca, stop_words='english')
    term_count = tf_vectorizer.fit_transform(corpus)
    tf_feature_names = tf_vectorizer.get_feature_names()

    if learning_method == 'online':
        lda_model = LatentDirichletAllocation(n_components=num_topic, max_iter=max_iter, learning_method=learning_method, learning_offset=learning_offset, random_state=random_state).fit(term_count)
    elif learning_method == 'batch':
        lda_model = LatentDirichletAllocation(n_components=num_topic, max_iter=max_iter, learning_method=learning_method, random_state=random_state).fit(term_count)
    else:
        raise_runtime_error("Please check 'learning_method'.")
    
    topic_model = pd.DataFrame([])
    topic_idx_list = []
    voca_weights_list = []
    for topic_idx, weights in enumerate(lda_model.components_):
        topic_idx_list.append("Topic {}".format(topic_idx))
        pairs = []
        for term_idx, value in enumerate(weights):
            pairs.append((abs(value), tf_feature_names[term_idx]))
        pairs.sort(key=lambda x: x[0], reverse=True)
        voca_weights = []
        for pair in pairs[:num_topic_word]:
            voca_weights.append("{}: {}".format(pair[1], pair[0]))
        voca_weights_list.append(voca_weights)
    topic_model['topic idx'] = topic_idx_list
    topic_model['topic vocabularies'] = voca_weights_list

    doc_topic = lda_model.transform(term_count)

    doc_classification = pd.DataFrame()
    doc_classification['documents'] = [doc for doc in corpus]
    doc_classification['top topic'] = ["Topic {}".format(doc_topic[i].argmax()) for i in range(len(corpus))]
    
    params = {
        'Input Column': input_col,
        'Number of Vocabularies': num_voca,
        'Number of Topics': num_topic,
        'Number of Terminologies': num_topic_word,
        'Iterations': max_iter,
        'Learning Method': learning_method,
    }
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""# Latent Dirichlet Allocation Result"""))
    rb.addMD(strip_margin("""
    |
    |### Parameters
    |
    | {display_params}
    |
    |### Topic Model
    |
    |{topic_model}
    |
    |### Documents Classification
    |
    |{doc_classification}
    |
    """.format(display_params=dict2MD(params), topic_model=pandasDF2MD(topic_model, num_rows=num_topic + 1), doc_classification=pandasDF2MD(doc_classification, num_rows=len(corpus) + 1))))
    
    model = _model_dict('lda')
    model['parameter'] = params
    model['topic_model'] = topic_model
    model['documents_classification'] = doc_classification
    model['_repr_brtc_'] = rb.get()

    return {'model' : model}

