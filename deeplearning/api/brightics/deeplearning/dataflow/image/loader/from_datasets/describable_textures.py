import os
import itertools

import cv2
import pandas as pd

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.preprocessing.create_csvfile_from_directory import WHITE_LIST_FORMATS, \
    _get_valid_files, _get_valid_classes
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

class ImageClassificationDTD(ImageClassification):

    def __init__(self, datadir, mode='train', shuffle=True, set_n=1,
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        datadir = path_type_chk(datadir)
        datadir = os.path.join(datadir, 'dtd')
        
        assert os.path.exists(datadir), '{} not exists.'.format(datadir)
        
        imgdir = os.path.join(datadir, 'images')
        labeldir = os.path.join(datadir, 'labels')
        
        labelfile = os.path.join(labeldir, '{}{}.txt'.format(mode,set_n))
        
        assert os.path.exists(labelfile), '{} not exists.'.format(labelfile)
        
        valid_classes = _get_valid_classes(imgdir, WHITE_LIST_FORMATS)
        class_idx = {name: i for i, name in enumerate(valid_classes)}
        
        files = pd.read_csv(labelfile, names=['filename'])['filename'].values
        labels = [class_idx[filename.split('/')[0]] for filename in files]
        
        label_texts_list = [[filename.split('/')[0]] for filename in files]
        num_label_texts_list = [1]*len(files)
        
        ImageClassification.__init__(self, files, labels, label_texts_list, num_label_texts_list, shuffle, imgdir, retain_original_image, rgb, img_flag)
        self.labels = n_hot_encode(self.labels, 47)
