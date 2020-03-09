#
# Indicates this is a DL fix for Studio.
#
import copy
import json
import logging
import os
import subprocess
import sys
import time
import traceback
from datetime import datetime

import psutil

from brightics.deeplearning import config
from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj
from brightics.deeplearning.runner.parent_runner import ParentJobRunner
from brightics.deeplearning.runner.utils import get_random_name_from_millis
from brightics.deeplearning.runner.warm_start import AbstractWarmStart
from brightics.deeplearning.util import common_logging, job_scheduler

logger = common_logging.get_logger(__name__)
TF_LOG_NAME = 'tensorflow'
RESOURCES_DIR = 'resources'
INPUT_FUNCTION_FILENAME = 'input_function.py'
MODEL_FUNCTION_FILENAME = 'model_function.py'
SPEC_FILENAME = 'spec.json'
ASSIGNED_GPUS_FILENAME = 'assigned_gpus'
STATUS_PREFIX = 'STATUS.'

class LocalJobRunner(ParentJobRunner):

    def __init__(self):

        millis = int(round(time.time() * 1000))
        experiment_name = get_random_name_from_millis(millis)
        job_dir = config.get_model_base_path()

        super().__init__(experiment_name, millis, job_dir)

    def run(self, job_spec_jsonstr):

        model_dir = os.path.join(self.job_dir, self.experiment_name)
        function_file_dir = os.path.join(model_dir, RESOURCES_DIR)

        try:
            if not (os.path.isdir(function_file_dir)):
                os.makedirs(os.path.join(function_file_dir))
        except OSError as e:
            logger.info("Failed to create directory from %s : %s", function_file_dir, e)
            raise

        self._change_status(model_dir, 'Waiting')
        self.make_run_param(job_spec_jsonstr)

        input_function_file_path = os.path.join(function_file_dir, INPUT_FUNCTION_FILENAME)
        with open(input_function_file_path, 'w', encoding='utf-8') as input_file:
            input_file.write(self.brightics_input_function_code)

        model_function_file_path = os.path.join(function_file_dir, MODEL_FUNCTION_FILENAME)
        with open(model_function_file_path, 'w', encoding='utf-8') as model_file:
            model_file.write("import tensorflow as tf\n")
            model_file.write(self.brightics_model_function)

        spec_file_path = os.path.join(function_file_dir, SPEC_FILENAME)
        with open(spec_file_path, 'w', encoding='utf-8') as spec_file:
            spec_file.write(job_spec_jsonstr)

        # Open training job with some modified envs
        child_env = os.environ.copy()
        python_exec = os.getenv('BRIGHTICS_DL_PYTHON_PATH', 'python')

        # Try to run gpu scheduler if it is not initialized
        psutil.Popen([python_exec, "-c",
                      f"from brightics.deeplearning.util import job_scheduler; job_scheduler.listener();"],
                     cwd=model_dir, env=child_env, stdout=open(os.devnull, 'w'), stderr=open(os.devnull, 'w'))

        # Open training job
        proc = psutil.Popen([python_exec, "-c",
                             f"from brightics.deeplearning.runner.local_job_runner import LocalJobRunner; LocalJobRunner().internal_run(r'{model_dir}');"],
                            cwd=model_dir, env=child_env, stdout=open(os.path.join(model_dir, 'stdout'), 'w'),
                            stderr=subprocess.STDOUT, bufsize=1)
        # Write pid file
        with open(os.path.join(model_dir, self.experiment_name + '.pid'), 'w') as pid_file:
            pid_file.write(str(proc.pid))

        results = {
            'experiment_name': self.experiment_name,
            'output_path': os.path.normpath(model_dir),
            'learning_jobs': None,
            'created_date': datetime.now().isoformat()
        }

        logger.info('Training Job Results : %s', json.dumps(results))
        return results

    # This function can be called externally by cmd or something.
    def internal_run(self, model_dir):
        try:
            import tensorflow as tf

            # create private logger
            tf.logging.set_verbosity(tf.logging.INFO)
            common_logging.get_logger(TF_LOG_NAME)
            train_logger = common_logging.get_logger(self.experiment_name)

            train_logger.info("Training job is starting...")

            # update experiment name from model_dir
            path = os.path.normpath(model_dir)
            self.experiment_name = path.split(os.sep)[-1]

            resources_path = os.path.join(model_dir, RESOURCES_DIR)
            with open(os.path.join(resources_path, SPEC_FILENAME), 'rt', encoding='utf-8') as job_spec_file:
                self.make_run_param(job_spec_file.read())

            # Select available gpu or cpu env when it is not found
            self.avail_gpu = []
            device_type, device_id = "CPU", "0"

            if self.use_gpu:
                
                job_scheduler.set_job(self.experiment_name)

                # It can an get 2 or more gpus here, only 1 gpu implemented.
                if job_scheduler.get_gpu() == 'no_gpu' or not tf.test.is_built_with_cuda():
                    job_scheduler.close_listener()
                    train_logger.warn("You have selected the GPU usage option. Since the current environment cannot use the GPU, the job is executed by the CPU.")
                else:
                    while len(self.avail_gpu) == 0:
                        gpu_id = job_scheduler.get_gpu()
                        job = job_scheduler.get_job()

                        if gpu_id != '' and self.experiment_name in job:
                            gpu_id = job_scheduler.pop_gpu()
                            self.avail_gpu.append(gpu_id)
                            device_type, device_id = "GPU", gpu_id

                        time.sleep(1)
                    
                    visible_gpus = ','.join(self.avail_gpu)
                    job = job_scheduler.pop_job()

                    os.environ['CUDA_VISIBLE_DEVICES'] = visible_gpus
                    with open(os.path.join(model_dir, ASSIGNED_GPUS_FILENAME), 'w') as f:
                        f.write(visible_gpus)

            else:
                os.environ['CUDA_VISIBLE_DEVICES'] = "-1"
            
            sys.path.append(resources_path)
            import input_function, model_function

            model_params = copy.deepcopy(self.model_hparams)
            model_params['data_params'] = self.data_params

            if self.num_cores == 0 or self.num_cores is None:
                cpu_counts = psutil.cpu_count(logical=False) / 2
            else:
                cpu_counts = self.num_cores

            sess_config = tf.ConfigProto(intra_op_parallelism_threads= int(cpu_counts), 
                                        inter_op_parallelism_threads=2, 
                                        allow_soft_placement = True
                                        )

            #selected_device = "/"+ device_type  + ":" + device_id
            selected_device = ":".join(["/device", device_type, device_id])
            strategy = tf.contrib.distribute.OneDeviceStrategy(device=selected_device)
            run_config = tf.estimator.RunConfig(save_summary_steps=self.summary_save_frequency,
                                                save_checkpoints_steps=self.checkpoint_frequency_in_steps,
                                                session_config=sess_config,
                                                train_distribute=strategy
                                                )

            if self.warm_start_setting:
                assert isinstance(self.warm_start_setting,
                                  AbstractWarmStart), 'The type of trained model is wrong : {}'.format(
                    type(self.warm_start_setting))
                wss = self.warm_start_setting.get_warm_start_settings(input_fn=self.train_input_fn,
                                                                      model_fn=model_function.brightics_model_fn,
                                                                      model_fn_params=model_params)
            else:
                wss = None
            train_logger.debug('warm_start_settings : {}'.format(wss))

            train_logger.debug('data_params : {}'.format(self.data_params))
            train_logger.debug('model_hparams : {}'.format(self.model_hparams))
            train_logger.debug('model_params : {}'.format(model_params))

            classifier = tf.estimator.Estimator(model_function.brightics_model_fn,
                                                model_dir=model_dir,
                                                config=run_config,
                                                params=model_params,
                                                warm_start_from=wss)
            train_logger.info('Running Process({}) for Training Job with Local Engine'.format(str(os.getpid())))

            iteration = self.iterations
            ckpt_step = self.checkpoint_frequency_in_steps

            self._change_status(model_dir, 'Running')

            train_hooks = []

            if self.validation_channel_exists:
                # train & validation

                remain_step_to_train = iteration
                epochs = 0

                train_logger.debug('early_stopping : %s', self.early_stopping_code)
                if self.early_stopping_code:
                    early_stopping_fn = get_python_object_from_spec_obj(self.early_stopping_code)
                    early_stopping_hook = early_stopping_fn(worker_type='local',
                                                            additional_params={'estimator': classifier})
                    train_hooks.append(early_stopping_hook)

                previous_ckpt = None

                while remain_step_to_train > 0:

                    epochs += 1
                    train_logger.info('Train and evaluate epoch : ( {} )  '.format(epochs))

                    # Train Step
                    train_logger.debug(
                        'remain_step_to_train : {}, checkpoint_step : {}'.format(remain_step_to_train, ckpt_step))
                    train_steps = min(ckpt_step, remain_step_to_train)
                    classifier.train(input_fn=self.train_input_fn, steps=train_steps, hooks=train_hooks)

                    train_logger.debug('previous_checkpoint : %s, latest checkpoint : %s', previous_ckpt,
                                       classifier.latest_checkpoint())
                    if previous_ckpt and previous_ckpt == classifier.latest_checkpoint():
                        train_logger.info('No checkpoint created in the previous train step. Terminate training.')
                        break

                    remain_step_to_train -= ckpt_step
                    previous_ckpt = classifier.latest_checkpoint()

                    # Validation Step
                    classifier.evaluate(input_fn=self.eval_input_fn, steps=None)

            else:
                # only train
                classifier.train(input_fn=self.train_input_fn, steps=iteration, hooks=train_hooks)

            # Test Step
            if self.test_channel_exists:
                train_logger.info('Test Job Processing..  ')
                classifier.evaluate(input_fn=self.test_input_fn, steps=None, name="test")

            train_logger.info('[Training Job] Complete')
            self._change_status(model_dir, 'Success')

        except Exception as e:
            with open(os.path.join(model_dir, 'traceback'), 'w') as t:
                track = traceback.format_exc()
                t.write(
                    '[Job Failed] Exception occurs from TrainingJob with Local Engine : {}\n{}'.format(str(e), track))

            self._change_status(model_dir, 'Failed')
        finally:
            proc = psutil.Process()
            train_logger.debug('process {} is terminating.'.format(proc))
            sub_procs = proc.children(recursive=True)
            train_logger.debug('sub processes {} are terminating.'.format(sub_procs))
            for p in sub_procs:
                p.terminate()
            gone, alive = psutil.wait_procs(sub_procs, timeout=3, callback=on_terminate)
            for p in alive:
                p.kill()

            for gpu_id in self.avail_gpu:
                job_scheduler.set_gpu(gpu_id)

            proc.terminate()

    def stop_job(self, experiment_name):
        job_pid = experiment_name + '.pid'
        model_dir = os.path.join(self.job_dir, experiment_name)
        pid_file_path = os.path.join(model_dir, job_pid)
        status = self.get_job_status(experiment_name)['status']

        if os.path.isfile(pid_file_path) and (status == 'Waiting' or status == 'Running'):  ## Local Engine Job Stop
            with open(pid_file_path, 'r') as file:
                pid = int(file.readline())
                proc = psutil.Process(pid)
                sub_procs = proc.children(recursive=True)
                for p in sub_procs:
                    p.terminate()
                proc.terminate()
                gone, alive = psutil.wait_procs([proc] + sub_procs, timeout=3, callback=on_terminate)
                for p in alive:
                    p.kill()
                try:
                    assigned_gpus = os.path.join(model_dir, ASSIGNED_GPUS_FILENAME)
                    with open(assigned_gpus, 'r') as f:
                        for gpu_id in f.read().split(','):
                            if gpu_id != '':
                                job_scheduler.set_gpu(gpu_id)
                except OSError as e:
                    logger.error('Cannot return assigned gpus.')

            if status == 'Waiting':
                job_scheduler.remove_job(experiment_name)

            self._change_status(model_dir, 'Cancelled')

        return {'status': 'Success'}

    def get_job_status(self, experiment_name):
        try:
            status = "Failed"
            started_date = ""
            ended_date = ""

            model_dir = os.path.normpath(os.path.join(self.job_dir, experiment_name))
            logger.debug("model_dir: %s", model_dir)

            if os.path.isdir(model_dir):
                for file in os.listdir(model_dir):
                    if file.startswith(STATUS_PREFIX):
                        status = file.split(".")[-1]

                        with open(os.path.join(model_dir, file), 'r') as f:
                            json_spec = json.load(f)
                            started_date = json_spec['started_date']
                            ended_date = json_spec['ended_date']

                if status in ['Running', 'Waiting'] and not self._process_check(experiment_name):
                    self._remove_from_scheduler(status, experiment_name)

                    status = 'Failed'
                    self._change_status(model_dir, status)

                    with open(os.path.join(model_dir, 'traceback'), 'w') as t:
                        t.write('[Training Job Stopped] It was terminated by an external interrupt!!')
            else:
                status = "Unidentified"

            logger.debug("[Training Job] get_job_status: %s", status)

            return {'status': status,
                    'started_date': started_date,
                    'ended_date': ended_date}
        except RuntimeError as e:
            logger.error('Error occurs in get_job_status : %s', str(e))
            return {'status': status,
                    'started_date': started_date,
                    'ended_date': ended_date}

    def _remove_from_scheduler(self, status, experiment_name):

        model_dir = os.path.join(self.job_dir, experiment_name)

        if status == 'Running':
            assigned_gpus = os.path.join(model_dir, ASSIGNED_GPUS_FILENAME)
            with open(assigned_gpus, 'r') as f:
                for gpu_id in f.read().split(','):
                    if gpu_id != '':
                        job_scheduler.set_gpu(gpu_id)

        if status == 'Waiting':
            job_scheduler.remove_job(experiment_name)

    def get_job_text(self, experiment_name):

        r_text = ''
        traceback_path = os.path.join(self.job_dir, experiment_name, 'traceback')
        try:
            if os.path.exists(traceback_path):
                with open(traceback_path, 'r') as t:
                    r_text = t.read()
            return {'text': r_text}
        except RuntimeError as e:
            logger.error('Error occurs in get_job_text : %s', str(e))
            return {'text': 'Failed'}

    def get_job_log(self, experiment_name):
        r_text = ''
        log_path = os.path.join(self.job_dir, experiment_name, 'stdout')
        trace_path = os.path.join(self.job_dir, experiment_name, 'traceback')
        try:
            if os.path.exists(log_path):
                with open(log_path, 'r') as t:
                    r_text = t.read()

            if os.path.exists(trace_path):
                with open(trace_path, 'r') as t:
                    traceback = t.read()
                    r_text = r_text + '\n' + traceback

            return {'text': r_text}
        except RuntimeError as e:
            logger.error('[TrainingJob] Error occurs in get_job_log : %s', str(e))
            return {'text': 'Failed'}

    def _change_status(self, model_dir, status_text):
        try:
            status_files = [f for f in os.listdir(model_dir) if f.startswith(STATUS_PREFIX)]
            if len(status_files) > 0:

                filepath = os.path.join(model_dir, status_files[0])

                with open(filepath, 'r') as file:
                    data = json.load(file)

                if status_text in ['Failed', 'Cancelled', 'Success'] and status_files is not None:
                    with open(filepath, 'w') as file:
                        data['ended_date'] = datetime.now().isoformat()
                        json.dump(data, file)

                if status_text in 'Running' and status_files is not None:
                    with open(filepath, 'w') as file:
                        data['started_date'] = datetime.now().isoformat()
                        json.dump(data, file)

                os.rename(filepath, filepath.replace(filepath.split(".")[-1], status_text))
            else:
                with open(os.path.join(model_dir, STATUS_PREFIX + status_text), 'w') as filepath:
                    init_json = {'started_date': '', 'ended_date': ''}
                    json.dump(init_json, filepath)

        except OSError as e:
            logger.error("Can not change the status from %s : %s", model_dir, e)

    def _process_check(self, experiment_name):

        job_pid = experiment_name + '.pid'
        model_dir = os.path.join(self.job_dir, experiment_name)
        pid_file_path = os.path.join(model_dir, job_pid)

        try:
            if os.path.isfile(pid_file_path):
                with open(pid_file_path, 'r') as f:
                    pid = int(f.read())

                ps = psutil.Process(pid)
                logger.debug('Training Process running pid : %s', pid)
                process_name = ['python', 'python.exe']
                return True if ps.name() in process_name and ps.status() is not 'zombie' else False
            else:
                return False
        except:
            logger.info('No process')
            return False


def on_terminate(proc, logger_=None):
    if logger_ is None:
        logger_ = logger
    logger_.info('process {} terminated with exit code {}'.format(proc, proc.returncode))


def path_type_chk(dir):
    from brightics.deeplearning.util.path import path_type_chk as _path_type_chk
    return _path_type_chk(dir)
