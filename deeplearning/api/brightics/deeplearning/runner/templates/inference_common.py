from functools import partial
from string import Template

WRAPPED_INPUT_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION = Template(r'''
def brightics_inference_input_fn(params=None):
    from brightics.deeplearning.runner.templates.inference_common import _get_brightics_inference_input_fn
    
    input_fn = _get_brightics_inference_input_fn(test_input_spec=$test_input_spec)
    return input_fn(params)
''')


def _get_brightics_inference_input_fn(params=None, test_input_spec=None):
    def input_fn(params=None, test_input_spec=None):
        from brightics.deeplearning.runner.utils import get_input_function
        from brightics.deeplearning.dataflow.utils.dataflow_parser import parse
        import tensorflow as tf

        assert test_input_spec is not None, 'input function is not provided.'

        def get_combined_features(features, labels):
            return {'features': features, 'labels': labels}, labels

        res_input_fn = get_input_function(parse(test_input_spec))()
        if isinstance(res_input_fn, tf.data.Dataset):
            return res_input_fn.map(get_combined_features)
        elif isinstance(res_input_fn, tuple):
            return get_combined_features(*res_input_fn)
        else:
            raise Exception(
                'Unknown return type: {}. We support tf.data.Dataset or (features, labels) tensors only.'.format(
                    type(res_input_fn)))

    return partial(input_fn, test_input_spec=test_input_spec)


WRAPPED_MODEL_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION = Template(r'''
def brightics_inference_model_fn(features, labels, mode, params):

    import tensorflow as tf

    labels = features['labels'] # assuming that it is tensor or dict of tensor
    features = features['features']
    
    feature_keys = $feature_keys
    if feature_keys is None:
        feature_keys = []
    
    label_keys = $label_keys
    if label_keys is None:
        label_keys = []
    
    prediction_keys = $prediction_keys
    
    $model_code
    
    model_function_result = $model_function_name(features, labels, mode, params)
    
    predictions = model_function_result.predictions # tensor or dict of tensor
    prediction_dict = {}
    if isinstance(features, tf.Tensor):
        features = {'': features}
    
    if isinstance(labels, tf.Tensor):
        labels = {'': labels}
        
    if isinstance(predictions, tf.Tensor):
        predictions = {'': predictions}
        
    if prediction_keys is None:
        prediction_keys = ['predictions.{}'.format(key) for key in predictions.keys()]
    
    for k,v in features.items():
        key = 'features.{}'.format(k)
        if key in feature_keys:
            prediction_dict[key] = v
    
    for k,v in labels.items():
        key = 'labels.{}'.format(k)
        if key in label_keys:
            prediction_dict['labels.{}'.format(k)] = v
    
    for k,v in predictions.items():
        key = 'predictions.{}'.format(k)
        if key in prediction_keys:
            prediction_dict['predictions.{}'.format(k)] = v
    
    
    model_function_result = model_function_result._replace(predictions=prediction_dict)
    return model_function_result
''')

INPUT_FUNCTION_CODE_TEMPLATE = Template(r'''
def brightics_inference_input_fn(params=None):
    from brightics.deeplearning.runner.utils import get_input_function
    from brightics.deeplearning.dataflow.utils.dataflow_parser import parse
    
    spec = $test_input_spec
    assert spec is not None, 'input function is not provided.'
    return get_input_function(parse(spec))()
''')

MODEL_FUNCTION_CODE_TEMPLATE = Template(r"""
def brightics_inference_model_fn(features, labels, mode, params):

    $model_code
    
    return model_function(features, labels, mode, params)
""")

MODEL_FUNCTION_CODE_TEMPLATE2 = Template("""
def brightics_inference_model_fn(features, labels, mode, params):

    $model_code
    
    return $model_function_name(features, labels, mode, params)
""")

