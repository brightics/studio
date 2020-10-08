import json
import os
import pathlib
import pickle
from string import Template

import numpy as np

from brightics.deeplearning.runner.utils import InferenceResultJsonEncoder

WRAPPED_MODEL_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION_GRAD_CAM = Template(r'''
def brightics_inference_model_fn(features, labels, mode, params):
    from brightics.deeplearning.runner.templates.simulation_for_grad_cam import model_fn
    
    $model_code
    
    return model_fn(features, labels, mode, params, 
                    model_function=$model_function_name,
                    image_key='$image_key',
                    output_image_shape='$output_image_shape',
                    target_tensor_name='$target_tensor_name',
                    target_operation_name='$target_operation_name',
                    logit_tensor_name='$logit_tensor_name',
                    logit_operation_name='$logit_operation_name')
''')

SIMULATION_GRADCAM_OUTPUT_FUNCTION_CODE_TEMPLATE = Template(r'''
def brightics_inference_output_fn(results, params):
    from brightics.deeplearning.runner.templates.simulation_for_grad_cam import output_fn
    return output_fn(results, params,
                      output_path=r'$output_path',
                      output_overwrite='$output_overwrite',
                      html_path=r'$html_path',
                      encoding='$encoding',
                      serializer='$serializer',
                      sampling_ratio=float('$sampling_ratio'))
''')


def model_fn(features, labels, mode, params,
             model_function=None, image_key=None, output_image_shape=None,
             target_tensor_name=None, target_operation_name=None,
             logit_tensor_name=None, logit_operation_name=None):
    import tensorflow as tf
    import logging
    import matplotlib.pyplot as plt
    import numpy as np

    logger = logging.getLogger(__name__)

    output_image_height, output_image_width, output_image_channels = [int(x) for x in output_image_shape.split(',')]

    labels = features['labels']  # assuming that it is tensor or dict of tensor
    features = features['features']

    model_function_result = model_function(features, labels, mode, params)

    predictions = model_function_result.predictions  # tensor or dict of tensor

    prediction_dict = {}
    if isinstance(labels, tf.Tensor):
        labels = {'': labels}

    if isinstance(features, tf.Tensor):
        features = {'': features}

    for k, v in predictions.items():
        prediction_dict['predictions.{}'.format(k)] = v

    feature_dict = {}
    logger.info('keys in features : {}'.format(features.keys()))
    for k, v in features.items():
        if 'features.{}'.format(k) == image_key:
            feature_dict[image_key] = v

    inputs = feature_dict[image_key]
    if target_tensor_name is not None:
        target = tf.get_default_graph().get_tensor_by_name(target_tensor_name)
    else:
        target = tf.get_default_graph().get_operation_by_name(target_operation_name).outputs[0]

    if logit_tensor_name is not None:
        logits = tf.get_default_graph().get_tensor_by_name(logit_tensor_name)
    else:
        logits = tf.get_default_graph().get_operation_by_name(logit_operation_name).outputs[0]

    num_classes = int(logits.shape[-1])

    logger.info('num_classes : {}'.format(num_classes))

    logits = tf.reshape(logits, [-1, num_classes])
    logger.info('shape of logits : {}'.format(logits.shape))

    prob = tf.nn.softmax(logits, axis=1)
    logger.info('shape of prob : {}'.format(prob.shape))
    pred = tf.argmax(prob, axis=1)
    logger.info('shape of pred : {}'.format(pred.shape))
    pred_onehot = tf.one_hot(pred, num_classes)
    logger.info('shape of pred_onehot : {}'.format(pred_onehot.shape))

    conv_output = target
    logger.info('shape of conv_output : {}'.format(conv_output.shape))

    loss = tf.multiply(logits, pred_onehot)
    logger.info('shape of loss : {}'.format(loss.shape))
    reduced_loss = tf.reduce_sum(loss, axis=1)
    logger.info('shape of reduced_loss : {}'.format(reduced_loss.shape))

    grads = tf.gradients(reduced_loss, conv_output)[0]
    logger.info('shape of grads0 : {}'.format(grads.shape))

    weights = tf.reduce_mean(grads, axis=(1, 2))
    logger.info('shape of weights : {}'.format(weights.shape))
    weights_shape = np.ones(len(conv_output.shape), dtype=np.int32)
    weights_shape[0] = -1
    weights_shape[-1] = weights.shape[-1]
    weights_shape = list(weights_shape)
    weights_rs = tf.reshape(weights, weights_shape)

    mul1 = tf.multiply(weights_rs, conv_output)
    cams = tf.reduce_sum(mul1, axis=3)

    cm = plt.cm.get_cmap('jet')
    colors = cm(np.arange(256))[:, :3]
    colors = tf.constant(colors, dtype=tf.float32)

    cam_org_img = tf.reshape(inputs, [-1, output_image_height, output_image_width, output_image_channels])
    cam_org_img = cam_org_img / tf.reduce_max(cam_org_img, axis=(1, 2, 3), keepdims=True)
    logger.info('shape of cam_org_img : {}'.format(cam_org_img.shape))
    cam_org_img = tf.cast(cam_org_img * 255.0, tf.uint8)
    cam_img = cams

    cam_img = tf.expand_dims(cam_img, -1)
    cam_img = tf.image.resize_images(cam_img, size=tf.constant((output_image_height, output_image_width)))
    cam_img = tf.nn.relu(cam_img)
    heatmap = cam_img / tf.reduce_max(cam_img, axis=(1, 2, 3), keepdims=True)
    cam_img = tf.cast(255 * heatmap, tf.uint8)
    cam_img = tf.cast(cam_img, tf.int32)
    cam_img = tf.gather(colors, cam_img)
    cam_img = tf.squeeze(cam_img, axis=[3])
    cam_img = 255 * cam_img / tf.reduce_max(cam_img, axis=(1, 2, 3), keepdims=True)

    overlay = tf.cast(cam_img, tf.float32) + tf.cast(cam_org_img, tf.float32)
    overlay = 255 * overlay / tf.reduce_max(overlay, axis=(1, 2, 3), keepdims=True)
    overlay = tf.cast(overlay, tf.uint8)

    prediction_dict['grad_cam.cam'] = cams
    prediction_dict['grad_cam.original'] = cam_org_img
    prediction_dict['grad_cam.overlay'] = overlay

    model_function_result = model_function_result._replace(predictions=prediction_dict)
    return model_function_result


