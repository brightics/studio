import json

from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj
from brightics.deeplearning.model_function.base import AbstractSBrainModelFunction, \
    AbstractUserDefinedModelFunction


class UserDefinedModelFunction(AbstractUserDefinedModelFunction, AbstractSBrainModelFunction):

    def __init__(self, model_function_spec):
        if isinstance(model_function_spec, str):
            model_function_spec = json.loads(model_function_spec)

        self.spec = model_function_spec

    def model_function(self, features, labels, mode, params):
        exec(self.spec['code'])
        return locals()['model_function'](features, labels, mode, params)

    def model_code(self):
        return self.spec['code']

    def sbrain_hparams(self):
        return get_python_object_from_spec_obj(self.spec['parameters'])

    def sbrain_code(self):
        return self.model_code()
