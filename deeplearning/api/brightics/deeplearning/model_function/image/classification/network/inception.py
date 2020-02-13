from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import inception


class InceptionV1Model(BuiltInSlimModel):
    '''
    Inception V1 Model Function
    logit layer scope : InceptionV1/Logits
    '''
    model_name = 'inception_v1'
    default_image_size = inception.inception_v1.default_image_size
    model_param_keys = ['num_classes', 'dropout_keep_prob', 'spatial_squeeze']
    arg_scope_param_keys = ['weight_decay', 'use_batch_norm', 'batch_norm_decay', 'batch_norm_epsilon', 'batch_norm_scale']

    def slim_model(self, inputs, is_training, **kwargs):
        return inception.inception_v1(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return inception.inception_v1_arg_scope(**kwargs)


class InceptionV2Model(BuiltInSlimModel):
    '''
    Inception V2 Model Function
    logit layer scope : InceptionV2/Logits
    '''
    model_name = 'inception_v2'
    default_image_size = inception.inception_v2.default_image_size
    model_param_keys = ['num_classes', 'dropout_keep_prob', 'min_depth', 'depth_multiplier', 'spatial_squeeze']
    arg_scope_param_keys = ['weight_decay', 'use_batch_norm', 'batch_norm_decay', 'batch_norm_epsilon', 'batch_norm_scale']

    def slim_model(self, inputs, is_training, **kwargs):
        return inception.inception_v2(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return inception.inception_v2_arg_scope(**kwargs)


class InceptionV3Model(BuiltInSlimModel):
    '''
    Inception V3 Model Function
    logit layer scope : 'nceptionV3/Logits, InceptionV3/AuxLogits
    '''
    model_name = 'inception_v3'
    model_param_keys = ['num_classes', 'dropout_keep_prob', 'min_depth', 'depth_multiplier', 'spatial_squeeze',
                        'create_aux_logits', 'global_pool']
    default_image_size = inception.inception_v3.default_image_size
    arg_scope_param_keys = ['weight_decay', 'use_batch_norm', 'batch_norm_decay', 'batch_norm_epsilon', 'batch_norm_scale']

    def slim_model(self, inputs, is_training, **kwargs):
        return inception.inception_v3(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return inception.inception_v3_arg_scope(**kwargs)


class InceptionV4Model(BuiltInSlimModel):
    '''
    Inception V4 Model Function
    logit layer scope : 'nceptionV4/Logits, InceptionV4/AuxLogits
    '''
    model_name = 'inception_v4'
    default_image_size = inception.inception_v4.default_image_size
    model_param_keys = ['num_classes', 'dropout_keep_prob', 'create_aux_logits']
    arg_scope_param_keys = ['weight_decay', 'use_batch_norm', 'batch_norm_decay', 'batch_norm_epsilon', 'batch_norm_scale']

    def slim_model(self, inputs, is_training, **kwargs):
        return inception.inception_v4(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return inception.inception_v4_arg_scope(**kwargs)


class InceptionResNetV2Model(BuiltInSlimModel):
    '''
    Inception V4 Model Function
    logit layer scope : 'InceptionResNetV2/Logits, InceptionResNetV2/AuxLogits
    '''
    model_name = 'inception_resnet_v2'
    model_param_keys = ['num_classes', 'dropout_keep_prob', 'create_aux_logits', 'spatial_squeeze']
    default_image_size = inception.inception_resnet_v2.default_image_size
    arg_scope_param_keys = ['weight_decay', 'batch_norm_decay', 'batch_norm_epsilon', 'batch_norm_scale']

    def slim_model(self, inputs, is_training, **kwargs):
        return inception.inception_resnet_v2(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return inception.inception_resnet_v2_arg_scope(**kwargs)
