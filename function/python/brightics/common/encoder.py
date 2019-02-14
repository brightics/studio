import json
import pickle
import numpy
import pandas as pd
from brightics.common.repr import BrtcReprBuilder

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
            if isinstance(item, set):
                new_set = []
                for i in item:
                    if isinstance(i,float) and i == numpy.inf:
                        new_set.append({'__inf__':'inf'})
                    elif isinstance(i,float) and i == -numpy.inf:
                        new_set.append({'__inf__':'-inf'})
                    elif isinstance(i,float) and pd.isnull(i):
                        new_set.append(None)
                    else:
                        new_set.append(hint_tuples(i))
                return {'__set__': new_set}
            if isinstance(item, numpy.ndarray):
                new_array = []
                for i in item:
                    if isinstance(i,float) and i == numpy.inf:
                        new_array.append({'__inf__':'inf'})
                    elif isinstance(i,float) and i == -numpy.inf:
                        new_array.append({'__inf__':'-inf'})
                    elif isinstance(i,float) and pd.isnull(i):
                        new_array.append(None)
                    else:
                        new_array.append(hint_tuples(i))
                return {'__numpy__': new_array}
            if isinstance(item, tuple):
                new_tuple = []
                for i in item:
                    if isinstance(i,float) and i == numpy.inf:
                        new_tuple.append({'__inf__':'inf'})
                    elif isinstance(i,float) and i == -numpy.inf:
                        new_tuple.append({'__inf__':'-inf'})
                    elif isinstance(i,float) and pd.isnull(i):
                        new_tuple.append(None)
                    else:
                        new_tuple.append(hint_tuples(i))
                return {'__tuple__': new_tuple}
            if isinstance(item, list):
                new_list = []
                for i in item:
                    if isinstance(i,float) and i == numpy.inf:
                        new_list.append({'__inf__':'inf'})
                    elif isinstance(i,float) and i == -numpy.inf:
                        new_list.append({'__inf__':'-inf'})
                    elif isinstance(i,float) and pd.isnull(i):
                        new_list.append(None)
                    else:
                        new_list.append(hint_tuples(i))
                return new_list
            if isinstance(item, dict):
                new_dict = {}
                for key in item:
                    if isinstance(item[key],float) and item[key] == numpy.inf:
                        new_dict[key] = {'__inf__':'inf'}
                    elif isinstance(item[key],float) and item[key] == -numpy.inf:
                        new_dict[key].append({'__inf__':'-inf'})
                    elif isinstance(item[key],float) and pd.isnull(item[key]):
                        new_dict[key] = None
                    else:
                        new_dict[key] = hint_tuples(item[key])
                return new_dict
            else:
                return item
        
        return super(DefaultEncoder, self).encode(hint_tuples(obj))

    def default(self, o):
        # TODO add more support types
        if hasattr(o, '_repr_html_'):
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