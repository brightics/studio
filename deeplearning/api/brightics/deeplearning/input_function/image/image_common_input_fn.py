import json
from functools import partial
import logging

import tensorflow as tf
from tensorpack.dataflow.common import RepeatedData, MapData
from tensorpack.utils import logger as tensorpack_logging

from brightics.deeplearning.dataflow.common import BatchData
from brightics.deeplearning.dataflow.common import mapdata
from brightics.deeplearning.dataflow.image.mapper.augmenter import augment
from brightics.deeplearning.dataflow.image.postprocess_transformer import postprocess_transform, \
    get_output_types_and_shapes_from_first_dp
from brightics.deeplearning.dataflow.utils.dataflow_parser import get_augmenters_from_spec
from brightics.deeplearning.dataflow.utils.dataflow_parser import get_loader_from_spec
from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj
from brightics.deeplearning.util import common_logging
from brightics.deeplearning.util.common_logging import LOG_FORMATTER

logger = common_logging.get_logger(__name__)


def _get_image_common_dataflow(input_fn_spec):
    assert 'loader' in input_fn_spec
    assert 'transformer' in input_fn_spec

    loader_spec = input_fn_spec['loader']
    if 'augmenters' in input_fn_spec['transformer']['params']:
        augmenters_spec = input_fn_spec['transformer']['params']['augmenters']
    else:
        augmenters_spec = []
    logger.debug('augmenters_spec : %s', augmenters_spec)

    if 'postprocessors' in input_fn_spec['transformer']['params']:
        postprocessors_spec = input_fn_spec['transformer']['params']['postprocessors']
    else:
        postprocessors_spec = []
    logger.debug('postprocessors_spec : %s', postprocessors_spec)

    transform_params = input_fn_spec['transformer']['params']['parameters']['params']
    repeat = transform_params.get('repeat', -1)
    batch_size = transform_params.get('batch_size', 32)
    remainder = transform_params.get('remainder', False)

    # dataflow_runner_spec = transform_params.get('dataflow_runner', None)
    mapdata_spec = transform_params.get('mapdata_func', {})

    '''
    load
    '''
    df_load = get_loader_from_spec(loader_spec)
    max_anns = df_load.max_anns if hasattr(df_load, 'max_anns') else 1
    df = RepeatedData(df_load, repeat)

    '''
    transfrom
    '''
    augmenters = get_augmenters_from_spec(augmenters_spec)
    if mapdata_spec is not None and 'module' in mapdata_spec and 'name' in mapdata_spec:
        mapdata_func = get_python_object_from_spec_obj(mapdata_spec)
    else:
        mapdata_func = mapdata()

    post_processors = get_augmenters_from_spec(postprocessors_spec)

    df = mapdata_func(ds=df, map_func=partial(augment, augmenters=augmenters + post_processors))

    df = mapdata_func(ds=df, map_func=partial(postprocess_transform, max_anns=max_anns))
    # if dataflow_runner_spec:
    #     df = get_python_object_from_spec_obj(dataflow_runner_spec)(df)

    df = MapData(ds=df, func=tuple)
    df = BatchData(df, batch_size, remainder=remainder)

    output_types, output_shapes = get_output_types_and_shapes_from_first_dp(df)

    return df, output_types, output_shapes, augmenters, df_load


def get_image_common_input_fn(input_fn_spec):
    assert isinstance(input_fn_spec, dict) or isinstance(input_fn_spec, str)
    if isinstance(input_fn_spec, str):
        input_fn_spec = json.loads(input_fn_spec)

    transform_params = input_fn_spec['transformer']['params']['parameters']['params']
    prefetch_buffer_size = transform_params.get('prefetch_buffer_size', None)

    def _input_fn():
        for handler in tensorpack_logging._logger.handlers:
            if isinstance(handler, logging.StreamHandler):
                handler.setFormatter(LOG_FORMATTER)
        df, output_types, _, _, _ = _get_image_common_dataflow(input_fn_spec)

        try:
            df.reset_state()
        except AssertionError as ass_err:
            logger.warn(ass_err)
            pass

        tf_dataset = tf.data.Dataset.from_generator(df.get_data, output_types)
        if prefetch_buffer_size:
            tf_dataset = tf_dataset.prefetch(prefetch_buffer_size)

        return tf_dataset

    return _input_fn
