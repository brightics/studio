import os
import tarfile
import itertools

import cv2

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification, \
    n_hot_encode
from brightics.deeplearning.preprocessing.create_csvfile_from_directory import WHITE_LIST_FORMATS, \
    _get_valid_files
from brightics.deeplearning.dataflow.image.loader.classification.common import path_type_chk

CALTECH_101 = '101_ObjectCategories'


class ImageClassificationCALTECH_101(ImageClassification):

    def __init__(self, datadir, mode='train', shuffle=True, num_train_images_per_class=30, white_list_format=None,
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        datadir = path_type_chk(datadir)
        if white_list_format is None:
            white_list_format = WHITE_LIST_FORMATS
        
        imgdir = os.path.join(datadir, '101_ObjectCategories')
        
        assert os.path.exists(imgdir), '{} not exists.'.format(imgdir)
        
        files_with_labels, classes = _get_valid_files(imgdir, white_list_format)

        files_with_labels = sorted(files_with_labels)
        files = []
        labels = []
        for k, g in itertools.groupby(files_with_labels, lambda x: x[1]):
            files_grp = list(g)
            if mode == 'train':
                files_with_labels_grp = files_grp[:num_train_images_per_class]
                files.extend([f for f, _ in files_with_labels_grp])
                labels.extend([l for _, l in files_with_labels_grp])
            else:
                files_with_labels_grp = files_grp[num_train_images_per_class:]
                files.extend([f for f, _ in files_with_labels_grp])
                labels.extend([l for _, l in files_with_labels_grp])
        
        label_texts_list = [[classes[label_idx]] for label_idx in labels]
        num_label_texts_list = [1]*len(files)
        
        ImageClassification.__init__(self, files, labels, label_texts_list, num_label_texts_list, shuffle, imgdir, retain_original_image, rgb, img_flag)
        self.labels = n_hot_encode(self.labels, 102)
