from albumentations import Blur as alb_Blur
from albumentations import CLAHE as alb_CLAHE
from albumentations import CenterCrop as alb_CenterCrop
from albumentations import ChannelShuffle as alb_ChannelShuffle
from albumentations import Crop as alb_Crop
from albumentations import Cutout as alb_Cutout
from albumentations import ElasticTransform as alb_ElasticTransform
from albumentations import Flip as alb_Flip
from albumentations import FromFloat as alb_FromFloat
from albumentations import GaussNoise as alb_GaussNoise
from albumentations import GaussianBlur as alb_GaussianBlur
from albumentations import GridDistortion as alb_GridDistortion
from albumentations import HorizontalFlip as alb_HorizontalFlip
from albumentations import HueSaturationValue as alb_HueSaturationValue
from albumentations import ImageOnlyTransform as alb_ImageOnlyTransform
from albumentations import InvertImg as alb_InvertImg
from albumentations import JpegCompression as alb_JpegCompression
from albumentations import Lambda as alb_Lambda
from albumentations import LongestMaxSize as alb_LongestMaxSize
from albumentations import MedianBlur as alb_MedianBlur
from albumentations import MotionBlur as alb_MotionBlur
from albumentations import NoOp as alb_NoOp
from albumentations import Normalize as alb_Normalize
from albumentations import OpticalDistortion as alb_OpticalDistortion
from albumentations import PadIfNeeded as alb_PadIfNeeded
from albumentations import RGBShift as alb_RGBShift
from albumentations import RandomBrightnessContrast as alb_RandomBrightnessContrast
from albumentations import RandomCrop as alb_RandomCrop
from albumentations import RandomCropNearBBox as alb_RandomCropNearBBox
from albumentations import RandomFog as alb_RandomFog
from albumentations import RandomGamma as alb_RandomGamma
from albumentations import RandomRain as alb_RandomRain
from albumentations import RandomRotate90 as alb_RandomRotate90
from albumentations import RandomScale as alb_RandomScale
from albumentations import RandomShadow as alb_RandomShadow
from albumentations import RandomSizedBBoxSafeCrop as alb_RandomSizedBBoxSafeCrop
from albumentations import RandomSizedCrop as alb_RandomSizedCrop
from albumentations import RandomSnow as alb_RandomSnow
from albumentations import RandomSunFlare as alb_RandomSunFlare
from albumentations import Resize as alb_Resize
from albumentations import Rotate as alb_Rotate
from albumentations import ShiftScaleRotate as alb_ShiftScaleRotate
from albumentations import SmallestMaxSize as alb_SmallestMaxSize
from albumentations import ToFloat as alb_ToFloat
from albumentations import ToGray as alb_ToGray
from albumentations import Transpose as alb_Transpose
from albumentations import VerticalFlip as alb_VerticalFlip
from albumentations.core.composition import OneOf as alb_OneOf
from albumentations.core.composition import Compose as alb_Compose

"""
Compositions
"""


def Compose(transforms, p=0.5):
    # todo Currently support image classification only
    return alb_Compose(transforms=transforms, p=p)


def OneOf(transforms, p=0.5):
    return alb_OneOf(transforms=transforms, p=p)

"""
Transforms
"""


def Blur(blur_limit=7, always_apply=False, p=0.5):
    return alb_Blur(blur_limit=blur_limit, always_apply=always_apply, p=p)


def CLAHE(clip_limit=4.0, tile_grid_size=(8, 8), always_apply=False, p=0.5):
    if isinstance(tile_grid_size, str):
        tile_grid_size = tuple(int(val) for val in tile_grid_size.split(','))
    return alb_CLAHE(clip_limit=clip_limit, tile_grid_size=tile_grid_size, always_apply=always_apply, p=p)


def CenterCrop(height, width, always_apply=False, p=1.0):
    return alb_CenterCrop(height=height, width=width, always_apply=always_apply, p=p)


def ChannelShuffle(always_apply=False, p=0.5):
    return alb_ChannelShuffle(always_apply=always_apply, p=p)


def Crop(x_min=0, y_min=0, x_max=1024, y_max=1024, always_apply=False, p=1.0):
    return alb_Crop(x_min=x_min, y_min=y_min, x_max=x_max, y_max=y_max, always_apply=always_apply, p=p)


def Cutout(num_holes=8, max_h_size=8, max_w_size=8, always_apply=False, p=0.5):
    return alb_Cutout(num_holes=num_holes, max_h_size=max_h_size, max_w_size=max_w_size, always_apply=always_apply, p=p)


