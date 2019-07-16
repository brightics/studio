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

import pandas as pd
import numpy as np
import scipy.stats 

# NOTE: all parameter 'a' is assumed as array-like


def max(a): return np.nanmax(a)


def min(a): return np.nanmin(a)


def range(a): return np.nanmax(a) - np.nanmin(a)


def sum(a): return np.nansum(a)


def mean(a): return np.nanmean(a)


def var(a): return np.nanvar(a)


def var_samp(a): return np.nanvar(a, ddof=1)


def std(a): return np.nanstd(a)


def skewness(a): return scipy.stats.skew(a, nan_policy = 'omit').tolist()


def kurtosis(a): return scipy.stats.kurtosis(a, nan_policy = 'omit')


def median(a): return np.median(a)


def percentile(a, q): return np.percentile(a, q)


def trimmed_mean(a, proportiontocut): return scipy.stats.trim_mean(a, proportiontocut)


def iqr(a): return scipy.stats.iqr(a)


def q1(a): return np.percentile(a, 25)


def q3(a): return np.percentile(a, 75)


def mode(a):
    a = np.array(a)
    a = a[np.where(~pd.isnull(a))]
    vals, cnts = np.unique(a, return_counts=True)
    return vals[cnts.argmax()]


def num_row(a): return len(a)


def num_value(a): return np.count_nonzero(~pd.isnull(a))


def num_nan(a): return np.count_nonzero([x is np.nan for x in a])


def num_nullonly(a): return np.count_nonzero([x is None for x in a])


def num_null(a): return np.count_nonzero(pd.isnull(a))


def num_distinct(a): return np.count_nonzero(np.unique(a))
