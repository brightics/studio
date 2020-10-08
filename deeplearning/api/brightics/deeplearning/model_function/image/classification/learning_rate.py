import tensorflow as tf

def exponential_decay(**params):
    def _wrapped_exponential_decay(global_step):
        return tf.train.exponential_decay(global_step=global_step, **params)

    return _wrapped_exponential_decay

def fixed(**params):
    return lambda **x: params['learning_rate']

def polynomial_decay(**params):
    def _wrapped_polynomial_decay(global_step):
        return tf.train.polynomial_decay(global_step=global_step, **params)

    return _wrapped_polynomial_decay

def inverse_time_decay(**params):
    def _wrapped_inverse_time_decay(global_step):
        return tf.train.inverse_time_decay(global_step=global_step, **params)
    
    return _wrapped_inverse_time_decay

def natural_exp_decay(**params):
    def _wrapped_natural_exp_decay(global_step):
        return tf.train.natural_exp_decay(global_step=global_step, **params)
    return _wrapped_natural_exp_decay

def piecewise_constant(**params):
    params['boundaries'] = [int(x.strip()) for x in params['boundaries'].split(',')]
    params['values'] = [float(x.strip()) for x in params['values'].split(',')]

    def _wrapped_piecewise_constant(global_step):
        return tf.train.piecewise_constant(x=global_step, **params)
    return _wrapped_piecewise_constant

def cosine_decay(**params):
    def _wrapped_cosine_decay(global_step):
        return tf.train.cosine_decay(global_step=global_step, **params)
    
    return _wrapped_cosine_decay

def linear_cosine_decay(**params):
    def _wrapped_linear_cosine_decay(global_step):
        return tf.train.linear_cosine_decay(global_step=global_step, **params)
    
    return _wrapped_linear_cosine_decay

def noisy_linear_cosine_decay(**params):
    def _wrapped_noisy_linear_cosine_decay(global_step):
        return tf.train.noisy_linear_cosine_decay(global_step=global_step, **params)
    
    return _wrapped_noisy_linear_cosine_decay