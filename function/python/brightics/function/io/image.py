import glob
import os
import pathlib
import random

import cv2
import numpy as np
import pandas as pd

from brightics.common.datatypes.image import Image
from brightics.common.validation import raise_runtime_error


#
# labelling
# dir : (label)/files....
# none : no label
# file_prefix : (label)_files...
#
def image_load(path, labeling='dir', image_col='image', n_sample=None, size_limit=640, auto_resize_limit=False):
    def _is_big_image(img, limit):
        return max(img.height, img.width) > limit

    if labeling == 'dir':
        images_file_list = glob.glob('''{}/*/*'''.format(path))
        if n_sample is not None:
            images_file_list = random.sample(images_file_list, n_sample)
        npy_images = [(cv2.imread(x), x) for x in images_file_list]
        label = [os.path.split(os.path.dirname(os.path.abspath(x[1])))[1] for x in npy_images if x[0] is not None]
    else:
        images_file_list = glob.glob('''{}/*'''.format(path))
        if n_sample is not None:
            images_file_list = random.sample(images_file_list, n_sample)
        npy_images = [(cv2.imread(x), x) for x in images_file_list]
        label = None

    loaded_images = [Image(x[0], origin=x[1]) for x in npy_images if x[0] is not None]

    # check the size of loaded images
    if any([x for x in loaded_images if _is_big_image(x, size_limit)]):
        if auto_resize_limit:
            encoded_images = [x.resize_limit(size_limit).tobytes() for x in loaded_images]
        else:
            raise_runtime_error('Cannot load images with size over {}px.'.format(size_limit))
    else:
        encoded_images = [x.tobytes() for x in loaded_images]

    label_col = '{}_label'.format(image_col)
    out_df = pd.DataFrame({image_col: encoded_images})
    if label is not None:
        out_df[label_col] = label

    return {'out_table': out_df}


def image_unload(table, input_col, path, type='png', label_col=None, labelling='dir'):
    if not _is_image_col(table, input_col):
        raise_runtime_error('{} is not an image type column.'.format(input_col))

    pathlib.Path(path).mkdir(parents=True, exist_ok=True)

    if label_col is None:
        for i, x in enumerate(table[input_col]):
            img_npy = Image.from_bytes(x).data
            # if type == 'png':
            out_file_name = '{}/{}.{}'.format(path, i, type)
            print(out_file_name)
            cv2.imwrite(out_file_name, img_npy)


def save_to_npy(table, input_col, label_col, data_output_path, label_output_path, flatten=True):
    _check_image_col(table, input_col)

    data_npy = np.array(
        [Image.from_bytes(x).data.flatten() if flatten else Image.from_bytes(x).data for x in table[input_col]])
    label_npy = np.array(table[label_col])
    np.save(file=data_output_path, arr=data_npy)
    np.save(file=label_output_path, arr=label_npy)


def _is_image_col(table, input_col, n_sample=3):
    if table[input_col].dtype != object:
        return False

    _n_table = len(table)
    if _n_table == 0:
        # ignore validation
        return True

    _n_sample = min(n_sample, _n_table)
    sampled_data = table[input_col].sample(_n_sample)

    return all([Image.is_image(x) for x in sampled_data])


def _check_image_col(table, input_col):
    if not _is_image_col(table, input_col):
        raise_runtime_error("input column {} is not an image column.".format(input_col))