OUTPUT_FUNCTION_CODE_TEMPLATE = Template(r'''
def brightics_inference_output_fn(results, params):
    import json
    import numpy as np
    import os
    import pickle
    import pathlib
    import uuid
    import logging
    
    logger = logging.getLogger(__name__)

    output_path = r'$output_path'
    output_overwrite = $output_overwrite
    if not output_overwrite and os.path.exists(os.path.abspath(output_path)):
        raise RuntimeError('Another file exists in the path : {}'.format(output_path))
        
    encoding = '$encoding'
    serializer = '$serializer'
    temp_output_path = output_path + '_' + str(uuid.uuid4())

    class InferenceResultJsonEncoder(json.JSONEncoder):

        def __init__(self, encoding='utf-8', **kwargs):
            super(InferenceResultJsonEncoder, self).__init__(**kwargs)
            self.encoding = encoding

        def default(self, obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, bytes):
                return obj.decode(self.encoding)
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            else:
                return json.JSONEncoder.default(self, obj)

    output_dir = os.path.dirname(os.path.abspath(output_path))
    if not os.path.exists(output_dir):
        pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)

    f = open(temp_output_path, 'wb')
    
    tn_line = 10
    n_line = 0
    log_out = []

    try:
        for each in results:
            if serializer == 'json':
                if n_line < tn_line:
                    log_out.append(str(each))
                    n_line += 1
                line = json.dumps(each, cls=InferenceResultJsonEncoder, encoding=encoding).encode(encoding)
            else:
                line = pickle.dumps(each)

            f.write(line)
            f.write('\n'.encode(encoding))
        logger.info('\n'.join(log_out))
        print('\n'.join(log_out))
        job_success = True
    except Exception as e:
        job_success = False
        raise e
    finally:
        f.close()
        if os.path.exists(temp_output_path):
            os.rename(temp_output_path, output_path)

    return output_path
''')

SIMULATION_ROC_OUTPUT_FUNCTION_CODE_TEMPLATE = Template(r'''
def brightics_inference_output_fn(results, params):
    import json
    import numpy as np
    import os
    import pickle
    import pathlib
    import uuid
    from brightics.deeplearning.util import common_logging, common_config
    logger = common_logging.get_logger(__name__)
    
    label_key = '$label_key'
    probability_key = '$probability_key'
    if label_key == 'label':
        label_key = 'label.'
    if probability_key == 'features':
        probability_key = 'features.'

    output_path = r'$output_path'
    output_overwrite = $output_overwrite
    if not output_overwrite and os.path.exists(os.path.abspath(output_path)):
        raise RuntimeError('Another file exists in the path : {}'.format(output_path))
    
    html_path = r'$html_path'
    encoding = '$encoding'
    outjson = r'$outjson'
    pos_labels=$pos_labels
    cnf_mat_overlay_text=$cnf_mat_overlay_text
    prediction_weights = $prediction_weights
    serializer = '$serializer'
    temp_output_path = output_path + '_' + str(uuid.uuid4())
    if html_path is None:
        html_path = os.path.abspath(output_path)+'.html'
    fig_size = $fig_size

    class InferenceResultJsonEncoder(json.JSONEncoder):

        def __init__(self, encoding='utf-8', **kwargs):
            super(InferenceResultJsonEncoder, self).__init__(**kwargs)
            self.encoding = encoding

        def default(self, obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, bytes):
                return obj.decode(self.encoding)
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            else:
                return json.JSONEncoder.default(self, obj)

    output_dir = os.path.dirname(os.path.abspath(output_path))
    if not os.path.exists(output_dir):
        pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)

    labels = []
    probabilities = []
    f = open(temp_output_path, 'wb')
    try:
        for each in results:
            labels.extend(each[label_key])
            probabilities.extend(each[probability_key])
            if serializer == 'json':
                line = json.dumps(each, cls=InferenceResultJsonEncoder, encoding=encoding).encode(encoding)
            else:
                line = pickle.dumps(each)

            f.write(line)
            f.write('\n'.encode(encoding))

        job_success = True
    except Exception as e:
        job_success = False
        raise e
    finally:
        f.close()
        
    if os.path.exists(temp_output_path):
        os.rename(temp_output_path, output_path)
    logger.info('shape of probabilities : {}'.format(np.shape(probabilities)))
    from brightics.deeplearning.runner.summary_util import create_summary
    create_summary(labels, probabilities, outfile=html_path, outjson=outjson, pos_labels=pos_labels, cnf_mat_overlay_text=cnf_mat_overlay_text, prediction_weights=prediction_weights, average='weighted', jpeg_quality=90, figsize=fig_size, json_cls=InferenceResultJsonEncoder)
    
    return output_path
''')

