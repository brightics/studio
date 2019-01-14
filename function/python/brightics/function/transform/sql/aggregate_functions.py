# -*- coding: utf-8 -*-

import pickle
import numpy as np


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
