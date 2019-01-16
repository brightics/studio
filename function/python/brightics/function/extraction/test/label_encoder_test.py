import unittest
from brightics.function.extraction.encoder import label_encoder, \
    label_encoder_model
from brightics.function.test_data import get_iris
import random


def get_iris_randomgroup():
    df = get_iris()
    random_group1 = []
    random_group2 = []
    random_group2_map = {1:'A', 2:'B'}
    for i in range(len(df)):
      random_group1.append(random.randint(1, 2))
      random_group2.append(random_group2_map[random.randint(1, 2)])
    df['random_group1'] = random_group1
    df['random_group2'] = random_group2
    return df


class LabelEncoderTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris_randomgroup()
        enc_out = label_encoder(df, input_col='species', group_by=['random_group1', 'random_group2'])
        print(enc_out['out_table'])
        print(enc_out['model'].keys())
        model_out = label_encoder_model(df, enc_out['model'])
        print(model_out['out_table'])
        
