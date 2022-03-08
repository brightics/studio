import os
from functools import reduce
from itertools import groupby

import tensorflow as tf

from brightics.deeplearning.util import common_logging
import json

logger = common_logging.get_logger(__name__)


class EventParser:

    def __init__(self, model_path):
        logger.debug('model_path : {}'.format(model_path))
        self.model_path = model_path

    def _remove_key(self, source_list, elem_to_remove):
        for e in source_list:
            if e == elem_to_remove:
                source_list.remove(e)

    def _parse(self, mode, mode_key=None):
        if mode_key is None:
            mode_key = mode
        target_path = os.path.join(self.model_path, mode)
        result = {}
        if os.path.isdir(target_path) and os.path.exists(target_path):
            for _, _, filenames in os.walk(target_path):
                filenames.sort()
                for f in filenames:
                    if f.startswith('events'):
                        for e in tf.train.summary_iterator(os.path.join(target_path, f)):
                            if e.step and len(e.summary.value) != 0:
                                step_val = e.step
                                vs = [value for value in e.summary.value if value.HasField('simple_value')]
                                for v in vs:
                                    tag_val = v.tag.split('/')[-1]
                                    if result.get(tag_val) is None:
                                        result[tag_val] = {"keys": ['step', mode_key], "data": []}
                                    value = v.simple_value
                                    result[tag_val]['data'].append({'step': step_val, mode_key: value})
            for t, v in result.items():
                v['data'].sort(key=lambda x: x['step'])
            return result
        return None

    def evaluate(self):
        return self._parse('eval')

    def train(self):
        return self._parse('train')

    def test(self):
        return self._parse('eval_test', 'test')

    def merge(self, target_data, source_data, source_mode):
        if target_data is not None and source_data is not None:
            for metric, values in source_data.items():
                if target_data.get(metric) is None:
                    target_data[metric] = values
                else:
                    target_data[metric]['keys'].append(source_mode)

                    result_data = values['data'] + target_data[metric]['data']

                    def reduce_func(dict_1, dict_2):
                        return {**dict_1, **dict_2}

                    def key_func(obj):
                        return obj['step']

                    result_data.sort(key=key_func)
                    target_data[metric]['data'] = [reduce(reduce_func, group) for _, group in
                                                   groupby(result_data, key=key_func)]

    def get_all(self):
        train_data = self.train()
        eval_data = self.evaluate()
        test_data = self.test()

        self.merge(train_data, eval_data, 'eval')
        self.merge(train_data, test_data, 'test')
        return json.dumps(train_data)
