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

import numpy as np
import brightics.common.statistics as brtc_stats
from .serializer import _serialize


class Variance(object):
    name = 'variance'

    def __init__(self):
        self.n = 0
        self.curr_mean = 0
        self.curr_m2 = 0

    def step(self, value):
        n1 = self.n
        self.n += 1
        delta = value - self.curr_mean
        delta_n = delta / self.n
        term1 = delta * delta_n * n1
        
        self.curr_mean += delta_n
        self.curr_m2 += term1
    
    def finalize(self):
        return self.curr_m2 / self.n


class VarPop(Variance):
    name = 'var_pop'

    
class VarSamp(Variance):
    name = 'var_samp'
    
    def finalize(self):
        return self.curr_m2 / (self.n - 1)


class StddevPop(Variance):
    name = 'stddev_pop'
    
    def finalize(self):
        return np.sqrt(self.curr_m2 / self.n)

    
class StddevSamp(Variance):
    name = 'stddev_samp'
    
    def finalize(self):
        return np.sqrt(self.curr_m2 / (self.n - 1))


class Covariance(object):
    name = 'covar_pop'

    def __init__(self):
        self.n = 0
        self.c = 0
        self.meanx = 0
        self.meany = 0
        
    def step(self, x, y):
        self.n += 1
        dx = x - self.meanx
        self.meanx += dx / self.n
        self.meany += (y - self.meany) / self.n
        self.c += dx * (y - self.meany)

    def finalize(self):
        return self.c / self.n
    
    
class CovarSamp(Covariance):
    name = 'covar_samp'
    
    def finalize(self):
        return self.c / (self.n - 1)
    
    
class Percentile(object): 
    name = 'percentile'

    def __init__(self):
        self.data = []
        
    def step(self, x, p):
        self.data.append(x)
        self.p = p

    def finalize(self):
        return brtc_stats.percentile(self.data, self.p)
    
    
class CollectList(object):
    name = 'collect_list'
    
    def __init__(self):
        self.data = []
        
    def step(self, x):
        self.data.append(x)

    def finalize(self):
        return _serialize(np.array(self.data))


class CollectSet(object):
    name = 'collect_set'
    
    def __init__(self):
        self.data = []
        
    def step(self, x):
        self.data.append(x)

    def finalize(self):
        return _serialize(np.unique(np.array(self.data)))
