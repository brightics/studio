from abc import ABCMeta, abstractmethod

from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import vgg


class VGGModel(BuiltInSlimModel, metaclass=ABCMeta):
    @classmethod
    @abstractmethod
    def vgg_model_function(cls):
        pass

    model_param_keys = ['num_classes', 'dropout_keep_prob', 'spatial_squeeze', 'fc_conv_padding', 'global_pool']
    arg_scope_param_keys = ['weight_decay']

    def slim_arg_scope(self, **kwargs):
        return vgg.vgg_arg_scope(**kwargs)

    def slim_model(self, inputs, is_training, **kwargs):
        return self.__class__.vgg_model_function(inputs=inputs, is_training=is_training, **kwargs)


class VGGAModel(VGGModel):
    '''
    VGG A Model Function
    logit layer scope : vgg_a/fc8
    '''
    model_name = 'vgg_a'
    vgg_model_function = vgg.vgg_a
    default_image_size = vgg.vgg_a.default_image_size


class VGG16Model(VGGModel):
    '''
    VGG 16 Model Function
    logit layer scope : vgg_16/fc8
    '''
    model_name = 'vgg_16'
    vgg_model_function = vgg.vgg_16
    default_image_size = vgg.vgg_16.default_image_size


class VGG19Model(VGGModel):
    '''
    VGG 19 Model Function
    logit layer scope : vgg_19/fc8
    '''
    model_name = 'vgg_19'
    vgg_model_function = vgg.vgg_19
    default_image_size = vgg.vgg_19.default_image_size
