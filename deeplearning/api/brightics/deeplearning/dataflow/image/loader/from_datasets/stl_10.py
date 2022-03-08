import os

import numpy as np

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassificationIN_MEMORY
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

class ImageClassificationSTL_10(ImageClassificationIN_MEMORY):

    def __init__(self, datadir, mode='train', shuffle=True, retain_original_image=False):
        datadir = path_type_chk(datadir)
        if mode == 'train':
            x_path = os.path.join(datadir, 'stl10_binary', 'train_X.bin')
            y_path = os.path.join(datadir, 'stl10_binary', 'train_y.bin')
        else:
            x_path = os.path.join(datadir, 'stl10_binary', 'test_X.bin')
            y_path = os.path.join(datadir, 'stl10_binary', 'test_y.bin')
        
        class_names_path = os.path.join(datadir, 'stl10_binary', 'class_names.txt')

        with open(x_path, 'rb') as f:
            images = np.fromfile(f, dtype=np.uint8)
            images = np.reshape(images, (-1, 3, 96, 96))
            images = np.transpose(images, (0, 3, 2, 1))

        with open(y_path, 'rb') as f:
            labels = np.fromfile(f, dtype=np.uint8)
        labels = labels - 1
        
        with open(class_names_path, 'rb') as f:
            cls_names = f.read().decode().split('\n')
        num_label_texts_list = [1] * len(images)
        label_texts_list = [[cls_names[idx]] for idx in labels]
        
        ImageClassificationIN_MEMORY.__init__(self, images, labels, label_texts_list, num_label_texts_list, shuffle, retain_original_image)
        self.labels = n_hot_encode(self.labels, 10, False)

    
