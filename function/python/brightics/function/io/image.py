import uuid

import matplotlib.pyplot as plt
from typing import List, Any, Union

from brightics.common.image import *
import glob
import pandas as pd
import random
import os
import pyarrow as pa
import pyarrow.parquet as pq
import pathlib
import time


def image_load(path, labeling='label'):
    images_file_list = glob.glob('''{}/*/*'''.format(path))

    if labeling == 'label':
        label = [os.path.split(os.path.dirname(os.path.abspath(x)))[1] for x in images_file_list]
    else:
        label = list(range(0, images_file_list))

    images = [plt.imread(x) for x in images_file_list]
    encoded_images = [img_to_byte(x) for x in images]

    sample_idx = random.randint(0, len(images_file_list))
    print('''image_path : {}'''.format(images_file_list[sample_idx]))
    print('''encoded_image : {}'''.format(encoded_images[sample_idx]))
    print('''labeling : {}'''.format(labeling))
    print('''label : {}'''.format(label[sample_idx]))

    out_df = pd.DataFrame({'image': encoded_images, 'label': label})

    return {'out_table': out_df}


# size
# fixed-size (x,y)
# fixed-ratio (x,y)
# min-x
# min-y
# max-x
# max-y
#
# shrink
# scailing / cropping
# cropping
# (center
#  left+top / center+top / right+top
#  left+center / right+center
#  left+bottom / center+bottom / right+bottom
#
#  zoom
#  scailing / padding
#  cropping
#  (center
#  left+top / center+top / right+top
#  left+center / right+center
#  left+bottom / center+bottom / right+bottom
#
#  target_size : fixed-size, fixed-ratio, min, x-min, y-min
#  shrink_type : scailing, cropping-center, cropping-left-top, cropping-center-top, cropping-right-top
#                cropping-left-center, cropping-right-center,
#                cropping-left-bottom, cropping-center-bottom, cropping-right-bottom
#  zoom_type : scailing, cropping-center, cropping-left-top, cropping-center-top, cropping-right-top
#              cropping-left-center, cropping-right-center,
#              cropping-left-bottom, cropping-center-bottom, cropping-right-bottom
def resize(table, input_col, size_type='fixed-ratio', dsize=(1.0, 1.0), shrink_type='scailing', zoom_type='scailing'):
    if not is_image_col(table, input_col):
        raise ValueError("input column {} is not an image column.".format(input_col))

    def _resize_img(img, size_type, dsize):
        # img_np = byte_to_img(img_byte)
        org_x = img.shape[0]
        org_y = img.shape[1]
        size_org = org_x * org_y

        if size_type == 'size':
            new_x = dsize[0]
            new_y = dsize[1]
        elif size_type == 'ratio':
            new_x = int(org_x * dsize[0])
            new_y = int(org_x * dsize[1])
        else:
            new_x = dsize[0]
            new_y = dsize[1]

        size_new = new_x * new_y
        if org_x == new_x and org_y == new_y:
            # no change
            img_resized = img
        elif size_org > size_new:
            # make smaller
            img_resized = cv2.resize(img, dsize=(new_x, new_y), interpolation=cv2.INTER_AREA)
        else:
            # make larger
            img_resized = cv2.resize(img, dsize=(new_x, new_y), interpolation=cv2.INTER_LINEAR)

        return img_to_byte(img_resized)

    def _cropping_img(img_byte, crop_type, dsize):
        pass

    def _padding_img(img_byte, crop_type, dsize):
        pass

    npy_imgs = [byte_to_img(x) for x in table[input_col]]

    if size_type == 'min':
        dsize_x = min([x.shape[0] for x in npy_imgs])
        dsize_y = min([x.shape[1] for x in npy_imgs])
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=(dsize_x, dsize_y)) for x in npy_imgs]
    elif size_type == 'fixed-ratio':
        resized_imgs = [_resize_img(x, size_type='ratio', dsize=dsize) for x in npy_imgs]
    else:
        resized_imgs = [_resize_img(x, size_type='size', dsize=dsize) for x in npy_imgs]

    table['image_resized'] = resized_imgs

    return {'out_table': table}


def import_image(in_path, out_path, image_type='npy', labeling='label'):
    images_file_list = glob.glob('''{}/*/*'''.format(in_path))

    if labeling == 'label':
        label = [os.path.split(os.path.dirname(os.path.abspath(x)))[1] for x in images_file_list]
    else:
        label = list(range(0, images_file_list))

    images = [(plt.imread(x), i) for i, x in enumerate(images_file_list)]
    # image_files_name = range(0, len(images_file_list))

    if os.path.exists(out_path):
        os.remove(out_path)

    data_file_path = '{}/data.pq'.format(out_path)
    image_dir = '{}/images'.format(out_path)
    pathlib.Path(image_dir).mkdir(parents=True, exist_ok=True)

    tt = 0.0

    if image_type == 'npy':
        for i, img_path in enumerate(images_file_list):
            img = plt.imread(img_path)
            ts = time.perf_counter()
            image_filename = '{}/{}'.format(image_dir, i)
            np.save(image_filename, img)
            tt = tt + (time.perf_counter() - ts)

        print('time for save images : {}'.format(tt))
        out_table = pd.DataFrame({'images': ['images/{}.{}'.format(x[1], image_type) for x in images], 'label': label})
        pq.write_table(pa.Table.from_pandas(out_table), data_file_path)

    else:
        image_list = np.array([plt.imread(x) for x in images_file_list])
        print('shape : {}'.format(image_list.shape))
        np.save('{}/images'.format(image_dir), image_list)
        out_table = pd.DataFrame({'images': range(0, len(images_file_list)), 'label': label})
        pq.write_table(pa.Table.from_pandas(out_table), data_file_path)

    return {'out_table': out_table}
