import json
from string import Template

import tensorflow as tf

from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj
from brightics.deeplearning.model_function.base import AbstractSBrainModelFunction, \
    AbstractUserDefinedModelFunction
from brightics.deeplearning.util import common_logging

logger = common_logging.get_logger(__name__)

CODE_TEMPLATE = Template('''
def model_function(features, labels, mode, params):
    import json
    
    from brightics.deeplearning.model_function import ImageClassificationModelFunction
    json_param = \'\'\'$spec_json\'\'\'
    return ImageClassificationModelFunction(json.loads(json_param)).model_function(features, labels, mode, params)
''')


def _get_variables_to_train(trainable_scopes):
    if trainable_scopes is None:
        return tf.trainable_variables()
    else:
        scopes = [scope.strip() for scope in trainable_scopes]

    variables_to_train = []
    for scope in scopes:
        variables = tf.get_collection(tf.GraphKeys.TRAINABLE_VARIABLES, scope)
        variables_to_train.extend(variables)
    return variables_to_train


class ImageClassificationModelFunction(AbstractUserDefinedModelFunction, AbstractSBrainModelFunction):

    def __init__(self, model_function_spec):
        self.spec = model_function_spec

    def model_function(self, features, labels, mode, params):

        inputs = features
        if isinstance(inputs, dict):
            inputs = features['image']

        '''
        Compute logits
        Assume using networks only in TF-Slim
        '''
        is_training = (mode == tf.estimator.ModeKeys.TRAIN)

        model = self._get_network_obj()
        fine_tune = self._get_fine_tune()
        trainable_scopes = self._get_trainable_scopes()
        logger.debug('model: {}, fine_tune: {}, trainable_scopes: {}'.format(model, fine_tune,trainable_scopes))

        logits, end_points = model.run(inputs=inputs, is_training=is_training)

        '''
        predictions
        '''
        if mode == tf.estimator.ModeKeys.PREDICT:
            predictions = self._get_predictions(features, labels, logits, end_points)

            return tf.estimator.EstimatorSpec(
                mode=mode,
                predictions=predictions
            )

        if isinstance(labels, dict):
            labels = labels['label']

        loss = self._get_loss(labels=labels, logits=logits)
        logger.debug('loss: {}'.format(loss))
        loss = tf.losses.get_total_loss()

        '''
        metrics - eval_metric_ops
        '''
        metrics = self._get_eval_metrics(labels=labels, logits=logits)
        logger.debug('eval_metrics: {}'.format(metrics))

        if mode == tf.estimator.ModeKeys.EVAL:
            return tf.estimator.EstimatorSpec(
                mode=mode,
                loss=loss,
                eval_metric_ops=metrics)

        assert is_training, 'Undefined estimator mode : {}'.format(mode)

        for metrics_k, metrics_v in metrics.items():
            tf.summary.scalar("train_{}".format(metrics_k), metrics_v[1])

        '''
        optimizer
        learning_rate
        train_op
        '''
        global_step = tf.train.get_or_create_global_step()
        learning_rate = self._get_learning_rate(global_step)

        tf.identity(learning_rate, name='log_learning_rate')
        tf.summary.scalar('learning_rate', learning_rate)

        optimizer = self._get_optimizer(learning_rate=learning_rate, global_step=global_step)
        scope_to_train = None if fine_tune else trainable_scopes

        variables_to_train = _get_variables_to_train(scope_to_train)
        logger.debug('learning_rate: {}, optimizer: {}'.format(learning_rate, optimizer))
        logger.debug('variables_to_train: {}'.format(variables_to_train))

        train_op = tf.contrib.training.create_train_op(total_loss=loss, optimizer=optimizer, global_step=global_step,
                                                       variables_to_train=variables_to_train)

        return tf.estimator.EstimatorSpec(
            mode=mode,
            loss=loss,
            train_op=train_op)

    def model_code(self):
        return CODE_TEMPLATE.substitute(spec_json=self._get_jsonspec())

    def sbrain_hparams(self):
        return {}

    def sbrain_code(self):
        return self.model_code()

    def _get_jsonspec(self):
        return json.dumps(self.spec)

    def _get_network_obj(self):
        return get_python_object_from_spec_obj(self.spec['network'])

    def _get_fine_tune(self):
        return self.spec['network']['params'].get('fine_tune', True)

    def _get_trainable_scopes(self, delimiter=','):
        _trainable_scopes = self.spec['network']['params'].get('trainable_scopes', '').strip()
        return _trainable_scopes.split(delimiter) if len(_trainable_scopes) > 0 else None

    def _get_predictions(self, features, labels, logits, end_points):
        predictions_spec_list = self.spec['predictions']

        predictions = {}
        for pred_elem in predictions_spec_list:
            if 'params' not in pred_elem.keys():
                pred_elem['params'] = {}
            pred_elem['params']['_features'] = features
            pred_elem['params']['_labels'] = labels
            pred_elem['params']['_logits'] = logits
            pred_elem['params']['_end_points'] = end_points
            pred_k, pred_v = get_python_object_from_spec_obj(pred_elem)
            predictions[pred_k] = pred_v

        return predictions

    def _get_loss(self, labels, logits):
        loss_fn = get_python_object_from_spec_obj(self.spec['loss'])
        return loss_fn(labels=labels, logits=logits)

    def _get_eval_metrics(self, labels, logits):
        eval_metrics_spec_list = self.spec['eval_metrics']

        eval_metrics = {}
        for metric_elem in eval_metrics_spec_list:
            if 'params' not in metric_elem.keys():
                metric_elem['params'] = {}
            metric_elem['params']['labels'] = labels
            metric_elem['params']['logits'] = logits
            metric_k, metric_v = get_python_object_from_spec_obj(metric_elem)
            eval_metrics[metric_k] = metric_v

        return eval_metrics

    def _get_learning_rate(self, global_step):
        learning_rate_policy_fn = get_python_object_from_spec_obj(self.spec['learning_rate_policy'])
        return learning_rate_policy_fn(global_step=global_step)

    def _get_optimizer(self, learning_rate, global_step):
        optimizer_fn = get_python_object_from_spec_obj(self.spec['optimizer'])
        return optimizer_fn(learning_rate=learning_rate, global_step=global_step)
