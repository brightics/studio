
# coding: utf-8

from brightics.common.report import ReportBuilder, strip_margin, plt2MD
from brightics.function.utils import _model_dict
from wordcloud import WordCloud
import pandas as pd
import numpy as np

import matplotlib.pyplot as plt


def wordcloud(table,input_col,font_path = '/fonts/NanumGothic.ttf',width=800, height=800, background_color="white"):
    texts=''
    for tokens in table[input_col]:
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
    
    fig_image=plt2MD(plt)

    rb = ReportBuilder()
    rb.addMD(strip_margin("""
    | ## Word Cloud Result
    | {fig}
    """.format(fig=fig_image)))

    model = _model_dict('wordcloud')
    model['plt'] = fig_image
    model['report']=rb.get()

    return {'model': model}



