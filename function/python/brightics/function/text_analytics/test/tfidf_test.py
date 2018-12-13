import pandas as pd
import numpy as np
import unittest
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer, TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from brightics.function.text_analytics import tfidf


class TfIdfTest(unittest.TestCase):
    
    def setUp(self):
        corpus = ['This is the first document.',
                  'This document is the second document.',
                  'And this is the third one.',
                  'Is this the first document?']
        self.ex_corpus = corpus
        self.ex2 = pd.read_csv('sample_termDocument2.csv')['description2'].values
        self.df = pd.DataFrame({'data':corpus, 'text_index':[1, 2, 3, 4], 'text_comment':['a', 'b', 'c', 'd']})
    
    def test1(self):
        out_func = tfidf(self.df, input_col='data', hold_cols=['text_index', 'text_comment'], max_df=1.0)
        
        print(out_func['frequency_table'])
        print(out_func['idf_vector_table'])
        
    def test2(self):
        out_func = tfidf(self.df, input_col='data', hold_cols=['text_index', 'text_comment'], idf_weighting_scheme='idf')
        
        print(out_func['frequency_table'])
        print(out_func['idf_vector_table'])
    
    def test11(self):
        corpus = ['This is the first document.',
                  'This document is the second document.',
                  'And this is the third one.',
                  'Is this the first document?']
        
        vectorizer = TfidfVectorizer()
        # X = vectorizer.fit_transform(corpus)
        model = vectorizer.fit(corpus)
        X = model.transform(corpus)
        print(vectorizer.get_feature_names())
        print(vectorizer.get_stop_words())
        print(vectorizer.inverse_transform(X))
        print(X.shape)
        print(X)
        print(model.vocabulary_)
        print(model.idf_)
        
    def test12(self):
        cv = CountVectorizer()
        out_cv = cv.fit_transform(self.ex_corpus)
        
        tfidft = TfidfTransformer()
        out_tfidft = tfidft.fit_transform(out_cv)
        # tfidft.
        print(out_cv)
        print(out_tfidft)
    
    def test13(self):
        cv = CountVectorizer()
        out_cv = cv.fit_transform(self.ex2)
#         print(out_cv)
#         print(out_cv.shape)
#         print(out_cv.getnnz())
        out2 = out_cv.tocoo()
        print(out2.row)
        print(out2.col)
    
    def test14(self):
        d = pd.read_csv('sample_termDocument2.csv')['description2'].values
            
        vectorizer = TfidfVectorizer()
        X = vectorizer.fit_transform(d)
        model = vectorizer.fit(d)
        # print(vectorizer.get_feature_names())
        # print(vectorizer.get_stop_words())
        # print(vectorizer.inverse_transform(X))
        # print(X.shape)
        # print(X)
        # print(model.vocabulary_)
        # print(model.idf_)
        
        dic = [None] * len(model.vocabulary_)
        for k, v in model.vocabulary_.items():
            dic[v] = k
        
        out_table2 = pd.DataFrame({'voc':dic, 'idf_vector':model.idf_})
        print(out_table2)
#         print(X)
        
        # print(pd.DataFrame(X.toarray()))
        X_coo = X.tocoo()
        # print(X_coo)
        # print(X_coo.data)
        # print(X_coo.row)
        # print(X_coo.col)
        
        X_new = X_coo.copy()
        y = np.array(list(range(1, 1937)))
        mnb = MultinomialNB()
        mnb.fit(X_new, y)
        
