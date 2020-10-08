
import os

import numpy as np
import pandas as pd
 
 
def split_data(csvfile, weights,
               outfiles=None, header=None, encoding='utf-8', comment='#'):
    
    assert os.path.exists(csvfile), 'not found: {}'.format(csvfile)
    assert isinstance(weights, (list, str)), 'got {}.'.format(type(weights))
    
    if isinstance(weights, str):
        weights = np.array([float(weight) for weight in weights.split(sep=',')])
    else:
        weights = np.array(weights)
    
    assert all(weights > 0), 'all the weights must be positive but got {}'.format(weights)    
    weights = weights / sum(weights)
    cum_weights = weights.cumsum()
    
    if outfiles is None:
        filename, extension = os.path.splitext(csvfile)
        outfiles = [filename + '_{}'.format(idx) + extension for idx in range(len(weights))]
    else:
        outfiles = outfiles.split(',')
    
    assert len(outfiles) == len(weights), \
        'the length of outfiles({}) and the length of weights({}) are not the same.'.format(len(outfiles), len(weights))
    df = pd.read_csv(csvfile, header=header, encoding=encoding, comment=comment)
    rand = np.random.rand(df.shape[0])
    for idx, outfile in enumerate(outfiles):
        if idx == 0:
            df[rand < cum_weights[idx]].to_csv(outfile, header=None, index=None)
        else:
            df[(cum_weights[idx - 1] <= rand) * (rand < cum_weights[idx])].to_csv(outfile, header=None, index=None)
