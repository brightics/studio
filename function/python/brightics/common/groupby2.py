"""
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

# -*- coding: utf-8 -*-
import traceback

import pandas as pd
import numpy as np

from brightics.common.repr import BrtcReprBuilder
from brightics.common.utils import time_usage
from multiprocessing import Pool


def apply_list(args):
    df, func, kwargs = args
    kwargs['groups']=df
    return func(**kwargs)



def apply_by_multiprocessing_list_to_list(df, func, **kwargs):
    workers = kwargs.pop('workers')
    pool = Pool(processes=workers)
    result = pool.map(apply_list, [(d, func, kwargs) for d in np.array_split(df, workers)])
    pool.close()
    return result

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
    if 'workers' in params:
        workers = params.pop('workers')
    else:
        workers = 1
    if isinstance(model, dict) and '_grouped_data' not in model:
        raise Exception('Unsupported model. model requires _grouped_data.')
    if isinstance(model, dict):
        groups = model['_grouped_data']['groups']
        group_by = model['_grouped_data']['group_by']
    if isinstance(table, pd.DataFrame):
        table, groups = _group(table, params, group_by)  # use group keys from table even there is a model.
    sample_result = _sample_result(function, table, model, params, groups)
    res_keys, df_keys, model_keys_containing_repr = _info_from_sample_result(sample_result, group_by, groups)
    if workers ==1:
        res_dict, success_keys = _function_by_group_key(function, table, model, params, groups, res_keys, group_by)
    else:
        res_dict, success_keys = _function_by_group_key2(function, table, model, params, groups, res_keys, group_by, workers)
    for repr_key in model_keys_containing_repr:
        rb = BrtcReprBuilder()
        for group in success_keys:
            rb.addMD('--- \n\n ### Group by {group_by} : {tmp_group}\n\n---'.format(group_by=group_by, tmp_group=group))
            rb.merge(res_dict[repr_key]['_grouped_data']['data'][tuple(group)]['_repr_brtc_'])
        res_dict[repr_key]['_repr_brtc_'] = rb.get()
    for df_key in df_keys:
        res_dict[df_key] = _flatten(res_dict[df_key],groups, group_by, columns)
    return res_dict

@time_usage
def _group(table, params, group_by):
    if True in pd.isnull(table[group_by]).values:
        table[group_by] = table[group_by].fillna('\u0002')
    groups = table[group_by].drop_duplicates().values
    res_dict = {
        '_grouped_data': _grouped_data(group_by=group_by, groups=groups)
    }
    temp_group_by_table = table[group_by].values
    temp_table = table.values
    for i in range(len(temp_table)):
        res_dict['_grouped_data']['data'][tuple(temp_group_by_table[i])].append(list(temp_table[i]))
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
    if '\u0002' in result2.values:
        result2 = result2.replace('\u0002',np.nan)
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
        res_dict[res_key] = {'_grouped_data': _grouped_data(group_by, groups)}
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

def _function_by_group_key2(function, table, model, params, groups, res_keys, group_by, workers):
    #print( '_function_by_group_key is running' )
    res_dict = dict()
    for res_key in res_keys:
        res_dict[res_key] = {'_grouped_data': _grouped_data(group_by, groups)}
    #start=time.time()
    result = apply_by_multiprocessing_list_to_list(groups,_function_by_group_key_multi,workers=workers,function=function, table=table, model=model, params=params)
    #print(time.time()-start)
    success_keys = []
    success_results = []
    for elem in result:
        success_keys+=elem[0]
        success_results+=elem[1]
    for i in range(len(success_keys)):        
        for res_key in res_keys:
            res_dict[res_key]['_grouped_data']['data'][tuple(success_keys[i])] = success_results[i][res_key]
    #print( '_function_by_group_key finished.' )
    return res_dict, success_keys

def _function_by_group_key_multi(function, table, model, params, groups):
    success_keys=[]
    success_results=[]
    for group in groups:  # todo try except
    #print( '_function_by_group_key for group {} is running.'.format(group_key) )
        try:
            success_results.append(_run_function(function, table, model, params, group))
            success_keys.append(group)
        except Exception:
            #print( '_function_by_group_key got an exception while running for group {}.'.format(group_key) )
            traceback.print_exc()
    return success_keys, success_results


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
