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

import nltk
from bs4 import BeautifulSoup
from nltk.tokenize import word_tokenize
from nltk import ne_chunk
from nltk.tree import Tree
import numpy as np
import pandas as pd
import en_core_web_sm
import re
import sklearn_crfsuite
import pickle

from brightics.function.textanalytics.split_sentences import split_sentences
from brightics.function.textanalytics.tokenizer2 import tokenizer_kor2, tokenizer_eng2
from brightics.function.utils import _model_dict
from brightics.common.repr import BrtcReprBuilder
from brightics.common.repr import strip_margin
from brightics.common.repr import dict2MD
from brightics.common.utils import check_required_parameters
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.validation import raise_runtime_error
from brightics.common.validation import validate, greater_than_or_equal_to

REPLACE_NO_SPACE = re.compile(r"[.;:!\'?,\"()\[\]]")
REGEX_EXTRACT_POSTAG_KOR = re.compile(r'^(.+)/([\S]+)$')
REGEX_EXTRACT_POSTAG_ENG = re.compile(r'^(.+)\(([\S]+)\)$')
REGEX_CHINESE = re.compile(r'[⺀-⺙⺛-⻳⼀-⿕々〇〡-〩〸-〺〻㐀-䶵一-鿃豈-鶴侮-頻並-龎]+')
METHOD_NLTK = 'nltk'
METHOD_SPACY = 'spacy'
METHOD_STANFORD = 'stanford'
METHOD_CRF = 'crf'
DEFAULT_LABELS_NLTK = ['FACILITY', 'GPE', 'GSP', 'LOCATION', 'ORGANIZATION', 'PERSON']
DEFAULT_LABELS_SPACY = ['CARDINAL', 'DATE', 'EVENT', 'FAC', 'GPE', 'LANGUAGE', 'LAW', 'LOC', 'MONEY', 'NORP', 'ORDINAL',
                        'ORG', 'PERCENT', 'PERSON', 'PRODUCT', 'QUANTITY', 'TIME', 'WORK_OF_ART']
DEFAULT_LABELS_CRF_ENG = ['ART', 'EVE', 'GEO', 'GPE', 'NAT', 'ORG', 'PER', 'TIM']
DICT_NE_LABEL_KOR = {'PS': 'PERSON',
                     'DT': 'DATE',
                     'OG': 'ORGANIZATION',
                     'LC': 'LOCATION',
                     'TI': 'TIME'}
DICT_NE_LABEL_ENG = {'geo': 'GEOGRAPHICAL_ENTITY',
                     'org': 'ORGANIZATION',
                     'per': 'PERSON',
                     'gpe': 'GEO_POLITICAL_ENTITY',
                     'tim': 'TIME',
                     'art': 'ARTIFACT',
                     'eve': 'EVENT',
                     'nat': 'NATURAL_PHENOMENON'}


def ner_eng(table, **params):
    check_required_parameters(_ner_eng, params, ['table'])
    return _ner_eng(table, **params)


def _ner_eng(table, input_cols, method='nltk', ne_extraction_nltk=None, ne_extraction_spacy=None,
             ne_extraction_crf=None, new_col_prefix='named_entity'):
    out_table = table.copy()
    if ne_extraction_nltk is None:
        ne_extraction_nltk = DEFAULT_LABELS_NLTK
    if ne_extraction_spacy is None:
        ne_extraction_spacy = DEFAULT_LABELS_SPACY
    if ne_extraction_crf is None:
        ne_extraction_crf = DEFAULT_LABELS_CRF_ENG

    if method == METHOD_CRF:
        # Load a CRF model pre-trained with GMB corpus and sklearn_crfsuite.
        # https://www.kaggle.com/abhinavwalia95/entity-annotated-corpus/version/3#ner_dataset.csv
        with open('brightics/function/textanalytics/data/english_ner_model.pickle', 'rb') as f:
            crf_model = pickle.load(f)
        model = {'crf_model': crf_model}
        res = _ner_crf_predict(table, model, input_cols, language='eng', new_col_prefix=new_col_prefix,
                               extraction_set=ne_extraction_crf)
        out_table = res['out_table']

    else:
        def process_text(text):
            if method == METHOD_NLTK:
                return process_text_nltk(text, ne_extraction_nltk)
            elif method == METHOD_SPACY:
                return process_text_spacy(text, ne_extraction_spacy)
            elif method == METHOD_STANFORD:
                return process_text_stanford(text)
            else:
                raise_runtime_error("Invalid method name.")

        for col in input_cols:
            docs = table[col]
            docs_result = docs.apply(process_text)
            out_table['{prefix}_{col}'.format(prefix=new_col_prefix, col=col)] = docs_result

    return {'out_table': out_table}


