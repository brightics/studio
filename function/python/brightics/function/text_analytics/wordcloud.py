
# coding: utf-8

from brightics.common.report import ReportBuilder
from brightics.function.utils import _model_dict
from wordcloud import WordCloud
import NKP
import MeCab
import pandas as pd
import numpy as np

#%matplotlib inline
import matplotlib.pyplot as plt


def wordcloud(table,font_path = '/fonts/NanumGothic.ttf',width=800, height=800, background_color="white"):
    texts=''
    for tokens in tokenizer['Tokens']:
        for token in tokens:
            texts += ' ' + token

    wordcloud = WordCloud(
    font_path = font_path,
    width = width,
    height = height,
    background_color=background_color
    )
    wordclud = wordcloud.generate_from_text(texts)

    array = wordcloud.to_array()

    fig = plt.figure(figsize=(10, 10))
    plt.imshow(array, interpolation="bilinear")
    plt.axis('off')
    plt.show()

    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | ## Word Cloud Result
    | {fig}
    """.format(fig=plt)))

    model = _model_dict('wordcloud')
    model['plt'] = plt
    model['report']=rb.get()

    return {'model': model}



