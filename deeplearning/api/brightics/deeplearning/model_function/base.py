import abc


class AbstractModelFunction(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def model_function(self, features, labels, mode, params):
        pass


class AbstractUserDefinedModelFunction(AbstractModelFunction, metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def model_code(self):
        pass


class AbstractSBrainModelFunction(metaclass=abc.ABCMeta):

    @abc.abstractmethod
    def sbrain_code(self):
        pass

    @abc.abstractmethod
    def sbrain_hparams(self):
        pass
