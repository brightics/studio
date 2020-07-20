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
from brightics.common.validation import validate, greater_than_or_equal_to, raise_runtime_error
from brightics.common.exception import BrighticsFunctionException

import numpy as np
import pandas as pd
import pyLDAvis as plv
from gensim.models.wrappers import DtmModel
from gensim.models.coherencemodel import CoherenceModel
from gensim import corpora
import pathlib
import platform
import os


def dtm(table, group_by=None, **params):
    check_required_parameters(_dtm, params, ['table'])
    params = get_default_from_parameters_if_required(params, _dtm)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'num_topic'),
                              greater_than_or_equal_to(params, 2, 'num_topic_word'),
                              greater_than_or_equal_to(params, 1, 'max_iter')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_dtm, table, group_by=group_by, **params)
    else:
        return _dtm(table, **params)


def _dtm(table, input_col, topic_name='topic', num_topic=5, num_topic_word=10, max_iter=20, time_slice=None,
         coherence='u_mass', vis_time=0, seed=None):
    running_os = platform.system()
    is_os_64bit = platform.machine().endswith('64')
    if running_os == 'Linux':
        if is_os_64bit:
            dtm_filename = 'dtm-linux64'
        else:
            dtm_filename = 'dtm-linux32'
    elif running_os == 'Windows':
        if is_os_64bit:
            dtm_filename = 'dtm-win64.exe'
        else:
            dtm_filename = 'dtm-win32.exe'
    else:  # Mac
        dtm_filename = 'dtm-darwin64'
    dtm_path = os.path.join(str(pathlib.Path(__file__).parent.absolute()), 'dtm', dtm_filename)
    if running_os != 'Windows':
        bash_command = "chmod +x {}".format(dtm_path)
        os.system(bash_command)
    tokenized_doc = np.array(table[input_col])
    num_doc = len(tokenized_doc)
    if time_slice is None:
        time_slice = [num_doc]
    elif sum(time_slice) != num_doc:
        raise_runtime_error("The sum of time slice list does not match the number of documents.")
    if vis_time < 0 or vis_time >= len(time_slice):
        raise_runtime_error("Invalid time parameter: {}".format(vis_time))
    dictionary = corpora.Dictionary(tokenized_doc)
    corpus = [dictionary.doc2bow(text) for text in tokenized_doc]
    dtm_params = {"corpus": corpus,
                  "id2word": dictionary,
                  "time_slices": time_slice,
                  "num_topics": num_topic,
                  "lda_sequence_max_iter": max_iter,
                  "model": 'dtm'}
    if seed is not None:
        dtm_params["rng_seed"] = seed
    dtm_model = DtmModel(dtm_path, **dtm_params)

    topic_time = [[dtm_model.show_topic(topicid=id, time=t, topn=num_topic_word) for id in range(num_topic)]
                  for t in range(len(time_slice))]
    topic_time = [[["{}: {}".format(tup[1], tup[0]) for tup in topic] for topic in time] for time in topic_time]
    timeline = ["{} ({} docs)".format(ind, t) for ind, t in enumerate(time_slice)]
    columns = ["topic_{}".format(i + 1) for i in range(num_topic)]
    topic_table = pd.DataFrame(topic_time, columns=columns)
    topic_table['time'] = timeline
    topic_table = topic_table[['time'] + columns]

    prop_arr = dtm_model.gamma_
    out_table = pd.DataFrame.copy(table, deep=True)
    if topic_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Existing table contains Topic Column Name. Please choose again."}])
    out_table[topic_name] = [item.argmax() + 1 for item in prop_arr]
    out_table['topic_distribution'] = prop_arr.tolist()

    coherence_topic_arr = [dtm_model.dtm_coherence(time) for time in range(len(time_slice))]
    if coherence == 'u_mass':
        coh_arr = [CoherenceModel(topics=item, dictionary=dictionary, corpus=corpus, coherence='u_mass').get_coherence()
                   for item in coherence_topic_arr]
    else:
        coh_arr = [CoherenceModel(topics=item, dictionary=dictionary, corpus=corpus, texts=tokenized_doc,
                                  coherence='c_v').get_coherence() for item in coherence_topic_arr]

    doc_topic, topic_term, doc_lengths, term_frequency, vocab = dtm_model.dtm_vis(corpus, vis_time)
    prepared_data = plv.prepare(topic_term, doc_topic, doc_lengths, vocab, term_frequency, sort_topics=False)
    html_result = plv.prepared_data_to_html(prepared_data)

    params = {'Input column': input_col,
              'Topic column name': topic_name,
              'Number of topics': num_topic,
              'Number of words for each topic': num_topic_word,
              'Maximum number of iterations': max_iter,
              'Time slice': time_slice,
              'Coherence measure': coherence,
              'Time to visualize': vis_time}
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Dynamic Topic Modeling Result
    | ### Summary
    |
    """))
    rb.addHTML(html_result)
    rb.addMD(strip_margin("""
    | ### Coherence for each period
    | {coh_arr}
    |
    | ### Parameters
    | {params}
    """.format(coh_arr=coh_arr, params=dict2MD(params))))

    model = _model_dict('dtm_model')
    model['params'] = params
    model['dtm_model'] = dtm_model
    model['coherences'] = coh_arr
    model['corpus'] = corpus
    model['_repr_brtc_'] = rb.get()

    return {'out_table': out_table, 'topic_table': topic_table, 'model': model}


def dim(table, group_by=None, **params):
    check_required_parameters(_dim, params, ['table'])
    params = get_default_from_parameters_if_required(params, _dim)
    param_validation_check = [greater_than_or_equal_to(params, 2, 'num_topic'),
                              greater_than_or_equal_to(params, 2, 'num_topic_word'),
                              greater_than_or_equal_to(params, 1, 'max_iter')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_dim, table, group_by=group_by, **params)
    else:
        return _dim(table, **params)


def _dim(table, input_col, topic_name='topic', num_topic=5, num_topic_word=10, max_iter=20, time_slice=None,
         coherence='u_mass', vis_time=0, seed=None):
    running_os = platform.system()
    is_os_64bit = platform.machine().endswith('64')
    if running_os == 'Linux':
        if is_os_64bit:
            dtm_filename = 'dtm-linux64'
        else:
            dtm_filename = 'dtm-linux32'
    elif running_os == 'Windows':
        if is_os_64bit:
            dtm_filename = 'dtm-win64.exe'
        else:
            dtm_filename = 'dtm-win32.exe'
    else:  # Mac
        dtm_filename = 'dtm-darwin64'
    dtm_path = os.path.join(str(pathlib.Path(__file__).parent.absolute()), 'dtm', dtm_filename)
    tokenized_doc = np.array(table[input_col])
    num_doc = len(tokenized_doc)
    if time_slice is None:
        time_slice = [num_doc]
    elif sum(time_slice) != num_doc:
        raise_runtime_error("The sum of time slice list does not match the number of documents.")
    if vis_time < 0 or vis_time >= len(time_slice):
        raise_runtime_error("Invalid time parameter: {}".format(vis_time))
    dictionary = corpora.Dictionary(tokenized_doc)
    corpus = [dictionary.doc2bow(text) for text in tokenized_doc]
    dim_params = {"corpus": corpus,
                  "id2word": dictionary,
                  "time_slices": time_slice,
                  "num_topics": num_topic,
                  "lda_sequence_max_iter": max_iter,
                  "model": 'fixed'}
    if seed is not None:
        dim_params["rng_seed"] = seed
    dtm_model = DtmModel(dtm_path, **dim_params)

    topic_time = [[dtm_model.show_topic(topicid=topic_id, time=t, topn=num_topic_word) for topic_id in range(num_topic)]
                  for t in range(len(time_slice))]
    topic_time = [[["{}: {}".format(tup[1], tup[0]) for tup in topic] for topic in time] for time in topic_time]
    timeline = ["{} ({} docs)".format(ind, t) for ind, t in enumerate(time_slice)]
    columns = ["topic_{}".format(i + 1) for i in range(num_topic)]
    topic_table = pd.DataFrame(topic_time, columns=columns)
    topic_table['time'] = timeline
    topic_table = topic_table[['time'] + columns]

    prop_arr = dtm_model.gamma_
    out_table = pd.DataFrame.copy(table, deep=True)
    if topic_name in table.columns:
        raise BrighticsFunctionException.from_errors(
            [{'0100': "Existing table contains Topic Column Name. Please choose again."}])
    out_table[topic_name] = [item.argmax() + 1 for item in prop_arr]
    out_table['topic_distribution'] = prop_arr.tolist()

    # original influence table: influences_time[time_slice][document_no][topic_no]
    influence_arr = np.vstack(dtm_model.influences_time)
    influence_table = pd.DataFrame(influence_arr, columns=columns)
    time_id = np.concatenate([id * np.ones(duration) for id, duration in enumerate(time_slice)])
    influence_table['time'] = time_id
    influence_table = influence_table[['time'] + columns]

    coherence_topic_arr = [dtm_model.dtm_coherence(time) for time in range(len(time_slice))]
    if coherence == 'u_mass':
        coh_arr = [CoherenceModel(topics=item, dictionary=dictionary, corpus=corpus, coherence='u_mass').get_coherence()
                   for item in coherence_topic_arr]
    else:
        coh_arr = [CoherenceModel(topics=item, dictionary=dictionary, corpus=corpus, texts=tokenized_doc,
                                  coherence='c_v').get_coherence() for item in coherence_topic_arr]

    doc_topic, topic_term, doc_lengths, term_frequency, vocab = dtm_model.dtm_vis(corpus, vis_time)
    prepared_data = plv.prepare(topic_term, doc_topic, doc_lengths, vocab, term_frequency, sort_topics=False)
    html_result = plv.prepared_data_to_html(prepared_data)

    params = {'Input column': input_col,
              'Topic column name': topic_name,
              'Number of topics': num_topic,
              'Number of words for each topic': num_topic_word,
              'Maximum number of iterations': max_iter,
              'Time slice': time_slice,
              'Coherence measure': coherence,
              'Time to visualize': vis_time}
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Document Influence Model Result
    | ### Summary
    |
    """))
    rb.addHTML(html_result)
    rb.addMD(strip_margin("""
    | ### Coherence for each period
    | {coh_arr}
    |
    | ### Parameters
    | {params}
    """.format(coh_arr=coh_arr, params=dict2MD(params))))

    model = _model_dict('dtm_model')
    model['params'] = params
    model['dtm_model'] = dtm_model
    model['coherences'] = coh_arr
    model['corpus'] = corpus
    model['_repr_brtc_'] = rb.get()

    return {'out_table': out_table, 'topic_table': topic_table, 'influence_table': influence_table, 'model': model}
