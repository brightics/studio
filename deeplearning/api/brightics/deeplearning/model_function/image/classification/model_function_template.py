#
# Tensorflow Estimator Model Function Template
#
# features : batch_features from input function
# labels : batch_labels from input function
# mode : An instance of tf.estimator.ModeKeys (TRAIN, EVAL, PREDICT)
# params : Additional configuration
#
def model_function(features, labels, mode, params):
    import tensorflow as tf

    if mode == tf.estimator.ModeKeys.PREDICT:
        return tf.estimator.EstimatorSpec(
            mode=mode,
            predictions=None
        )

    if mode == tf.estimator.ModeKeys.TRAIN:
        return tf.estimator.EstimatorSpec(
            mode=mode,
            loss=None,
            train_op=None
        )

    if mode == tf.estimator.ModeKeys.EVAL:
        return tf.estimator.EstimatorSpec(
            mode=mode,
            loss=None
        )
