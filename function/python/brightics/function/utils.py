import pandas as pd
import numpy as np


def _model_dict(type):
    return {'_type':type, '_context':'python', '_version': 3.6}


def dataframe_to_md(table, n=20, precision=None, max_width=None):
    
    if precision is None:
        _table = table.copy()
    else:
        _table = table.copy().round(precision)
    
    COL_DIVIDER = '|'
    md_line = []
    
    cols = _table.columns
    types = _table.dtypes.values
    
    def getAlign(dtype):
        if np.issubdtype(dtype, np.number):
            return '--:'
        else:
            return ':--'
    
    def to_string(v, max_width=None):
        if not isinstance(v, str):
            return str(v)
        else:
            s = str(v)
            l = len(s)
            if max_width is None or max_width < 10 or l < max_width:
                return str(v)
            else:
                return s[0:max_width - 3] + '...'
    
    data = _table.values[:n]
    
    md_line.append(COL_DIVIDER + COL_DIVIDER.join(cols) + COL_DIVIDER)
    md_line.append(COL_DIVIDER + COL_DIVIDER.join([getAlign(dt) for dt in types]) + COL_DIVIDER)
    
    for row in data:
        md_line.append(COL_DIVIDER + COL_DIVIDER.join([to_string(c, max_width) for c in row]) + COL_DIVIDER)
        # for c in row:
            
    return '\n'.join(md_line)

# if __name__ == "__main__":
#     df = pd.DataFrame(np.random.random([1000,3]), columns=['A', 'B', 'C'])
#     df['D'] = 'A92083r5uawhef;awshed;fkawjs;dfkglasd'
#     print(dataframe_to_md(df, precision=6, max_width=20))
