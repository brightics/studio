import os
import copy

import cv2
import pandas as pd

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

class ImageClassificationFGVC_AIRCRAFT(ImageClassification):

    def __init__(self, datadir, mode='train', shuffle=True, level='variant',
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        datadir = path_type_chk(datadir)
        datadir = os.path.join(datadir, 'fgvc-aircraft-2013b')
        
        assert os.path.exists(datadir), '{} not exists.'.format(datadir)
        
        imgdir = os.path.join(datadir, 'data', 'images')
        
        assert level in ['variant', 'manufacturer', 'family'], \
            'Unknown key:{}. Choose one of {}.'.format(level, ['variant', 'manufacturer', 'family'])
        
        assert mode in ['train', 'val', 'test'], \
            'Unknown key:{}. Choose one of {}.'.format(mode, ['train', 'val', 'test'])
        
        annfile = os.path.join(datadir, 'data', 'images_{}_{}.txt'.format(level, mode))
        
        family_classes = os.path.join(datadir, 'data', 'families.txt')
        manufacturer_classes = os.path.join(datadir, 'data', 'manufacturers.txt')
        variant_classes = os.path.join(datadir, 'data', 'variants.txt')
        
        data = pd.read_csv(annfile, names=['data'])['data'].values
        
        files = ['{}.jpg'.format(line.split(' ')[0]) for line in data]
        labels = [[' '.join(line.split(' ')[1:])] for line in data]

        if level == 'variant':
            unique_labels = pd.read_csv(variant_classes,names=['data'])['data'].values
            n_classes = 102
        elif level == 'family':
            unique_labels = pd.read_csv(family_classes,names=['data'])['data'].values
            n_classes = 70
        elif level == 'manufacturer':
            unique_labels = pd.read_csv(manufacturer_classes,names=['data'])['data'].values
            n_classes = 41
        
        class_idx = {name: i for i, name in enumerate(unique_labels)}
        label_texts_list = copy.deepcopy(labels)
        num_label_texts_list = [1]*len(files)
        labels = [class_idx[label[0]] for label in labels]
        
        ImageClassification.__init__(self, files, labels, label_texts_list, num_label_texts_list, shuffle, imgdir, retain_original_image, rgb, img_flag)
        self.labels = n_hot_encode(self.labels, n_classes)
