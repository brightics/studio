import hashlib

BRTC_CODE = hashlib.sha1('brightics-studio v1.0'.encode('utf-8')).hexdigest().encode() #83c78ba730ba09fa13c8559f2a616e887005e021
BRTC_CODE_SIZE = len(BRTC_CODE) # 40

import pandas as pd
import numpy as np

_numpy_logical_type_map = {
    np.bool_: 'bool',
    np.int8: 'int8',
    np.int16: 'int16',
    np.int32: 'int32',
    np.int64: 'int64',
    np.uint8: 'uint8',
    np.uint16: 'uint16',
    np.uint32: 'uint32',
    np.uint64: 'uint64',
    np.float32: 'float32',
    np.float64: 'float64',
    'datetime64[D]': 'date',
    np.unicode_: 'string',
    np.bytes_: 'bytes',
}

def get_logical_type_from_numpy(pandas_collection):
    try:
        return _numpy_logical_type_map[pandas_collection.dtype.type]
    except KeyError:
        if hasattr(pandas_collection.dtype, 'tz'):
            return 'datetimetz'
        # See https://github.com/pandas-dev/pandas/issues/24739
        if str(pandas_collection.dtype) == 'datetime64[ns]':
            return 'datetime64[ns]'
        result = infer_dtype(pandas_collection)
        return result


def infer_dtype(arr):
    tpe = pd.api.types.infer_dtype(arr)
    
    # todo image
    
    return tpe

