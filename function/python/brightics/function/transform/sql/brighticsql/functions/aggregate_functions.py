from collections import namedtuple
import numpy as np

aggfbase = namedtuple('aggfbase', ['fexp', 'func', 'ret_dtype'])

non_numeric_agg = {
    'COUNT': aggfbase('count', np.sum, np.dtype('int64')),
    'SIZE': aggfbase('count', np.size, np.dtype('int64'))
}

numeric_agg = {
    'AVG': aggfbase('avg', np.mean, np.dtype('float64')),
    'MAX': aggfbase('max', np.max, 'argdtype'),
    'MIN': aggfbase('min', np.min, 'argdtype'),
    'SUM': aggfbase('sum', np.sum, 'argdtype')
}

aggregate_functions = dict()
aggregate_functions.update(numeric_agg)
aggregate_functions.update(non_numeric_agg)
