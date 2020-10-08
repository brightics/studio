import copy
import os

import cv2
import numpy as np
from tensorpack.dataflow.base import RNGDataFlow

from brightics.deeplearning.dataflow.image.standard_fileds import InputDataFields


class ImageClassificationFiles(RNGDataFlow):

    def __init__(self, filenames, labels, label_texts_list=None, num_label_texts_list=None, shuffle=True, datadir=None):

        self.filenames = filenames
        self.labels = labels

        self.label_texts_list = label_texts_list
        self.num_label_texts_list = num_label_texts_list

        if self.label_texts_list is None or self.num_label_texts_list is None:
            self.max_anns = 0
        else:
            self.max_anns = max(self.num_label_texts_list)

        self.total = len(self.filenames)
        self.shuffle = shuffle

        if datadir is None:
            datadir = ''
        self.datadir = datadir

    def __iter__(self):
        idxs = np.arange(self.total)
        if self.shuffle:
            self.rng.shuffle(idxs)
        for k in idxs:
            if self.max_anns == 0:
                yield (self.filenames[k], self.labels[k])
            else:
                yield (self.filenames[k], self.labels[k], self.label_texts_list[k], self.num_label_texts_list[k])

    def __len__(self):
        return self.total


class ImageClassification(ImageClassificationFiles):

    def __init__(self, filenames, labels, label_texts_list=None, num_label_texts_list=None, shuffle=True, datadir=None,
                 retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR):
        super(ImageClassification, self).__init__(filenames, labels, label_texts_list, num_label_texts_list, shuffle,
                                                  datadir)
        self.rgb = rgb
        self.img_flag = img_flag
        self.retain_original_image = retain_original_image

    def __iter__(self):
        if self.max_anns == 0:
            for filename, label_classes in super(ImageClassification, self).__iter__():
                img = cv2.imread(os.path.join(self.datadir, filename), self.img_flag)
                if self.rgb:
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                record = {
                    InputDataFields.filename: filename,
                    InputDataFields.image: img,
                    InputDataFields.label: label_classes
                }
                if self.retain_original_image:
                    record[InputDataFields.original_image] = copy.deepcopy(record[InputDataFields.image])

                yield record
        else:
            for filename, label_classes, label_texts, num_label_texts in super(ImageClassification, self).__iter__():
                img = cv2.imread(os.path.join(self.datadir, filename), self.img_flag)
                if self.rgb:
                    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                record = {
                    InputDataFields.filename: filename,
                    InputDataFields.image: img,
                    InputDataFields.label: label_classes,
                    InputDataFields.label_texts: label_texts,
                    InputDataFields.num_label_texts: num_label_texts
                }
                if self.retain_original_image:
                    record[InputDataFields.original_image] = copy.deepcopy(record[InputDataFields.image])

                yield record


class ImageClassificationIN_MEMORY(RNGDataFlow):

    def __init__(self, images, labels, label_texts_list=None, num_label_texts_list=None, shuffle=True,
                 retain_original_image=False):

        self.images = images
        self.labels = labels

        self.label_texts_list = label_texts_list
        self.num_label_texts_list = num_label_texts_list

        self.total = len(self.images)
        self.shuffle = shuffle
        self.retain_original_image = retain_original_image

    def __iter__(self):
        idxs = np.arange(self.total)
        if self.shuffle:
            self.rng.shuffle(idxs)
        for k in idxs:
            record = {
                InputDataFields.image: self.images[k],
                InputDataFields.label: self.labels[k]
            }
            if self.retain_original_image:
                record[InputDataFields.original_image] = copy.deepcopy(record[InputDataFields.image])
            if self.label_texts_list:
                record[InputDataFields.label_texts] = self.label_texts_list[k]
            if self.num_label_texts_list:
                record[InputDataFields.num_label_texts] = self.num_label_texts_list[k]

            yield record

    def __len__(self):
        return self.total


def _n_hot(labels, n_classes):
    res = np.zeros(n_classes, dtype=np.int32)
    np.put(res, labels, 1)
    return res


def n_hot_encode(labels, n_classes, is_list=False):
    if is_list:
        labels = [_n_hot(label_list, n_classes) for label_list in labels]
    else:
        labels = [_n_hot([label], n_classes) for label in labels]

    return labels


def path_type_chk(dir):
    from brightics.deeplearning.util.path import path_type_chk as _path_type_chk
    return _path_type_chk(dir)
