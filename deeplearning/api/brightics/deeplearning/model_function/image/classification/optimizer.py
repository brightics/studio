from functools import partial

import tensorflow as tf


def adadelta(**params):
    def _wrapped_adadelta(learning_rate, global_step):
        return tf.train.AdadeltaOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_adadelta


def adagrad(**params):
    def _wrapped_adagrad(learning_rate, global_step):
        return tf.train.AdagradOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_adagrad


def adagrad_da(**params):
    def _wrapped_adagrad_da(learning_rate, global_step):
        return tf.train.AdagradDAOptimizer(learning_rate=learning_rate, global_step=global_step, **params)
    return _wrapped_adagrad_da

def adam(**params):
    def _wrapped_adam(learning_rate, global_step):
        return tf.train.AdamOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_adam


def ftrl(**params):
    def _wrapped_ftrl(learning_rate, global_step):
        return tf.train.FtrlOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_ftrl


def gradient_descent(**params):
    def _wrapped_gradient_descent(learning_rate, global_step):
        return tf.train.GradientDescentOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_gradient_descent

def momentum(**params):
    def _wrapped_momentum(learning_rate, global_step):
        return tf.train.MomentumOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_momentum    


def proximal_adagrad(**params):
    def _wrapped_proximal_adagrad(learning_rate, global_step):
        return tf.train.ProximalAdagradOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_proximal_adagrad

def proximal_gradient_descent(**params):
    def _wrapped_proximal_gradient_descent(learning_rate, global_step):
        return tf.train.ProximalGradientDescentOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_proximal_gradient_descent

def rmsprop(**params):
    def _wrapped_rmsprop(learning_rate, global_step):
        return tf.train.RMSPropOptimizer(learning_rate=learning_rate, **params)
    return _wrapped_rmsprop
