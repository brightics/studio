import datetime
import json
import re
from functools import partial

import cv2
import numpy as np

from brightics.deeplearning.runner.templates import TEMPLATE_SBRAIN_INPUT_FN_CODE
from brightics.deeplearning.util import common_logging

logger = common_logging.get_logger(__name__)


def get_exclude_regex(excludes):
    if isinstance(excludes, str):
        excludes = excludes.split(',')
    return '''^(?!{}).*$'''.format('''|'''.join(['(' + s + ')' for s in excludes]))


def get_created_date():
    now = datetime.datetime.now()
    now_str = now.strftime("%Y-%m-%d")
    return now_str


def get_input_function(input_function_spec):
    assert isinstance(input_function_spec, (dict, str))
    if isinstance(input_function_spec, str):
        input_function_spec = json.loads(input_function_spec)

    assert 'module' in input_function_spec
    assert 'name' in input_function_spec

    module_ = input_function_spec['module']
    name_ = input_function_spec['name']

    if module_ == 'brightics.deeplearning.input_function.image' and \
            name_ == 'common_basic_setting':
        from brightics.deeplearning.input_function.image.image_common_input_fn import get_image_common_input_fn
        return get_image_common_input_fn(input_function_spec['params'])

    elif module_ == 'brightics.deeplearning.input_function' and \
            name_ == 'user_defined_input_function':
        udf_spec = input_function_spec['params']
        exec(udf_spec['code'])
        return partial(locals()['input_function'], params=udf_spec['parameters']['params'])

    else:
        raise Exception('unknown input_function. {}.{}'.format(module_, name_))


def get_input_functions_code(input_functions_spec):
    assert isinstance(input_functions_spec, (dict, str))
    if isinstance(input_functions_spec, str):
        input_functions_spec = json.loads(input_functions_spec)

    train_input_fn_spec = input_functions_spec['train']
    eval_input_fn_spec = input_functions_spec.get('validation', None)
    test_input_fn_spec = input_functions_spec.get('test', None)

    sbrain_input_fn_code = TEMPLATE_SBRAIN_INPUT_FN_CODE.substitute(train_input_spec=train_input_fn_spec,
                                                                    eval_input_spec=eval_input_fn_spec,
                                                                    test_input_spec=test_input_fn_spec)

    return sbrain_input_fn_code


def get_model_function(model_function_spec):
    from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj

    if isinstance(model_function_spec, str):
        model_function_spec = json.loads(model_function_spec)

    model_function_object = get_python_object_from_spec_obj({
        'module': model_function_spec['module'],
        'name': model_function_spec['name']
    })(model_function_spec['params'])

    return model_function_object.model_function


def filter_none_values_in_dict(d):
    new_d = {}
    for k, v in d.items():
        if v is not None:
            if isinstance(v, dict):
                new_d[k] = filter_none_values_in_dict(v)
            else:
                new_d[k] = v

    return new_d


def get_random_name_from_millis(millis):
    EXPERIMENT_NAME_FORMAT = 'BrighticsDL-{millis}'
    return EXPERIMENT_NAME_FORMAT.format(millis=millis)


def add_indent_to_code(code, n_indent=4):
    indent = n_indent * ' '
    return code.replace('\n', '\n' + indent)


def pandas_to_html(table):
    def row_to_tag(row):
        return '''<tr>{}</tr>'''.format(''.join(['''<td>{}</td>'''.format(x) for x in row]))

    header = ''.join(['''<th>{}</th>'''.format(x) for x in table.columns])
    body = ''.join([row_to_tag(r) for r in table.values])
    return '''<table><thead>{}</thead><tbody>{}</tbody></table>'''.format(header, body)


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


def filter_strings_by_regex(str_list, regex_list):
    return [x for x in str_list if any([re.match(rgx, x) for rgx in regex_list])] if isinstance(regex_list,
                                                                                                list) else []


# COCO
# [top left x position, top left y position, width, height
# YOLO
# [center_x, center_y, height, width]
# PascalVOC
# [x_start, y_start, x_end, y_end]

def convert_bbox_format(data, source, target):
    converter = {
        'coco': {
            'yolo': _coco_to_yolo,
            'pascalvoc': _coco_to_pascalvoc
        },
        'yolo': {
            'coco': _yolo_to_coco,
            'pascalvoc': _yolo_to_pascalvoc
        },
        'pascalvoc': {
            'coco': _pascalvoc_to_coco,
            'yolo': _pascalvoc_to_yolo
        }
    }

    return converter[source][target](data)


def get_coco_segmentation_from_cmap(cmap, threshold=0.5, mode=cv2.RETR_TREE, method=cv2.CHAIN_APPROX_SIMPLE):
    from pycocotools import mask as maskUtils
    # cmap shape = (height, width)
    h, w = cmap.shape
    _, thr = cv2.threshold(cmap, threshold, 1, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours((thr * 255.0).astype(np.uint8), mode, method)
    segm = [cnt.ravel().tolist() for cnt in contours if cv2.contourArea(cnt) > 0]
    if segm:
        rles = maskUtils.frPyObjects(segm, h, w)
        rle = maskUtils.merge(rles)
    else:
        rle = None

    return rle


def _yolo_to_coco(d):
    d = d.copy()
    # [center_x - (width/2), center_y - (height/2), width, height]
    d[..., 0] = d[..., 0] - (d[..., 2] / 2.0)
    d[..., 1] = d[..., 1] - (d[..., 3] / 2.0)
    return d


def _yolo_to_pascalvoc(d):
    d = d.copy()
    # [center_x - half_width, center_y - half_height, min_x + width, min_y + height]
    d[..., 0] = d[..., 0] - (d[..., 2] / 2.0)
    d[..., 1] = d[..., 1] - (d[..., 3] / 2.0)
    d[..., 2] = d[..., 0] + d[..., 2]
    d[..., 3] = d[..., 1] + d[..., 3]
    return d


def _coco_to_pascalvoc(d):
    # [top_x, top_y, top_x + width, top_y + height]
    d = d.copy()
    d[..., 2] = d[..., 2] + d[..., 0]
    d[..., 3] = d[..., 3] + d[..., 1]
    return d


def _coco_to_yolo(d):
    d = d.copy()
    # [top_x + (width/2), top_y + (height/2), width, height]
    d[:, :, 0] = d[:, :, 0] + (d[:, :, 2] / 2.0)
    d[:, :, 1] = d[:, :, 1] + (d[:, :, 3] / 2.0)
    return d


def _pascalvoc_to_coco(d):
    d = d.copy()
    # [x1, y1, (x2-x1), (y2-y1)]
    d[..., 2] = d[..., 2] - d[..., 0]
    d[..., 3] = d[..., 3] - d[..., 1]
    return d


def _pascalvoc_to_yolo(d):
    d = d.copy()
    # [(x1 + x2)/2, (y1+y2)/2, (x2 - center_x) * 2, (y2 - center_y) * 2]
    d[..., 0] = (d[..., 0] + d[..., 2]) / 2.0
    d[..., 1] = (d[..., 1] + d[..., 3]) / 2.0
    d[..., 2] = (d[..., 2] - d[..., 0]) * 2.0
    d[..., 3] = (d[..., 3] - d[..., 1]) * 2.0
    return d
