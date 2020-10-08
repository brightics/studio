import tensorflow as tf


def accuracy(labels, logits, **params):
    _accuracy = tf.metrics.accuracy(tf.argmax(labels, axis=1), tf.argmax(logits, axis=1))
    return 'accuracy', _accuracy


def mean_square_error(labels, logits, **params):
    return 'mean_square_error', tf.metrics.mean_squared_error(tf.argmax(labels, axis=1), tf.argmax(logits, axis=1))


def top_k_accuracy(labels, logits, **params):
    assert 'k' in params
    k = params['k']
    _top_k_accuracy = tf.metrics.mean(tf.nn.in_top_k(logits, tf.argmax(labels, axis=1), k))
    return 'top_{}'.format(k), _top_k_accuracy
