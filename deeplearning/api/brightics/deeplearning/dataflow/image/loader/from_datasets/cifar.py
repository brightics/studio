import os
import pickle

import numpy as np

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassificationIN_MEMORY
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

class ImageClassificationCIFAR_100(ImageClassificationIN_MEMORY):
    def __init__(self, datadir, mode='train', fine_labels=True, shuffle=True, retain_original_image=False):
        datadir = path_type_chk(datadir)
        binarydir = os.path.join(datadir, 'cifar-100-python')
        
        assert os.path.exists(binarydir), '{} not exists.'.format(binarydir)
        
        meta_file = os.path.join(binarydir, 'meta')
        if mode == 'train':
            binary_file = os.path.join(binarydir, 'train')
            IMG_NUM = 50000
        elif mode == 'test':
            binary_file = os.path.join(binarydir, 'test')
            IMG_NUM = 10000
        else:
            raise Exception('Unknown key:{}. Choose one of {}.'.format(mode, ['train', 'test']))
            
        with open(binary_file, 'rb') as f:
            data = pickle.load(f, encoding='bytes')
        with open(meta_file, 'rb') as f:
            meta = pickle.load(f, encoding='bytes')
        
        
        images = []
        for k in range(IMG_NUM):
            img = data[b'data'][k].reshape(3, 32, 32)
            img = np.transpose(img, [1, 2, 0])
            images.append(img)
            
        if fine_labels:
            labels = data[b'fine_labels']
            label_name = [byte_name.decode() for byte_name in meta[b'fine_label_names']]
        else:
            labels = data[b'coarse_labels']
            label_name = [byte_name.decode() for byte_name in meta[b'coarse_label_names']]
        
        label_texts_list = [[label_name[label_idx]] for label_idx in labels]
        num_label_texts_list = [1]*len(images)
        
        ImageClassificationIN_MEMORY.__init__(self, images, labels, label_texts_list, num_label_texts_list, shuffle, retain_original_image)
        if fine_labels:
            self.labels = n_hot_encode(self.labels, 100, False)
        else:
            self.labels = n_hot_encode(self.labels, 20, False)


class ImageClassificationCIFAR_10(ImageClassificationIN_MEMORY):

    def __init__(self, datadir, mode='train', shuffle=True, retain_original_image=False):
        datadir = path_type_chk(datadir)
        binarydir = os.path.join(datadir, 'cifar-10-batches-py')
        
        assert os.path.exists(binarydir), '{} not exists.'.format(binarydir)
        
        images = []
        labels = []
        if mode == 'train':
            binary_files = [os.path.join(binarydir, 'data_batch_{}'.format(i + 1)) for i in range(5)]
        elif mode == 'test':
            binary_files = [os.path.join(binarydir, 'test_batch')]
        else:
            raise Exception('Unknown key:{}. Choose one of {}.'.format(mode, ['train', 'test']))
        
        meta_file = os.path.join(binarydir, 'batches.meta')
        with open(meta_file, 'rb') as f:
            meta = pickle.load(f, encoding='bytes')
            
        for binary_file in binary_files:
            with open(binary_file, 'rb') as f:
                data = pickle.load(f, encoding='bytes')
            
            for k in range(10000):
                img = data[b'data'][k].reshape(3, 32, 32)
                img = np.transpose(img, [1, 2, 0])
                images.append(img)
            
            labels.extend(data[b'labels'])
        
        label_name = [byte_name.decode() for byte_name in meta[b'label_names']]
        label_texts_list = [[label_name[label_idx]] for label_idx in labels]
        num_label_texts_list = [1]*len(images)
        
        ImageClassificationIN_MEMORY.__init__(self, images, labels, label_texts_list, num_label_texts_list, shuffle, retain_original_image)
        self.labels = n_hot_encode(self.labels, 10, False)


class ImageClassificationCIFAR(ImageClassificationCIFAR_100, ImageClassificationCIFAR_10):
    def __init__(self, datadir, mode='train', shuffle=True, cifar_classnum=100, fine_labels=True, retain_original_image=False):
        cifar_classnum = int(cifar_classnum)
        assert cifar_classnum in [10,100], 'Choose one of {}.'.format([10,100])
        
        if cifar_classnum == 100:
            ImageClassificationCIFAR_100.__init__(self, datadir, mode, fine_labels, shuffle, retain_original_image)
        elif cifar_classnum == 10:
            ImageClassificationCIFAR_10.__init__(self, datadir, mode, shuffle, retain_original_image)