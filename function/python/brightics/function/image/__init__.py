from brightics.common.datatypes.image import Image
from brightics.common.validation import raise_runtime_error
import cv2
import numpy as np


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
def resize(table, input_col, size_type='fixed-ratio', target_height=1.0, target_width=1.0, shrink_type='scailing',
           zoom_type='scailing'):
    if not _is_image_col(table, input_col):
        raise_runtime_error("input column {} is not an image column.".format(input_col))

    def _resize_img(img, size_type, dsize):
        # img_np = byte_to_img(img_byte)
        org_x = img.width
        org_y = img.height
        size_org = org_x * org_y

        if size_type == 'size':
            new_x = int(dsize[0])
            new_y = int(dsize[1])
        elif size_type == 'ratio':
            new_x = int(org_x * dsize[0])
            new_y = int(org_x * dsize[1])
        else:
            new_x = int(dsize[0])
            new_y = int(dsize[1])

        size_new = new_x * new_y
        if org_x == new_x and org_y == new_y:
            # no change
            img_resized = img.data
        elif size_org > size_new:
            # make smaller
            img_resized = cv2.resize(img.data, dsize=(new_x, new_y), interpolation=cv2.INTER_AREA)
        else:
            # make larger
            img_resized = cv2.resize(img.data, dsize=(new_x, new_y), interpolation=cv2.INTER_LINEAR)

        return Image(img_resized, origin=img.origin, mode=img.mode).tobytes()

    def _cropping_img(img_byte, crop_type, dsize):
        pass

    def _padding_img(img_byte, crop_type, dsize):
        pass

    npy_imgs = [Image.from_bytes(x) for x in table[input_col]]

    if size_type == 'min':
        dsize_x = min([x.width for x in npy_imgs])
        dsize_y = min([x.height for x in npy_imgs])
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=(dsize_x, dsize_y)) for x in npy_imgs]
    elif size_type == 'x-min':
        dsize_x = min([x.width for x in npy_imgs])
        dsize_y = [int(dsize_x * x.height / x.width) for x in npy_imgs]
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=(dsize_x, dsize_y)) for x in npy_imgs]
    elif size_type == 'y-min':
        dsize_y = min([x.height for x in npy_imgs])
        dsize_x = [int(dsize_y * x.width / x.height) for x in npy_imgs]
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=(dsize_x, dsize_y)) for x in npy_imgs]
    elif size_type == 'fixed-ratio':
        resized_imgs = [_resize_img(x, size_type='ratio', dsize=(target_height, target_width)) for x in npy_imgs]
    else:
        resized_imgs = [_resize_img(x, size_type='size', dsize=(target_height, target_width)) for x in npy_imgs]

    table['image_resized'] = resized_imgs

    return {'out_table': table}


# colorspace : BGR(default), RGB, GRAY, HSV
def convert_colorspace(table, input_col, color_space='BGR'):
    if not _is_image_col(table, input_col):
        raise_runtime_error("input column {} is not an image column.".format(input_col))

    def _get_color_code(src_mode, dst_mode):
        if src_mode == 'BGR' and dst_mode == 'RGB':
            return cv2.COLOR_BGR2RGB
        elif src_mode == 'BGR' and dst_mode == 'GRAY':
            return cv2.COLOR_BGR2GRAY
        elif src_mode == 'RGB' and dst_mode == 'BGR':
            return cv2.COLOR_RGB2BGR
        elif src_mode == 'RGB' and dst_mode == 'GRAY':
            return cv2.COLOR_RGB2GRAY
        elif src_mode == 'GRAY' and dst_mode == 'RGB':
            return cv2.COLOR_GRAY2RGB
        elif src_mode == 'GRAY' and dst_mode == 'BGR':
            return cv2.COLOR_GRAY2BGR

    def _convert_image(img, src_space, dst_space):
        if src_space != dst_space:
            converted_img_npy = cv2.cvtColor(img.data, code=_get_color_code(img.mode, color_space))
            if dst_space == 'GRAY':
                converted_img_npy = np.stack((converted_img_npy,) * 3, axis=-1)

            return Image(converted_img_npy, origin=img.origin, mode=dst_space)
        else:
            return img

    imgs = [Image.from_bytes(x) for x in table[input_col]]
    converted_imgs = [_convert_image(x, x.mode, color_space).tobytes() for x in imgs]

    table['image_converted'] = converted_imgs
    return {'out_table': table}


def _is_image_col(table, input_col, n_sample=3):
    if table[input_col].dtype != object:
        return False

    _n_table = len(table)
    if _n_table == 0:
        return True

    _n_sample = min(n_sample, _n_table)
    sampled_data = table[input_col].sample(_n_sample)

    return all([Image.is_image(x) for x in sampled_data])
