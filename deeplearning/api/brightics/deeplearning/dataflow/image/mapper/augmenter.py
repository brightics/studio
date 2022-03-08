from albumentations.core.transforms_interface import BasicTransform as AlbumentationsTransform
from albumentations.core.composition import BaseCompose as AlbumentationsCompose

from brightics.deeplearning.dataflow.image.standard_fileds import InputDataFields
from brightics.deeplearning.dataflow.image.standard_fileds import AlbumentationsFields


def augment(dp, augmenters):
    assert isinstance(augmenters, list)
    
    for aug in augmenters:
        if isinstance(aug, (AlbumentationsTransform, AlbumentationsCompose)):
            dp_for_albumentations = {AlbumentationsFields.image: dp[InputDataFields.image]}
            if InputDataFields.groundtruth_boxes in dp:
                dp_for_albumentations[AlbumentationsFields.bboxes] = dp[InputDataFields.groundtruth_boxes]
            
            dp_for_albumentations = aug(**dp_for_albumentations)
            dp[InputDataFields.image] = dp_for_albumentations[AlbumentationsFields.image]
            if AlbumentationsFields.bboxes in dp_for_albumentations:
                dp[InputDataFields.groundtruth_boxes] = dp_for_albumentations[AlbumentationsFields.bboxes]
        
        else:
            raise Exception('unknown augmenter')
        
    return dp
