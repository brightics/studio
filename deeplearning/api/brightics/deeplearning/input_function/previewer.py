from io import BytesIO
import base64
import itertools
import numpy as np
import json

import matplotlib
from brightics.deeplearning.runner.utils import get_input_function
matplotlib.use("agg")
import matplotlib.pyplot as plt
import tensorflow as tf

from brightics.deeplearning.dataflow.utils.dataflow_parser import parse,\
    get_loader_from_spec, get_augmenters_from_spec
from brightics.deeplearning.input_function.image.image_common_input_fn import _get_image_common_dataflow
from brightics.deeplearning.dataflow.image.utils.show_image import augment_and_show2


class PreviewerManager(object):
    previewers = {}
    
    @classmethod
    def create_previewer(cls, input_function_spec, previewer_id=None):
        assert isinstance(input_function_spec, (dict, str))
        if isinstance(input_function_spec, str):
            input_function_spec = parse(input_function_spec)

        if previewer_id not in PreviewerManager.previewers:
            pass  # log 
        
        PreviewerManager.previewers[previewer_id] = ImageCommonBasicPreviewer(input_function_spec)

    @classmethod
    def get_next(cls, previewer_id=None, params=None):
        assert previewer_id in PreviewerManager.previewers, \
            'keys available are {} but {} is given.'.format(PreviewerManager.previewers.keys(), previewer_id)
        if isinstance(params, str):
            params = json.loads(params)
        
        if params is None:
            params = {}
        
        ncols = params.get('ncols', 5)
        nrows = params.get('nrows', 5)
        box_color = params.get('box_color', (255, 0, 0))
        if isinstance(box_color, list):
            box_color = tuple(box_color)
        bgr2rgb = params.get('bgr2rgb', False)
        fontcolor = params.get('fontcolor', (255, 255, 255))
        if isinstance(fontcolor, list):
            fontcolor = tuple(fontcolor)
        fontsize = params.get('fontsize', 8)
        jpeg_quality = params.get('jpeg_quality', 90)
        
        return PreviewerManager.previewers[previewer_id].get_next(ncols, nrows, box_color, bgr2rgb, fontcolor, fontsize, jpeg_quality)
    
    @classmethod
    def delete_previewer(cls, previewer_id):
        del PreviewerManager.previewers[previewer_id]
        

class Previewer(object):

    def __init__(self, input_function_spec):
        assert 'module' in input_function_spec
        assert 'name' in input_function_spec
        
        self.module_ = input_function_spec['module']
        self.name_ = input_function_spec['name']

 
class ImageCommonBasicPreviewer(Previewer):

    def __init__(self, input_function_spec):
        super(ImageCommonBasicPreviewer, self).__init__(input_function_spec)
                
        assert self.module_ == 'brightics.deeplearning.input_function.image'
        assert self.name_ == 'common_basic_setting'
        
        if 'params' in input_function_spec:
            input_function_spec = input_function_spec['params']        
        
        assert 'loader' in input_function_spec
        assert 'transformer' in input_function_spec
        
        loader_spec = input_function_spec['loader']
        augmenters_spec = input_function_spec['transformer']['params']['augmenters']
        if augmenters_spec is None:
            augmenters_spec = []

        self.df_load = get_loader_from_spec(loader_spec)
        self.df_load.reset_state()
        self.it = self.df_load.get_data()
        self.augmenters = get_augmenters_from_spec(augmenters_spec)

    def get_next(self, ncols, nrows, box_color, bgr2rgb, fontcolor, fontsize, jpeg_quality):
        dp = next(self.it)
        augment_and_show2(dp, self.augmenters, ncols, nrows, box_color, bgr2rgb, fontcolor, fontsize)
        
        img = BytesIO()
        plt.savefig(img, format='jpg', quality=jpeg_quality)
        plt.clf()  # clear the current figure
        
        img_str = b'data:image/jpg;base64,' + base64.b64encode(img.getvalue().strip())
        img_str = img_str.decode('ascii')
        
        return {'augmented': img_str}


class ResultPreviewer(Previewer):

    def __init__(self, input_function_spec):
        ds = get_input_function(input_function_spec)()
        it = ds.make_one_shot_iterator()
        self.dp = it.get_next()
        
    def get_next(self):
        with tf.Session() as sess:
            return get_msg(sess.run(self.dp))

def _analyze_input_data(entry, k, depth=1, max_depth=5, max_list=5):
 
    class _elementInfo(object):
 
        def __init__(self, el, pos, depth=0, max_list=3):
            self.shape = ""
            self.type = type(el).__name__
            self.dtype = ""
            self.range = ""
  
            self.sub_elements = []
  
            self.ident = " " * (depth * 2)
            self.pos = pos
  
            numpy_scalar_types = list(itertools.chain(*np.sctypes.values()))
              
            if isinstance(el, dict):
                self.shape = " of len {}".format(len(el))
  
                if depth < max_depth:
                    for k, (subkey, subel) in enumerate(el.items()):
                        if k < max_list:
                            self.sub_elements.append(_elementInfo(subel, subkey, depth + 1, max_list))
                        else:
                            self.sub_elements.append(" " * ((depth + 1) * 2) + '...')
                            break
                else:
                    if len(el) > 0:
                        self.sub_elements.append(" " * ((depth + 1) * 2) + ' ...')
              
            elif isinstance(el, (int, float, bool)):
                self.range = " with value {}".format(el)
            elif type(el) is np.ndarray:
                self.shape = " of shape {}".format(el.shape)
                self.dtype = ":{}".format(str(el.dtype))
                self.range = " in range [{}, {}]".format(el.min(), el.max())
            elif type(el) in numpy_scalar_types:
                self.range = " with value {}".format(el)
            elif isinstance(el, (list)):
                self.shape = " of len {}".format(len(el))
  
                if depth < max_depth:
                    for k, subel in enumerate(el):
                        if k < max_list:
                            self.sub_elements.append(_elementInfo(subel, k, depth + 1, max_list))
                        else:
                            self.sub_elements.append(" " * ((depth + 1) * 2) + '...')
                            break
                else:
                    if len(el) > 0:
                        self.sub_elements.append(" " * ((depth + 1) * 2) + ' ...')
  
        def __str__(self):
            strings = []
            vals = (self.ident, self.pos, self.type, self.dtype, self.shape, self.range)
            strings.append("{}{}: {}{}{}{}".format(*vals))
  
            for k, el in enumerate(self.sub_elements):
                strings.append(str(el))
            return "\n".join(strings)
  
    return str(_elementInfo(entry, k, depth, max_list))
 
  
def get_msg(dp, max_depth=5, max_list=5):
    if isinstance(dp, dict):
        msg = ['datapoint consists of']
        msg.append(_analyze_input_data(dp, 0, max_depth=max_depth, max_list=max_list))
              
    else:
        msg = ['datapoint with {} consists of'.format(len(dp))]
        for k, entry in enumerate(dp):
            msg.append(_analyze_input_data(entry, k, max_depth=max_depth, max_list=max_list))
    return '\n'.join(msg)
