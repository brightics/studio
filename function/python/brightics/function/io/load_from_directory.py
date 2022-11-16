import os
import multiprocessing.pool

import cv2
import pandas as pd
import numpy as np
from pyarrow import compat
from brightics.common.utils import time_usage
from brightics.brightics_data_api import _make_directory_if_needed
from brightics.common.datatypes.image import Image

WHITE_LIST = ['.jpg', '.jpeg', '.bmp', '.png']


def _get_extension(file):
    return os.path.splitext(file)[1].lower()


def _iter_validfiles(directory, white_list_formats):
    for root, _, files in os.walk(directory):
        for file in files:
            if _get_extension(file) in white_list_formats:
                yield root, file


def split(arr, n):
    k, m = divmod(len(arr), n)
    return (arr[i * k + min(i, m):(i + 1) * k + min(i + 1, m)] for i in range(n))


def images_from_files(valid_files, directory, class_dict):
    images = []
    relative_paths = []
    filenames = []
    extensions = []
    classes = []
    
    for root, file in valid_files:
        relative_path = os.path.relpath(root, directory)
        class_ = relative_path if class_dict is None \
            else class_dict[relative_path]

        fullname = os.path.join(root, file)
        classes.append(class_)
        filename = os.path.splitext(file)[0].lower()
        extension = os.path.splitext(file)[1][1:].lower()
        filenames.append(filename)
        extensions.append(extension)
        relative_paths.append(relative_path)
        images.append(Image(cv2.imread(fullname, cv2.IMREAD_UNCHANGED), fullname).tobytes())

    return images, relative_paths, filenames, extensions, classes


def _valid_images(directory, white_list_formats, class_dict=None, n_jobs=None):
    valid_files = _iter_validfiles(directory, white_list_formats)

    split_files = split([*valid_files], n_jobs)
    pool = multiprocessing.pool.ThreadPool()
    results = []

    for valid_files in split_files:
        results.append(
            pool.apply_async(images_from_files, (valid_files, directory, class_dict))
        )

    pool.close()
    pool.join()

    classes = []
    filenames = []
    images = []
    relative_paths = []
    extensions = []
    for res in results:
        images_sub, relative_paths_sub, filenames_sub, extensions_sub, classes_sub = res.get()

        images.extend(images_sub)
        relative_paths.extend(relative_paths_sub)
        filenames.extend(filenames_sub)
        extensions.extend(extensions_sub)
        classes.extend(classes_sub)

    return images, relative_paths, filenames, extensions, classes


@time_usage
def load_from_directory(path, white_list_formats=None, class_dict=None, n_jobs=8):
    if white_list_formats is None:
        white_list_formats = WHITE_LIST

    images, relative_paths, filenames, extensions, classes = _valid_images(path, white_list_formats, class_dict, n_jobs)

    if class_dict is None:
        table = pd.DataFrame.from_dict({
            'image': images,
            'relative_path': relative_paths,
            'filename': filenames,
            'extension': extensions})
    else:
        table = pd.DataFrame.from_dict({
            'image': images,
            'relative_path': relative_paths,
            'filename': filenames,
            'extension': extensions,
            'class': classes})


    return {'table': table}


import pyarrow as pa
import pyarrow.parquet as pq
import brightics.common.data.utils as brtc_data_utils


def write_to_dataset(table, root_path, partition_cols=None, **kwargs):
    _make_directory_if_needed(brtc_data_utils.make_data_path(root_path))
     
    if partition_cols is not None and len(partition_cols) > 0:
        df = table.to_pandas()
        partition_keys = [df[col] for col in partition_cols]
        data_df = df.drop(partition_cols, axis='columns')
        data_cols = df.columns.drop(partition_cols)
        if len(data_cols) == 0:
            raise ValueError("No data left to save outside partition columns")
        for keys, subgroup in data_df.groupby(partition_keys):
            if not isinstance(keys, tuple):
                keys = (keys,)
            subdir = "/".join(
                ["{colname}={value}".format(colname=name, value=val)
                 for name, val in zip(partition_cols, keys)])
            subtable = pa.Table.from_pandas(subgroup, preserve_index=False)
            prefix = "/".join([root_path, subdir])
            _make_directory_if_needed(brtc_data_utils.make_data_path(prefix))
            outfile = compat.guid() + ".parquet"
            full_path = "/".join([prefix, outfile])
            full_path = brtc_data_utils.make_data_path(full_path)
            _make_directory_if_needed(brtc_data_utils.make_data_path(full_path))
            pq.write_table(subtable, brtc_data_utils.make_data_path(full_path), **kwargs)
    else:
        outfile = compat.guid() + ".parquet"
        full_path = "/".join([root_path, outfile])
        pq.write_table(table, brtc_data_utils.make_data_path(full_path), **kwargs)


from brightics.common.utils import time_usage


@time_usage
def _write_parquet(df, path):
     with open(path, 'wb') as f:
         df.to_parquet(f, compression='none')


@time_usage
def to_parquet(df, path, njobs=4):
    print(path)
    path = brtc_data_utils.make_data_path(path)
    print(path)
    os.makedirs(path)

    pool = multiprocessing.pool.ThreadPool()

    paths = []
    for grp, sample in df.groupby(lambda _: np.random.choice(range(njobs), 1)[0]):
        sub_path = os.path.join(path, '{}'.format(grp))
        paths.append(sub_path)
        pool.apply_async(_write_parquet, (sample, sub_path))

    pool.close()
    pool.join()
    return paths
#     with open('d:/data/test/image_parquet', 'wb') as f:
#         df.to_parquet(f)
    
#     len_ = len(df['image'])
#     for idx in range(len_):
#         cv2.imwrite('d:/data/test/image_write.png',df['image'][idx].data) 
#     np.save('d:/data/test/image_npy', np.asarray(df['image']), False)
#     with open('d:/data/test/image_pickle', 'wb') as f:
#         cPickle.dump(df, f)
#     table = pa.Table.from_pandas(df)
#     write_to_dataset(table, 'd:/data/image_parquet_test', ['class'])
#     import os
#     os.mkdir('d:/data/test')
#     df.to_csv('d:/data/test/image_csv')


@time_usage
def read_parquet(paths):
    pool = multiprocessing.pool.ThreadPool()
    
    res = []
    for path in paths:
        res.append(
            pool.apply_async(lambda path: pd.read_parquet(path), [path]).get()
        )
    
    pool.close()
    pool.join()
    
    return pd.concat(res)

# PATH = 'D:\\data\\cell_images'
# write_path = 'd:/data/test/image_parquet'
# model = load_from_directory(PATH, sampling_rate=0.4)
# model['table'].columns = ['a b', 'b c', 'c d']
# paths = to_parquet(model['table'], write_path)
# 
# @time_usage
# def test():
#     pd.read_parquet(write_path)
# 
# test()

# print(paths)
# print( read_parquet(paths) )
