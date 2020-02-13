from string import Template

TEMPLATE_SBRAIN_MODEL_FN_CODE = Template("""
def brightics_model_fn(features, labels, mode, params):

    $model_code
    
    if mode == tf.estimator.ModeKeys.PREDICT:
        return model_function(features, labels, mode, params)
        
    $input_code
    
    import os
    import inspect
    from brightics.deeplearning.runner.hooks import BrighticsTrainingHook
    from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj
         
    model_root = r'$model_home'
    model_home = os.path.join(model_root,'$experiment_name')
    train_log_dir = os.path.join(model_home,'train')
    eval_log_dir = os.path.join(model_home,'eval')
    eval_test_log_dir = os.path.join(model_home,'eval_test')
    run_eval = params['data_params']['evaluate']
    
    returned = model_function(features, labels, mode, params)
    
    tf.summary.scalar("loss", returned.loss)
    summary_hook = tf.train.SummarySaverHook(
        save_steps=$save_summaries_steps,
        summary_op=tf.summary.merge_all(),
        summary_writer=tf.summary.FileWriter(logdir=train_log_dir,flush_secs=1))
    new_hooks = []
    new_hooks.extend(returned.training_hooks)
    new_hooks.append(summary_hook)
        
    csh = BrighticsTrainingHook(
            model_home,
            save_steps=$evaluation_steps,
            last_step=$last_step,
            evaluate_every_checkpoint=run_eval,
            model_fn=model_function,
            model_params=params,
            input_fn=brightics_input_fn,
            best_weights=$best_weights,
            best_metric='$best_metric',
            best_condition='$best_condition',
            )
    # TODO export_best            
    new_hooks.append(csh)
    
    # FileWriterCache hack to make this estimator skip writing the default graph in its event log
    tf.summary.FileWriterCache._cache[eval_test_log_dir] = tf.summary.FileWriter(logdir=eval_test_log_dir,flush_secs=1)
    
    # early stopping hook (early_stopping_hook)
    early_stopping_hook = get_python_object_from_spec_obj($early_stopping_hook)
    if early_stopping_hook:
        if inspect.isclass(early_stopping_hook):
            # For migration of changing spec of early_stopping
            new_hooks.append(early_stopping_hook)
        else:
            new_hooks.append(early_stopping_hook(worker_type='sbrain'))
    
    return tf.estimator.EstimatorSpec(returned.mode, predictions=returned.predictions,
                  loss=returned.loss,
                  train_op=returned.train_op,
                  eval_metric_ops=returned.eval_metric_ops,
                  export_outputs=returned.export_outputs,
                  training_chief_hooks=returned.training_chief_hooks,
                  training_hooks=new_hooks,
                  scaffold=returned.scaffold,
                  evaluation_hooks=returned.evaluation_hooks,
                  prediction_hooks=returned.prediction_hooks)
""")

TEMPLATE_SBRAIN_INPUT_FN_CODE = Template("""
def brightics_input_fn(mode, batch_size, params):
    from brightics.deeplearning.runner.utils import get_input_function
    from brightics.deeplearning.dataflow.utils.dataflow_parser import parse
    
    if mode == 'train':
        spec = parse($train_input_spec)
        return get_input_function(spec)()
    elif mode == 'eval':
        spec = $eval_input_spec
        assert spec is not None, 'input function for validation channel is not provided.'
        return get_input_function(parse(spec))()
    elif mode == 'test':
        spec = $test_input_spec
        assert spec is not None, 'input function for test channel is not provided.'
        return get_input_function(parse(spec))()
    else:
        raise Exception('Unknown mode key.')

""")
