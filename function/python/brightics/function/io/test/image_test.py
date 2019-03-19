import unittest
import glob
import matplotlib.pyplot as plt
from brightics.common.image import byte_to_img
from brightics.function.io import image_load, resize, import_image
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import random
import time
import numpy as np


class ImageTest(unittest.TestCase):
    # image_path = '''D:/dev/datasets/fruits-sampled'''
    image_path = '''D:/dev/datasets/fruits-sampled2'''
    # image_path = '''D:/dev/datasets/fruits-360/Training'''
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
        print('All images are loaded.')
        org_img = byte_to_img(test_table['image'][0])
        # resized = resize(test_table, 'image', size_type='fixed-ratio', dsize=(0.8, 0.8))['out_table']
        resized = resize(test_table, 'image', size_type='min')['out_table']

        resized_img = byte_to_img(resized['image_resized'][0])
        print(resized)
        print(org_img.shape)
        print(resized_img.shape)

    def test_multiprocess(self):
        out_table = image_load(self.image_path)['out_table']
        out_table['part'] = [random.randint(0, 10) for i in range(0, len(out_table))]
        out_arrow = pa.Table.from_pandas(out_table, nthreads=24)
        # pq.write_table(out_arrow, 'out_data.pq')
        ts0 = time.perf_counter()
        pq.write_to_dataset(out_arrow, 'parquet/out_data')
        t0 = time.perf_counter() - ts0

        ts1 = time.perf_counter()
        pq.write_table(out_arrow, 'parquet/out_table.pq')
        t1 = time.perf_counter() - ts1

        print('write_to_dataset : {}'.format(t0))
        print('write_table : {}'.format(t1))

        ts0 = time.perf_counter()
        print(pd.read_parquet('parquet/out_data', use_threads=True)[:20])
        t0 = time.perf_counter() - ts0

        ts1 = time.perf_counter()
        print(pd.read_parquet('parquet/out_table.pq', use_threads=True)[:20])
        t1 = time.perf_counter() - ts1

        print('read_dataset : {}'.format(t0))
        print('read_table : {}'.format(t1))

    def test_import_image(self):
        out_path = 'd:/dev/temp/parquet/image1'
        ts = time.perf_counter()
        out = import_image(self.image_path, out_path)
        t = time.perf_counter() - ts
        print(out['out_table'][:20])
        print('function running time : {}'.format(t))

        img_path = out['out_table']['images'][0]
        img = np.load('{}/{}'.format(out_path, img_path))
        plt.imsave('d:/dev/temp/img1.png', img, format='png')

    def test_import_image_onenpy(self):
        out_path = 'd:/dev/temp/parquet/image2'
        ts = time.perf_counter()
        out = import_image(self.image_path, out_path, image_type='npy_one')
        t = time.perf_counter() - ts
        print(out['out_table'][:20])
        print('function running time : {}'.format(t))

        # img_path = out['out_table']['images'][0]
        # img = plt.imread('{}/{}'.format(out_path, img_path))
        # plt.imsave('d:/dev/temp/img2.png', img, format='png')

    def test_temp_convert(self):
        out_path = '{}-png'.format(self.image_path)
        images_file_list = glob.glob('''{}/*/*'''.format(self.image_path))

        label = [os.path.split(os.path.dirname(os.path.abspath(x)))[1] for x in images_file_list]
        for i in images_file_list:
            img = plt.imread(i)

    def test_schema(self):

        sampled_df = image_load(self.image_path)['out_table']
        image_col = [byte_to_img(x) for x in sampled_df['image']]
        sampled_df['image'] = image_col

        print(sampled_df)
        # img = byte_to_img(table['image'][0])
        # plt.imsave('img.png', img, format='png')

        # patable = pa.Table.from_pandas(df)
        # print(patable.schema.metadata)
