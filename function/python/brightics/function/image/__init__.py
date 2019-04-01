from brightics.common.datatypes.image import Image
from brightics.common.validation import raise_runtime_error
import cv2
import numpy as np
from scipy.stats import itemfreq


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
           zoom_type='scailing', out_col='image_resized'):
    _check_image_col(table, input_col)

    def _resize_img(img, size_type, dsize):
        # img_np = byte_to_img(img_byte)
        org_dsize = (img.width, img.height)
        org_area = org_dsize[0] * org_dsize[1]

        if size_type == 'size':
            new_dsize = (int(dsize[0]), int(dsize[1]))
        elif size_type == 'ratio':
            new_dsize = (int(org_dsize[0] * dsize[0]), int(org_dsize[1] * dsize[1]))
        else:
            new_dsize = (int(dsize[0]), int(dsize[1]))

        new_area = new_dsize[0] * new_dsize[1]
        if org_dsize == new_dsize:
            # no change
            img_resized = img.data
        elif org_area > new_area:
            # make smaller
            img_resized = cv2.resize(img.data, dsize=new_dsize, interpolation=cv2.INTER_AREA)
        else:
            # make larger
            img_resized = cv2.resize(img.data, dsize=new_dsize, interpolation=cv2.INTER_LINEAR)

        return Image(img_resized, origin=img.origin, mode=img.mode).tobytes()

    def _cropping_img(img_byte, crop_type, dsize):
        pass

    def _padding_img(img_byte, crop_type, dsize):
        pass

    npy_imgs = [Image.from_bytes(x) for x in table[input_col]]

    if size_type == 'min':
        dsize = (min([x.width for x in npy_imgs]), min([x.height for x in npy_imgs]))
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=dsize) for x in npy_imgs]
    elif size_type == 'x-min':
        dsize_w = min([x.width for x in npy_imgs])
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=(dsize_w, int(dsize_w * x.height / x.width))) for x in
                        npy_imgs]
    elif size_type == 'y-min':
        dsize_h = min([x.height for x in npy_imgs])
        resized_imgs = [_resize_img(x, size_type=size_type, dsize=(int(dsize_h * x.width / x.height), dsize_h)) for x in
                        npy_imgs]
    elif size_type == 'fixed-ratio':
        resized_imgs = [_resize_img(x, size_type='ratio', dsize=(target_width, target_height)) for x in npy_imgs]
    else:
        resized_imgs = [_resize_img(x, size_type='size', dsize=(target_width, target_height)) for x in npy_imgs]

    table[out_col] = resized_imgs

    return {'out_table': table}


# colorspace : BGR(default), RGB, GRAY, HSV
def convert_colorspace(table, input_col, color_space='BGR', out_col='image_converted'):
    _check_image_col(table, input_col)
    imgs = [Image.from_bytes(x) for x in table[input_col]]
    converted_imgs = [_convert_colorspace(x, x.mode, color_space).tobytes() for x in imgs]

    table[out_col] = converted_imgs
    return {'out_table': table}


def extract_features(table, input_col):
    _check_image_col(table, input_col)
    imgs = [Image.from_bytes(x) for x in table[input_col]]
    table['{}_height'.format(input_col)] = [x.height for x in imgs]
    table['{}_width'.format(input_col)] = [x.width for x in imgs]
    table['{}_color_space'.format(input_col)] = [x.mode for x in imgs]
    table['{}_origin_path'.format(input_col)] = [x.origin for x in imgs]

    # table['{}_blurriness'.format(input_col)] = [_get_blurriness_score(x) for x in imgs]
    # dominant_colors = np.array([_get_dominant_color(x) for x in imgs]).T.tolist()
    # table['{}_dominant_red'.format(input_col)] = dominant_colors[0]
    # table['{}_dominant_blue'.format(input_col)] = dominant_colors[1]
    # table['{}_dominant_green'.format(input_col)] = dominant_colors[2]
    return {'out_table': table}


