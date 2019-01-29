from brightics.common.repr import BrtcReprBuilder, strip_margin, pandasDF2MD, dict2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters
from brightics.function.validation import raise_runtime_error

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer


def tfidf(table, group_by=None, **params):
    check_required_parameters(_tfidf, params, ['table'])
    if group_by is not None:
        return _function_by_group(_tfidf, table, group_by=group_by, **params)
    else:
        return _tfidf(table, **params)


def _tfidf(table, input_col, max_df=0.95, min_df=2, num_voca=1000, idf_weighting_scheme='inverseDocumentFrequency', norm='l2', smooth_idf=True, sublinear_tf=False, output_type=False):
    corpus=table[input_col]
    tf_vectorizer=CountVectorizer(stop_words='english', max_df=max_df, min_df=min_df, max_features=num_voca)
    tf_vectorizer.fit(corpus)
    
    voca_dict=tf_vectorizer.vocabulary_
    
    
    tfidf_vectorizer=TfidfVectorizer(stop_words='english', max_df=max_df, min_df=min_df, max_features=num_voca, norm=norm, use_idf=True, smooth_idf=smooth_idf, sublinear_tf=sublinear_tf)
    tfidf_vectorizer.fit(corpus)
    

    tf_feature_names=tf_vectorizer.get_feature_names()
    idf_table=pd.DataFrame()
    idf_table['vocabulary']=tf_feature_names
    if idf_weighting_scheme=='inverseDocumentFrequency':
        idf_table['idf weight']=tfidf_vectorizer.idf_.tolist()
    elif idf_weighting_scheme=='unary':
        idf_table['idf weight']=float(1)
    
    
    tfidf_table=pd.DataFrame()
    for doc in range(len(corpus)):
        each_tfidf_table=pd.DataFrame()
        each_tfidf_table[input_col]=[str(corpus[doc]) for j in range(len(voca_dict.keys()))]
        each_tfidf_table['vocabulary']=voca_dict.keys()
        each_tfidf_table['index']=voca_dict.values()
        each_tfidf_table['frequency']=[np.ravel(tf_vectorizer.transform([corpus[doc]]).toarray())[idx] for idx in voca_dict.values()]
        if idf_weighting_scheme=='inverseDocumentFrequency':
            each_tfidf_table['tfidf score']=[np.ravel(tfidf_vectorizer.transform([corpus[doc]]).toarray())[idx] for idx in voca_dict.values()]
        elif idf_weighting_scheme=='unary':
            each_tfidf_table['tfidf score']=[np.ravel(tfidf_vectorizer.transform([corpus[doc]]).toarray())[idx] / float(tfidf_vectorizer.idf_[idx]) for idx in voca_dict.values()]
        each_tfidf_table=each_tfidf_table.sort_values(by=['index'], axis=0)
        tfidf_table=pd.concat([tfidf_table, each_tfidf_table], axis=0)
        
    
    if output_type==False:
        pass
    elif output_type==True:
        remain_idx=tfidf_table['frequency'].apply(lambda x: x!=0)
        tfidf_table=tfidf_table[remain_idx.values]
    else:
        raise_runtime_error("Please check 'output_type'.")
        
        
    params={
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
    
    rb=BrtcReprBuilder()
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
    """.format(display_params=dict2MD(params), idf_table=pandasDF2MD(idf_table, num_rows=len(tf_feature_names)+1), tfidf_table=pandasDF2MD(tfidf_table, num_rows=len(tf_feature_names)*len(corpus)+1))))

    model=_model_dict('tfidf')
    model['idf_table']=idf_table
    model['tfidf_table']=tfidf_table
    model['_repr_brtc_']=rb.get()
    
    return {'model' : model}
