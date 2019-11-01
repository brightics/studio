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

import ast
import pandas as pd
import numpy as np
import scipy
from brightics.common.utils import get_default_from_parameters_if_required
from brightics.common.utils import check_required_parameters
from brightics.common.exception import BrighticsFunctionException as BFE
from dtaidistance import dtw


def timeseries_distance(table, **params):
    params = get_default_from_parameters_if_required(params, _timeseries_distance)
    check_required_parameters(_timeseries_distance, params, ['table'])
    return _timeseries_distance(table, **params)


def _timeseries_distance(table, input_col_1, input_col_2, distance_type, alphabet=26, hold_cols=[]):
    temp_table = table.copy()
    if len(hold_cols) > 0:
        out_table = temp_table[hold_cols]
    else:
        out_table = pd.DataFrame()
    if table[input_col_1].dtype != table[input_col_2].dtype:
        raise BFE.from_errors([{'0100': 'Data types of two input timeseries must be the same.'}])
    if distance_type == 'Sax':
        if alphabet < 3 or alphabet > 26:
            raise BFE.from_errors(
                [{'0100': 'Alphabet must be between 3 and 26 if distance_type is Sax.'}])
        if not isinstance(table[input_col_1].loc[0], str):
            raise BFE.from_errors(
                [{'0100': 'Data types of input timeseries must be String if distance_type is Sax.'}])
        sax_obj = SAX(alphabetSize=alphabet)
    else:
        sax_obj = None
        if isinstance(table[input_col_1].loc[0], str):
            raise BFE.from_errors(
                [{'0100': 'Data types of input timeseries must be Array (Double) if distance_type is NOT Sax.'}])
    func = lambda x: ast.literal_eval(x)
    try:
        temp_table[input_col_1] = temp_table[input_col_1].apply(func)
        temp_table[input_col_2] = temp_table[input_col_2].apply(func)
    except:
        pass
    arr_1 = temp_table[input_col_1].values
    arr_2 = temp_table[input_col_2].values
    distance_list = compute_distance(arr_1, arr_2, distance_type, sax_obj)
    out_table['distance'] = distance_list
    return {'out_table':out_table}


def compute_distance(arr_1, arr_2, distance_type, sax_obj):
    if distance_type == 'Sax':
        distance_func = sax_obj.compare_strings
    elif distance_type == 'Dtw':
        distance_func = _dtw
    elif distance_type == 'Euclidean' or distance_type == 'EuclideanWithInterpolation':
        distance_func = _euclidean
    elif distance_type == 'Correlation':
        distance_func = _corr
    elif distance_type == 'L1Distance' or distance_type == 'L1DistanceWithInterpolation':
        distance_func = _l1
    distance_list = []
    for ind in range(len(arr_1)):
        temp_1 = np.array(arr_1[ind])
        temp_2 = np.array(arr_2[ind])
        if 'Interpolation' in distance_type:
            temp_1 = _interpolate(temp_1)
            temp_2 = _interpolate(temp_2)
        try:
            distance_list.append(distance_func(temp_1, temp_2))
        except:
            distance_list.append(np.nan)
    return distance_list


def _dtw(in_1, in_2):
    sim = dtw.distance(in_1, in_2)
    return sim


def _euclidean(in_1, in_2):
    return np.linalg.norm((in_1 - in_2), ord=2)


def _corr(in_1, in_2):
    return np.corrcoef(in_1, in_2)[0, 1]


def _interpolate(arr):
    return pd.Series(arr).interpolate().values


def _l1(in_1, in_2):
    return np.linalg.norm((in_1 - in_2), ord=1)


class SAX(object):

    def __init__(self, alphabetSize):
        self.aOffset = ord('a')
        self.alphabetSize = alphabetSize
        self.create_breakpoint()
        self.beta = self.breakpoints[str(self.alphabetSize)]
        self.build_letter_compare_dict()

    def compare_strings(self, sA, sB):
        list_letters_a = [x for x in str(sA)]
        list_letters_b = [x for x in str(sB)]
        mindist = 0.0
        for i in range(0, len(list_letters_a)):
            mindist += self.compareDict[list_letters_a[i] + list_letters_b[i]] ** 2
        mindist = np.sqrt(mindist)
        return mindist

    def build_letter_compare_dict(self):
        number_rep = range(0, self.alphabetSize)
        letters = [chr(x + self.aOffset) for x in number_rep]
        self.compareDict = {}
        for i in range(0, len(letters)):
            for j in range(0, len(letters)):
                if np.abs(number_rep[i] - number_rep[j]) <= 1:
                    self.compareDict[letters[i] + letters[j]] = 0
                else:
                    high_num = np.max([number_rep[i], number_rep[j]]) - 1
                    low_num = np.min([number_rep[i], number_rep[j]])
                    self.compareDict[letters[i] + letters[j]] = self.beta[high_num] - self.beta[low_num]

    def create_breakpoint(self):
        self.breakpoints = {}
        for i in range(3, 27):
            self.breakpoints[str(i)] = self.lookupEquiprobableRegions(i)

    def lookupEquiprobableRegions(self, word_length):
        regions = np.arange(0, word_length, 1) / word_length
        temp = scipy.stats.norm.ppf(regions)[1:].tolist()
        return temp
