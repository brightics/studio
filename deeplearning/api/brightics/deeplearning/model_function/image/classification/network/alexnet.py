from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import alexnet


class AlexNetV2Model(BuiltInSlimModel):
    '''
    Alexnet-V2 Model Function
    logit layer scope : 'alexnet_v2/fc8'
    '''

    model_name = 'alexnet_v2'
    model_param_keys = ['num_classes']
    arg_scope_param_keys = ['weight_decay']
    default_image_size = alexnet.alexnet_v2.default_image_size

    def slim_model(self, inputs, is_training, **kwargs):
        return alexnet.alexnet_v2(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return alexnet.alexnet_v2_arg_scope(**kwargs)