def process_text_nltk(text, extraction_set):
    text_filtered_html = BeautifulSoup(text).get_text()
    text_preprocessed = REPLACE_NO_SPACE.sub("", text_filtered_html)
    text_tokenized = word_tokenize(text_preprocessed)
    text_tagged = nltk.pos_tag(text_tokenized)
    chunk_tree = ne_chunk(text_tagged)
    named_entities = [" ".join([token for token, pos in chunk.leaves()]) + "({label})".format(label=chunk.label())
                      for chunk in chunk_tree if type(chunk) == Tree and chunk.label() in extraction_set]
    return named_entities


def process_text_spacy(text, extraction_set):
    nlp = en_core_web_sm.load()
    doc = nlp(text)
    named_entities = ["{token}({label})".format(token=word.text, label=word.label_)
                      for word in doc.ents if word.label_ in extraction_set]
    return named_entities


# TODO: Available after implementation of Stanford library
def process_text_stanford(text):
    from nltk.tag import StanfordNERTagger
    tagger = StanfordNERTagger('english.all.3class.distsim.crf.ser.gz')
    tagged = tagger.tag(text.split())
    named_entities = ["{token}({label})".format(token=word, label=label)
                      for word, label in tagged if label != 'O']
    return named_entities


def ner_kor(table, **params):
    check_required_parameters(_ner_kor, params, ['table'])
    return _ner_kor(table, **params)


# TODO: Incomplete right now since the corpus is compatible with MeCab Tokenizer
def _ner_kor(table, input_cols, ne_extraction_crf=None, new_col_prefix='named_entity'):
    # Load a CRF model pre-trained with KoreanNERCorpus and sklearn_crfsuite.
    # https://github.com/machinereading/KoreanNERCorpus
    with open('brightics/function/textanalytics/data/korean_ner_model.pickle', 'rb') as f:
        crf_model = pickle.load(f)
    model = {'crf_model': crf_model}
    res = _ner_crf_predict(table, model, input_cols, language='kor', new_col_prefix=new_col_prefix,
                           extraction_set=ne_extraction_crf)
    out_table = res['out_table']
    return {'out_table': out_table}


