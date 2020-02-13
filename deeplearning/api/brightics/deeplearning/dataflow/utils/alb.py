import albumentations
from functools import partial


def lambda_from_func_str(image_str=None, bbox_str=None):
    image_transform_ftn = None
    bbox_transform_ftn = None
    
    if image_str:
        exec(image_str)
        image_transform_ftn = partial(locals()['image_transform'])
        
    if bbox_str:
        exec(bbox_str)
        bbox_transform_ftn = partial(locals()['bbox_transform'])
    
    return albumentations.Lambda(image=image_transform_ftn, bbox=bbox_transform_ftn)

