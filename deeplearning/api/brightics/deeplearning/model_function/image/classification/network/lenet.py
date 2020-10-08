from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets import lenet
from brightics.deeplearning.util import common_logging
logger = common_logging.get_logger(__name__)

class LeNetModel(BuiltInSlimModel):
    '''
    LeNet Model Class
    Logit Layer Scope : LeNet/fc4
    '''
    model_name = 'lenet'
    arg_scope_param_keys = ['weight_decay']
    model_param_keys = ['num_classes', 'dropout_keep_prob']

    @property
    def default_image_size(self):
        return lenet.lenet.default_image_size

    def slim_model(self, inputs, is_training, **kwargs):
        return lenet.lenet(images=inputs, is_training=is_training, **kwargs)

    def slim_arg_scope(self, **kwargs):
        return lenet.lenet_arg_scope(**kwargs)

    def _get_arg_scope_params(self):
        logger.debug("arg_scope_param_keys: {}".format(self.arg_scope_param_keys))
        _arg_scope_params = {k: self.network_params[k] for k in
                             self.network_params.keys() & self.arg_scope_param_keys}
        if 'weight_decay' in _arg_scope_params:
            _arg_scope_params['weight_decay'] = float(_arg_scope_params['weight_decay'])
        return _arg_scope_params
