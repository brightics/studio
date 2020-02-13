from brightics.deeplearning.model_function.image.classification.network.base import BuiltInSlimModel
from brightics.deeplearning.model_function.image.classification.network.slim.nets.nasnet import nasnet, pnasnet

NASNET_DEFAULT_CONFIGURAION = 'mobile'
PNASNET_DEFAULT_CONFIGURAION = 'mobile'

NASNET_MODEL_INFO_MAP = {
    'nasnet': {
        'mobile': {
            'model': nasnet.build_nasnet_mobile,
            'arg_scope': nasnet.nasnet_mobile_arg_scope,
            'default_image_size': nasnet.build_nasnet_mobile.default_image_size,
        },
        'large': {
            'model': nasnet.build_nasnet_large,
            'arg_scope': nasnet.nasnet_large_arg_scope,
            'default_image_size': nasnet.build_nasnet_large.default_image_size,
        },
        'cifar': {
            'model': nasnet.build_nasnet_cifar,
            'arg_scope': nasnet.nasnet_cifar_arg_scope,
            'default_image_size': nasnet.build_nasnet_cifar.default_image_size,
        }
    },
    'pnasnet': {
        'mobile': {
            'model': pnasnet.build_pnasnet_mobile,
            'arg_scope': pnasnet.pnasnet_mobile_arg_scope,
            'default_image_size': pnasnet.build_pnasnet_mobile.default_image_size,
        },
        'large': {
            'model': pnasnet.build_pnasnet_large,
            'arg_scope': pnasnet.pnasnet_large_arg_scope,
            'default_image_size': pnasnet.build_pnasnet_large.default_image_size,
        }
    }
}


class NASNetModel(BuiltInSlimModel):
    '''
    NASNet Model Function
    '''
    model_name = 'nasnet'
    model_param_keys = ['num_classes']
    arg_scope_param_keys = ['weight_decay', 'batch_norm_decay', 'batch_norm_epsilon']

    @property
    def configuration(self):
        return self.network_params.get('configuration', NASNET_DEFAULT_CONFIGURAION)

    @property
    def default_image_size(self):
        return NASNET_MODEL_INFO_MAP['nasnet'][self.configuration]['default_image_size']

    def slim_model(self, inputs, is_training, **kwargs):
        return NASNET_MODEL_INFO_MAP['nasnet'][self.configuration]['model'](images=inputs, is_training=is_training,
                                                                            **kwargs)

    def slim_arg_scope(self, **kwargs):
        return NASNET_MODEL_INFO_MAP['nasnet'][self.configuration]['arg_scope'](**kwargs)


class PNASNetModel(BuiltInSlimModel):
    '''
    PNASNet Model Function
    '''
    model_name = 'nasnet'
    model_param_keys = ['num_classes']
    arg_scope_param_keys = ['weight_decay', 'batch_norm_decay', 'batch_norm_epsilon']

    @property
    def configuration(self):
        return self.network_params.get('configuration', PNASNET_DEFAULT_CONFIGURAION)

    @property
    def default_image_size(self):
        return NASNET_MODEL_INFO_MAP['pnasnet'][self.configuration]['default_image_size']

    def slim_model(self, inputs, is_training, **kwargs):
        return NASNET_MODEL_INFO_MAP['pnasnet'][self.configuration]['model'](images=inputs, is_training=is_training,
                                                                             **kwargs)

    def slim_arg_scope(self, **kwargs):
        return NASNET_MODEL_INFO_MAP['pnasnet'][self.configuration]['arg_scope'](**kwargs)