def ElasticTransform(alpha=1, sigma=50, alpha_affine=50, interpolation=1, border_mode=4, value=None, always_apply=False, approximate=False, p=0.5):
    if isinstance(value, str):
        value = [int(val) for val in value.split(',')]
        
    return alb_ElasticTransform(alpha=alpha, sigma=sigma, alpha_affine=alpha_affine, interpolation=interpolation, border_mode=border_mode, value=value, always_apply=always_apply, approximate=approximate, p=p)


def Flip(always_apply=False, p=0.5):
    return alb_Flip(always_apply=always_apply, p=p)


def FromFloat(dtype='uint16', max_value=None, always_apply=False, p=1.0):
    return alb_FromFloat(dtype=dtype, max_value=max_value, always_apply=always_apply, p=p)


def GaussNoise(var_limit=(10.0, 50.0), always_apply=False, p=0.5):
    if isinstance(var_limit, str):
        var_limit = tuple(float(val) for val in var_limit.split(','))
    return alb_GaussNoise(var_limit=var_limit, always_apply=always_apply, p=p)


def GaussianBlur(blur_limit=7, always_apply=False, p=0.5):
    return alb_GaussianBlur(blur_limit=blur_limit, always_apply=always_apply, p=p)


def GridDistortion(num_steps=5, distort_limit=0.3, interpolation=1, border_mode=4, value=None, always_apply=False, p=0.5):
    if isinstance(value, str):
        value = [int(val) for val in value.split(',')]
        
    return alb_GridDistortion(num_steps=num_steps, distort_limit=distort_limit, interpolation=interpolation, border_mode=border_mode, value=value, always_apply=always_apply, p=p)


def HorizontalFlip(always_apply=False, p=0.5):
    return alb_HorizontalFlip(always_apply=always_apply, p=p)


def HueSaturationValue(hue_shift_limit=20, sat_shift_limit=30, val_shift_limit=20, always_apply=False, p=0.5):
    if isinstance(hue_shift_limit, str):
        hue_shift_limit = _get_int_tuple2_from_string(hue_shift_limit)
    if isinstance(sat_shift_limit, str):
        sat_shift_limit = _get_int_tuple2_from_string(sat_shift_limit)
    if isinstance(val_shift_limit, str):
        val_shift_limit = _get_int_tuple2_from_string(val_shift_limit)            
    
    return alb_HueSaturationValue(hue_shift_limit=hue_shift_limit, sat_shift_limit=sat_shift_limit, val_shift_limit=val_shift_limit, always_apply=always_apply, p=p)


def ImageOnlyTransform(always_apply=False, p=0.5):
    return alb_ImageOnlyTransform(always_apply=always_apply, p=p)


def InvertImg(always_apply=False, p=0.5):
    return alb_InvertImg(always_apply=always_apply, p=p)


def JpegCompression(quality_lower=99, quality_upper=100, always_apply=False, p=0.5):
    return alb_JpegCompression(quality_lower=quality_lower, quality_upper=quality_upper, always_apply=always_apply, p=p)


def Lambda(image=None, mask=None, keypoint=None, bbox=None, always_apply=False, p=1.0):
    # currently image is supported
    _locals = {}
    exec(image, globals(), _locals)
    image_transform = _locals['image_transform']
    return alb_Lambda(image=image_transform, mask=mask, keypoint=keypoint, bbox=bbox, always_apply=always_apply, p=p)


def LongestMaxSize(max_size=1024, interpolation=1, always_apply=False, p=1):
    return alb_LongestMaxSize(max_size=max_size, interpolation=interpolation, always_apply=always_apply, p=p)


def MedianBlur(blur_limit=7, always_apply=False, p=0.5):
    return alb_MedianBlur(blur_limit=blur_limit, always_apply=always_apply, p=p)


def MotionBlur(blur_limit=7, always_apply=False, p=0.5):
    return alb_MotionBlur(blur_limit=blur_limit, always_apply=always_apply, p=p)


def NoOp(always_apply=False, p=0.5):
    return alb_NoOp(always_apply=always_apply, p=p)


def Normalize(mean=(0.485, 0.456, 0.406), std=(0.229, 0.224, 0.225), max_pixel_value=255.0, always_apply=False, p=1.0):
    if isinstance(mean, str):
        mean = tuple(float(val) for val in mean.split(','))
    if isinstance(std, str):
        std = tuple(float(val) for val in std.split(','))
    
    return alb_Normalize(mean=mean, std=std, max_pixel_value=max_pixel_value, always_apply=always_apply, p=p)


def OpticalDistortion(distort_limit=0.05, shift_limit=0.05, interpolation=1, border_mode=4, value=None, always_apply=False, p=0.5):
    if isinstance(value, str):
        value = [int(val) for val in value.split(',')]
        
    return alb_OpticalDistortion(distort_limit=distort_limit, shift_limit=shift_limit, interpolation=interpolation, border_mode=border_mode, value=value, always_apply=always_apply, p=p)


