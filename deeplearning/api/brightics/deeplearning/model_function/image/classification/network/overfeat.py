from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import overfeat


class OverFeatModel(BuiltInSlimModel):
    '''
    OverFeat Model Function
    logit layer scope : 'overfeat/fc8'
    '''
    model_name = 'overfeat'
    model_param_keys = ['num_classes']
    arg_scope_param_keys = ['weight_decay']
    default_image_size = overfeat.overfeat.default_image_size

    def slim_model(self, inputs, is_training, **kwargs):
        return overfeat.overfeat(inputs=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return overfeat.overfeat_arg_scope(**kwargs)
