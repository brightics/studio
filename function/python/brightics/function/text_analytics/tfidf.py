import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer


def tfidf(table, input_col, hold_cols=None, min_df=None, max_df=None, max_features=None, idf_weighting_scheme='unary',
          vocabulary_col='vocabulary', index_col='index', frequency_col='frequency'):
    _table = table.copy()
    
    _input_data = _table[input_col]
    
    if min_df is None:
        _min_df = 1
    else:
        _min_df = min_df
        
    if max_df is None:
        _max_df = 1.0
    else:
        _max_df = max_df
    
    if idf_weighting_scheme == 'idf':
        _vectorizer = TfidfVectorizer(min_df=_min_df, max_df=_max_df, max_features=max_features)
        _model = _vectorizer.fit(_input_data)        
        _tdm = _model.transform(_input_data)
        _idf_vector = _model.idf_
    else:
        _vectorizer = CountVectorizer(min_df=_min_df, max_df=_max_df, max_features=max_features)
        _model = _vectorizer.fit(_input_data)        
        _tdm = _model.transform(_input_data)
        _idf_vector = [1.0] * len(_model.get_feature_names())
    
    _features = _vectorizer.get_feature_names()
    _out_coo = _tdm.tocoo()
    
    _frequency_table = pd.DataFrame()
    if hold_cols is not None:
        for hc in hold_cols:
            _frequency_table[hc] = [_table[hc][i] for i in _out_coo.row] 
    _frequency_table[vocabulary_col] = [_features[i] for i in _out_coo.col]
    _frequency_table[index_col] = _out_coo.col
    _frequency_table[frequency_col] = _out_coo.data
    
    _idf_vector_table = pd.DataFrame({vocabulary_col:_vectorizer.get_feature_names()})
    _idf_vector_table['idf_vector'] = _idf_vector
    
    return {'frequency_table':_frequency_table, 'idf_vector_table':_idf_vector_table}