def PadIfNeeded(min_height=1024, min_width=1024, border_mode=4, value=None, always_apply=False, p=1.0):
    if isinstance(value, str):
        value = [int(val) for val in value.split(',')]
        
    return alb_PadIfNeeded(min_height=min_height, min_width=min_width, border_mode=border_mode, value=value, always_apply=always_apply, p=p)


def RGBShift(r_shift_limit=20, g_shift_limit=20, b_shift_limit=20, always_apply=False, p=0.5):
    if isinstance(r_shift_limit, str):
        r_shift_limit = _get_int_tuple2_from_string(r_shift_limit)
            
    if isinstance(g_shift_limit, str):
        g_shift_limit = _get_int_tuple2_from_string(g_shift_limit)
                
    if isinstance(b_shift_limit, str):
        b_shift_limit = _get_int_tuple2_from_string(b_shift_limit)
            
    return alb_RGBShift(r_shift_limit=r_shift_limit, g_shift_limit=g_shift_limit, b_shift_limit=b_shift_limit, always_apply=always_apply, p=p)


def RandomBrightness(limit=0.2, always_apply=False, p=0.5):
    return RandomBrightnessContrast(brightness_limit=limit, contrast_limit=0, always_apply=always_apply, p=p)


def RandomBrightnessContrast(brightness_limit=0.2, contrast_limit=0.2, always_apply=False, p=0.5):
    if isinstance(brightness_limit, str):
        brightness_limit = _get_float_tuple2_from_string(brightness_limit)
            
    if isinstance(contrast_limit, str):
        contrast_limit = _get_float_tuple2_from_string(contrast_limit)        
            
    return alb_RandomBrightnessContrast(brightness_limit=brightness_limit, contrast_limit=contrast_limit, always_apply=always_apply, p=p)


def RandomContrast(limit=0.2, always_apply=False, p=0.5):
    return RandomBrightnessContrast(brightness_limit=0, contrast_limit=limit, always_apply=always_apply, p=p)


def RandomCrop(height, width, always_apply=False, p=1.0):
    return alb_RandomCrop(height=height, width=width, always_apply=always_apply, p=p)


def RandomCropNearBBox(max_part_shift=0.3, always_apply=False, p=1.0):
    return alb_RandomCropNearBBox(max_part_shift=max_part_shift, always_apply=always_apply, p=p)


def RandomFog(fog_coef_lower=0.3, fog_coef_upper=1, alpha_coef=0.08, always_apply=False, p=0.5):
    return alb_RandomFog(fog_coef_lower=fog_coef_lower, fog_coef_upper=fog_coef_upper, alpha_coef=alpha_coef, always_apply=always_apply, p=p)


def RandomGamma(gamma_limit=(80, 120), always_apply=False, p=0.5):
    if isinstance(gamma_limit, str):
        gamma_limit = tuple(float(val) for val in gamma_limit.split(','))
    return alb_RandomGamma(gamma_limit=gamma_limit, always_apply=always_apply, p=p)


def RandomRain(slant_lower=-10, slant_upper=10, drop_length=20, drop_width=1, drop_color=(200, 200, 200), blur_value=7, brightness_coefficient=0.7, rain_type=None, always_apply=False, p=0.5):
    if isinstance(drop_color, str):
        drop_color = tuple(int(val) for val in drop_color.split(','))
    return alb_RandomRain(slant_lower=slant_lower, slant_upper=slant_upper, drop_length=drop_length, drop_width=drop_width, drop_color=drop_color, blur_value=blur_value, brightness_coefficient=brightness_coefficient, rain_type=rain_type, always_apply=always_apply, p=p)


def RandomRotate90(always_apply=False, p=0.5):
    return alb_RandomRotate90(always_apply=always_apply, p=p)


def RandomScale(scale_limit=0.1, interpolation=1, always_apply=False, p=0.5):
    return alb_RandomScale(scale_limit=scale_limit, interpolation=interpolation, always_apply=always_apply, p=p)


def RandomShadow(shadow_roi=(0, 0.5, 1, 1), num_shadows_lower=1, num_shadows_upper=2, shadow_dimension=5, always_apply=False, p=0.5):
    if isinstance(shadow_roi, str):
        shadow_roi = tuple(float(val) for val in shadow_roi.split(','))
    return alb_RandomShadow(shadow_roi=shadow_roi, num_shadows_lower=num_shadows_lower, num_shadows_upper=num_shadows_upper, shadow_dimension=shadow_dimension, always_apply=always_apply, p=p)


