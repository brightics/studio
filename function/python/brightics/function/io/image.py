import matplotlib.pyplot as plt
from typing import List, Any, Union

from brightics.common.image import *
import glob
import pandas as pd
import random
import os


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


def resize(table, input_col, dsize=(100, 100)):
    if not is_image_col(table, input_col):
        raise ValueError("input column {} is not an image column.".format(input_col))

    def _resize_img(img_byte, dsize):
        img_np = byte_to_img(img_byte)
        img_x = img_np.shape[0]
        img_y = img_np.shape[1]

        size_org = img_x * img_y
        size_new = dsize[0] * dsize[1]
        if size_org == size_new:
            # no change
            img_resized = img_np
        elif size_org > size_new:
            # make smaller
            img_resized = cv2.resize(img_np, dsize=dsize, interpolation=cv2.INTER_AREA)
        else:
            # make larger
            img_resized = cv2.resize(img_np, dsize=dsize, interpolation=cv2.INTER_CUBIC)

        return img_to_byte(img_resized)

    resized_imgs = [_resize_img(x, dsize=dsize) for x in table[input_col]]
    table['image_resized'] = resized_imgs

    return {'out_table': table}
