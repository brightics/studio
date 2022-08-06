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

import multiprocessing
import itertools
from functools import partial
import numpy as np
import pandas as pd
import matplotlib

from pkg_resources import resource_filename
import pandas_profiling.formatters as formatters
import pandas_profiling.base as base
# from pandas_profiling.plot import histogram, mini_histogram

from pandas_profiling.describe import multiprocess_func


def describe_fix(df, bins=10, check_correlation=True, correlation_threshold=0.9, correlation_overrides=None, check_recoded=False, pool_size=1, **kwargs):
    """Generates a dict containing summary statistics for a given dataset stored as a pandas `DataFrame`.

    Used has is it will output its content as an HTML report in a Jupyter notebook.

    Parameters
    ----------
    df : DataFrame
        Data to be analyzed
    bins : int
        Number of bins in histogram.
        The default is 10.
    check_correlation : boolean
        Whether or not to check correlation.
        It's `True` by default.
    correlation_threshold: float
        Threshold to determine if the variable pair is correlated.
        The default is 0.9.
    correlation_overrides : list
        Variable names not to be rejected because they are correlated.
        There is no variable in the list (`None`) by default.
    check_recoded : boolean
        Whether or not to check recoded correlation (memory heavy feature).
        Since it's an expensive computation it can be activated for small datasets.
        `check_correlation` must be true to disable this check.
        It's `False` by default.
    pool_size : int
        Number of workers in thread pool
        The default is equal to the number of CPU.

    Returns
    -------
    dict
        Containing the following keys:
            * table: general statistics on the dataset
            * variables: summary statistics for each variable
            * freq: frequency table

    Notes:
    ------
        * The section dedicated to check the correlation should be externalized
    """

    if not isinstance(df, pd.DataFrame):
        raise TypeError("df must be of type pandas.DataFrame")
    if df.empty:
        raise ValueError("df can not be empty")

    try:
        # reset matplotlib style before use
        # Fails in matplotlib 1.4.x so plot might look bad
        matplotlib.style.use("default")
    except:
        pass

    matplotlib.style.use(resource_filename(__name__, "pandas_profiling.mplstyle"))

    # Clearing the cache before computing stats
    base.clear_cache()

    if not pd.Index(np.arange(0, len(df))).equals(df.index):
        # Treat index as any other column
        df = df.reset_index()

    # Describe all variables in a univariate way
    # pool = multiprocessing.Pool(pool_size)
    # local_multiprocess_func = partial(multiprocess_func, **kwargs)
    # ldesc = {col: s for col, s in pool.map(local_multiprocess_func, df.iteritems())}
    # pool.close()

    local_multiprocess_func = partial(multiprocess_func, **kwargs)
    ldesc = {}
    for x in df.iteritems():
        col, data = local_multiprocess_func(x)
        ldesc[col] = data

    # Get correlations
    dfcorrPear = df.corr(method="pearson")
    dfcorrSpear = df.corr(method="spearman")

    # Check correlations between variable
    if check_correlation is True:
        ''' TODO: corr(x,y) > 0.9 and corr(y,z) > 0.9 does not imply corr(x,z) > 0.9
        If x~y and y~z but not x~z, it would be better to delete only y
        Better way would be to find out which variable causes the highest increase in multicollinearity.
        '''
        corr = dfcorrPear.copy()
        for x, corr_x in corr.iterrows():
            if correlation_overrides and x in correlation_overrides:
                continue

            for y, corr in corr_x.iteritems():
                if x == y: break

                if corr > correlation_threshold:
                    ldesc[x] = pd.Series(['CORR', y, corr], index=['type', 'correlation_var', 'correlation'])

        if check_recoded:
            categorical_variables = [(name, data) for (name, data) in df.iteritems() if base.get_vartype(data)=='CAT']
            for (name1, data1), (name2, data2) in itertools.combinations(categorical_variables, 2):
                if correlation_overrides and name1 in correlation_overrides:
                    continue

                confusion_matrix=pd.crosstab(data1,data2)
                if confusion_matrix.values.diagonal().sum() == len(df):
                    ldesc[name1] = pd.Series(['RECODED', name2], index=['type', 'correlation_var'])

    # Convert ldesc to a DataFrame
    names = []
    ldesc_indexes = sorted([x.index for x in ldesc.values()], key=len)
    for idxnames in ldesc_indexes:
        for name in idxnames:
            if name not in names:
                names.append(name)

    variable_stats = pd.concat(ldesc, axis=1).reindex(pd.Index(names))
    variable_stats.columns.names = df.columns.names

    # General statistics
    table_stats = {}

    table_stats['n'] = len(df)
    table_stats['nvar'] = len(df.columns)
    table_stats['total_missing'] = variable_stats.loc['n_missing'].sum() / (table_stats['n'] * table_stats['nvar'])
    unsupported_columns = variable_stats.transpose()[variable_stats.transpose().type != base.S_TYPE_UNSUPPORTED].index.tolist()
    table_stats['n_duplicates'] = sum(df.duplicated(subset=unsupported_columns)) if len(unsupported_columns) > 0 else 0

    memsize = df.memory_usage(index=True).sum()
    table_stats['memsize'] = formatters.fmt_bytesize(memsize)
    table_stats['recordsize'] = formatters.fmt_bytesize(memsize / table_stats['n'])

    table_stats.update({k: 0 for k in ("NUM", "DATE", "CONST", "CAT", "UNIQUE", "CORR", "RECODED", "BOOL", "UNSUPPORTED")})
    table_stats.update(dict(variable_stats.loc['type'].value_counts()))
    table_stats['REJECTED'] = table_stats['CONST'] + table_stats['CORR'] + table_stats['RECODED']

    return {
        'table': table_stats,
        'variables': variable_stats.T,
        'freq': {k: (base.get_groupby_statistic(df[k])[0] if variable_stats[k].type != base.S_TYPE_UNSUPPORTED else None) for k in df.columns},
        'correlations': {'pearson': dfcorrPear, 'spearman': dfcorrSpear}
    }
