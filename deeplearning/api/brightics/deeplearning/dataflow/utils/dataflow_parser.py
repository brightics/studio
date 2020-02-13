from importlib import import_module
import json

from tensorpack import dataflow as tp_dataflow
from brightics.deeplearning.dataflow.image.loader import IMAGE_CLASSIFICATION_FROM_CSV


def get_loader_from_spec(spec):
    assert isinstance(spec, dict) or isinstance(spec, str)
    if isinstance(spec, str):
        spec = json.loads(spec)
    
    assert all(key in spec for key in ('module', 'name')), spec.keys()
    
    df = get_python_object_from_spec_obj(spec)
    assert isinstance(df, tp_dataflow.DataFlow)
    return df


def get_augmenters_from_spec(spec):
    assert isinstance(spec, list) or isinstance(spec, str)
    if isinstance(spec, str):
        spec = json.loads(spec)
        assert isinstance(spec, list)
    
    augmenters = get_python_object_from_spec_obj(spec)
    assert isinstance(augmenters, list)
    return augmenters


def get_python_object_from_spec_obj(obj):
    if isinstance(obj, dict):
        res = {}
        for k, v in obj.items():
            res[k] = get_python_object_from_spec_obj(v)
        
        if all(key in res for key in ('module', 'name')):
            module = import_module(res['module'])
            if 'params' in res and isinstance(res['params'], list):
                res = getattr(module, res['name'])(*res['params'])
            elif 'params' in res and isinstance(res['params'], dict):
                res = getattr(module, res['name'])(**res['params'])
            elif 'params' in res and res['params'] is None:
                res = getattr(module, res['name'])()
            elif 'params' not in res:
                res = getattr(module, res['name'])
            else:
                raise Exception('cannot create an object from {}'.format(res))
    
        return res
    
    elif isinstance(obj, list):
        return [get_python_object_from_spec_obj(v) for v in obj]
    
    else:
        return obj


def parse(obj):
    assert isinstance(obj, (dict, str))
    if isinstance(obj, str):
        obj = json.loads(obj)
    return _normalize(_parse(obj))
    

def _parse(obj):
    if isinstance(obj, dict):
        res = {}
        for k, v in obj.items():
            res[k] = _parse(v)
        
        if '_value' in res:
            res = res['_value']
        elif '_type' in res and 'params' not in res:
            res = None
            
        return res
    
    elif isinstance(obj, list):
        return [_parse(v) for v in obj]
    
    else:
        return obj


def _normalize(obj):
    if isinstance(obj, dict):
        res = {}
        for k, v in obj.items():
            if not k.startswith('_'):
                res[k] = _normalize(v)
        
        return res
    
    elif isinstance(obj, list):
        return [_normalize(v) for v in obj]
    
    elif isinstance(obj, str):
        if obj != obj.strip():
            obj = obj.strip() #log..
        
        return obj 
    else:
        return obj
