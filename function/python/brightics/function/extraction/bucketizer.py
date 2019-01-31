import math
import numpy as np


def bucketizer(table, input_cols, radio_splits, bucket_type='left_closed', splits=None, splits_from=None, splits_to=None, splits_by=None, new_name=None):
    if radio_splits != 'array':
        i = splits_from
        if splits_by > 0:
            splits = [-math.inf]
            while i <= splits_to:
                splits += [i]
                i += splits_by
                i = round(i, 10)
            splits += [math.inf]
        else:
            splits = [math.inf]
            while i >= splits_to:
                splits += [i]
                i += splits_by
                i = round(i, 10)
            splits += [-math.inf]
            splits.reverse()
    else:
        splits.insert(0, -math.inf)
        splits += [math.inf]

    if new_name is None:
        new_name = input_cols + '_bucketed'
    out_table = table.copy()
    for i in range(len(splits) - 1):
        if bucket_type == 'left_closed':
            if i == 0:
                result = np.where(table[input_cols] < splits[i + 1], 0, 1)
            else:
                result += np.where(table[input_cols] < splits[i + 1], 0, 1)
        else:
            if i == 0:
                result = np.where(table[input_cols] <= splits[i + 1], 0, 1)
            else:
                result += np.where(table[input_cols] <= splits[i + 1], 0, 1)
    out_table[new_name] = result
    return {'out_table' : out_table}
