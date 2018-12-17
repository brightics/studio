
# coding: utf-8

# In[ ]:
from brightics.common.report import ReportBuilder, strip_margin, pandasDF2MD
from brightics.function.utils import _model_dict
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from twkorean import TwitterKoreanProcessor

import MeCab
import pandas as pd
import numpy as np
import re
    


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





