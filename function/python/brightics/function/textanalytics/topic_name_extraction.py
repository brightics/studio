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

from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import validate, greater_than_or_equal_to

import numpy as np
import pandas as pd


def topic_name_extraction(table, **params):
    check_required_parameters(_topic_name_extraction, params, ['table'])
    params = get_default_from_parameters_if_required(params, _topic_name_extraction)
    param_validation_check = [greater_than_or_equal_to(params, 1, 'topn')]
    validate(*param_validation_check)
    return _topic_name_extraction(table, **params)


def _topic_name_extraction(table, sim_table=None, model=None, topn=10):
    out_table = table.copy()
    if model is None:
        if sim_table is None:
            raise_runtime_error("Either a model or a similarity table is needed as an input.")
    else:
        if 'w2v' in model:
            input_model = model['w2v']
        elif 'ft' in model:
            input_model = model['ft']

    topics_vocab_weight_arr = np.array(table[['vocabularies', 'weights']])
    num_topic_vocab = len(topics_vocab_weight_arr[0][0])
    harmonic_weights = np.array([1.0 / (i + 1) for i in range(num_topic_vocab)])
    geometric_weights = np.array([1.0 / 2 ** i for i in range(num_topic_vocab)])
    log_weights = np.array([np.log(num_topic_vocab - i) for i in range(num_topic_vocab)])
    constant_weights = np.ones(num_topic_vocab)

    def topic_name_suggestion(vocab, weights):
        if model is not None:  # similarity: Word2vec model
            vectors = np.transpose(np.array([input_model.wv.get_vector(word) for word in vocab]))
            weighted_averages = np.dot(np.array(
                [weights, harmonic_weights, geometric_weights, log_weights, constant_weights]), np.transpose(vectors))
            topic_name_weight_tuples = [input_model.wv.similar_by_vector(avg, topn=topn) for avg in weighted_averages]
            res = [['{}: {}'.format(tup[0], tup[1]) for tup in item] for item in topic_name_weight_tuples]
            return res
        else:  # similarity: matrix
            # Assume that sim_table has words as indices for both rows and columns. columns: column name, rows: 1st col
            vocab_set = sim_table.columns.values[1:]
            row_indices = [pd.Index(sim_table.iloc[:, 0]).get_loc(word) for word in vocab]
            sim_table_vocab = np.array(sim_table.iloc[row_indices, 1:])
            weighted_sims = np.dot(np.array(
                [weights, harmonic_weights, geometric_weights, log_weights, constant_weights]), sim_table_vocab)
            res = [_extract(item, vocab_set, topn) for item in weighted_sims]
            return res

    topics_name_arr = [topic_name_suggestion(row[0], row[1]) for row in topics_vocab_weight_arr]
    columns = ['topic_name_original', 'topic_name_harmonic', 'topic_name_geometric', 'topic_name_log',
               'topic_name_constant']
    out_table[columns] = pd.DataFrame(topics_name_arr)
    return {'out_table': out_table}


def _extract(weighted_sim_list, vocab_set, topn):
    list_zipped = zip(vocab_set, weighted_sim_list)
    list_sorted = sorted(list_zipped, key=lambda tup: tup[1])
    list_cut = list_sorted[:topn]
    return ['{}: {}'.format(tup[0], tup[1]) for tup in list_cut]
