import glob
import unittest

import cv2
import numpy as np

from brightics.common.datatypes.image import Image
from brightics.function.image import resize, convert_colorspace, extract_features, split_by_channels, normalize, \
    vectorize_image, save_to_npy
from brightics.function.io import image_load, image_unload


# @unittest.skip('test files only exist in local system.')
class ImageTest(unittest.TestCase):
    # image_path = '''D:/dev/datasets/fruits-sampled'''
    image_path = '''D:/dev/datasets/fruits-sampled4'''
    # full_image_path = '''D:/dev/datasets/fruits-360/Training'''
    image_files = glob.glob('''{}/*/*'''.format(image_path))
    image_nonelabel = '''d:/dev/datasets/avito_images'''
    image_mnist_training = '''D:/dev/datasets/mnist_png/training'''
    image_mnist_testing = '''D:/dev/datasets/mnist_png/testing'''

    def setUp(self):
        self.test_table = image_load(self.image_path)['out_table']

    def test_load(self):
        self.assertEqual(len(self.image_files), len(self.test_table))
        self.assertEqual((100, 100, 3), Image.from_bytes(self.test_table['image'][0]).data.shape)

    def test_load_nonelabel(self):
        table_nonelabel = image_load(self.image_nonelabel, labeling='none')['out_table']
        self.assertEqual(1, len(table_nonelabel.columns))

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
        # print(sample_row['image_blurriness'])
        # print(sample_row[['image_dominant_red', 'image_dominant_blue', 'image_dominant_green']])
        for i, row in sample_row.iterrows():
            sample_img = Image.from_bytes(row['image'])
            self.assertEqual(row['image_height'], sample_img.height)
            self.assertEqual(row['image_width'], sample_img.width)
            self.assertEqual(row['image_color_space'], sample_img.mode)
            self.assertEqual(row['image_origin_path'], sample_img.origin)

    def test_split_by_channels(self):
        out_table = split_by_channels(self.test_table, 'image')['out_table']
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

    def test_normalize(self):
        out_table = normalize(self.test_table, 'image', alpha=128, beta=255, out_col='img_norm')['out_table']
        sample_row = out_table.sample(3)
        for i, row in sample_row.iterrows():
            sample_img = Image.from_bytes(row['image']).data
            new_img1 = Image.from_bytes(row['img_norm']).data
            new_img2 = cv2.normalize(sample_img, np.zeros(sample_img.shape), alpha=128, beta=255,
                                     norm_type=cv2.NORM_MINMAX)
            np.testing.assert_array_equal(new_img2, new_img1)

    def test_vectorize(self):
        out_table = vectorize_image(self.test_table, 'image', 'image_vector')['out_table']
        sample_row = out_table.sample(3)
        print(sample_row)
        # for i, row in sample_row.iterrows():
        #     sample_img = Image.from_bytes(row['image']).data
        #     print(sample_img.reshape(-1).shape)

    def test_save_to_npy(self):
        # mnist_train_table = image_load(self.image_mnist_training)['out_table']
        # save_to_npy(mnist_train_table, 'image', 'label', 'mnist_train_data.npy', 'mnist_train_label.npy')
        # train_data_loaded = np.load('mnist_train_data.npy')
        # train_label_loaded = np.load('mnist_train_label.npy')
        # print(train_data_loaded.shape)
        # print(train_label_loaded.shape)

        mnist_test_table = image_load(self.image_mnist_testing)['out_table']
        save_to_npy(mnist_test_table, 'image', 'label', 'mnist_test_data.npy', 'mnist_test_label.npy')
        test_data_loaded = np.load('mnist_test_data.npy')
        test_label_loaded = np.load('mnist_test_label.npy')
        print(test_data_loaded.shape)
        print(test_label_loaded.shape)

    def test_image_unload(self):
        out_table = self.test_table.sample(3)
        print(out_table)
        image_unload(out_table, input_col='image', path='./out_images')
