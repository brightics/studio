import glob
import unittest

import cv2
import numpy as np

from brightics.common.datatypes.image import Image
from brightics.function.image import resize, convert_colorspace, extract_features, split_by_channels
from brightics.function.io import image_load


class ImageTest(unittest.TestCase):
    # image_path = '''D:/dev/datasets/fruits-sampled'''
    image_path = '''D:/dev/datasets/fruits-sampled4'''
    full_image_path = '''D:/dev/datasets/fruits-360/Training'''
    image_files = glob.glob('''{}/*/*'''.format(image_path))

    def setUp(self):
        self.test_table = image_load(self.image_path)['out_table']

    def test_load(self):
        self.assertEqual(len(self.image_files), len(self.test_table))
        self.assertEqual((100, 100, 3), Image.from_bytes(self.test_table['image'][0]).data.shape)

    def test_resize_min(self):
        resized = resize(self.test_table, 'image', size_type='min')['out_table']
        resized_img = Image.from_bytes(resized['image_resized'][0])
        self.assertEqual((100, 100, 3), resized_img.data.shape)

    def test_resize_fixedsize(self):
        resized = resize(self.test_table, 'image', size_type='fixed-ratio',
                         target_height=0.6, target_width=0.5, out_col='out_img')['out_table']
        resized_img = Image.from_bytes(resized['out_img'][0])
        self.assertEqual((60, 50, 3), resized_img.data.shape)

    def test_convert_grayscale(self):
        converted = convert_colorspace(self.test_table, 'image', color_space='GRAY', out_col='out_img')['out_table']
        converted_img = Image.from_bytes(converted['out_img'][0])
        self.assertEqual('GRAY', converted_img.mode)

    def test_extract_features(self):
        out_table = extract_features(self.test_table, 'image')['out_table']
        sample_row = out_table.sample(5)
        for i, row in sample_row.iterrows():
            sample_img = Image.from_bytes(row['image'])
            self.assertEqual(row['image_height'], sample_img.height)
            self.assertEqual(row['image_width'], sample_img.width)
            self.assertEqual(row['image_color_space'], sample_img.mode)
            self.assertEqual(row['image_origin_path'], sample_img.origin)

    def test_split_by_channels(self):
        out_table = split_by_channels(self.test_table, 'image')['out_table']
        print(out_table)
        print(out_table.columns)
        sample_row = out_table.sample(1)
        for i, row in sample_row.iterrows():
            sample_img = Image.from_bytes(row['image'])
            img_c0 = Image.from_bytes(row['image_channel_0']).data
            img_c1 = Image.from_bytes(row['image_channel_1']).data
            img_c2 = Image.from_bytes(row['image_channel_2']).data

            img_new = np.zeros(sample_img.data.shape, dtype=sample_img.data.dtype)
            img_new[:, :, 0] = img_c0[:, :, 0]
            img_new[:, :, 1] = img_c1[:, :, 1]
            img_new[:, :, 2] = img_c2[:, :, 2]
            np.testing.assert_array_equal(img_new, sample_img.data)
