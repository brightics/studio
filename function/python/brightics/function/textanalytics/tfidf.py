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
from brightics.common.validation import validate, greater_than_or_equal_to, greater_than

import pandas as pd
import numpy as np
from operator import itemgetter
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_extraction.text import TfidfTransformer


def tfidf(table, group_by=None, **params):
    check_required_parameters(_tfidf, params, ['table'])
    params = get_default_from_parameters_if_required(params, _tfidf)
    param_validation_check = [greater_than_or_equal_to(params, 0, 'min_df'),
                              greater_than_or_equal_to(params, 2, 'num_voca'),
                              greater_than(params, 0, 'max_df')]
    validate(*param_validation_check)
    if group_by is not None:
        return _function_by_group(_tfidf, table, group_by=group_by, **params)
    else:
        return _tfidf(table, **params)


def _tfidf(table, input_col, max_df=None, min_df=1, num_voca=1000, idf_weighting_scheme='inverseDocumentFrequency', norm='l2', smooth_idf=True, sublinear_tf=False, output_type=False):
    corpus = table[input_col]
    if max_df == None:
        max_df = len(corpus)
    tf_vectorizer = CountVectorizer(stop_words='english', max_df=max_df, min_df=min_df, max_features=num_voca)
    tf_vectorizer.fit(corpus)
    csr_matrix_tf = tf_vectorizer.transform(corpus)
    tfidf_vectorizer = TfidfTransformer(norm=norm, use_idf=True, smooth_idf=smooth_idf, sublinear_tf=sublinear_tf)
    csr_matrix_tfidf = tfidf_vectorizer.fit_transform(csr_matrix_tf)

    voca_dict = sorted(tf_vectorizer.vocabulary_.items(), key=itemgetter(1))
    len_voca = len(voca_dict)
    
    # tf-idf table

    tfidf_table = pd.DataFrame()
    document_list = []
    docID_list = []
    if output_type == False:
        vocabulary_list = []
        index_list = []
        label_table = pd.DataFrame()
        for doc in range(len(corpus)):
            docID_list += ['doc_{}'.format(doc + 1) for _ in range(len_voca)]
            document_list += [str(corpus[doc]) for _ in range(len_voca)]
            vocabulary_list += [voca_dict[j][0] for j in range(len_voca)]
            index_list += [voca_dict[j][1] for j in range(len_voca)]
        label_table['document_id'] = docID_list
        label_table[input_col] = document_list
        label_table['vocabulary'] = vocabulary_list
        label_table['index'] = index_list
        tfidf_table = label_table
        tfidf_table['frequency'] = np.ravel(csr_matrix_tf.todense())
        if idf_weighting_scheme == 'inverseDocumentFrequency':
            tfidf_table['tfidf score'] = np.ravel(csr_matrix_tfidf.todense())
        elif idf_weighting_scheme == 'unary':
            tfidf_table['tfidf score'] = list(map(float, np.array(tfidf_table['frequency'])))
    
    elif output_type == True:
        for doc in range(len(corpus)):
            docID_list += ['doc_{}'.format(doc + 1) for _ in range(csr_matrix_tfidf.indptr[doc + 1] - csr_matrix_tfidf.indptr[doc])]
            document_list += [str(corpus[doc]) for _ in range(csr_matrix_tfidf.indptr[doc + 1] - csr_matrix_tfidf.indptr[doc])]
        tfidf_table['document_id'] = docID_list
        tfidf_table[input_col] = document_list
        tfidf_table['vocabulary'] = [voca_dict[i][0] for i in csr_matrix_tf.indices]
        tfidf_table['index'] = csr_matrix_tf.indices
        tfidf_table['frequency'] = csr_matrix_tf.data
        data_list = []
        for doc in range(len(corpus)):
            data_list += [csr_matrix_tfidf.data[i]  for i in range(csr_matrix_tfidf.indptr[doc + 1] - csr_matrix_tfidf.indptr[doc])][::-1]
        if idf_weighting_scheme == 'inverseDocumentFrequency':
            tfidf_table['tfidf score'] = data_list
        elif idf_weighting_scheme == 'unary':
            tfidf_table['tfidf score'] = list(map(float, np.array(tfidf_table['frequency'])))

    else:
        raise_runtime_error("Please check 'output_type'.")
        
        # idf table
    
    idf_table = pd.DataFrame()
    idf_table['vocabulary'] = [voca_dict[j][0] for j in range(len(voca_dict))]
    idf_table['index'] = [voca_dict[j][1] for j in range(len(voca_dict))]
    if idf_weighting_scheme == 'inverseDocumentFrequency':
        idf_table['idf weight'] = tfidf_vectorizer.idf_.tolist()
    elif idf_weighting_scheme == 'unary':
        idf_table['idf weight'] = float(1)
        
    params = {
        'Input Column': input_col,
        'Max DF': max_df,
        'Min DF': min_df,
        'Number of Vocabularies': num_voca,
        'IDF Weighting Scheme': idf_weighting_scheme,
        'Norm': norm,
        'Smooth IDF': smooth_idf,
        'Sublinear TF': sublinear_tf,
        'Remove Zero Counts': output_type
    }
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""# TF-IDF Result"""))
    rb.addMD(strip_margin("""
    |
    |### Parameters
    |
    |{display_params}
    |
    |### IDF Table
    |
    |{idf_table}
    |
    |### TFIDF Table
    |
    |{tfidf_table}
    |
    """.format(display_params=dict2MD(params), idf_table=pandasDF2MD(idf_table, num_rows=200), tfidf_table=pandasDF2MD(tfidf_table, num_rows=200))))

    model = _model_dict('tfidf')
    model['csr_matrix_tf'] = csr_matrix_tf
    model['csr_matrix_tfidf'] = csr_matrix_tfidf
    model['parameter'] = params
    model['idf_table'] = idf_table
    model['tfidf_table'] = tfidf_table
    model['_repr_brtc_'] = rb.get()
    
    return {'model' : model}
