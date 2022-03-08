import tensorflow as tf

from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import densenet


class DenseNet169Model(BuiltInSlimModel):
    '''
    DenseNet 169 Model Function
    logit layer scope : 'densenet169/logits'
    '''
    model_name = 'densenet169'
    model_param_keys = ['num_classes']
    arg_scope_param_keys = ['weight_decay', 'batch_norm_decay', 'batch_norm_epsilon']
    default_image_size = densenet.densenet169.default_image_size

    def slim_model(self, inputs, is_training, **kwargs):
        net, end_points = densenet.densenet169(inputs=inputs, is_training=is_training, **kwargs)
        net = tf.squeeze(net, axis=[1, 2])
        return net, end_points

    def slim_arg_scope(self, **kwargs):
        return densenet.densenet_arg_scope(**kwargs)
