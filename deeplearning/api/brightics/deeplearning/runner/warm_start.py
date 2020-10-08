import abc
import csv
import re
from io import StringIO

import tensorflow as tf

from brightics.deeplearning.util import common_logging

logger = common_logging.get_logger(__name__)


class AbstractWarmStart(metaclass=abc.ABCMeta):

    @property
    @abc.abstractmethod
    def model_path(self):
        pass

    @abc.abstractmethod
    def get_warm_start_settings(self, input_fn=None, model_fn=None, model_fn_params=None):
        pass


class BasicWarmStart(AbstractWarmStart):

    def __init__(self, model, vars_to_warm_start=None, load_only_trainable_vars=False, checkpoint_exclude_scopes=None):
        self._ckpt_to_initialize_from = model['path']
        self._load_only_trainable_vars = load_only_trainable_vars

        vars_to_warm_start = vars_to_warm_start if vars_to_warm_start else '.*'
        checkpoint_exclude_scopes = checkpoint_exclude_scopes if checkpoint_exclude_scopes else ''

        self._vars_to_warm_start = _csv_split(vars_to_warm_start)
        self._checkpoint_exclude_scopes = _csv_split(checkpoint_exclude_scopes)

    @property
    def model_path(self):
        return self._ckpt_to_initialize_from

    def get_warm_start_settings(self, input_fn=None, model_fn=None, model_fn_params=None):

        len_vars_to_warm_start = len(self._vars_to_warm_start)
        len_exclude_scopes = len(self._checkpoint_exclude_scopes)
        _excludes = _exclude_scopes_to_regex(self._checkpoint_exclude_scopes)
        _excludes = _excludes[0] if len(_excludes) else ''

        # make one regex string
        if len_vars_to_warm_start == 0 and len_exclude_scopes == 0:
            _vars_to_warm_start = '.*'
        elif len_vars_to_warm_start == 0 and len_exclude_scopes > 0:
            _vars_to_warm_start = _excludes
        elif len_vars_to_warm_start == 1 and len_exclude_scopes == 0:
            _vars_to_warm_start = self._vars_to_warm_start[0]
        else:
            _vars_to_warm_start = ''.join(['(?=.*({}).*)'.format(v) for v in self._vars_to_warm_start])
            _vars_to_warm_start += _excludes

        if not self._load_only_trainable_vars:
            # make a list of regex
            _vars_to_warm_start = [_vars_to_warm_start]

        logger.debug('BasicWarmStart/vars_to_warm_start : {}'.format(_vars_to_warm_start))

        return tf.estimator.WarmStartSettings(
            ckpt_to_initialize_from=self._ckpt_to_initialize_from,
            vars_to_warm_start=_vars_to_warm_start
        )


class AutoWarmStart(AbstractWarmStart):

    def __init__(self, model, load_only_trainable_vars=False, checkpoint_exclude_scopes=None):
        logger.debug(
            'AutoWarmStart Params == model : {}, load_only_trainable_vars : {}, checkpoint_exclude_scopes: {}'.format(
                model, load_only_trainable_vars, checkpoint_exclude_scopes))
        self._model_path = model['path']
        self._load_only_trainable_vars = load_only_trainable_vars
        checkpoint_exclude_scopes = checkpoint_exclude_scopes if checkpoint_exclude_scopes else ''
        self._checkpoint_exclude_scopes = _csv_split(checkpoint_exclude_scopes)

    @property
    def model_path(self):
        return self._model_path

    def get_warm_start_settings(self, input_fn=None, model_fn=None, model_fn_params=None):
        if not input_fn:
            raise RuntimeError('An input function is required.')
        if not model_fn:
            raise RuntimeError('A model function is required.')

        checkpoint_vars = tf.train.list_variables(self._model_path)
        logger.debug('checkpoint_vars : {}'.format(checkpoint_vars))
        all_vars = _get_vars_from_model_function(input_fn, model_fn, model_fn_params)
        model_fn_vars = all_vars['trainable'] if self._load_only_trainable_vars else all_vars['global']
        inter_vars = _get_vars_intersection(model_fn_vars, checkpoint_vars)
        inter_vars_excluded = _get_all_matched_vars(inter_vars, ['.*'], self._checkpoint_exclude_scopes)
        vars_to_warm_start = _get_regex_list_from_vars(inter_vars_excluded)

        logger.debug('AutoWarmStart/vars_to_warm_start : {}'.format(vars_to_warm_start))

        if len(vars_to_warm_start) > 0:
            _warm_start_settings = tf.estimator.WarmStartSettings(
                ckpt_to_initialize_from=self._model_path,
                vars_to_warm_start=vars_to_warm_start
            )
        else:
            logger.debug('No vars for warm_start.')
            _warm_start_settings = None

        return _warm_start_settings


