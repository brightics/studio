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

from twkorean import TwitterKoreanProcessor as Tw
from nltk.stem import PorterStemmer
from nltk.tokenize import sent_tokenize, word_tokenize
import nltk
from bs4 import BeautifulSoup
import re
from brightics.common.utils import check_required_parameters


def tokenizer_kor(table, **params):
    check_required_parameters(_tokenizer_kor, params, ['table'])   
    return _tokenizer_kor(table, **params)

    
def _tokenizer_kor(table, input_cols, hold_cols=None, new_col_prefix='tokenized',
                   normalization=True, stemming=True, pos_extraction=None, is_tagged=False):
    
    if hold_cols is None:
        out_table = table.copy()
    else:
        out_table = table[hold_cols]
    
    if pos_extraction is None:
        pos_extraction = ["Noun", "Verb", "Adjective", "Adverb", "Determiner", "Exclamation",
                          "Josa", "Eomi", "PreEomi", "Conjunction", "Modifier", "VerbPrefix", "Suffix",
                          "Unknown", "Korean", "Foreign", "Number", "KoreanParticle", "Alpha", "Punctuation",
                          "Hashtag", "ScreenName", "Email", "URL", "CashTag", "Space", "Others"]
        
    for i in range(len(input_cols)):      
        tokenizer = Tw(normalization=normalization, stemming=stemming)

        docs = table[input_cols[i]]
        tagged_doc_list = docs.apply(tokenizer.tokenize)

        pos_doc_list = []
        
        for tagged_list in tagged_doc_list:
            pos_list = []
            for tagged in tagged_list:
                for pos in pos_extraction:
                    if tagged[1] == pos:  
                        if is_tagged == True:
                            pos_list = pos_list + ['{text}({pos})'.format(text=tagged[0], pos=tagged[1])]
                        else:
                            pos_list = pos_list + [tagged[0]]  
            pos_doc_list.append(pos_list)

        out_table['{prefix}_{col}'.format(prefix=new_col_prefix, col=input_cols[i])] = pos_doc_list
    
    return {'out_table': out_table}


def doc_list_stemming(word_tok_list):
    ps = PorterStemmer()
    return [ps.stem(word_tok) for word_tok in word_tok_list]


REPLACE_NO_SPACE = re.compile("[.;:!\'?,\"()\[\]]")
REPLACE_WITH_SPACE = re.compile("(<br\s*/><br\s*/>)|(\-)|(\/)")


def preprocess_reviews(text):
    text = REPLACE_NO_SPACE.sub("", text.lower())
    text = REPLACE_WITH_SPACE.sub(" ", text)
    return text


def tokenizer_eng(table, **params):
    check_required_parameters(_tokenizer_eng, params, ['table'])    
    return _tokenizer_eng(table, **params)


def _tokenizer_eng(table, input_cols, hold_cols=None, new_col_prefix='tokenized',
                   normalization=True, stemming=True, pos_extraction=None, is_tagged=False):

    if hold_cols is None:
        out_table = table.copy()
    else:
        out_table = table[hold_cols]
        
    if pos_extraction is None:
        pos_extraction = ["CC", "CD", "DT", "EX", "FW", "IN", "JJ", "JJR", "JJS", "LS", "MD",
                          "NN", "NNS", "NNP", "NNPS", "PDT", "POS", "PRP", "PRP$", "RB", "RBR", "RBS",
                          "RP", "TO", "UH", "VB", "VBD", "VBG", "VBN", "VBP", "VBZ", "WDT", "WP", "WP$", "WRB"]

    for i in range(len(input_cols)):
        docs = table[input_cols[i]]

        docs = docs.apply(lambda text: BeautifulSoup(text).get_text())
        docs = docs.apply(preprocess_reviews)
        doc_list = docs.apply(word_tokenize)

        if stemming == True:
            doc_list = doc_list.apply(doc_list_stemming)

        tagged_doc_list = doc_list.apply(nltk.pos_tag)

        pos_doc_list = []
        extracted_pos_doc_list = []

        for tagged_list in tagged_doc_list:
            pos_list = []
            for tagged in tagged_list:
                for pos in pos_extraction:
                    if tagged[1] == pos:
                        if is_tagged == True:
                            pos_list = pos_list + ['{text}({pos})'.format(text=tagged[0], pos=tagged[1])]
                        else:
                            pos_list = pos_list + [tagged[0]]
            pos_doc_list.append(pos_list)
    
        out_table['{prefix}_{col}'.format(prefix=new_col_prefix, col=input_cols[i])] = pos_doc_list
    return {'out_table': out_table}
