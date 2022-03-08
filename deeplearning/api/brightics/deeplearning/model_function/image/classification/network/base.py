from abc import abstractmethod, ABCMeta

import tensorflow as tf
import tensorflow.contrib.slim as slim


class AbstractBuiltInModel(metaclass=ABCMeta):

    @property
    @abstractmethod
    def model_name(self):
        return

    @property
    @abstractmethod
    def network_params(self):
        pass

    @property
    @abstractmethod
    def default_input_shape(self):
        pass

    @property
    @abstractmethod
    def default_image_size(self):
        pass

    @abstractmethod
    def run(self, inputs, is_training):
        pass


class BuiltInSlimModel(AbstractBuiltInModel, metaclass=ABCMeta):

    @property
    @abstractmethod
    def arg_scope_param_keys(self):
        pass

    @property
    @abstractmethod
    def model_param_keys(self):
        pass

    @property
    def network_params(self):
        return self._network_params

    @property
    def default_input_shape(self):
        return self.default_image_size, self.default_image_size, 3

    @abstractmethod
    def slim_model(self, inputs, is_training, **kwargs):
        pass

    @abstractmethod
    def slim_arg_scope(self, **kwargs):
        pass

    def __init__(self, **network_params):
        self._network_params = network_params

    def run(self, inputs, is_training=True):
        inputs_reshape = self._reshape_inputs(inputs)
        model_params = self._get_model_params()
        arg_scope_params = self._get_arg_scope_params()

        with slim.arg_scope(self.slim_arg_scope(**arg_scope_params)):
            net, end_points = self.slim_model(inputs=inputs_reshape, is_training=is_training, **model_params)

        return net, end_points

    def _reshape_inputs(self, inputs):
        reshape_to = [-1]
        input_shape = self.network_params.get('input_shape', None)
        if not input_shape:
            reshape_to.extend(self.default_input_shape)
        else:
            reshape_to.extend([int(x.strip()) for x in input_shape.split(',')])
        return tf.reshape(inputs, reshape_to)

    def _get_model_params(self):
        return {k: self.network_params[k] for k in self.network_params.keys() & self.__class__.model_param_keys}

    def _get_arg_scope_params(self):
        return {k: self.network_params[k] for k in self.network_params.keys() & self.__class__.arg_scope_param_keys}
