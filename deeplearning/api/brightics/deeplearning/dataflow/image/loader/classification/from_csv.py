import os
import itertools
import re

import pandas as pd
import cv2
import numpy as np

from brightics.deeplearning.dataflow.image.loader.classification.common import ImageClassification
from brightics.deeplearning.dataflow.image.loader.classification.common import _n_hot, path_type_chk


def _n_hot(labels, n_classes): #todo
    res = np.zeros(n_classes, dtype=np.int32)
    np.put(res, labels, 1)
    return res


def _parse_fn(label, sep): 
    pat = re.compile(sep)
    return [int(index) for index in pat.split(str(label).strip())]


# assuming that there are two columns and the label column is already label-indexed from 0 to n_class-1.
class ImageClassificationFromCSV(ImageClassification):

    def __init__(self, datadir, csvfile,
                 n_classes=None, header=None, sep=',', encoding='utf-8', shuffle=True, label_sep='\s', retain_original_image=False, rgb=True, img_flag=cv2.IMREAD_COLOR, comment='#'):
        
        datadir = path_type_chk(datadir)
        csvfile = path_type_chk(csvfile)

        assert os.path.isdir(datadir), 'Not a directory : {}'.format(datadir)
        assert os.path.exists(csvfile), 'CSV file does not exist : {}'.format(csvfile)
        
        self.ann = pd.read_csv(csvfile, header=header, encoding=encoding, sep=sep, dtype=str, names=['filename', 'label_text'], comment=comment)  
        self.labels_text = self.ann['label_text'].values
        
        labels_classes = [_parse_fn(labels, label_sep) for labels in self.labels_text]
        if n_classes is None:
            n_classes = max(itertools.chain.from_iterable(labels_classes)) + 1
        
        labels_classes = [_n_hot(labels, n_classes) for labels in labels_classes]
        filenames = self.ann['filename'].values 
        
        self.max_anns = 0
        
        super(ImageClassificationFromCSV, self).__init__(filenames, labels_classes, None, None, shuffle, datadir)
        self.rgb = rgb
        self.img_flag = img_flag
        self.retain_original_image = retain_original_image
