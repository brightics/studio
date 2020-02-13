from tensorflow.contrib import slim

from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import mobilenet_v1
from brightics.deeplearning.model_function.image.classification.network.slim.nets.mobilenet import mobilenet_v2, \
    mobilenet_v3


class MobilenetV1Model(BuiltInSlimModel):
    '''
    Mobilenet V1 Model Function
    logit layer scope : Mobilenet_v1/Logits
    '''
    model_name = 'mobilenet_v1'
    default_image_size = mobilenet_v1.mobilenet_v1.default_image_size = 224

    model_param_keys = ['num_classes', 'min_depth', 'depth_multiplier', 'dropout_keep_prob', 'spatial_squeeze',
                        'global_pool']
    arg_scope_param_keys = ['weight_decay', 'stddev', 'regularize_depthwise', 'batch_norm_decay', 'batch_norm_epsilon']

    def slim_model(self, inputs, is_training, **kwargs):
        return mobilenet_v1.mobilenet_v1(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return mobilenet_v1.mobilenet_v1_arg_scope(**kwargs)


class MobilenetV2Model(BuiltInSlimModel):
    '''
    Mobilenet V2 Model Function
    logit layer scope : Mobilenet_v2/Logits
    '''
    model_name = 'mobilenet_v2'
    default_image_size = mobilenet_v2.mobilenet.default_image_size
    model_param_keys = ['num_classes', 'min_depth', 'depth_multiplier', 'finegrain_classification_mode',
                        'divisible_by']
    arg_scope_param_keys = ['weight_decay', 'stddev', 'dropout_keep_prob', 'bn_decay']
    # Not use slim_model/slim_arg_scope. model function is redefined in the class.
    slim_model = None
    slim_arg_scope = None

    def run(self, inputs, is_training=True):
        inputs_reshape = self._reshape_inputs(inputs)
        model_params = self._get_model_params()
        arg_scope_params = self._get_arg_scope_params()

        if is_training:
            with slim.arg_scope(mobilenet_v2.training_scope(**arg_scope_params)):
                net, end_points = mobilenet_v2.mobilenet(input_tensor=inputs_reshape, **model_params)
        else:
            net, end_points = mobilenet_v2.mobilenet(input_tensor=inputs_reshape, **model_params)

        return net, end_points


class MobilenetV3Model(BuiltInSlimModel):
    '''
    Mobilenet V3 Model Function
    logit layer scope : Mobilenet_v3/Logits
    '''
    model_name = 'mobilenet_v3'
    default_image_size = mobilenet_v3.mobilenet.default_image_size
    model_param_keys = ['num_classes', 'depth_multiplier', 'conv_defs', 'finegrain_classification_mode']
    arg_scope_param_keys = ['weight_decay', 'stddev', 'dropout_keep_prob', 'bn_decay']
    # Not use slim_model/slim_arg_scope. model function is redefined in the class.
    slim_model = None
    slim_arg_scope = None

    def run(self, inputs, is_training=True):
        inputs_reshape = self._reshape_inputs(inputs)
        model_params = self._get_model_params()
        arg_scope_params = self._get_arg_scope_params()

        if is_training:
            with slim.arg_scope(mobilenet_v3.training_scope(**arg_scope_params)):
                net, end_points = mobilenet_v3.mobilenet(input_tensor=inputs_reshape, **model_params)
        else:
            net, end_points = mobilenet_v3.mobilenet(input_tensor=inputs_reshape, **model_params)

        return net, end_points
