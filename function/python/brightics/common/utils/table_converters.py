import pandas as pd
import re


def _replace_col_name(col_name):
    if col_name == '':
        return 'unnamed'
    else:
        return re.sub('[ ,;{}()\n\t=]', '_', col_name)


def _replace_column_names(col_name_list):
    if col_name_list is None:
        return None
    else:
        return [_replace_col_name(col_name) for col_name in col_name_list]


def _header(simple_table):
    if simple_table[0].datatype == 'header':
        return simple_table[0].data
    else:
        return None


def _to_float(df):
    for col in df.columns:
        try:
            df = df.astype({col:float})
        except:
            pass
        
    return df


def simple_tables2df_list(simple_tables):
    table_list = []
    for simple_table in simple_tables:
        header = _replace_column_names(_header(simple_table))
        print(header)
        if header is not None:
            data = [row.data for row in simple_table[1:]]
            table_list.append(_to_float(pd.DataFrame(data, columns=header)))
        else:
            data = [row.data for row in simple_table]
            table_list.append(_to_float(pd.DataFrame(data)))
        
    return table_list