class AdvancedWarmStart(AbstractWarmStart):

    def __init__(self, model, trainable_vars_expr='.*', trainable_exclude_scopes='',
                 nontrainable_vars_expr='.*', nontrainable_exclude_scopes=''):
        logger.debug(
            'AutoWarmStart Params == model : {}, trainable_vars_expr : {}, trainable_exclude_scopes : {}, nontrainable_vars_expr : {}, nontrainable_exclude_scopes : {}'.format(
                model, trainable_vars_expr, trainable_exclude_scopes, nontrainable_vars_expr,
                nontrainable_exclude_scopes))
        self._model_path = model['path']
        self._trainable_vars_expr = _csv_split(trainable_vars_expr)
        self._trainable_exclude_scopes = _csv_split(trainable_exclude_scopes)
        self._nontrainable_vars_expr = _csv_split(nontrainable_vars_expr)
        self._nontrainable_exclude_scopes = _csv_split(nontrainable_exclude_scopes)

    @property
    def model_path(self):
        return self._model_path

    def get_warm_start_settings(self, input_fn=None, model_fn=None, model_fn_params=None):
        all_vars = _get_vars_from_model_function(input_fn, model_fn, model_fn_params)

        all_trainable_vars = all_vars['trainable']
        trainable_vars = _get_all_matched_vars(all_trainable_vars, self._trainable_vars_expr,
                                               self._trainable_exclude_scopes)
        logger.debug('trainable_vars : {}'.format(trainable_vars))
        logger.debug(
            'trainable vars not set : {}'.format([x for x in all_trainable_vars if x not in trainable_vars]))

        all_nontrainable_vars = [v for v in all_vars['global'] if
                                 not any([t for t in all_vars['trainable'] if v[0] == t[0]])]
        nontrainable_vars = _get_all_matched_vars(all_nontrainable_vars, self._nontrainable_vars_expr,
                                                  self._nontrainable_exclude_scopes)

        logger.debug('nontrainable_vars : {}'.format(nontrainable_vars))
        logger.debug(
            'nontrainable vars not set : {}'.format([x for x in all_nontrainable_vars if x not in nontrainable_vars]))

        _vars_to_warm_start = _get_regex_list_from_vars(trainable_vars + nontrainable_vars)
        logger.debug('vars_to_warm_start : {}'.format(_vars_to_warm_start))

        if len(_vars_to_warm_start) > 0:
            _warm_start_settings = tf.estimator.WarmStartSettings(
                ckpt_to_initialize_from=self._model_path,
                vars_to_warm_start=_vars_to_warm_start
            )
        else:
            logger.debug('No vars for warm_start.')
            _warm_start_settings = None

        return _warm_start_settings


def warm_start_settings(model=None, vars_to_warm_start_expr=None,
                        load_only_trainable_vars=True, **params):
    logger.debug(
        'input params / model : {} / vars_to_warm_start_expr : {} / load_only_trainable_vars : {} / params : {}'.format(
            model, vars_to_warm_start_expr, load_only_trainable_vars, params))

    # for migration of 3.6
    if model is None and 'experiment_name' in params:
        model = {'id': '', 'path': params['experiment_name']}

    if model:
        ckpt_to_initialize_from = model.get('path', '')
        if not ckpt_to_initialize_from:
            raise ValueError('Model path in warm start setting is not assigned.')

        logger.debug('vars_to_warm_start_expr = {}'.format(vars_to_warm_start_expr))
        if vars_to_warm_start_expr:
            vars = _csv_split(vars_to_warm_start_expr)
            # make vars_to_warm_start from vars_to_warm_start_expr

            if load_only_trainable_vars:
                # make one regex
                if len(vars) > 1:
                    vars_to_warm_start = '|'.join(['({})'.format(v) for v in vars])
                else:
                    vars_to_warm_start = vars_to_warm_start_expr
            else:
                # make list of regex
                vars_to_warm_start = vars
        else:
            checkpoint_exclude_scopes = params.get('checkpoint_exclude_scopes', '')
            if not checkpoint_exclude_scopes:
                vars_to_warm_start = '.*'
            else:
                vars_to_warm_start = '^(?!{expr}).*$'.format(
                    expr='|'.join(['({})'.format(v) for v in _csv_split(checkpoint_exclude_scopes)]))

            if not load_only_trainable_vars:
                vars_to_warm_start = [vars_to_warm_start]

        logger.debug('var_to_warm_start : %s', vars_to_warm_start)

        _warm_start_settings = tf.estimator.WarmStartSettings(
            ckpt_to_initialize_from=ckpt_to_initialize_from,
            vars_to_warm_start=vars_to_warm_start
        )
    else:
        _warm_start_settings = None

    return lambda *args, **kwargs: _warm_start_settings


def _csv_split(s, dialect='excel'):
    _s = s if s else ''
    return next(csv.reader(StringIO(_s), dialect=dialect)) if _s.strip() else []


def _get_tensor_var_shape(tv):
    return [v.value for v in tv.shape.dims]


def _get_vars_intersection(model_fn_vars, checkpoint_vars):
    return [v for v in checkpoint_vars if any([v == m for m in model_fn_vars])]


def _get_vars_from_model_function(input_fn, model_fn, model_fn_params, model_fn_mode='train'):
    with tf.Graph().as_default():
        input_iter = input_fn().make_one_shot_iterator()
        data = input_iter.get_next()
        model_fn(data[0], data[1], model_fn_mode, model_fn_params)
        model_fn_vars_trainable = [(x.op.name, [d.value for d in x.shape.dims]) for x in
                                   tf.trainable_variables()]
        model_fn_vars_global = [(x.op.name, [d.value for d in x.shape.dims]) for x in tf.global_variables()]
        return {'trainable': model_fn_vars_trainable, 'global': model_fn_vars_global}


def _exclude_scopes_to_regex(scopes):
    # '^((?!(ex1)|(ex2)).)*$'
    if len(scopes) == 0:
        return []
    _scopes_union = '({})'.format('|'.join(['({})'.format(s) for s in scopes]))
    return ['^((?!{}).)*$'.format(_scopes_union)]


def _get_all_matched_vars(all_vars, exprs, exclude_scopes):
    all_exprs = exprs + _exclude_scopes_to_regex(exclude_scopes)
    logger.debug('match_expre : {}'.format(all_exprs))
    logger.debug('exprs : {}'.format(exprs))
    logger.debug('exclude_scopes : {}'.format(exclude_scopes))
    logger.debug('all_exprs : {}'.format(all_exprs))
    return [v for v in all_vars if all([re.search(r, v[0]) is not None for r in all_exprs])]


def _get_regex_list_from_vars(var_list):
    return ['{}:'.format(v[0]) for v in var_list]
