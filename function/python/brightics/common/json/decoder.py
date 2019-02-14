import json
import pickle
import numpy


def decode(obj):
    def redis_read_hook(o):
        if '__inf__' in o:
            return float(o['__inf__'])
        if '__set__' in o:
            return set(o['__set__'])
        if '__tuple__' in o:
            return tuple(o['__tuple__'])
        if '__numpy__' in o:
            return numpy.array(o['__numpy__'])
        # TODO add more support types
        if '__pickled__' in o:
            import array
            return pickle.loads(array.array('B', o['__pickled__']).tobytes())
        return o

    return json.loads(obj, object_hook=redis_read_hook)
