import os
import tarfile

import cv2
import scipy.io

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification
from brightics.deeplearning.dataflow.image.loader.classification.common import n_hot_encode
from brightics.deeplearning.preprocessing.create_csvfile_from_directory import WHITE_LIST_FORMATS
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

STANFORD_CARS_TRAIN = 'cars_train'
STANFORD_CARS_TEST = 'cars_test' 

STANFORD_CARS_DEVKIT_DIR = 'devkit'
STANFORD_CARS_DEVKIT_TRAIN_ANN = 'cars_train_annos.mat'
STANFORD_CARS_DEVKIT_TEST_ANN = 'cars_test_annos.mat'
STANFORD_CARS_DEVKIT_TEST_ANN_W_LABEL = 'cars_test_annos_withlabels.mat'


class ImageClassificationSTANFORD_CARS(ImageClassification):

    def __init__(self, datadir, mode='train', shuffle=True, white_list_format=None,
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        datadir = path_type_chk(datadir)
        if white_list_format is None:
            white_list_format = WHITE_LIST_FORMATS
            
        traindir = os.path.join(datadir, 'cars_train')
        testdir = os.path.join(datadir, 'cars_test')
        devkit_dir = os.path.join(datadir, 'devkit')
        
        assert os.path.exists(traindir), '{} does not exist.'.format({traindir})
        assert os.path.exists(testdir), '{} does not exist.'.format({testdir})
        assert os.path.exists(devkit_dir), '{} does not exist.'.format({devkit_dir})
        
        meta = scipy.io.loadmat(os.path.join(devkit_dir,'cars_meta.mat'))
        classes = meta['class_names'][0]
        
        if mode == 'train':
            imgdir = traindir
            ann_file = os.path.join(devkit_dir, 'cars_train_annos.mat')
            ann = scipy.io.loadmat(ann_file)['annotations'][0]
        elif mode == 'test':
            imgdir = testdir
            ann_with_labels = os.path.join(devkit_dir, 'cars_test_annos_withlabels.mat')
            ann_without_labels = os.path.join(devkit_dir, 'cars_test_annos.mat')
            
            if os.path.exists(ann_with_labels):
                ann = scipy.io.loadmat(ann_with_labels)['annotations'][0]
            elif os.path.exists(ann_without_labels):
                ann = scipy.io.loadmat(ann_without_labels)['annotations'][0]
            else:
                raise Exception('Annotation file not exists. cars_test_annos.mat or cars_test_annos_withlabels.mat')
            
        else:
            raise Exception('unknown key:{}. Choose one of train, test.')
            
        
        if mode == 'test' and not os.path.exists(ann_with_labels):
            files = [fname[0] for bbox_x1, bbox_y1, bbox_x2, bbox_y2, fname in ann]
            labels = [0 for bbox_x1, bbox_y1, bbox_x2, bbox_y2, fname in ann]
            label_texts_list = [['N/A']]*len(files)
            num_label_texts_list = [1]*len(files)
        else:
            files = [fname[0] for bbox_x1, bbox_y1, bbox_x2, bbox_y2, label, fname in ann]
            labels = [label[0] - 1 for bbox_x1, bbox_y1, bbox_x2, bbox_y2, label, fname in ann]  # matlab starts from 1
            label_texts_list = [[classes[label_idx][0][0]] for label_idx in labels]
            num_label_texts_list = [1]*len(files)
        
        super(ImageClassificationSTANFORD_CARS, self).__init__(files, labels, label_texts_list, num_label_texts_list, shuffle, imgdir, retain_original_image, rgb, img_flag)
        self.labels = n_hot_encode(self.labels, 196)
