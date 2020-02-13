import os

import cv2
import pandas as pd

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

class ImageClassificationFOOD_101(ImageClassification):

    def __init__(self, datadir, mode='train', shuffle=True,
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        datadir = path_type_chk(datadir)
        datadir = os.path.join(datadir, 'food-101')
        
        assert os.path.exists(datadir), '{} not exists.'.format(datadir)
        
        imgdir = os.path.join(datadir, 'images')
        
        assert mode in ['train', 'test'], \
            'Unknown key:{}. Choose one of {}.'.format(mode, ['train', 'test'])
        
        classes_file = os.path.join(datadir, 'meta', 'classes.txt')
        train_file = os.path.join(datadir, 'meta', 'train.txt')
        test_file = os.path.join(datadir, 'meta', 'test.txt')
        
        distinct_classes = pd.read_csv(classes_file,names=['data'])['data'].values
        class_idx = {name:i for i, name in enumerate(distinct_classes)}
        
        if mode == 'train':
            data = pd.read_csv(train_file,names=['data'])['data'].values
        elif mode == 'test':
            data = pd.read_csv(test_file,names=['data'])['data'].values
        
        files = ['{}.jpg'.format(line) for line in data]
        label_texts_list = [[line.split('/')[0]] for line in data]
        labels = [class_idx[label_texts[0]] for label_texts in label_texts_list]
        num_label_texts_list = [1]*len(files)
        
        ImageClassification.__init__(self, files, labels, label_texts_list, num_label_texts_list, shuffle, imgdir, retain_original_image, rgb, img_flag)
        self.labels = n_hot_encode(self.labels, 101)