SIMULATION_GRADCAM_OUTPUT_FUNCTION_CODE_TEMPLATE = Template(r'''
def brightics_inference_output_fn(results, params):
    import json
    import numpy as np
    import os
    import pickle
    import pathlib
    import uuid
    import matplotlib.pyplot as plt
    from brightics.deeplearning.runner.summary_util import _plt2jpg_base64

    output_path = '$output_path'
    output_overwrite = $output_overwrite
    if not output_overwrite and os.path.exists(os.path.abspath(output_path)):
        raise RuntimeError('Another file exists in the path : {}'.format(output_path))
    
    encoding = '$encoding'
    serializer = '$serializer'
    temp_output_path = output_path + '_' + str(uuid.uuid4())

    table_field = '$table_field'
    table_line = '$table_line'
    img_tag = '$img_tag'

    sampling_ratio = float('$sampling_ratio')

    img_output_path = '$html_path'

    class InferenceResultJsonEncoder(json.JSONEncoder):

        def __init__(self, encoding='utf-8', **kwargs):
            super(InferenceResultJsonEncoder, self).__init__(**kwargs)
            self.encoding = encoding

        def default(self, obj):
            if isinstance(obj, np.ndarray):
                return obj.tolist()
            elif isinstance(obj, bytes):
                return obj.decode(self.encoding)
            elif isinstance(obj, np.integer):
                return int(obj)
            elif isinstance(obj, np.floating):
                return float(obj)
            else:
                return json.JSONEncoder.default(self, obj)

    output_dir = os.path.dirname(os.path.abspath(output_path))
    if not os.path.exists(output_dir):
        pathlib.Path(output_dir).mkdir(parents=True, exist_ok=True)

    f = open(temp_output_path, 'wb')
    img_f = open(img_output_path, 'wb')
    try:
        img_lines = []
        first_data = True

        if serializer == 'json':
            for each in results:
                # line = json.dumps(each, cls=InferenceResultJsonEncoder, encoding=encoding).encode(encoding)
                txt_line_obj = {}
                for k, v in each.items():
                    if not k.startswith('grad_cam.original') and not k.startswith('grad_cam.overlay'):
                        txt_line_obj[k] = v

                for i in range(0, len(each['grad_cam.cam'])):
                    if np.random.uniform(size=1)[0] < sampling_ratio or first_data:
                        first_data = False
                        plt.figure(figsize=(6.4, 4.8))
                        plt.axis('off')
                        cam_original = each['grad_cam.original'][i]
                        if cam_original.shape[-1] == 1:
                            cam_original = np.squeeze(cam_original, axis=-1)
                        plt.imshow(cam_original)
                        tag_original = img_tag.format(base64=_plt2jpg_base64(plt, 90))
                        plt.axis('off')
                        cam_overlay = each['grad_cam.overlay'][i]
                        if cam_overlay.shape[-1] == 1:
                            cam_overlay = np.squeeze(cam_overlay, axis=-1) 
                        plt.imshow(cam_overlay)
                        tag_overlay = img_tag.format(base64=_plt2jpg_base64(plt, 90))

                        img_lines.append(table_line.format(original=tag_original, overlay=tag_overlay))

                txt_line = json.dumps(txt_line_obj, cls=InferenceResultJsonEncoder, encoding=encoding).encode(encoding)

                f.write(txt_line)
                f.write('\n'.encode(encoding))

            img_f.write(table_field.format(body=''.join(img_lines)).encode(encoding))
        else:
            for each in results:
                line = pickle.dumps(each)
                f.write(line)
                f.write('\n'.encode(encoding))

        job_success = True
    except Exception as e:
        job_success = False
        raise e
    finally:
        f.close()
        img_f.close()
        if os.path.exists(temp_output_path):
            os.rename(temp_output_path, output_path)

    return output_path
''')
