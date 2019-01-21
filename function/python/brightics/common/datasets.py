import pandas as pd
import numpy as np
import random
import os
from sklearn.datasets import load_iris as sklearn_load_iris

TESTDATA_RELATIVEPATH = '''/../../../sample_data'''

_PATH_PARQUET = os.path.abspath(os.path.dirname(os.path.abspath(__file__)) +
                                TESTDATA_RELATIVEPATH)
_PATH_FORMAT_PARQUET = _PATH_PARQUET + '''/{}'''


def load_dataset(fname):
    return pd.read_parquet(_PATH_FORMAT_PARQUET.format(fname), engine='auto')


def save_dataset(table, fname):
    _make_dir(_PATH_PARQUET)
    pd.DataFrame(table).to_parquet(_PATH_FORMAT_PARQUET.format(fname),
                                   engine='auto', compression='snappy')


def load_random_table(columns, seed=None, data_size=20, add_index=True):

    npr = np.random.RandomState(seed)
    random.seed(seed)

    col_info = {}
    if add_index:
        col_info['index'] = np.arange(1, data_size + 1, step=1)

    for c in columns:
        if c['type'] == 'int':
            col_info[c['name']] = npr.random_integers(
                low=c['min_value'], high=c['max_value'], size=data_size)
        elif c['type'] == 'float':
            col_info[c['name']] = (npr.random_sample(size=data_size)
                                   * (c['max_value'] - c['min_value'])
                                   + c['min_value'])
        elif c['type'] == 'category':
            col_info[c['name']] = random.choices(population=c['population'],
                                                 k=data_size)
        elif c['type'] == 'string':
            col_info[c['name']] = [_get_randstring(c['population'],
                                                   c['min_length'],
                                                   c['max_length'])
                                   for _ in range(0, data_size)]

    data = pd.DataFrame(data=col_info)
    return data


def load_iris():
    return load_dataset('iris')


def _make_dir(path):
    if not os.path.exists(path):
        os.mkdir(path)


def _load_iris_sklearn():
    raw_data = sklearn_load_iris()
    out_data = pd.DataFrame(data=raw_data.data,
                            columns=['sepal_length', 'sepal_width',
                                     'petal_length', 'petal_width'])
    out_data['species'] = [raw_data.target_names[x] for x in raw_data.target]
    return out_data


def _get_randstring(population, min_length, max_length):
    return ''.join(random.choices(population,
                                  k=random.randint(min_length, max_length)))

# REPOSITORY_CSV = REPOSITORY_TESTDATA + '''/csv'''
# _PATH_FORMAT_CSV = REPOSITORY_CSV + '''/{}.csv'''
# def _load_dataset_csv(fname, _sep=',', _quotechar='"'):
#     return pd.read_csv(_PATH_FORMAT_CSV.format(fname), sep=_sep, quotechar=_quotechar)
# def _save_dataset_csv(table, fname, _sep=',', _quotechar='"', _index=False):
#     _make_dir(REPOSITORY_CSV)
#     pd.DataFrame(table).to_csv(_PATH_FORMAT_CSV.format(fname), sep=_sep, quotechar=_quotechar, index=_index)
