"""
    Copyright 2020 Samsung SDS
    
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
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import validate, greater_than_or_equal_to
from brightics.common.exception import BrighticsFunctionException

from sklearn.preprocessing import normalize
import numpy as np
import pandas as pd
from .short_text_topic_modeling_gsdmm import gsdmm_rwalk
import functools
import pyLDAvis


def gsdmm(table, **params):
    check_required_parameters(_gsdmm, params, ['table'])
    params = get_default_from_parameters_if_required(params, _gsdmm)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'K'),
                              greater_than_or_equal_to(params, 0.0, 'alpha'),
                              greater_than_or_equal_to(params, 0.0, 'beta'),
                              greater_than_or_equal_to(params, 1, 'max_iter'),
                              greater_than_or_equal_to(params, 1, 'num_topic_words')]

    validate(*param_validation_check)
    return _gsdmm(table, **params)


def _count_to_ratio_raw(word_count):
    if not word_count:
        return {}
    else:
        word_count_list = word_count.items()
        words = [pair[0] for pair in word_count_list]
        counts = [[pair[1]] for pair in word_count_list]
        counts_normalized = normalize(counts, norm='l1', axis=0)
        word_ratio_raw = {word: ratio[0] for word, ratio in zip(words, counts_normalized)}
        return word_ratio_raw


def _gen_table(word_ratio_raw, num_topic_words):
    if not word_ratio_raw:
        return [""]
    else:
        word_ratio_sorted = sorted(word_ratio_raw.items(), key=lambda item: item[1], reverse=True)
        word_ratio = [["{}: {}".format(word, ratio), word, ratio] for word, ratio in word_ratio_sorted]
        return np.transpose(word_ratio[:num_topic_words]).tolist()


def _gsdmm(table, input_col, topic_name='topic', K=10, alpha=0.1, beta=0.1, max_iter=50, num_topic_words=3):
    docs = np.array(table[input_col])
    docs_set = [set(doc) for doc in docs]
    docs_preprocessed = [list(doc_set) for doc_set in docs_set]
    vocab_set = list(set.union(*docs_set))
    vocab_size = len(vocab_set)

    # initialize and train a GSDMM model
    mgp = gsdmm_rwalk.MovieGroupProcess(K=K, alpha=alpha, beta=beta, n_iters=max_iter)
    topics = mgp.fit(docs_preprocessed, vocab_size)

    # generate topic table
    topic_word_count = mgp.cluster_word_distribution
    topic_words_raw = [[ind, _count_to_ratio_raw(word_count)]
                       for ind, word_count in enumerate(topic_word_count) if word_count]
    topic_words = [[item[0]] + _gen_table(item[1], num_topic_words) for item in topic_words_raw]

    # reset topic ids
    nonempty_topic_indices = [item[0] for item in topic_words]
    reset_topic_ind = {old_ind: (new_ind + 1) for new_ind, old_ind in enumerate(nonempty_topic_indices)}
    topics = [reset_topic_ind[old_ind] for old_ind in topics]
    topic_words = [[reset_topic_ind[old_item[0]]] + old_item[1:] for old_item in topic_words]

    # generate output dataframes
    out_table = pd.DataFrame.copy(table, deep=True)
    if topic_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Existing table contains the topic column name. Please choose another name."}])
    out_table[topic_name] = topics
    columns = ['index', 'vocabularies_weights', 'vocabularies', 'weights']
    topic_table = pd.DataFrame(topic_words, columns=columns)
    topic_table['weights'] = topic_table['weights'].apply(pd.to_numeric)

    # pyLDAvis
    if len(topic_words) == 1:
        html_result = None
    else:
        topic_words_dicts = [item[1] for item in topic_words_raw]
        topic_term_dists = [[topic_words_dict.get(word, 0) for word in vocab_set] for topic_words_dict in
                            topic_words_dicts]
        num_docs = len(topics)
        num_topics = len(topic_words_raw)
        doc_topic_dists = np.zeros((num_docs, num_topics))
        for doc_id, topic_id in enumerate(topics):
            doc_topic_dists[doc_id][topic_id - 1] = 1.0
        doc_lengths = [len(doc) for doc in docs_preprocessed]
        vocab_count = functools.reduce(
            lambda dict_1, dict_2: {word: dict_1.get(word, 0) + dict_2.get(word, 0) for word in
                                    set(dict_1).union(dict_2)},
            topic_word_count)
        term_frequency = [vocab_count.get(word) for word in vocab_set]

        prepared_data = pyLDAvis.prepare(topic_term_dists, doc_topic_dists, doc_lengths, vocab_set, term_frequency)
        html_result = pyLDAvis.prepared_data_to_html(prepared_data,
                                                     d3_url="/js/plugins/pyldavis/d3.v3.min.js",
                                                     ldavis_url="/js/plugins/pyldavis/ldavis.v1.0.0.js",
                                                     ldavis_css_url="/css/plugins/pyldavis/ldavis.v1.0.0.css")

    # generate report
    params = {'Input column': input_col,
              'Topic column name': topic_name,
              'K': K,
              'Alpha': alpha,
              'Beta': beta,
              'Maximum number of iterations': max_iter,
              'Number of words for each topic': num_topic_words}
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## GSDMM Result
    | ### Summary
    |
    """))
    if html_result is not None:
        rb.addHTML(html_result)
        rb.addMD(strip_margin("""
        |
        """))
    rb.addMD(strip_margin("""
    | ### Final Number of Topics
    | {num_topics}
    |
    | ### Parameters
    | {params}
    """.format(num_topics=len(topic_words_raw), params=dict2MD(params))))

    # create model
    model = _model_dict('lda_model')
    model['params'] = params
    model['gsdmm_model'] = mgp
    model['_repr_brtc_'] = rb.get()

    return {'out_table': out_table, 'topic_table': topic_table, 'model': model}
