import tensorflow as tf


def prediction(_logits, **params):
    return 'prediction', tf.argmax(_logits, axis=1)


def probabilities(_logits, **params):
    return 'probabilities', tf.nn.softmax(_logits)


def top_k(_logits, k, **params):
    return 'top_{}'.format(k), tf.nn.top_k(_logits, k)[1]


def features(_features, feature_key, **params):
    if feature_key:
        return 'features.{feature_key}'.format(feature_key=feature_key), _features[feature_key]
    else:
        return 'features', _features


def tensor_in_graph(tensor_name, **params):
    return 'tensor_{tensor_name}'.format(tensor_name=tensor_name), tf.get_default_graph().get_tensor_by_name(tensor_name)


def end_point(_end_points, end_point_name, **params):
    return 'end_point_{}'.format(end_point_name), _end_points[end_point_name]
