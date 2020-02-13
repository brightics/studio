from functools import partial

from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj

SBRAIN_EARLY_STOPPING = {
    'stop_if_higher_hook': {
        'module': 'sbrain_common.experiment.hooks',
        'name': 'StopIfHigherHook'
    },
    'stop_if_lower_hook': {
        'module': 'sbrain_common.experiment.hooks',
        'name': 'StopIfLowerHook'
    },
    'stop_if_no_decrease_hook': {
        'module': 'sbrain_common.experiment.hooks',
        'name': 'StopIfNoDecreaseHook'
    },
    'stop_if_no_increase_hook': {
        'module': 'sbrain_common.experiment.hooks',
        'name': 'StopIfNoIncreaseHook'
    }
}

TENSORFLOW_EARLY_STOPPING = {
    'stop_if_higher_hook': {
        'module': 'tensorflow.contrib.estimator',
        'name': 'stop_if_higher_hook'
    },
    'stop_if_lower_hook': {
        'module': 'tensorflow.contrib.estimator',
        'name': 'stop_if_lower_hook'
    },
    'stop_if_no_decrease_hook': {
        'module': 'tensorflow.contrib.estimator',
        'name': 'stop_if_no_decrease_hook'
    },
    'stop_if_no_increase_hook': {
        'module': 'tensorflow.contrib.estimator',
        'name': 'stop_if_no_increase_hook'
    }
}


def _get_hook(hook_name, params, worker_type='sbrain', additional_params={}):
    if worker_type == 'sbrain':
        module_obj = SBRAIN_EARLY_STOPPING[hook_name]
    else:
        module_obj = TENSORFLOW_EARLY_STOPPING[hook_name]
    module_obj['params'] = dict(params, **additional_params)

    return get_python_object_from_spec_obj(module_obj)


def stop_if_higher_hook(**params):
    return partial(_get_hook, hook_name='stop_if_higher_hook', params=params)


def stop_if_lower_hook(**params):
    return partial(_get_hook, hook_name='stop_if_lower_hook', params=params)


def stop_if_no_decrease_hook(**params):
    return partial(_get_hook, hook_name='stop_if_no_decrease_hook', params=params)


def stop_if_no_increase_hook(**params):
    return partial(_get_hook, hook_name='stop_if_no_increase_hook', params=params)
