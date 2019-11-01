from multiprocessing import Pool
import numpy as np
import pandas as pd


def apply_list(args):
    df, func, kwargs = args
    kwargs['table']=df
    return func(**kwargs)



def apply_by_multiprocessing_list_to_list(df, func, **kwargs):
    workers = kwargs.pop('workers')
    pool = Pool(processes=workers)
    result = pool.map(apply_list, [(d, func, kwargs) for d in np.array_split(df, workers)])
    pool.close()
    return result