def RandomSizedBBoxSafeCrop(height, width, erosion_rate=0.0, interpolation=1, always_apply=False, p=1.0):
    return alb_RandomSizedBBoxSafeCrop(height=height, width=width, erosion_rate=erosion_rate, interpolation=interpolation, always_apply=always_apply, p=p)


def RandomSizedCrop(min_max_height, height, width, w2h_ratio=1.0, interpolation=1, always_apply=False, p=1.0):
    if isinstance(min_max_height, str):
        min_max_height = tuple(float(val) for val in min_max_height.split(','))
    
    return alb_RandomSizedCrop(min_max_height=min_max_height, height=height, width=width, w2h_ratio=w2h_ratio, interpolation=interpolation, always_apply=always_apply, p=p)


def RandomSnow(snow_point_lower=0.1, snow_point_upper=0.3, brightness_coeff=2.5, always_apply=False, p=0.5):
    return alb_RandomSnow(snow_point_lower=snow_point_lower, snow_point_upper=snow_point_upper, brightness_coeff=brightness_coeff, always_apply=always_apply, p=p)


def RandomSunFlare(flare_roi=(0, 0, 1, 0.5), angle_lower=0, angle_upper=1, num_flare_circles_lower=6, num_flare_circles_upper=10, src_radius=400, src_color=(255, 255, 255), always_apply=False, p=0.5):
    if isinstance(flare_roi, str):
        flare_roi = tuple(float(val) for val in flare_roi.split(','))
    if isinstance(src_color, str):
        src_color = tuple(float(val) for val in src_color.split(','))
    return alb_RandomSunFlare(flare_roi=flare_roi, angle_lower=angle_lower, angle_upper=angle_upper, num_flare_circles_lower=num_flare_circles_lower, num_flare_circles_upper=num_flare_circles_upper, src_radius=src_radius, src_color=src_color, always_apply=always_apply, p=p)


def Resize(height, width, interpolation=1, always_apply=False, p=1):
    return alb_Resize(height=height, width=width, interpolation=interpolation, always_apply=always_apply, p=p)


def Rotate(limit=90, interpolation=1, border_mode=4, value=None, always_apply=False, p=0.5):
    if isinstance(limit, str):
        limit = _get_int_tuple2_from_string(limit)
        
    if isinstance(value, str):
        value = [int(val) for val in value.split(',')]
        
    return alb_Rotate(limit=limit, interpolation=interpolation, border_mode=border_mode, value=value, always_apply=always_apply, p=p)


def ShiftScaleRotate(shift_limit=0.0625, scale_limit=0.1, rotate_limit=45, interpolation=1, border_mode=4, value=None, always_apply=False, p=0.5):
    if isinstance(shift_limit, str):
        shift_limit = _get_float_tuple2_from_string(shift_limit)
            
    if isinstance(scale_limit, str):
        scale_limit = _get_float_tuple2_from_string(scale_limit)
            
    if isinstance(rotate_limit, str):
        rotate_limit = _get_int_tuple2_from_string(rotate_limit)
        
    if isinstance(value, str):
        value = [int(val) for val in value.split(',')]
    return alb_ShiftScaleRotate(shift_limit=shift_limit, scale_limit=scale_limit, rotate_limit=rotate_limit, interpolation=interpolation, border_mode=border_mode, value=value, always_apply=always_apply, p=p)


def SmallestMaxSize(max_size=1024, interpolation=1, always_apply=False, p=1):
    return alb_SmallestMaxSize(max_size=max_size, interpolation=interpolation, always_apply=always_apply, p=p)


def ToFloat(max_value=None, always_apply=False, p=1.0):
    return alb_ToFloat(max_value=max_value, always_apply=always_apply, p=p)


def ToGray(always_apply=False, p=0.5):
    return alb_ToGray(always_apply=always_apply, p=p)


def Transpose(always_apply=False, p=0.5):
    return alb_Transpose(always_apply=always_apply, p=p)


def VerticalFlip(always_apply=False, p=0.5):
    return alb_VerticalFlip(always_apply=always_apply, p=p)


def _get_int_tuple2_from_string(value):
    value = tuple(int(val) for val in value.split(','))
    assert len(value) == 1 or len(value) == 2, ''''int' or 'int, int' is required.''' 
    if len(value) == 1:
        value = (-abs(value[0]),abs(value[0]))
    
    return value

def _get_float_tuple2_from_string(value):
    value = tuple(float(val) for val in value.split(','))
    assert len(value) == 1 or len(value) == 2, '''comma separated float is required.''' 
    if len(value) == 1:
        value = (-abs(value[0]),abs(value[0]))
    
    return value
