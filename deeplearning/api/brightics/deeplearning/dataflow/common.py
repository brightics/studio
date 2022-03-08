import pprint
import logging
import itertools
import multiprocessing
from functools import partial
import six

import numpy as np

from tensorpack.dataflow.common import BatchData as tp_BatchData 
from tensorpack.dataflow.common import MapData
from tensorpack.dataflow.common import PrintData as tp_PrintData
from tensorpack.dataflow.parallel_map import MultiThreadMapData
from tensorpack.dataflow.parallel_map import MultiProcessMapData
from tensorpack.dataflow.parallel import PrefetchDataZMQ 
from tensorpack.dataflow.parallel import PrefetchData

logger = logging.getLogger(__name__)


class BatchData(tp_BatchData):

    def __iter__(self):
        holder = []
        for data in self.ds:
            holder.append(data)
            if len(holder) == self.batch_size:
                yield BatchData._aggregate_batch(holder, self.use_list)
                del holder[:]
        if self.remainder and len(holder) > 0:
            yield BatchData._aggregate_batch(holder, self.use_list)
    
    @staticmethod
    def _batch_numpy(data_list):
        data = data_list[0]
        if isinstance(data, six.integer_types):
            dtype = 'int32'
        elif type(data) == bool:
            dtype = 'bool'
        elif type(data) == float:
            dtype = 'float32'
        elif isinstance(data, (six.binary_type, six.text_type)):
            dtype = 'str'
        else:
            try:
                dtype = data.dtype
            except AttributeError:
                raise TypeError("Unsupported type to batch: {}".format(type(data)))
        try:
            return np.asarray(data_list, dtype=dtype)
        except Exception as e:  # noqa
            logger.error("Cannot batch data. Perhaps they are of inconsistent shape?")
            if isinstance(data, np.ndarray):
                s = pprint.pformat([x.shape for x in data_list])
                logger.error("Shape of all arrays to be batched: " + s)
            raise e
    
    @staticmethod
    def _aggregate_batch(data_holder, use_list=False):
        first_dp = data_holder[0]
        if isinstance(first_dp, (list, tuple)):
            result = []
            for k in range(len(first_dp)):
                data_list = [x[k] for x in data_holder]
                first_dp_k = first_dp[k]
                if isinstance(first_dp_k, dict):
                    result.append(BatchData._aggregate_batch(data_list, use_list))
                else:
                    if use_list:
                        result.append(data_list)
                    else:
                        result.append(BatchData._batch_numpy(data_list))
            if isinstance(first_dp, tuple):
                result = tuple(result)
        elif isinstance(first_dp, dict):
            result = {}
            for key in first_dp.keys():
                data_list = [x[key] for x in data_holder]
                if use_list:
                    result[key] = data_list
                else:
                    result[key] = BatchData._batch_numpy(data_list)
        return result
    
    
class PrintData(tp_PrintData):

    def __init__(self, ds, num=1, name=None, max_depth=5, max_list=5):
        super(PrintData, self).__init__(ds, num, name, max_depth, max_list)
    
    def _analyze_input_data(self, entry, k, depth=1, max_depth=5, max_list=5):
        """
        Gather useful debug information from a datapoint.

        Args:
            entry: the datapoint component
            k (int): index of this component in current datapoint
            depth (int, optional): recursion depth
            max_depth, max_list: same as in :meth:`__init__`.

        Returns:
            string: debug message
        """

        class _elementInfo(object):

            def __init__(self, el, pos, depth=0, max_list=3):
                self.shape = ""
                self.type = type(el).__name__
                self.dtype = ""
                self.range = ""

                self.sub_elements = []

                self.ident = " " * (depth * 2)
                self.pos = pos

                numpy_scalar_types = list(itertools.chain(*np.sctypes.values()))
                
                if isinstance(el, dict):
                    self.shape = " of len {}".format(len(el))

                    if depth < max_depth:
                        for k, (subkey, subel) in enumerate(el.items()):
                            if k < max_list:
                                self.sub_elements.append(_elementInfo(subel, subkey, depth + 1, max_list))
                            else:
                                self.sub_elements.append(" " * ((depth + 1) * 2) + '...')
                                break
                    else:
                        if len(el) > 0:
                            self.sub_elements.append(" " * ((depth + 1) * 2) + ' ...')
                
                elif isinstance(el, (int, float, bool)):
                    self.range = " with value {}".format(el)
                elif type(el) is np.ndarray:
                    self.shape = " of shape {}".format(el.shape)
                    self.dtype = ":{}".format(str(el.dtype))
                    self.range = " in range [{}, {}]".format(el.min(), el.max())
                elif type(el) in numpy_scalar_types:
                    self.range = " with value {}".format(el)
                elif isinstance(el, (list)):
                    self.shape = " of len {}".format(len(el))

                    if depth < max_depth:
                        for k, subel in enumerate(el):
                            if k < max_list:
                                self.sub_elements.append(_elementInfo(subel, k, depth + 1, max_list))
                            else:
                                self.sub_elements.append(" " * ((depth + 1) * 2) + '...')
                                break
                    else:
                        if len(el) > 0:
                            self.sub_elements.append(" " * ((depth + 1) * 2) + ' ...')

            def __str__(self):
                strings = []
                vals = (self.ident, self.pos, self.type, self.dtype, self.shape, self.range)
                strings.append("{}{}: {}{}{}{}".format(*vals))

                for k, el in enumerate(self.sub_elements):
                    strings.append(str(el))
                return "\n".join(strings)

        return str(_elementInfo(entry, k, depth, max_list))

    def _get_msg(self, dp):
        if isinstance(dp, dict):
            msg = [u"datapoint %i<%i with %i components consists of" % (self.cnt, self.num, 1)]
            msg.append(self._analyze_input_data(dp, 0, max_depth=self.max_depth, max_list=self.max_list))
                
        else:
            msg = [u"datapoint %i<%i with %i components consists of" % (self.cnt, self.num, len(dp))]
            for k, entry in enumerate(dp):
                msg.append(self._analyze_input_data(entry, k, max_depth=self.max_depth, max_list=self.max_list))
        return u'\n'.join(msg)
    
    
def mapdata():

    def mapdata_ftn(ds, map_func):
        return MapData(ds, map_func)
    
    return mapdata_ftn


def multithread_mapdata(num_thread=None, buffer_size=200, strict=True):
    if num_thread is None:
        num_thread = multiprocessing.cpu_count() // 2
    return partial(MultiThreadMapData, nr_thread=num_thread, buffer_size=buffer_size, strict=strict)
    

def multiprocess_mapdata(num_proc=None, buffer_size=200, strict=False):
    if num_proc is None:
        num_proc = multiprocessing.cpu_count() // 2
    return partial(MultiProcessMapData, num_proc=num_proc, buffer_size=buffer_size, strict=strict)


def multiprocess_runner_zmq(num_proc=None, hwm=50):
    if num_proc is None:
        num_proc = multiprocessing.cpu_count() // 2
    return partial(PrefetchDataZMQ, num_proc=num_proc, hwm=hwm)


def multiprocess_runner(num_proc=None, num_prefetch=200):
    if num_proc is None:
        num_proc = multiprocessing.cpu_count() // 2
    return partial(PrefetchData, nr_prefetch=num_prefetch, nr_proc=num_proc)
    
