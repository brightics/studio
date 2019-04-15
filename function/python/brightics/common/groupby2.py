# -*- coding: utf-8 -*-
import traceback

import pandas as pd
import numpy as np

from brightics.common.repr import BrtcReprBuilder
from brightics.common.utils import time_usage


def _concat_two_list_elements(list):
    result = []
    for i in list:
        result += i
    return result
        


def _grouped_data(group_by, groups):
    grouped_data = {
        'data': dict(),
        'group_by': group_by,
        'groups': groups
    }
    for group in groups:
        grouped_data['data'][tuple(group)] = []
    return grouped_data



def _function_by_group2(function, table=None, model=None, columns=None, group_by=None, **params):
    if isinstance(model, dict) and '_grouped_data' not in model:
        raise Exception('Unsupported model. model requires _grouped_data.')
    if isinstance(model, dict):
        groups = model['_grouped_data']['groups']
        group_by = model['_grouped_data']['group_by']
    elif isinstance(table, pd.DataFrame):
        table, groups = _group(table, params, group_by)  # use group keys from table even there is a model.
    sample_result = _sample_result(function, table, model, params, groups)
    res_keys, df_keys, model_keys_containing_repr = _info_from_sample_result(sample_result, group_by, groups)
    res_dict, success_keys = _function_by_group_key(function, table, model, params, groups, res_keys, group_by)
    for repr_key in model_keys_containing_repr:
        rb = BrtcReprBuilder()
        for group in success_keys:
            rb.addMD('--- \n\n ### Group by {group_by} : {tmp_group}\n\n---'.format(group_by=group_by, tmp_group=group_key_dict[group]))
            rb.merge(res_dict[repr_key]['_grouped_data']['data'][group]['_repr_brtc_'])
        res_dict[repr_key]['_repr_brtc_'] = rb.get()
    for df_key in df_keys:
        res_dict[df_key] = _flatten(res_dict[df_key],groups, group_by, columns)
    return res_dict

@time_usage
def _group(table, params, group_by):
    groups = table[group_by].drop_duplicates().values
    res_dict = {
        '_grouped_data': _grouped_data(group_by=group_by, groups=groups)
    }
    temp_group_by_table = table[group_by].values
    temp_table = table.values
    for i in range(len(temp_table)):
        res_dict['_grouped_data']['data'][tuple(temp_group_by_table[i])].append(temp_table[i])
    return res_dict, groups

def _flatten(grouped_table, groups, group_by, columns):
    result1 = pd.DataFrame(_concat_two_list_elements([table for key, table in grouped_table['_grouped_data']['data'].items() if table is not None]),columns=columns)
    common_columns = [column for column in group_by if column in result1.columns]
    result2= []
    for key, table in grouped_table['_grouped_data']['data'].items():
        if table is not None:
            for i in range(len(table)):
                result2.append(key)
    result2 = pd.DataFrame(result2, columns = group_by)
    result2 = result2.drop(common_columns, axis=1)
    return pd.concat([result2,result1],axis=1)

def _sample_result(function, table, model, params, groups):
    #print( '_sample_result is running' )
    sample_result = None
    for sample_group in groups:
        #print( '_sample_result for group {} is running.'.format(sample_group) )
        try:
            sample_result = _run_function(function, table, model, params, sample_group)
            break
        except Exception:
            #print( '_sample_result got an exception while running for group {}.'.format(sample_group) )
            traceback.print_exc()

    if sample_result is None:
        raise Exception('Please check the dataset. All the sample run fails.')
    #print( '_sample_result finished.' )
    return sample_result  # if all the cases failed


def _function_by_group_key(function, table, model, params, groups, res_keys, group_by):
    #print( '_function_by_group_key is running' )
    res_dict = dict()
    for res_key in res_keys:
        res_dict[res_key] = {'_grouped_data': _grouped_data(group_by, dict())}
    success_keys = []
    for group in groups:  # todo try except
        #print( '_function_by_group_key for group {} is running.'.format(group_key) )
        try:
            res_group = _run_function(function, table, model, params, group)

            for res_key in res_keys:
                res_dict[res_key]['_grouped_data']['data'][tuple(group)] = res_group[res_key]

            success_keys.append(group)
        except Exception:
            #print( '_function_by_group_key got an exception while running for group {}.'.format(group_key) )
            traceback.print_exc()

    #print( '_function_by_group_key finished.' )
    return res_dict, success_keys


def _run_function(function, table, model, params, group):
    if table is not None and model is None:
        res_group = function(table=table['_grouped_data']['data'][tuple(group)], **params)
    elif table is not None and model is not None:
        res_group = function(table=table['_grouped_data']['data'][tuple(group)], model=model['_grouped_data']['data'][tuple(group)], **params)
    else:
        res_group = function(model=model['_grouped_data']['data'][tuple(group)], **params)

    return res_group


def _info_from_sample_result(sample_result, group_by, groups):
    res_keys = [*sample_result]
    df_keys = [k for k, v in sample_result.items() if isinstance(v, list)]
    model_keys_containing_repr = [k for k, v in sample_result.items()
                                  if isinstance(v, dict) and '_repr_brtc_' in v]
    return res_keys, df_keys, model_keys_containing_repr
