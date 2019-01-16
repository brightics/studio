# -*- coding: utf-8 -*-
import traceback

import pandas as pd
import numpy as np

from brightics.common.repr import BrtcReprBuilder
from brightics.common.utils import time_usage

GROUP_KEY_SEP = '\u0002'


def _grouped_data(group_by, group_key_dict):
    grouped_data = {
        'data': dict(),
        'group_by': group_by,
        'group_key_dict': group_key_dict
    }
    return grouped_data


def _group_key_dict(group_keys, groups):  # todo
    group_key_dict = dict()
    for key, group in zip(group_keys, groups):
        if key not in group_key_dict:
            group_key_dict[key] = group

    return group_key_dict


@time_usage
def _function_by_group(function, table=None, model=None, group_by=None, **params):
    if table is None and model is None:
        raise Exception('This function requires at least one of a table or a model')

    if isinstance(table, pd.DataFrame) and model is None and group_by is None:
        raise Exception('This function requires group_by.')

    if isinstance(model, dict) and '_grouped_data' not in model:
        raise Exception('Unsupported model. model requires _grouped_data.')

    if isinstance(model, dict):
        group_key_dict = model['_grouped_data']['group_key_dict']
        group_by = model['_grouped_data']['group_by']

    if isinstance(table, pd.DataFrame):
        table, group_key_dict = _group(table, group_by)  # use group keys from table even there is a model.

    print('Number of groups: {}'.format(len(group_key_dict)))
    print('group_by: {}'.format(group_by))
    print('group_key_dict: {}'.format(group_key_dict))

    sample_result = _sample_result(function, table, model, params, group_key_dict)
    res_keys, df_keys, model_keys_containing_repr, res_dict = _info_from_sample_result(sample_result, group_by, group_key_dict)
    res_dict = _function_by_group_key(function, table, model, params, res_dict, group_key_dict, res_keys)

    for repr_key in model_keys_containing_repr:
        rb = BrtcReprBuilder()
        for group in group_key_dict:
            rb.addMD('{group}'.format(group=group))
            rb.merge(res_dict[repr_key]['_grouped_data']['data'][group]['_repr_brtc_'])
        res_dict[repr_key]['_repr_brtc_'] = rb.get()

    for df_key in df_keys:
        res_dict[df_key] = _flatten(res_dict[df_key])

    return res_dict


@time_usage
def _group(table, group_by):
    groups = table[group_by].drop_duplicates().values
    group_keys = np.array([_group_key_from_list(row) for row in groups])
    print(group_keys)
    # group_keys = np.apply_along_axis(_group_key_from_list, axis=1, arr=groups)
    group_key_dict = {k:v.tolist() for k, v in zip(group_keys, groups)}

    res_dict = {
        '_grouped_data': _grouped_data(group_by=group_by, group_key_dict=group_key_dict)
    }  # todo dict?

    for group_key in group_key_dict:
        print('GROUP_KEY', group_key)
        group_key_row = group_key_dict[group_key]
        temp_table = table
        for group_by_col, group in zip(group_by, group_key_row):
            temp_table = temp_table[temp_table[group_by_col]==group]

        data = temp_table.reset_index(drop=True)
        res_dict['_grouped_data']['data'][group_key] = data
    return res_dict, group_key_dict


def _flatten(grouped_table):
    group_cols = grouped_table['_grouped_data']['group_by']
    group_key_dict = grouped_table['_grouped_data']['group_key_dict']
    return pd.concat([_add_group_cols_front_if_required(v, k, group_cols, group_key_dict)
                      for k, v in grouped_table['_grouped_data']['data'].items() if v is not None],
                      ignore_index=True, sort=False)


@time_usage
def _sample_result(function, table, model, params, group_key_dict):
    print( '_sample_result is running' )
    for sample_group in group_key_dict:
        try:
            print( '_sample_result for group {} is running.'.format(sample_group) )
            sample_result = _run_function(function, table, model, params, sample_group)
            break
        except Exception:
            traceback.print_exc()

    print( '_sample_result finished.' )
    return sample_result  # if all the cases failed


def _function_by_group_key(function, table, model, params, res_dict, group_key_dict, res_keys):
    for group_key in group_key_dict:  # todo try except
        res_group = _run_function(function, table, model, params, group_key)

        for res_key in res_keys:
            res_dict[res_key]['_grouped_data']['data'][group_key] = res_group[res_key]

    return res_dict


def _run_function(function, table, model, params, group):
    print(group)
    print(type(group))
    print(table['_grouped_data']['data'].keys())
    print(table['_grouped_data']['data'][group])
    if table is not None and model is None:
        res_group = function(table=table['_grouped_data']['data'][group], **params)
    elif table is not None and model is not None:
        res_group = function(table=table['_grouped_data']['data'][group],
                                    model=model['_grouped_data']['data'][group], **params)
    else:
        res_group = function(model=model['_grouped_data']['data'][group], **params)

    return res_group


def _info_from_sample_result(sample_result, group_by, group_key_dict):
    res_keys = [*sample_result]
    df_keys = [k for k, v in sample_result.items() if isinstance(v, pd.DataFrame)]
    model_keys_containing_repr = [k for k, v in sample_result.items()
                                  if isinstance(v, dict) and '_repr_brtc_' in v]
    res_dict = dict()
    for res_key in res_keys:
        res_dict[res_key] = {'_grouped_data': _grouped_data(group_by, group_key_dict)}
    return res_keys, df_keys, model_keys_containing_repr, res_dict


def _group_key_from_list(list_):
    return GROUP_KEY_SEP.join([str(item) for item in list_])


def _add_group_cols_front_if_required(table, keys, group_cols, group_key_dict):
    reverse_keys = group_key_dict[keys]  # todo
    reverse_keys.reverse()
    columns = table.columns
    reverse_group_cols = group_cols.copy()
    reverse_group_cols.reverse()

    for group_col, key in zip(reverse_group_cols, reverse_keys):
        if group_col not in columns:
            table.insert(0, group_col, key)

    return table