def split_by_channels(table, input_col):
    # img : brightics.common.datatypes.image.Image
    def _split_image_by_channels(img):
        img_channel_list = []
        for i in range(img.n_channels):
            img_out = np.zeros((img.height, img.width, img.n_channels), dtype=img.data.dtype)
            img_out[:, :, i] = img.data[:, :, i]
            img_channel_list.append(img_out)
        return [Image(x, origin=img.origin, mode=img.mode) for x in img_channel_list]

    _check_image_col(table, input_col)
    imgs_split = [_split_image_by_channels(Image.from_bytes(x)) for x in table[input_col]]

    for i, col_data in enumerate(np.array(imgs_split).T.tolist()):
        table['{}_channel_{}'.format(input_col, i)] = [x.tobytes() for x in col_data]

    return {'out_table': table}


def normalize(table, input_col, alpha=0, beta=255, norm_type='minmax', out_col='image_normalized'):
    _check_image_col(table, input_col)

    imgs = [Image.from_bytes(x) for x in table[input_col]]
    imgs_normalized = [
        Image(cv2.normalize(x.data, dst=np.zeros(x.data.shape), alpha=alpha, beta=beta, norm_type=cv2.NORM_MINMAX),
              origin=x.origin, mode=x.mode).tobytes() for x in imgs]

    table[out_col] = imgs_normalized
    return {'out_table': table}


def save_to_npy(table, input_col, label_col, data_output_path, label_output_path):
    _check_image_col(table, input_col)

    data_npy = np.array([Image.from_bytes(x).data for x in table[input_col]])
    label_npy = np.array(table[label_col])
    np.save(file=data_output_path, arr=data_npy)
    np.save(file=label_output_path, arr=label_npy)


def vectorize_image(table, input_col, out_col='image_vector'):
    table[out_col] = [Image.from_bytes(x).data.reshape(-1).tolist() for x in table[input_col]]
    return {'out_table': table}


def _check_image_col(table, input_col):
    if not _is_image_col(table, input_col):
        raise_runtime_error("input column {} is not an image column.".format(input_col))


def _is_image_col(table, input_col, n_sample=3):
    if table[input_col].dtype != object:
        return False

    _n_table = len(table)
    if _n_table == 0:
        return True

    _n_sample = min(n_sample, _n_table)
    sampled_data = table[input_col].sample(_n_sample)

    return all([Image.is_image(x) for x in sampled_data])


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


def _get_blurriness_score(img):
    img_gray = cv2.cvtColor(img.data, _get_color_code(img.mode, 'GRAY'))
    fm = cv2.Laplacian(img_gray, cv2.CV_64F).var()
    return fm


def _kmeans(img, n_clusters=5, max_iter=200, epsilon=.1):
    pixels = np.float32(img.data.reshape((-1, 3)))

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, max_iter, epsilon)
    flags = cv2.KMEANS_RANDOM_CENTERS
    return cv2.kmeans(pixels, n_clusters, None, criteria, 10, flags)


def _get_quantize_image(img, n_clusters=5, max_iter=200, epsilon=.1):
    _, labels, centroids = _kmeans(img, n_clusters=n_clusters, max_iter=max_iter, epsilon=epsilon)
    palette = np.uint8(centroids)
    quantized = palette[labels.flatten()]
    quantized = quantized.reshape(img.data.shape)
    return Image(quantized, origin=img.origin, mode=img.mode)


def _get_dominant_color(img, n_clusters=5, max_iter=200, epsilon=.1):
    _, labels, centroids = _kmeans(img, n_clusters=n_clusters, max_iter=max_iter, epsilon=epsilon)
    palette = np.uint8(centroids)
    return palette[np.argmax(itemfreq(labels)[:, -1])]


def _convert_colorspace(img, src_space, dst_space):
    if src_space != dst_space:
        converted_img_npy = cv2.cvtColor(img.data, code=_get_color_code(src_space, dst_space))
        if dst_space == 'GRAY':
            # converted_img_npy = np.stack((converted_img_npy,) * 3, axis=-1)
            converted_img_npy = converted_img_npy.reshape(img.height, img.width, 1)

        return Image(converted_img_npy, origin=img.origin, mode=dst_space)
    else:
        return img
