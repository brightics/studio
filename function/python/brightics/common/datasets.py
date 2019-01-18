import pandas as pd
import os
from sklearn.datasets import load_iris as sklearn_load_iris

TESTDATA_RELATIVEPATH = '''/../../../sample_data'''

_PATH_PARQUET = os.path.abspath(os.path.dirname(os.path.abspath(__file__)) + TESTDATA_RELATIVEPATH)
_PATH_FORMAT_PARQUET = _PATH_PARQUET + '''/{}'''


def load_dataset(fname):
    return pd.read_parquet(_PATH_FORMAT_PARQUET.format(fname), engine='auto')


def save_dataset(table, fname):
    _make_dir(_PATH_PARQUET)
    pd.DataFrame(table).to_parquet(_PATH_FORMAT_PARQUET.format(fname), engine='auto', compression='snappy')


def load_iris():
    return load_dataset('iris')


def _make_dir(path):
    if not os.path.exists(path):
        os.mkdir(path)


def _load_iris_sklearn():
    raw_data = sklearn_load_iris()
    out_data = pd.DataFrame(data=raw_data.data, columns=['sepal_length', 'sepal_width', 'petal_length', 'petal_width'])
    out_data['species'] = [raw_data.target_names[x] for x in raw_data.target]
    return out_data

# REPOSITORY_CSV = REPOSITORY_TESTDATA + '''/csv'''
# _PATH_FORMAT_CSV = REPOSITORY_CSV + '''/{}.csv'''
# def _load_dataset_csv(fname, _sep=',', _quotechar='"'):
#     return pd.read_csv(_PATH_FORMAT_CSV.format(fname), sep=_sep, quotechar=_quotechar)
# def _save_dataset_csv(table, fname, _sep=',', _quotechar='"', _index=False):
#     _make_dir(REPOSITORY_CSV)
#     pd.DataFrame(table).to_csv(_PATH_FORMAT_CSV.format(fname), sep=_sep, quotechar=_quotechar, index=_index)

# if __name__ == '__main__':
#     print(_PATH_PARQUET)
#     save_dataset(_load_iris_sklearn(), 'iris')
#     
#     iris1 = load_dataset('iris')
#     print(iris1)
#     
#     iris3 = load_iris()
#     print(iris3)


