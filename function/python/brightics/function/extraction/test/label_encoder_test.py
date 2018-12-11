import unittest
from brightics.function.extraction.encoder import label_encoder,\
    label_encoder_model
from brightics.function.test_data import get_iris
import random


class LabelEncoderTest(unittest.TestCase):
    
    def groupby1(self):
        df = get_iris()
        random_group = []
        for i in range(len(df)):
            random_group.append(random.randint(1, 2))
        df['random_group'] = random_group
        enc_out = label_encoder(df, input_col='species', group_by=['random_group'])
        print(enc_out['out_table'])
        print(enc_out['model'].keys())
        model_out = label_encoder_model(df, enc_out['model'])
        print(model_out['out_table'])
        