def _transform_token_kor(pos_tagged_token):  # Rule-based transformation from Tw into MeCab pos system
    tag = REGEX_EXTRACT_POSTAG_KOR.search(pos_tagged_token)
    token, pos = tag.group(1), tag.group(2)
    if pos == 'Adjective':
        pos = 'VA'
    elif pos == 'Adverb':
        pos = 'MAG'
    elif pos == 'Alpha':
        pos = 'SL'
    elif pos == 'Conjunction':
        pos = 'MAJ'
    elif pos == 'Determiner':
        pos = 'MM'
    elif pos == 'Eomi':
        if token in ['가', '다', '데요', '까', '라', '니다', '니다.', '거든', '고', '냐', '네', '느냐', '는다', '는데', '다',
                     '다네', '더라고', '며', '습니다', '아', '아라', '아서다', '어', '어요', '요', '을까', '자', '지만']:
            pos = 'EF'
        elif token in ['기', '음']:
            pos = 'ETN'
        elif token in ['다는', '냐는', '느냐는', '는', '는다는', '다는', '단', '더라는', '던', '라는', '란', '려는', '려던', '은',
                       '을', '자는', '잘']:
            pos = 'ETM'
        else:
            pos = 'EC'
    elif pos == 'Exclamation':
        pos = 'IC'
    elif pos == 'Foreign':
        if REGEX_CHINESE.findall(token):
            pos = 'SH'
        else:
            pos = 'SL'
    elif pos == 'Josa':
        if token in ['이', '가', '께서']:
            pos = 'JKS'
        elif token == '의':
            pos = 'JKG'
        elif token in ['을', '를']:
            pos = 'JKO'
        elif token in ['같이', '께', '랑', '로', '로부터', '로서', '로써', '루', '만큼', '보다', '서', '서부터', '에', '에게',
                       '에다', '에서', '에서부터', '으로', '으로부터', '으로서', '으로써', '처럼', '하고', '한테', '한테서']:
            pos = 'JKB'
        elif token in ['여', '야']:
            pos = 'JKV'
        elif token in ['고', '라고', '이라고']:
            pos = 'JKQ'
        elif token in ['까지', '는', '다', '대로', '도', '두', '란', '마다', '마저', '만', '밖에', '부터', '뿐', '사',
                       '야', '요', '은', '이나', '이나마', '이란', '이야', '조차']:
            pos = 'JX'
        elif token in ['과', '나', '와', '이나', '이랑']:
            pos = 'JC'
        else:
            pos = 'JKB'
    elif pos == 'Noun':
        if token in ['거기', '그', '그것', '그곳', '그녀', '그대', '나', '내', '너', '네', '누구', '당신', '머', '무엇', '뭐',
                     '아무개', '어디', '여기', '여러분', '우리', '이', '이거', '이것', '이곳', '저', '저희', '제']:
            pos = 'NP'
        elif token in ['첫째', '둘째', '셋째', '넷째', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열',
                       '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십', '백', '천', '만', '십만', '백만', '천만',
                       '억', '십억', '백억', '천억', '조', '십조', '백조', '천조', '경', '수십', '수백', '수천', '수만', '수십만',
                       '수백만', '수천만', '수억', '수십억', '수백억', '수천억']:
            pos = 'NR'
        elif token in ['가량', '가지', '간', '개', '개교', '개국', '개년', '개사', '개선', '개소', '개월', '거', '거리', '건',
                       '것', '격', '겸', '고', '구', '군데', '권', '그루', '기', '기가', '나름', '내', '년', '년대', '년도',
                       '년차', '놈', '달러', '대', '대로', '데', '도', '동', '듯', '등', '때문', '량', '리', '마리', '마일',
                       '만', '만큼', '말', '매', '명', '바', '바퀴', '박', '발', '발짝', '번', '부', '분', '뿐', '살', '석',
                       '설', '세', '센트', '셈', '수', '시', '식', '심', '씨', '양', '어치', '엔', '외', '원', '월', '위',
                       '이', '인방', '인승', '인치', '일', '자', '장', '적', '전', '점', '정', '조', '주', '주년', '주일', '줄',
                       '중', '즈음', '지', '쪽', '쯤', '차', '차전', '채', '척', '천', '초', '측', '킬로미터', '터', '톤', '톨',
                       '통', '투', '판', '편', '평', '푼', '한', '할', '행', '호', '화', '회', '미터', '밀리미터', '센티미터',
                       '센치미터', '리터', '밀리리터', '데시리터', '킬로리터', '킬로', '킬로그램', '그램', '톤', '밀리그램',
                       '나노미터', '나노그램', '파운드', '유로', '위안']:
            pos = 'NNB'
        else:
            pos = 'NNG'
    elif pos == 'Number':
        pos = 'SN'
    elif pos == 'PreEomi':
        pos = 'EP'
    elif pos == 'Punctuation':
        if token in ['!', ',', '.', '?', '．']:
            pos = 'SF'
        elif token == '…':
            pos = 'SE'
        elif token in ['(', '[']:
            pos = 'SSO'
        elif token in [')', ']']:
            pos = 'SSC'
        else:
            pos = 'SC'
    elif pos == 'Suffix':
        pass
    elif pos == 'Verb':
        if token == '이':
            pos = 'VCP'
        elif token == '아니':
            pos = 'VCN'
        elif token in ['가', '계시', '나', '나가', '내', '놓', '달', '두', '드리', '들', '말', '못하', '버리', '보', '싶', '않',
                       '오', '있', '주', '지', '프', '하']:
            pos = 'VX'
        else:
            pos = 'VV'

    return token, pos, ''


