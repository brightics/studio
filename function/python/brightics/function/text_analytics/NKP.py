
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

def Analyzer(table,input_col,id_col = None) :
    df = table.copy()
    t = MeCab.Tagger()
    data_list = []
    id = 0
    for i in df.index:
        try:
            parse = t.parseToNode(df.at[i,input_col])
            index = 0
            while parse:
                if(parse.surface != ""):
                    word = parse.surface
                    feature = parse.feature.split(",")
                    pos = feature[0]
                    start = index
                    index = index + len(word)
                    end = index
                    if(id_col == None):
                        data_list.append([id,word,pos,feature,start,end])
                    else : 
                        data_list.append([df.at[i,id_col],word,pos,feature,start,end])
                parse = parse.next
            id = id +1
        except:
            None
    result = pd.DataFrame(data=data_list,columns=['Id','Word','Pos','Feature','Start','End'])
    return {'out_table': result}


# morpheme을 설정해주면 원하는 형태소만 출력한다.
# morpheme을 설정해주지 않으면 모든 형태소가 출력
def MeCab_Tokenizer(table, input_col,token_col_name = 'Tokens', pos_col_name = 'Pos', morpheme=None):
    result = table.copy()
    t = MeCab.Tagger()
    
    tokens_list = []
    pos_list = []
    
    
    for i in result.index:
        tokens = []
        tokens_pos = []
        
        try:
            parse = t.parseToNode(result.at[i,input_col])
            while parse:
                if(parse.surface != ""):
                    word = parse.surface
                    feature = parse.feature.split(",")
                    pos = feature[0]
                    if(morpheme == None):
                        tokens.append(word)
                        tokens_pos.append(pos)
                    else:
                        if(pos in morpheme):
                            tokens.append(word)
                            tokens_pos.append(pos)        
                parse = parse.next
            tokens_list.append(tokens)
            pos_list.append(tokens_pos)
        except:
            result.drop(i,inplace=True)
    result[token_col_name]=  tokens_list
    result[pos_col_name]  =pos_list
        
    return {'out_table': result}





def Doc_to_Vec(table, tokens_col, vector_size = 100, window = 5, min_count = 5, workers = 3, epochs = 5):

   result = table.copy()
   documents = [TaggedDocument(doc, [i]) for i, doc in enumerate(result[tokens_col])]

   model = Doc2Vec(documents, vector_size=vector_size, window=window, min_count=min_count, workers=workers, epochs=epochs)
   model.train(documents, total_examples=model.corpus_count, epochs=model.epochs)

   vectors = []
   for i in result.index:
      try:
         vector = model.infer_vector(result.at[i, tokens_col])
         vectors.append(vector)
      except:
         raise("ERROR")
        
   array_vectors = np.array(vectors)
   for i in range(model.vector_size) :
      col_name = 'vectors_' + str(i)
      result[col_name] = array_vectors[:,i]

      
   return {'out_table': result, 'model': model }

def doctovec_infervector(table, model, tokens_col ) :
    result = table.copy()

    vectors = []
    
    for i in result.index:
        try:
            vector = model.infer_vector(result.at[i, tokens_col])
            vectors.append(vector)
        except:
            raise("ERROR")
    array_vectors = np.array(vectors)
    

    for i in range(model.vector_size) :
        col_name = 'vectors_' + str(i)
        result[col_name] = array_vectors[:,i]
        
    return {'out_table': result}
    
def DoctoVecsimilar(table,model,text_col, label_col) :
   df = table.copy()
   result_sim={}

   for i in range(10):
      temp = {}
      temp['sentence'] = []
      temp['label'] = []
      for id, vec in model.docvecs.most_similar(i):
         temp['sentence'].append(df.at[id,text_col])
         temp['label'].append(df.at[id,label_col])
      result_sim[i]=pd.DataFrame(temp)

   str_MD = '## Most similar Result \n'

   for i in range(10):
      str_MD += '|' + df.at[i,'document'] +  '\n'

      str_MD += '|' + pandasDF2MD(result_sim[i]) +'\n'
   rb = ReportBuilder()
   rb.addMD(strip_margin(str_MD))

   _model = _model_dict('doc2vec')
   # _model['d2v_model'] = model
   # _model['epochs'] = model.epochs
   _model['report'] = rb.get()

   return{'model':_model}