from tensorpack.dataflow.base import RNGDataFlow
import numpy as np

from brightics.deeplearning.dataflow.image.standard_fileds import InputDataFields
from brightics.deeplearning.dataflow.image.loader.classification.from_csv import _n_hot
import copy


class ImageClassificationFake(RNGDataFlow):

    def __init__(self, shapes, size=1000, num_labels=2, retain_original_image=False):
        super(ImageClassificationFake, self).__init__()
        if isinstance(shapes, str):
            shapes = tuple(int(value) for value in shapes.split(',')) 
        self.shapes = shapes
        self._size = int(size)
        self.num_labels = num_labels
        self.max_anns = 1
        self.retain_original_image = retain_original_image
        
    def __len__(self):
        return self._size

    def __iter__(self):
        for _ in range(self._size):
            img = self.rng.randint(0, 256, tuple(self.shapes), np.uint8)
            label_classes = np.eye(self.num_labels,  dtype=np.int32)[self.rng.randint(self.num_labels)] 
            
            record = {
                InputDataFields.image: img,
                InputDataFields.label: label_classes 
            }
            if self.retain_original_image:
                record[InputDataFields.original_image] = copy.deepcopy(record[InputDataFields.image])
                
            yield record