def _transform_tokens_kor(pos_tagged_tokens):
    return [_transform_token_kor(token) for token in pos_tagged_tokens]


def _transform_token_eng(pos_tagged_token):
    tag = REGEX_EXTRACT_POSTAG_ENG.search(pos_tagged_token)
    return tag.group(1), tag.group(2), ''


def _transform_tokens_eng(pos_tagged_tokens):
    return [_transform_token_eng(token) for token in pos_tagged_tokens]


"""
    The following functions word2features, sent2features, sent2labels, and sent2tokens are excerpted from
    sklearn-crfsuite tutorial page.
    © Copyright 2015, Mikhail Korobov.
    https://github.com/TeamHG-Memex/sklearn-crfsuite/blob/master/docs/CoNLL2002.ipynb
"""


def word2features(sent, i):
    word = sent[i][0]
    postag = sent[i][1]

    features = {
        'bias': 1.0,
        'word.lower()': word.lower(),
        'word[-3:]': word[-3:],
        'word[-2:]': word[-2:],
        'word.isupper()': word.isupper(),
        'word.istitle()': word.istitle(),
        'word.isdigit()': word.isdigit(),
        'postag': postag,
        'postag[:2]': postag[:2],
    }
    if i > 0:
        word1 = sent[i-1][0]
        postag1 = sent[i-1][1]
        features.update({
            '-1:word.lower()': word1.lower(),
            '-1:word.istitle()': word1.istitle(),
            '-1:word.isupper()': word1.isupper(),
            '-1:postag': postag1,
            '-1:postag[:2]': postag1[:2],
        })
    else:
        features['BOS'] = True

    if i < len(sent)-1:
        word1 = sent[i+1][0]
        postag1 = sent[i+1][1]
        features.update({
            '+1:word.lower()': word1.lower(),
            '+1:word.istitle()': word1.istitle(),
            '+1:word.isupper()': word1.isupper(),
            '+1:postag': postag1,
            '+1:postag[:2]': postag1[:2],
        })
    else:
        features['EOS'] = True

    return features


def sent2features(sent):
    return [word2features(sent, i) for i in range(len(sent))]


def sent2labels(sent):
    return [label for token, postag, label in sent]


def sent2tokens(sent):
    return [token for token, postag, label in sent]


def gen_ne_list(token_label_list, extraction_set=None):
    res = []
    current_ne = ''
    current_tag = ''
    for token_label in token_label_list:
        token = token_label[0]
        label = token_label[1]
        if label[0] == 'I':
            current_ne = ' '.join([current_ne, token])
        else:
            if (extraction_set is not None and current_tag in extraction_set) \
                    or (extraction_set is None and current_tag != ''):
                res.append("{ne}({tag})".format(ne=current_ne, tag=current_tag))
            if label[0] == 'B':
                current_tag = label[2:].upper()
                current_ne = token
            else:
                current_tag = ''
    if (extraction_set is not None and current_tag in extraction_set) \
            or (extraction_set is None and current_tag != ''):
        res.append("{ne}({tag})".format(ne=current_ne, tag=current_tag))
    return res


def ner_crf_train(table, **params):
    check_required_parameters(_ner_crf_train, params, ['table'])
    params = get_default_from_parameters_if_required(params, _ner_crf_train)
    param_validation_check = [greater_than_or_equal_to(params, 0, 'c1'),
                              greater_than_or_equal_to(params, 0, 'c2'),
                              greater_than_or_equal_to(params, 1, 'max_iterations')]
    validate(*param_validation_check)

    return _ner_crf_train(table, **params)


