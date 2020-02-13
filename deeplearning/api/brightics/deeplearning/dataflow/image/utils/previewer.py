from tensorpack.dataflow.common import RepeatedData

from brightics.deeplearning.dataflow.utils.dataflow_parser import get_loader_from_spec
from brightics.deeplearning.dataflow.utils.dataflow_parser import get_augmenters_from_spec
from brightics.deeplearning.dataflow.image.utils.show_image import augment_and_show2
from brightics.deeplearning.dataflow.common import PrintData
from brightics.deeplearning.dataflow.image.mapper.augmenter import augment
from brightics.deeplearning.dataflow.image.postprocess_transformer import postprocess_transform



class Previewer(object):

    def __init__(self):
        pass
    
    def set_loader(self, loader_spec):
        self.df = get_loader_from_spec(loader_spec)
        self.max_anns = self.df.max_anns
        self.df = RepeatedData(self.df, -1)
        self.df.reset_state()
        self.it = self.df.get_data()
        self.dp = next(self.it)
        
    def set_transformer(self, transformer_spec):
        self.augmenters = get_augmenters_from_spec(transformer_spec['augmenters'])
    
    def next(self):
        self.dp = next(self.it)
        
    def augment_and_show(self, ncols=5, nrows=5, box_color=(255, 0, 0), bgr2rgb=False, fontcolor=(255, 255, 255), fontsize=8):
        return augment_and_show2(self.dp,self.augmenters, ncols, nrows, box_color, bgr2rgb, fontcolor, fontsize)
    
    def test(self):
        ds = PrintData(self.df)
        print( ds._get_msg(self.dp) )
        augmented = augment(self.dp, self.augmenters)
        print( ds._get_msg(augmented) )
        postprocess_transformed = postprocess_transform(augmented, self.max_anns)
        print( ds._get_msg(postprocess_transformed))
    
