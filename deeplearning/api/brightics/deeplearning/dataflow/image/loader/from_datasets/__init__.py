import os

from tensorpack.dataflow.base import ProxyDataFlow

from brightics.deeplearning.dataflow.image.loader.from_datasets.caltech_101 import ImageClassificationCALTECH_101
from brightics.deeplearning.dataflow.image.loader.from_datasets.stanford_cars import ImageClassificationSTANFORD_CARS
from brightics.deeplearning.dataflow.image.loader.from_datasets.cifar import ImageClassificationCIFAR
from brightics.deeplearning.dataflow.image.loader.from_datasets.describable_textures import ImageClassificationDTD
from brightics.deeplearning.dataflow.image.loader.from_datasets.fgvc_aircraft import ImageClassificationFGVC_AIRCRAFT
from brightics.deeplearning.dataflow.image.loader.from_datasets.oxford_iiit_pet import ImageClassificationOXFORD_IIIT_PET
from brightics.deeplearning.dataflow.image.loader.from_datasets.food_101 import ImageClassificationFOOD_101
from brightics.deeplearning.dataflow.image.loader.from_datasets.stl_10 import ImageClassificationSTL_10

CALTECH_101 = 'caltech_101'
STANFORD_CARS = 'stanford_cars'
CIFAR = 'cifar'
DTD = 'dtd'
FGVC_AIRCRAFT = 'fgvc_aircraft'
OXFORD_IIIT_PET = 'oxford_iiit_pet'
FOOD_101 = 'food_101'
STL_10 = 'stl_10'

DATASETS = [CALTECH_101, STANFORD_CARS, CIFAR, DTD, FGVC_AIRCRAFT, OXFORD_IIIT_PET, FOOD_101, STL_10]


def kwargs_from_string(kwargs_str):
    if kwargs_str is None:
        return {}
    return eval('dict({})'.format(kwargs_str))


class ImageClassificationFromDatasets(ProxyDataFlow):

    def __init__(self, dataset=CALTECH_101, datadir=None, mode='train', shuffle=True, kwargs_str=None):
        
        dataset = dataset.strip().lower()
        assert dataset in DATASETS, '{} is not in {}.'.format(dataset, DATASETS)
        
        if datadir is None:
            datadir = os.path.join('/workspace/shared-dir/data/datasets', dataset)  # todo
        assert os.path.isdir(datadir), datadir
        
        class_dict = {
            CALTECH_101: ImageClassificationCALTECH_101,
            STANFORD_CARS: ImageClassificationSTANFORD_CARS,
            CIFAR: ImageClassificationCIFAR,
            DTD: ImageClassificationDTD,
            FGVC_AIRCRAFT: ImageClassificationFGVC_AIRCRAFT,
            OXFORD_IIIT_PET: ImageClassificationOXFORD_IIIT_PET,
            FOOD_101: ImageClassificationFOOD_101,
            STL_10: ImageClassificationSTL_10
            }
        
        self.ds = class_dict[dataset](datadir, mode, shuffle, **kwargs_from_string(kwargs_str))
