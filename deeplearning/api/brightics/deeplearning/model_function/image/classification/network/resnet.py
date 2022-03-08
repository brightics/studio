from abc import ABCMeta, abstractmethod

from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import resnet_v1, resnet_v2


class ResNetModel(BuiltInSlimModel, metaclass=ABCMeta):
    @property
    @abstractmethod
    def resnet_arg_scope(self):
        pass

    @property
    @abstractmethod
    def resnet_model_function(self):
        pass

    def slim_arg_scope(self, **kwargs):
        return self.resnet_arg_scope(**kwargs)

    def slim_model(self, inputs, is_training, **kwargs):
        return self.resnet_model_function(inputs=inputs, is_training=is_training, **kwargs)


class ResNetV1Model(ResNetModel, metaclass=ABCMeta):
    default_image_size = resnet_v1.resnet_v1.default_image_size
    model_param_keys = ['num_classes', 'global_pool', 'output_stride', 'spatial_squeeze',
                        'store_non_strided_activations', 'min_base_depth', 'depth_multiplier']
    arg_scope_param_keys = ['weight_decay', 'use_batch_norm', 'batch_norm_decay', 'batch_norm_epsilon',
                            'batch_norm_scale']

    @property
    def resnet_arg_scope(self):
        return resnet_v1.resnet_arg_scope


class ResNetV1L50Model(ResNetV1Model):
    '''
    ResNet V1 50 Model Function
    logit layer scope : resnet_v1_50/logits
    '''
    model_name = 'resnet_v1_50'

    @property
    def resnet_model_function(self):
        return resnet_v1.resnet_v1_50


class ResNetV1L101Model(ResNetV1Model):
    '''
    ResNet V1 101 Model Function
    logit layer scope : resnet_v1_101/logits
    '''
    model_name = 'resnet_v1_101'

    @property
    def resnet_model_function(self):
        return resnet_v1.resnet_v1_101


class ResNetV1L152Model(ResNetV1Model):
    '''
    ResNet V1 152 Model Function
    logit layer scope : resnet_v1_152/logits
    '''
    model_name = 'resnet_v1_152'

    @property
    def resnet_model_function(self):
        return resnet_v1.resnet_v1_152


class ResNetV1L200Model(ResNetV1Model):
    '''
    ResNet V1 200 Model Function
    logit layer scope : resnet_v1_200/logits
    '''
    model_name = 'resnet_v1_200'

    @property
    def resnet_model_function(self):
        return resnet_v1.resnet_v1_200


class ResNetV2Model(ResNetModel, metaclass=ABCMeta):
    default_image_size = resnet_v2.resnet_v2.default_image_size
    model_param_keys = ['num_classes', 'global_pool', 'output_stride', 'spatial_squeeze']
    arg_scope_param_keys = ['weight_decay', 'use_batch_norm', 'batch_norm_decay', 'batch_norm_epsilon',
                            'batch_norm_scale']

    @property
    def resnet_arg_scope(self):
        return resnet_v2.resnet_arg_scope


class ResNetV2L50Model(ResNetV2Model):
    '''
    ResNet V2 50 Model Function
    logit layer scope : resnet_v2_50/logits
    '''
    model_name = 'resnet_v2_50'

    @property
    def resnet_model_function(self):
        return resnet_v2.resnet_v2_50


class ResNetV2L101Model(ResNetV2Model):
    '''
    ResNet V2 101 Model Function
    logit layer scope : resnet_v2_101/logits
    '''
    model_name = 'resnet_v2_101'

    @property
    def resnet_model_function(self):
        return resnet_v2.resnet_v2_101


class ResNetV2L152Model(ResNetV2Model):
    '''
    ResNet V2 152 Model Function
    logit layer scope : resnet_v2_152/logits
    '''
    model_name = 'resnet_v2_152'

    @property
    def resnet_model_function(self):
        return resnet_v2.resnet_v2_152


class ResNetV2L200Model(ResNetV2Model):
    '''
    ResNet V2 200 Model Function
    logit layer scope : resnet_v2_200/logits
    '''
    model_name = 'resnet_v2_200'

    @property
    def resnet_model_function(self):
        return resnet_v2.resnet_v2_200
