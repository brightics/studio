
# coding: utf-8

# In[ ]:
from brightics.common.report import ReportBuilder, strip_margin, pandasDF2MD
from brightics.function.utils import _model_dict
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from twkorean import TwitterKoreanProcessor

from tensorflow import keras
from keras.preprocessing.text import Tokenizer
from keras.preprocessing.sequence import pad_sequences
from keras.utils import to_categorical


import MeCab
import pandas as pd
import numpy as np
import re
    

def Twitter_Tokenizer(table, input_col, token_col_name = 'Tokens', pos_col_name = 'Pos',stemming=False, normalization=False,morpheme=None) :
    processor = TwitterKoreanProcessor(stemming=stemming, normalization=normalization)
    result = table.copy()
    tokens = []
    tokens_pos = []
    for i in result.index :
        try:
            sentence = result.at[i,input_col]
            tokenize = processor.tokenize(sentence)
            token = []
            pos = []
            for i in range(len(tokenize)):
                if(morpheme == None):
                    token.append(tokenize[i][0])
                    pos.append(tokenize[i][1])
                else:
                    if(tokenize[i][1] in morpheme):
                        token.append(tokenize[i][0])
                        pos.append(tokenize[i][1])       
                
            tokens.append(token)
            tokens_pos.append(pos)
        except:
            result.drop(i,inplace=True)
    result[token_col_name] = tokens
    result[pos_col_name] = tokens_pos

    return {'out_table': result}