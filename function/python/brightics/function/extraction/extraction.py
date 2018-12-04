import pandas as pd
import numpy as np


def add_row_number(table, new_col='add_row_number'):

    df = pd.DataFrame()
    n = len(table)

    for i in range(1, n + 1):
        df2 = pd.DataFrame([{new_col:i}])
        df = df.append(df2, ignore_index=True)
    out_table = pd.concat([df, table], axis=1)
    return {'out_table': out_table}


def discretize_quantile(table, input_col, num_of_buckets, bucket_opt='False', out_col_name='bucket_number'):
    buckets = table[input_col].quantile(np.linspace(1 / num_of_buckets, 1, num_of_buckets))
    if bucket_opt == 'True':
        out_col = pd.DataFrame(np.digitize(table[input_col], buckets, right=True), columns={out_col_name})
    else:
        out_col = pd.DataFrame(np.digitize(table[input_col], buckets, right=False), columns={out_col_name})
    out_table = pd.concat([table, out_col], axis=1)
    return {'out_table': out_table}