def _ner_crf_train(table, sentence_col, token_col, pos_col, label_col, algorithm='lbfgs', c1=0.1, c2=0.1,
                   max_iterations=100, all_possible_transitions=True):
    df = table.apply(lambda row: [row[sentence_col], [(row[token_col], row[pos_col], row[label_col])]],
                     axis=1, result_type='expand')
    df.columns = ['sent_id', 'sent']
    input_df = df.groupby('sent_id')['sent'].sum()
    train_set = input_df.values
    features_train = [sent2features(s) for s in train_set]
    label_train = [sent2labels(s) for s in train_set]
    crf_params = {"algorithm": algorithm,
                  "max_iterations": max_iterations,
                  "all_possible_transitions": all_possible_transitions}
    if algorithm == 'lbfgs':
        crf_params['c1'] = c1
        crf_params['c2'] = c2
    elif algorithm == 'l2sgd':
        crf_params['c2'] = c2
    crf = sklearn_crfsuite.CRF(**crf_params)
    crf_model = crf.fit(features_train, label_train)

    appearing_labels = list(set([label[2:].upper() for label in table[label_col].values if label[0] == 'B']))
    num_tokens = len(df.index)
    num_sentences = len(input_df.index)

    params = {'Sentence column': sentence_col,
              'Token column': token_col,
              'POS column': pos_col,
              'Label column': label_col,
              'Algorithm': algorithm,
              'c1': c1,
              'c2': c2,
              'Maximum iterations': max_iterations,
              'All possible transitions': all_possible_transitions}

    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Named Entity Recognition CRF Train Result
    | ### Number of tokens
    | {num_tokens}
    | 
    | ### Number of sentences
    | {num_sentences}
    | 
    | ### Appearing labels
    | {appearing_labels}
    |
    | ### Parameters
    | {params}
    """.format(num_tokens=num_tokens, num_sentences=num_sentences, appearing_labels=appearing_labels,
               params=dict2MD(params))))

    model = _model_dict('crf_ner_model')
    model['sentence'] = sentence_col
    model['token'] = token_col
    model['pos'] = pos_col
    model['label'] = label_col
    model['algorithm'] = algorithm
    model['c1'] = c1
    model['c2'] = c2
    model['max_iterations'] = max_iterations
    model['all_possible_transitions'] = all_possible_transitions
    model['crf_model'] = crf_model
    model['_repr_brtc_'] = rb.get()

    return {'model': model}


def ner_crf_predict(table, **params):
    check_required_parameters(_ner_crf_predict, params, ['table'])
    return _ner_crf_predict(table, **params)


def _ner_crf_predict(table, model, input_cols, language='eng', new_col_prefix='named_entity', extraction_set=None):
    out_table = table.copy()
    crf_model = model['crf_model']

    for col in input_cols:
        # Split sentences and tokenize using Brightics functions
        df_split_sentences = split_sentences(table, input_col=col, language=language)['out_table'].reset_index()
        if language == 'eng':
            df_tokenized = tokenizer_eng2(df_split_sentences, input_cols=['sentence'], is_tagged=True,
                                         stemming=False, lower_case=False)['out_table']
        else:  # language == 'kor'
            df_tokenized = tokenizer_kor2(df_split_sentences, input_cols=['sentence'], is_tagged=True,
                                         stemming=False)['out_table']
        col_doc_id = df_tokenized['doc_id']
        col_tokenized = df_tokenized['tokenized_sentence']

        # Transform to CRF input format
        if language == 'eng':
            transformer = _transform_tokens_eng
        else:  # language == 'kor':
            transformer = _transform_tokens_kor
        col_transformed = col_tokenized.apply(transformer)
        features_raw = col_transformed.tolist()
        features = [sent2features(sentence) for sentence in features_raw]

        # Run the model
        labels = crf_model.predict(features)
        token_labels = [[[token, label] for (token, pos, _), label in zip(i, j)]
                        for i, j in zip(features_raw, labels)]
        ne_list = [gen_ne_list(token_label_list, extraction_set) for token_label_list in token_labels]
        df = pd.DataFrame({'doc_id': col_doc_id, 'ne_list': ne_list})
        df_group_by_doc_id = df.groupby('doc_id')['ne_list'].sum()
        col_ne_list = df_group_by_doc_id.reset_index(drop=True)
        out_table['{prefix}_{col}'.format(prefix=new_col_prefix, col=col)] = col_ne_list

    return {'out_table': out_table}