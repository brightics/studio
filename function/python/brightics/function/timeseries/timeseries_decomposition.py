from brightics.common.repr import BrtcReprBuilder, strip_margin, plt2MD, \
    pandasDF2MD, keyValues2MD
from brightics.function.utils import _model_dict
from brightics.common.groupby import _function_by_group
from brightics.common.utils import check_required_parameters

import numpy as np
import pandas as pd
import statsmodels.api as sm
import warnings
import itertools
import matplotlib
import matplotlib.pyplot as plt

from pylab import rcParams

def timeseries_decomposition(table, group_by=None, **params):
    check_required_parameters(_timeseries_decomposition, params, ['table'])
    if group_by is not None:
        return _function_by_group(_timeseries_decomposition, table, group_by=group_by, **params)
    else:
        return _timeseries_decomposition(table, **params)
    
def _timeseries_decomposition(table, input_col, frequency, choice='additive', filteration=None, two_side=True, extrapolate_tren=0):
    out_table = table.copy()
 
    warnings.filterwarnings("ignore")
    plt.style.use('fivethirtyeight')
    matplotlib.rcParams['axes.labelsize'] = 14
    matplotlib.rcParams['xtick.labelsize'] = 12
    matplotlib.rcParams['ytick.labelsize'] = 12
    matplotlib.rcParams['text.color'] = 'k'
    rcParams['figure.figsize'] = 8.6, 6.4
    
    decomposition = sm.tsa.seasonal_decompose(out_table[input_col], model=choice, filt=filteration, freq=frequency, two_sided=two_side, extrapolate_trend=extrapolate_tren)
    fig = decomposition.plot()
    plt2 = plt2MD(plt)
    plt.clf()
    
    out_table['trendTSD'] = decomposition.trend
    out_table['seasonalTSD'] = decomposition.seasonal
    out_table['residualTSD'] = decomposition.resid
    
    rb = BrtcReprBuilder()
    rb.addMD(strip_margin("""
    | ## Time Series Decomposition Result
    | Model : {choice}
    |
    | {image2}
    |
    | 
    |
    """.format(choice=choice, image2=plt2)))
    
    model = _model_dict('timeseries_decomposition')
    model['model'] = choice
    model['_repr_brtc_'] = rb.get()
    
    return {'table':out_table, 'model':model}