def output_fn(results, params,
              output_path, output_overwrite, html_path, encoding, serializer, sampling_ratio):
    from brightics.deeplearning.runner.templates.simulation_for_grad_cam import TABLE_FIELD, TABLE_LINE

    if not output_overwrite and os.path.exists(os.path.abspath(output_path)):
        raise RuntimeError('Another file exists in the path : {}'.format(output_path))

    output_dir = os.path.dirname(os.path.abspath(output_path))
    if not os.path.exists(output_dir):
        pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)

    with open(output_path, 'wb') as f, open(html_path, 'wb') as img_f:
        img_lines = []
        first_data = True
        for each in results:
            output_line = _make_output_line(each, serializer, encoding, ['grad_cam.original', 'grad_cam.overlay'])
            f.write(output_line)
            f.write('\n'.encode(encoding))

            for org_img, overlay in zip(each['grad_cam.original'], each['grad_cam.overlay']):
                if np.random.uniform(size=1)[0] < sampling_ratio or first_data:
                    first_data = False
                    tag_original = _get_gradcam_result_plt_tag(org_img)
                    tag_overlay = _get_gradcam_result_plt_tag(overlay)
                    img_lines.append(TABLE_LINE.format(original=tag_original, overlay=tag_overlay))

        img_f.write(TABLE_FIELD.format(body=''.join(img_lines)).encode(encoding))

    return output_path


def _make_output_line(row, serializer='json', encoding='utf-8', exclude_keys=[]):
    if serializer == 'json':
        txt_line_obj = {k: v for k, v in row.items() if not any([k.startswith(ek) for ek in exclude_keys])}
        out_line = json.dumps(txt_line_obj, cls=InferenceResultJsonEncoder, encoding=encoding).encode(
            encoding)
    else:
        out_line = pickle.dumps(row)
    return out_line


def _get_gradcam_result_plt_tag(img_org):
    import numpy as np
    import matplotlib.pyplot as plt
    from brightics.deeplearning.runner.summary_util import _plt2jpg_base64
    plt.figure(figsize=(6.4, 4.8))
    plt.axis('off')
    _img_org = np.array(img_org, copy=True)
    if _img_org.shape[-1] == 1:
        _img_org = np.squeeze(_img_org, axis=-1)
    plt.imshow(_img_org)
    tag = IMG_TAG.format(base64=_plt2jpg_base64(plt, 90))
    return tag


TABLE_FIELD = '''<table><thead><tr><th>Original Image</th><th>Image Overlaid by Grad-CAM</th></tr></thead><tbody>{body}</tbody></table>'''
TABLE_LINE = '''<tr><td>{original}</td><td>{overlay}</td></tr>'''
IMG_TAG = '''<img src="{base64}" style="width:100%">'''
