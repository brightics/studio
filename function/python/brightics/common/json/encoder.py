import json
import pickle
import numpy
import pandas as pd
from brightics.common.repr import BrtcReprBuilder


def _to_default_list(np_arr):
    return numpy.where(pd.isnull(np_arr), None, np_arr).tolist()


class DefaultEncoder(json.JSONEncoder):
    """
    DefaultEncoder is used for building viewable json string for in browser
    """

    def default(self, obj):
        # TODO add more support types
        if isinstance(obj, set):
            return list(obj)
        elif isinstance(obj, numpy.ndarray):
            return _to_default_list(obj)
        else:
            rb = BrtcReprBuilder()
            rb.addRawTextMD(str(obj))
            return {'type':'python object', '_repr_brtc_':rb.get()}


class PickleEncoder(DefaultEncoder):
    """
    PickleEncoder is used for building json string saved in redis
    """

    def encode(self, obj):

        def hint_tuples(item):
            if isinstance(item, tuple):
                return {'__tuple__': [hint_tuples(e) for e in item]}
            if isinstance(item, list):
                return [hint_tuples(e) for e in item]
            if isinstance(item, dict):
                new_dict = {}
                for key in item:
                    new_dict[key] = hint_tuples(item[key])
                return new_dict
            else:
                return item

        return super(DefaultEncoder, self).encode(hint_tuples(obj))

    def default(self, o):
        # TODO add more support types
        if isinstance(o, set):
            return {'__set__': list(o)}
        elif isinstance(o, numpy.ndarray):
            return {'__numpy__': _to_default_list(o)}
        elif hasattr(o, '_repr_html_'):
            rb = BrtcReprBuilder()
            rb.addHTML(o._repr_html_())
            return {'_repr_brtc_':rb.get(), '__pickled__': list(pickle.dumps(o))}
        elif hasattr(o, 'savefig'):
            rb = BrtcReprBuilder()
            rb.addPlt(o)
            return {'_repr_brtc_':rb.get(), '__pickled__': list(pickle.dumps(o))}
        else:
            rb = BrtcReprBuilder()
            rb.addRawTextMD(str(o))
            return {'_repr_brtc_':rb.get(), '__pickled__': list(pickle.dumps(o))}


def encode(obj, for_redis):
    if for_redis:
        return json.dumps(obj, cls=PickleEncoder)
    else:
        return json.dumps(obj, cls=DefaultEncoder)
