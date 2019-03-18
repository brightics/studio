import base64
import io
import struct
# TODO: add new package: opencv-python
import cv2
import matplotlib.pyplot as plt
import numpy as np


def get_thumb_np(img, dsize=(20, 20)):
    return cv2.cvtColor(cv2.resize(img, dsize=dsize), cv2.COLOR_BGR2RGB)


def get_thumb_bytes(img, dsize=(20, 20), enc_type='jpg', jpg_quality=90):
    if enc_type == 'jpg':
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), jpg_quality]
        s, encoded_i = cv2.imencode('.jpg', get_thumb_np(img, dsize=dsize), encode_param)
    else:
        ## enc in png
        s, encoded_i = cv2.imencode('.png', get_thumb_np(img, dsize=dsize))
    return encoded_i


def get_thumb_b64(img_bytes):
    return base64.b64encode(img_bytes).decode('utf-8')


def get_thumb(img, dsize=(20, 20), enc_type='jpg', jpg_quality=90):
    encoded_i = get_thumb_bytes(img, dsize=dsize, enc_type=enc_type, jpg_quality=jpg_quality)
    encoded_tn = get_thumb_b64(encoded_i)
    return encoded_tn


def add_image_tag(img_b64, enc_type='png'):
    return '''data:image/{};base64,{}'''.format(enc_type, img_b64)


def imgfile_to_byte(img_path):
    return img_to_byte(plt.imread(img_path))


def img_to_byte(np_img):
    # byte map : data_type(1)::shape_degree(1)::thumb_size(4)::raw_size(4)::shape(4*shape_degree)::thumb(thumb_size)::raw(raw_size)
    raw = np_img
    shape = np.array(raw.shape)
    thumb = get_thumb_bytes(raw)
    raw_bytes = raw.tobytes()
    thumb_bytes = thumb.tobytes()

    data_type = 1
    n_shape = len(shape)
    n_thumb = len(thumb_bytes)
    n_raw = len(raw_bytes)
    shape_format = 'I' * n_shape
    thumb_format = '{}s'.format(n_thumb)
    raw_format = '{}s'.format(n_raw)
    pack_format = '<BBII{0}{1}{2}'.format(shape_format, thumb_format, raw_format)

    return struct.pack(pack_format, data_type, n_shape, n_thumb, n_raw, *shape, thumb_bytes, raw_bytes)


def byte_to_imgset(encoded_bytes):
    bio = io.BytesIO(encoded_bytes)
    tp, shape_deg, n_thumb, n_raw = struct.unpack('<BBII', bio.read(10))

    shape_format = '<' + ('I' * shape_deg)
    shape = struct.unpack(shape_format, bio.read(4 * shape_deg))

    thumb = base64.b64encode(bio.read(n_thumb)).decode('utf-8')
    raw = np.frombuffer(bio.read(n_raw), dtype=np.uint8).reshape(shape)

    return {'type': tp, 'shape_degree': shape_deg,
            'n_thumb': n_thumb, 'n_raw': n_raw, 'shape': shape, 'thumb': thumb, 'raw': raw}


def byte_to_img(encoded_bytes):
    bio = io.BytesIO(encoded_bytes)
    tp, shape_deg, _, n_raw = struct.unpack('<BBII', bio.read(10))

    shape_format = '<' + ('I' * shape_deg)
    shape = struct.unpack(shape_format, bio.read(4 * shape_deg))

    img = np.frombuffer(bio.read(n_raw), dtype=np.uint8).reshape(shape)

    return img


def is_image(encoded_bytes):
    bio = io.BytesIO(encoded_bytes)
    tp = struct.unpack('B', bio.read(1))[0]
    return tp == 1


def is_image_col(table, input_col, n_sample=3):
    if table[input_col].dtype != object:
        return False

    _n_table = len(table)
    if _n_table == 0:
        return True

    n_sample = min(n_sample, _n_table)
    sample_data = table[input_col].sample(n_sample)

    return all([is_image(x) for x in sample_data])
