import os

import cv2
import pandas as pd
import numpy as np

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

class ImageClassificationOXFORD_IIIT_PET(ImageClassification):

    def __init__(self, datadir, mode='train', shuffle=True, level='species',
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        datadir = path_type_chk(datadir)
        assert os.path.exists(datadir), '{} not exists.'.format(datadir)
        
        imgdir = os.path.join(datadir, 'images')
        
        assert level in ['species', 'id', 'breed_cat', 'breed_dog'], \
            'Unknown key:{}. Choose one of {}.'.format(level, ['species', 'id', 'breed_cat', 'breed_dog'])
        
        assert mode in ['train', 'test'], \
            'Unknown key:{}. Choose one of {}.'.format(mode, ['train', 'test'])
        
        if mode == 'train':
            annfile = os.path.join(datadir, 'annotations', 'trainval.txt')
        elif mode == 'test':
            annfile = os.path.join(datadir, 'annotations', 'test.txt')
        
        data = pd.read_csv(annfile, sep='\s', names=['filename', 'id', 'species', 'breed_id'])
        
        files = ['{}.jpg'.format(filename) for filename in data['filename'].values]
        
        if level == 'species':
            labels = [idx-1 for idx in data['species'].values]
            n_classes = 2
            label_texts_list = [['dog' if filename[0].islower() else 'cat'] for filename in data['filename'].values]
        elif level == 'id':
            labels = [idx-1 for idx in data['id'].values]
            n_classes = 37
            label_texts_list = [['_'.join(filename.split('_')[:-1])] for filename in data['filename'].values]
        elif level == 'breed_cat':
            labels = [idx-1 for idx in data[data['species'] == 1]['breed_id'].values]
            n_classes = 25
            label_texts_list = [['_'.join(filename.split('_')[:-1])] for filename in data['filename'].values]
        elif level == 'breed_dog':
            labels = [idx-1 for idx in data[data['species'] == 1]['breed_id'].values]
            n_classes = 12
            label_texts_list = [['_'.join(filename.split('_')[:-1])] for filename in data['filename'].values]
        num_label_texts_list = [1]*len(files)
        
        ImageClassification.__init__(self, files, labels, label_texts_list, num_label_texts_list, shuffle, imgdir, retain_original_image, rgb, img_flag)
        self.labels = n_hot_encode(self.labels, n_classes)
