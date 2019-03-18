import unittest
import glob
import matplotlib.pyplot as plt
from brightics.common.image import byte_to_img
from brightics.function.io import image_load, resize
import pandas as pd


class ImageTest(unittest.TestCase):
    # image_path = '''D:/dev/datasets/fruits-sampled'''
    image_path = '''D:/dev/datasets/fruits-360/Training'''
    image_files = glob.glob('''{}/*/*'''.format(image_path))

    class BrighticsDataset(pd.DataFrame):
        meta = []

    def test_load(self):
        # print(self.image_files)
        out_table = image_load(self.image_path)['out_table']
        self.assertEqual(len(self.image_files), len(out_table))
        # print(out_table)
        print(out_table.sample(20))
        # print(is_image_col(out_table, 'image'))
        print(len(out_table))
        print(byte_to_img(out_table['image'][0]).shape)

    def test_datatype(self):
        df = pd.DataFrame({'s': ['a', 'b', 'c'], 'i': [1, 2, 3]})
        df2 = self.BrighticsDataset({'s': ['a', 'b', 'c'], 'i': [1, 2, 3]})
        print(set(map(type, df['s'])))
        print(df2.sample(2))

    def test_resize(self):
        test_table = image_load(self.image_path)['out_table']
        org_img = byte_to_img(test_table['image'][0])
        resized = resize(test_table, 'image', dsize=(180, 180))['out_table']

        resized_img = byte_to_img(resized['image_resized'][0])
        print(resized)
        print(org_img.shape)
        print(resized_img.shape)
