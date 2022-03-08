import numpy as np
import tensorflow as tf

from brightics.deeplearning.dataflow.image.standard_fileds import InputDataFields
from brightics.deeplearning.dataflow.image.loader import IMAGE_CLASSIFICATION_FROM_CSV
from brightics.deeplearning.dataflow.image.loader import IMAGE_CLASSIFICATION_FAKE
from brightics.deeplearning.util import common_logging

logger = common_logging.get_logger(__name__)

def postprocess_transform(dp, max_anns):
    if InputDataFields.label_texts in dp:  # todo
        none_padded_classes = [''] * max_anns
        for idx in range(dp[InputDataFields.num_label_texts]):
            none_padded_classes[idx] = dp[InputDataFields.label_texts][idx]
     
        dp[InputDataFields.label_texts] = np.array(none_padded_classes)
    
    if InputDataFields.groundtruth_boxes in dp:  # todo
        zero_padded_bboxes = np.zeros((max_anns, 4))
        none_padded_classes = [''] * max_anns
        for idx in range(dp[InputDataFields.num_groundtruth_boxes]):
            zero_padded_bboxes[idx] = dp[InputDataFields.groundtruth_boxes][idx]
            none_padded_classes[idx] = dp[InputDataFields.groundtruth_classes][idx]
     
        dp[InputDataFields.groundtruth_boxes] = zero_padded_bboxes
        dp[InputDataFields.groundtruth_classes] = np.array(none_padded_classes)
     
    features_dict = {}
    labels_dict = {}
    for k, v in dp.items():
        if InputDataFields.key_dict[k] == 'features':
            features_dict[k] = v
        elif InputDataFields.key_dict[k] == 'labels':
            labels_dict[k] = v
     
    return [features_dict, labels_dict]
    

types = {
    str: tf.string,
    float: tf.float64,
    int: tf.int64,
    }


def _get_type_or_shape(obj, istype=True):
    if isinstance(obj, dict):
        res = {}
        for k, v in obj.items():
            res[k] = _get_type_or_shape(v, istype)
        return res
    
    elif isinstance(obj, tuple):
        res = []
        for v in obj:
            res.append(_get_type_or_shape(v, istype))
        return tuple(res)
    
    elif isinstance(obj, np.ndarray):
        if istype:
            return obj.dtype
        else:
            return obj.shape
    
    else:
        logger.info(type(obj))
        logger.info(obj)
        if istype:
            return types[type(obj)]
        else:
            ()


def get_type(obj):
    return _get_type_or_shape(obj, True)


def get_shape(obj):
    return _get_type_or_shape(obj, False)


def get_output_types_and_shapes_from_first_dp(df):
    df.reset_state()
    first_dp = tuple(next(df.get_data()))
    return get_type(first_dp), get_shape(first_dp)

def get_output_types(loader_spec):
    assert 'name' in loader_spec
    kwargs = loader_spec.get('params', None)
    if kwargs:
        retain_original_image = kwargs.get('retain_original_image', False)
    
    if loader_spec['name'] in (IMAGE_CLASSIFICATION_FROM_CSV):
        output_feature_types = {
            InputDataFields.filename: tf.string,
            InputDataFields.image: tf.float32,
        }
        if retain_original_image:
            output_feature_types[InputDataFields.original_image] = tf.uint8
            
        output_label_types = {
            InputDataFields.label: tf.int32
        }
            
        output_types = (output_feature_types, output_label_types)
    
    elif loader_spec['name'] in (IMAGE_CLASSIFICATION_FAKE):
        output_feature_types = {
            InputDataFields.image: tf.float32,
        }
        if retain_original_image:
            output_feature_types[InputDataFields.original_image] = tf.uint8
            
        output_label_types = {
            InputDataFields.label: tf.int32
        }
            
        output_types = (output_feature_types, output_label_types)
    
    else:
        output_feature_types = {
            InputDataFields.filename: tf.string,
            InputDataFields.image: tf.float32,
        }
        if retain_original_image:
            output_feature_types[InputDataFields.original_image] = tf.uint8
            
        output_label_types = {
            InputDataFields.num_groundtruth_boxes: tf.int32,
            InputDataFields.groundtruth_boxes: tf.float32,
            InputDataFields.groundtruth_classes: tf.string
        }               
        output_types = (output_feature_types, output_label_types)
        
    return output_types
