import os
import glob
import shutil
import tensorflow as tf
from tensorflow.core.util.event_pb2 import SessionLog
from tensorflow.python.framework import meta_graph
from tensorflow.python.framework import ops
from tensorflow.python.platform import tf_logging as logging
from tensorflow.python.training import training_util
from tensorflow.python.training.session_run_hook import SessionRunArgs
from tensorflow.python.training.summary_io import SummaryWriterCache

class BrighticsTrainingHook(tf.train.CheckpointSaverHook):
    def __init__(self,
                 checkpoint_dir,
                 last_step,
                 save_steps,
                 saver=None,
                 checkpoint_basename="model.ckpt",
                 scaffold=None,
                 listeners=None,
                 evaluate_every_checkpoint=False,
                 model_fn=None,
                 model_params=None,
                 input_fn=None,
                 best_weights=False,
                 best_metric='loss',
                 best_condition='lowest'):
        logging.info("Create BrighticsTrainingHook.")
        if saver is not None and scaffold is not None:
            raise ValueError("You cannot provide both saver and scaffold.")
        self._saver = saver
        self._checkpoint_dir = checkpoint_dir
        self._lock_dir = os.path.join(checkpoint_dir, 'lock')
        self._checkpoint_basename = checkpoint_basename
        self._save_path = os.path.join(checkpoint_dir, checkpoint_basename)
        self._scaffold = scaffold
        self._save_steps = save_steps
        # disable the every_secs feature
        self._timer = tf.train.SecondOrStepTimer(every_secs=None, every_steps=save_steps)
        self._listeners = listeners or []
        self._steps_per_run = 1
        self._last_step = last_step
        self._evaluate_every_checkpoint = evaluate_every_checkpoint
        if evaluate_every_checkpoint:
            if model_fn is None or model_params is None or input_fn is None:
                raise ValueError("If evaluate_every_checkpoint is set, model_fn, model_params and input_fn are required.")
            self._model_fn = model_fn
            self._model_params = model_params
            def input_function_wrapper(mode,params):
                return input_fn(mode, 1, params)
            self._input_fn = input_function_wrapper
            self._estimator = tf.estimator.Estimator(
                model_fn=model_fn,
                params=model_params,
                model_dir=checkpoint_dir
            )
        self._best_weights = best_weights
        self._best_metric = best_metric
        self._best_condition = best_condition.lower()
        if not self._best_condition in ('lowest', 'highest'):
            raise ValueError("best_condition is exactly one of lowest and highest.")
        if best_weights and not evaluate_every_checkpoint:
            raise ValueError("best_weights is only applied when evaluate_every_checkpoint is true.")
        if best_weights:
            self._best_checkpoint_dir = os.path.join(self._checkpoint_dir,'best')
            self._best_checkpoint_metric_value = os.path.join(self._best_checkpoint_dir, 'best_metric_value')
        # Hack to remove graph def from summary files.
        evaluation_summary_dir = os.path.join(checkpoint_dir,tf.estimator.ModeKeys.EVAL)
        tf.summary.FileWriterCache._cache[evaluation_summary_dir] = tf.summary.FileWriter(logdir=evaluation_summary_dir,flush_secs=1)

    def _set_steps_per_run(self, steps_per_run):
        self._steps_per_run = steps_per_run

    def begin(self):
        # create directories needed
        if not os.path.exists(self._lock_dir):
            os.makedirs(self._lock_dir)
        if self._best_weights and not os.path.exists(self._best_checkpoint_dir):
            os.makedirs(self._best_checkpoint_dir)
        self._summary_writer = SummaryWriterCache.get(self._checkpoint_dir)
        self._global_step_tensor = training_util._get_or_create_global_step_read()    # pylint: disable=protected-access
        if self._global_step_tensor is None:
            raise RuntimeError(
                "Global step should be created to use CheckpointSaverHook.")
        for l in self._listeners:
            l.begin()

    def after_create_session(self, session, coord):
        global_step = session.run(self._global_step_tensor)
        # We do write graph and saver_def at the first call of before_run.
        # We cannot do this in begin, since we let other hooks to change graph and
        # add variables in begin. Graph is finalized after all begin calls.
        training_util.write_graph(
            ops.get_default_graph().as_graph_def(add_shapes=True),
            self._checkpoint_dir,
            "graph.pbtxt")
        saver_def = self._get_saver().saver_def if self._get_saver() else None
        graph = ops.get_default_graph()
        meta_graph_def = meta_graph.create_meta_graph_def(
            graph_def=graph.as_graph_def(add_shapes=True),
            saver_def=saver_def)
        self._summary_writer.add_graph(graph)
        self._summary_writer.add_meta_graph(meta_graph_def)
        # The checkpoint saved here is the state at step "global_step".
        # Trigger if only zero step.
        if global_step == 0:
            open(os.path.join(self._lock_dir,'0'),'w').close()
            self._save(session, global_step)
        self._timer.update_last_triggered_step(global_step)

    def before_run(self, run_context):    # pylint: disable=unused-argument
        return SessionRunArgs(self._global_step_tensor)

    def after_run(self, run_context, run_values):
        stable_global_step = run_values.results
        # get the real value after train op.
        global_step = run_context.session.run(self._global_step_tensor)
        if self._timer.should_trigger_for_step(stable_global_step + self._steps_per_run) and self._timer.should_trigger_for_step(global_step):
            self._timer.update_last_triggered_step(global_step)
            # Control this save step by acquiring a lock
            next_checkpoint_step = self._acquire_lock(global_step)
            if next_checkpoint_step is not None:
                logging.info("Acquire a lock for the global step %d and the next point is %d.", global_step,next_checkpoint_step)
                # Change global step to this checkpoint step.
                request_stop = self._save(run_context.session, next_checkpoint_step)
                self._evaluate(next_checkpoint_step)
                if request_stop:
                    run_context.request_stop()
            else:
                logging.info("Insufficient global step value to save checkpoint.")
        # StopAtStep Part
        if global_step >= self._last_step:
            run_context.request_stop()

    def _evaluate(self, step_value):
        if self._evaluate_every_checkpoint:
            ckpt_path = self._save_path+'-'+str(step_value)
            result = self._estimator.evaluate(
                self._input_fn,
                checkpoint_path=ckpt_path
            )
            logging.info("End checkpoint step : "+ str(step_value))
            logging.info('Evaluation complete. The result is : ')
            logging.info(result)
            if self._best_weights and self._compare_best(step_value, result[self._best_metric]):
                for file in glob.glob(ckpt_path + ".*"):
                    shutil.copy(file, self._best_checkpoint_dir)



    def _compare_best(self, step_value, curr_val):
        if not os.path.isfile(self._best_checkpoint_metric_value):
            # first time
            promote_best = True
        else:
            with open(self._best_checkpoint_metric_value,'r') as f:
                best_val = float(f.read().strip().splitlines()[-1].split(',')[1])
            promote_best = self._compare_value(curr_val, best_val)
        if promote_best:
            with open(self._best_checkpoint_metric_value,'a') as f:
                f.write(str(step_value)+','+str(curr_val)+'\n')
        return promote_best

    def _compare_value(self, current, compare):
        a = float(current)
        b = float(compare)
        return (self._best_condition == 'lowest' and a <= b) or (self._best_condition == 'highest' and a >= b)

    def _acquire_lock(self, global_step):
        try:
            next_checkpoint_expected = max([int(f.split('.')[0]) for f in os.listdir(self._lock_dir)]) + self._save_steps
        except:
            # This can be first checkpoint
            next_checkpoint_expected = self._save_steps
        if global_step >= next_checkpoint_expected:
            try:
                open(os.path.join(self._lock_dir,str(next_checkpoint_expected)), 'w').close()
            except:
                #closed outside
                return None
            return next_checkpoint_expected
        else:
            return None

    def _acquire_last_lock(self, global_step):
        last_lock_path = os.path.join(self._lock_dir,str(self._last_step))
        if global_step >= self._last_step and not os.path.isfile(last_lock_path):
            try:
                open(last_lock_path, 'w').close()
            except:
                #closed outside
                return False
            return True
        else:
            return False

    def _organize_best_dir(self):
        if self._best_weights and os.path.isfile(self._best_checkpoint_metric_value):
            with open(self._best_checkpoint_metric_value, 'r') as f:
                best_step, best_value = ('','')
                for line in f.read().strip().splitlines():
                    s, v = line.split(',')
                    if best_step == '' or self._compare_value(v, best_value):
                        best_step = s
                        best_value = v
            for file in glob.glob(os.path.join(self._best_checkpoint_dir,self._checkpoint_basename) + "*"):
                if not self._checkpoint_basename+'-'+best_step+'.' in file:
                    os.remove(file)
            with open(os.path.join(self._best_checkpoint_dir,'checkpoint'),'w') as f:
                f.write('model_checkpoint_path: "{}"'.format(self._checkpoint_basename+'-'+best_step))


    def end(self, session):
        current_global_step = session.run(self._global_step_tensor)
        if current_global_step != self._timer.last_triggered_step() and self._acquire_last_lock(current_global_step):
            if current_global_step < self._last_step:
                # if EarlyStop hook
                step_value = self._current_global_step
            else:
                # if StopAtStep hook
                step_value = self._last_step
            self._save(session, step_value)
            self._evaluate(step_value)
            self._organize_best_dir()
        for l in self._listeners:
            l.end(session, current_global_step)

    def _save(self, session, step):
        logging.info("Saving checkpoints for %d into %s.", step, self._save_path)

        for l in self._listeners:
            l.before_save(session, step)

        self._get_saver().save(session, self._save_path, global_step=step)
        self._summary_writer.add_session_log(
            SessionLog(
                status=SessionLog.CHECKPOINT, checkpoint_path=self._save_path),
            step)

        should_stop = False
        for l in self._listeners:
            if l.after_save(session, step):
                logging.info(
                    "A CheckpointSaverListener requested that training be stopped. "
                    "listener: {}".format(l))
                should_stop = True
        return should_stop

    def _get_saver(self):
        if self._saver is not None:
            return self._saver
        elif self._scaffold is not None:
            return self._scaffold.saver

        # Get saver from the SAVERS collection if present.
        collection_key = ops.GraphKeys.SAVERS
        savers = ops.get_collection(collection_key)
        if not savers:
            raise RuntimeError(
                "No items in collection {}. Please add a saver to the collection "
                "or provide a saver or scaffold.".format(collection_key))
        elif len(savers) > 1:
            raise RuntimeError(
                "More than one item in collection {}. "
                "Please indicate which one to use by passing it to the constructor.".
                    format(collection_key))

        self._saver = savers[0]
        return savers[0]