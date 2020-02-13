import tensorflow as tf

losses = tf.losses


def sigmoid_cross_entropy(**kwargs):
    def _wrapped_sigmoid_cross_entropy(labels, logits):
        return losses.sigmoid_cross_entropy(multi_class_labels=labels, logits=logits, **kwargs)

    return _wrapped_sigmoid_cross_entropy


def softmax_cross_entropy(**kwargs):
    def _wrapped_softmax_cross_entropy(labels, logits):
        return losses.softmax_cross_entropy(onehot_labels=labels, logits=logits, **kwargs)

    return _wrapped_softmax_cross_entropy


def sparse_softmax_cross_entropy(**kwargs):
    def _wrapped_sparse_softmax_cross_entropy(labels, logits):
        return losses.sparse_softmax_cross_entropy(labels=labels, logits=logits, **kwargs)

    return _wrapped_sparse_softmax_cross_entropy
