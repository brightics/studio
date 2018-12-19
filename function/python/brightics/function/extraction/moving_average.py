import pandas as pd
import numpy as np
import statsmodels.tsa.filters.filtertools as sm


def ewma(table, input_cols, ratio_type, custom_ratio=0.5, period_number=1):
    out_table = table.copy()

    def ewma(column):
        result_col = []
        for i in range(0, period_number - 1):
            result_col.append(None)
        result_col.append(np.mean(out_table[column][0:period_number]))

        if ratio_type == 'custom':
            ratio = custom_ratio
        elif ratio_type == 'exp_smoothing':
            ratio = 2 / (period_number + 1)
        else:
            ratio = 1 / period_number

        for i in range(period_number, len(out_table[column] + period_number - 1)):
            result_col.append(ratio * out_table[column][i] + (1 - ratio) * result_col[i - 1])
        return result_col

    for column in input_cols:
        out_table[column + '_EWMA'] = ewma(column)
    return{'out_table':out_table}


def moving_average(table, input_cols, window_size=1, weights=None, mode='past_values_only', equal_weights=True):
    out_table = table.copy()
    nsides = 1
    if mode == 'centered_moving_average':
        nsides = 2
    if equal_weights == True:
        weights = np.ones(window_size)
    for column in input_cols:
        out_table[column + '_MA'] = sm.convolution_filter(out_table[column], weights, nsides) / sum(weights)
    return{'out_table':out_table}
