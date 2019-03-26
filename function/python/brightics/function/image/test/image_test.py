import glob
import unittest

import cv2
import numpy as np

from brightics.common.datatypes.image import Image
from brightics.function.image import resize, convert_colorspace
from brightics.function.io import image_load


class ImageTest(unittest.TestCase):
    # image_path = '''D:/dev/datasets/fruits-sampled'''
    image_path = '''D:/dev/datasets/fruits-sampled4'''
    full_image_path = '''D:/dev/datasets/fruits-360/Training'''
    image_files = glob.glob('''{}/*/*'''.format(image_path))

    def test_load(self):
        out_table = image_load(self.image_path)['out_table']
        self.assertEqual(len(self.image_files), len(out_table))
        self.assertEqual((100, 100, 3), Image.from_bytes(out_table['image'][0]).data.shape)

    def test_resize_min(self):
        test_table = image_load(self.image_path)['out_table']
        print('All images are loaded.')
        org_img = Image.from_bytes(test_table['image'][0])
        resized = resize(test_table, 'image', size_type='min')['out_table']

        resized_img = Image.from_bytes(resized['image_resized'][0])
        print(resized)
        print(org_img.data.shape)
        print(resized_img.data.shape)

    def test_resize_fixedsize(self):
        test_table = image_load(self.image_path)['out_table']
        print('All images are loaded.')
        org_img = Image.from_bytes(test_table['image'][0])
        resized = resize(test_table, 'image', size_type='fixed-ratio',
                         target_height=0.6, target_width=0.5, out_col='out_img')['out_table']

        resized_img = Image.from_bytes(resized['out_img'][0])
        print(resized)
        print(org_img.data.shape)
        print(resized_img.data.shape)

    def test_convert_grayscale(self):
        test_table = image_load(self.image_path)['out_table']
        org_img = Image.from_bytes(test_table['image'][0])
        converted = convert_colorspace(test_table, 'image', color_space='GRAY', out_col='out_img')['out_table']

        converted_img = Image.from_bytes(converted['out_img'][0])
        print(converted)
        print(org_img.mode)
        print(converted_img.mode)
        cv2.imwrite('image.png', converted_img.data)
