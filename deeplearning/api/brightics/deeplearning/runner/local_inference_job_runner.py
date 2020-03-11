#
# Indicates this is a DL fix for Studio.
#
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
from brightics.deeplearning.runner.parent_runner import ParentJobRunner
from brightics.deeplearning.runner.templates.inference_common import \
    WRAPPED_INPUT_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION, WRAPPED_MODEL_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION, \
    INPUT_FUNCTION_CODE_TEMPLATE, MODEL_FUNCTION_CODE_TEMPLATE2, OUTPUT_FUNCTION_CODE_TEMPLATE, \
    SIMULATION_ROC_OUTPUT_FUNCTION_CODE_TEMPLATE
from brightics.deeplearning.runner.templates.simulation_for_grad_cam import \
    SIMULATION_GRADCAM_OUTPUT_FUNCTION_CODE_TEMPLATE, WRAPPED_MODEL_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION_GRAD_CAM
from brightics.deeplearning.runner.utils import get_created_date, add_indent_to_code, get_random_name_from_millis
from brightics.deeplearning.util import common_logging, job_scheduler

logger = common_logging.get_logger(__name__)

_SIMULATION_JOB_CONFS = [
    'local_simulation_classification_roc',
    'local_simulation_grad_cam']

TF_LOG_NAME = 'tensorflow'
RESOURCES_DIR = 'resources'
INPUT_FUNCTION_FILENAME = 'input_function.py'
OUTPUT_FUNCTION_FILENAME = 'output_function.py'
MODEL_FUNCTION_FILENAME = 'model_function.py'
SPEC_FILENAME = 'spec.json'
ASSIGNED_GPUS_FILENAME = 'assigned_gpus'
STATUS_PREFIX = 'STATUS.'
PYTHON_PROCESS_NAME = 'python'

class LocalInferenceJobRunner(ParentJobRunner):

    def __init__(self):
        millis = int(round(time.time() * 1000))
        experiment_name = get_random_name_from_millis(millis)
        job_dir = config.get_inference_base_path()

        super().__init__(experiment_name, millis, job_dir)

    def run(self, job_spec_jsonstr):
        inference_dir = os.path.join(self.job_dir, self.experiment_name)
        function_file_dir = os.path.join(inference_dir, RESOURCES_DIR)
        logger.debug('inference_dir : {}, function_file_dir : {}'.format(inference_dir, function_file_dir))

        try:
            if not (os.path.isdir(function_file_dir)):
                os.makedirs(os.path.join(function_file_dir))
        except OSError as e:
            logger.info("Failed to create directory from %s : %s", function_file_dir, e)
            raise

        self._change_status(inference_dir, 'Waiting')
        self.make_inf_run_param(job_spec_jsonstr)

        config = self.config

        if config['name'] == 'local_inference_configuration':
            input_fn_code = INPUT_FUNCTION_CODE_TEMPLATE.substitute(test_input_spec=self.input_fn_spec)
            output_fn_code = OUTPUT_FUNCTION_CODE_TEMPLATE.substitute(output_path=self.output_path,
                                                                      encoding=self.encoding,
                                                                      serializer=self.serializer,
                                                                      output_overwrite=self.output_overwrite)
            model_fn_code = MODEL_FUNCTION_CODE_TEMPLATE2.substitute(model_code=add_indent_to_code(self.model_fn_code),
                                                                     model_function_name=self.model_function_name)
        elif config['name'] == 'local_simulation_classification_roc':
            input_fn_code, output_fn_code, model_fn_code, html_path = self._get_function_codes_for_simulation_classification_roc(
                self.output_path, self.input_fn_spec, self.encoding, self.serializer, self.model_fn_code,
                self.model_function_name, self.inf_conf_params)
        elif config['name'] == 'local_simulation_grad_cam':
            input_fn_code, output_fn_code, model_fn_code, html_path = self._get_function_codes_for_simulation_grad_cam(
                self.output_path, self.input_fn_spec, self.encoding, self.serializer, self.model_fn_code,
                self.model_function_name, self.inf_conf_params)

        now_str = get_created_date()

        input_function_file_path = os.path.join(function_file_dir, INPUT_FUNCTION_FILENAME)
        with open(input_function_file_path, 'w', encoding='utf-8') as input_file:
            input_file.write(input_fn_code)

        output_function_file_path = os.path.join(function_file_dir, OUTPUT_FUNCTION_FILENAME)
        with open(output_function_file_path, 'w', encoding='utf-8') as output_file:
            output_file.write(output_fn_code)

        model_function_file_path = os.path.join(function_file_dir, MODEL_FUNCTION_FILENAME)
        with open(model_function_file_path, 'w', encoding='utf-8') as model_file:
            model_file.write(model_fn_code)

        spec_file_path = os.path.join(function_file_dir, SPEC_FILENAME)
        with open(spec_file_path, 'w', encoding='utf-8') as spec_file:
            spec_file.write(job_spec_jsonstr)

        # Open training job with some modified envs
        child_env = os.environ.copy()

        python_exec = os.getenv('BRIGHTICS_DL_PYTHON_PATH', 'python')

        # Try to run gpu scheduler if it is not initialized
        psutil.Popen([python_exec, "-c",
                      f"from brightics.deeplearning.util import job_scheduler; job_scheduler.listener();"],
                     cwd=inference_dir, env=child_env, stdout=open(os.devnull, 'w'), stderr=open(os.devnull, 'w'))

        proc = psutil.Popen([python_exec, "-c",
                             f"from brightics.deeplearning.runner.local_inference_job_runner import LocalInferenceJobRunner;LocalInferenceJobRunner().internal_run(r'{inference_dir}');"],
                            cwd=inference_dir, env=child_env, stdout=open(os.path.join(inference_dir, 'stdout'), 'w'),
                            stderr=subprocess.STDOUT, bufsize=1)

        # Write pid file
        with open(os.path.join(inference_dir, self.experiment_name + '.pid'), 'w') as pid_file:
            pid_file.write(str(proc.pid))

        response = {
            'experiment_name': self.experiment_name,
            'inference_job_id': self.experiment_name,
            'output_path': os.path.normpath(self.output_path),
            'created_date': now_str
        }

        if config['name'] in _SIMULATION_JOB_CONFS:
            logger.debug("html_path: %s", html_path)
            response['html_path'] = html_path

        return response

    # This function can be called externally by cmd or something.
    def internal_run(self, inference_dir):
        try:
            import tensorflow as tf

            # create private logger
            tf.logging.set_verbosity(tf.logging.INFO)
            common_logging.get_logger(TF_LOG_NAME)
            inference_logger = common_logging.get_logger(self.experiment_name)

            inference_logger.info("Inference job is starting...")

            # update experiment name from model_dir
            path = os.path.normpath(inference_dir)
            self.experiment_name = path.split(os.sep)[-1]
            job_scheduler.set_job(self.experiment_name)

            resources_path = os.path.join(inference_dir, RESOURCES_DIR)
            with open(os.path.join(resources_path, SPEC_FILENAME), 'rt', encoding='utf-8') as job_spec_file:
                self.make_inf_run_param(job_spec_file.read())

            # Select available gpu or cpu env when it is not found
            self.avail_gpu = []
            device_type, device_id = "CPU", "0"

            if self.use_gpu:

                # It can an get 2 or more gpus here, only 1 gpu implemented.
                if job_scheduler.get_gpu() == 'no_gpu' or not tf.test.is_built_with_cuda():
                    job_scheduler.close_listener()
                    inference_logger.warn("You have selected the GPU usage option. Since the current environment cannot use the GPU, the job is executed by the CPU.")
                else:
                    while len(self.avail_gpu) == 0:
                        gpu_id = job_scheduler.get_gpu()
                        job = job_scheduler.get_job()

                        if gpu_id != '' and self.experiment_name in job:
                            gpu_id = job_scheduler.pop_gpu()
                            self.avail_gpu.append(gpu_id)
                            device_type, device_id = "GPU", gpu_id
                            job = job_scheduler.pop_job()

                        time.sleep(1)

                visible_gpus = ','.join(self.avail_gpu)
                job = job_scheduler.pop_job()

                os.environ['CUDA_VISIBLE_DEVICES'] = visible_gpus
                with open(os.path.join(inference_dir, ASSIGNED_GPUS_FILENAME), 'w') as f:
                    f.write(visible_gpus)
            else:
                os.environ['CUDA_VISIBLE_DEVICES'] = "-1"
                job = job_scheduler.remove_job(self.experiment_name)

            sys.path.append(resources_path)
            import input_function, output_function, model_function

            inference_logger.debug('inference_dir : {}'.format(inference_dir))

            if self.num_cores == 0:
                cpu_counts = psutil.cpu_count(logical=False) / 2
            else:
                cpu_counts = self.num_cores

            sess_config = tf.ConfigProto(intra_op_parallelism_threads= int(cpu_counts), inter_op_parallelism_threads=2, allow_soft_placement = True)

            selected_device = "/"+ device_type  + ":" + device_id
            strategy = tf.contrib.distribute.OneDeviceStrategy(device=selected_device)
            run_config = tf.estimator.RunConfig(session_config=sess_config,
                                                train_distribute=strategy)

            warm_start_settings = self.model_warm_start.get_warm_start_settings(
                input_fn=input_function.brightics_inference_input_fn,
                model_fn=model_function.brightics_inference_model_fn,
                model_fn_params=self.model_function_params)

            classifier = tf.estimator.Estimator(model_fn=model_function.brightics_inference_model_fn,
                                                model_dir=inference_dir,
                                                config=run_config,
                                                params=self.model_function_params,
                                                warm_start_from=warm_start_settings)

            inference_logger.info('Running Process({}) for Inference Job with Local Engine'.format(str(os.getpid())))
            self._change_status(inference_dir, 'Running')

            inf_result = classifier.predict(input_fn=input_function.brightics_inference_input_fn,
                                            yield_single_examples=self.yield_single_examples)

            output_function.brightics_inference_output_fn(inf_result, params=None)
            inference_logger.info('[Inference Job] Complete')
            self._change_status(inference_dir, 'Success')
        except Exception as e:
            with open(os.path.join(inference_dir, 'traceback'), 'w') as t:
                track = traceback.format_exc()
                t.write(
                    '[Job Failed] Exception occurs from InferenceJob with Local Engine : {}\n{}'.format(str(e), track))
            self._change_status(inference_dir, 'Failed')

        finally:
            proc = psutil.Process()
            inference_logger.debug('process {} is terminating.'.format(proc))
            sub_procs = proc.children(recursive=True)
            inference_logger.debug('sub processes {} are terminating.'.format(sub_procs))
            for p in sub_procs:
                p.terminate()
            gone, alive = psutil.wait_procs(sub_procs, timeout=3, callback=on_terminate)
            for p in alive:
                p.kill()
            for gpu_id in self.avail_gpu:
                job_scheduler.set_gpu(gpu_id)

            proc.terminate()

    def get_job_html(self, htmlfile):
        with open(htmlfile, 'r') as f:
            html = f.read()
        response = {'html': html}

        return response

    def get_job_status(self, experiment_name):
        try:
            status = "Failed"
            started_date = ""
            ended_date = ""

            inference_dir = os.path.normpath(os.path.join(self.job_dir, experiment_name))
            logger.debug("inference_dir: %s", inference_dir)
            if os.path.isdir(inference_dir):
                for file in os.listdir(inference_dir):
                    if file.startswith(STATUS_PREFIX):
                        status = file.split(".")[-1]

                        with open(os.path.join(inference_dir, file), 'r') as f:
                            json_spec = json.load(f)
                            started_date = json_spec['started_date']
                            ended_date = json_spec['ended_date']

                if status in ['Running', 'Waiting'] and not self._process_check(experiment_name):
                    self._remove_from_scheduler(status, experiment_name)

                    status = 'Failed'
                    self._change_status(inference_dir, status)

                    with open(os.path.join(inference_dir, 'traceback'), 'w') as t:
                        t.write('[Inference Job Stopped] It was terminated by an external interrupt!!')
            else:
                status = "Unidentified"

            logger.debug("[Inference Job] get_job_status: %s", status)

            return {'status': status,
                    'started_date': started_date,
                    'ended_date': ended_date}

        except RuntimeError as e:
            logger.error('Error occurs in [Inference Job] get_job_status : %s', str(e))
            return {'status': status,
                    'started_date': started_date,
                    'ended_date': ended_date}

    def _remove_from_scheduler(self, status, experiment_name):

        inference_dir = os.path.join(self.job_dir, experiment_name)

        if status == 'Running':
            assigned_gpus = os.path.join(inference_dir, ASSIGNED_GPUS_FILENAME)
            if os.path.exists(assigned_gpus):
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
            logger.error('[InferenceJob] Error occurs in get_job_log : %s', str(e))
            return {'text': 'Failed'}

    def stop_job(self, experiment_name):
        job_pid = experiment_name + '.pid'
        inference_dir = os.path.join(self.job_dir, experiment_name)
        pid_file_path = os.path.join(inference_dir, job_pid)
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
                    assigned_gpus = os.path.join(inference_dir, ASSIGNED_GPUS_FILENAME)
                    with open(assigned_gpus, 'r') as f:
                        for gpu_id in f.read().split(','):
                            if gpu_id != '':
                                job_scheduler.set_gpu(gpu_id)
                except OSError as e:
                    logger.error('Cannot return assigned gpus.')

            if status == 'Waiting':
                job_scheduler.remove_job(experiment_name)

            self._change_status(inference_dir, 'Cancelled')

        return {'status': 'Success'}

    def _raise_required_error(self, key):
        raise RuntimeError('''A parameter '{key}' is not assigned.'''.format(key=key))

    def _check_parameter_required(self, key, params, nullable=False):
        if key in params or (nullable and not params.get(key)):
            pass
        else:
            self._raise_required_error(key)

    def _get_function_codes_for_simulation_classification_roc(self, output_path, input_fn_spec, encoding, serializer,
                                                              model_fn_code, model_function_name, inf_conf_params):
        html_path = inf_conf_params.get('html_path', None)
        if html_path is None or html_path.strip() == '':
            file, _ = os.path.splitext(output_path)
            html_path = file + '.html'
        assert html_path != output_path, 'html_path and output_path are the same. output_path: {}, html_path: {}'.format(
            output_path, html_path)

        label_key = inf_conf_params.get('label_key', None)
        if label_key is None or label_key == 'labels':
            label_key = 'labels.'
        assert label_key.startswith('labels'), label_key

        probability_key = inf_conf_params.get('probability_key', None)
        logger.debug("probability_key:{}".format(probability_key))

        if probability_key is None or probability_key == 'predictions':
            probability_key = 'predictions.'
        assert probability_key.startswith('predictions'), probability_key

        fig_size = inf_conf_params.get('fig_size', None)
        if fig_size is None:
            fig_size = (6.4, 4.8)
        if isinstance(fig_size, str):
            fig_size = tuple([float(x) for x in fig_size.split(',')])

        outjson = inf_conf_params.get('outjson', None)
        if outjson is None or outjson.strip() == '':
            file, _ = os.path.splitext(output_path)
            outjson = file + '.json'

        pos_labels = inf_conf_params.get('pos_labels', None)
        if isinstance(pos_labels, str) and pos_labels.strip() == '':
            pos_labels = None
        if isinstance(pos_labels, str):
            pos_labels = [int(idx_str) for idx_str in pos_labels.split(',')]

        cnf_mat_overlay_text = inf_conf_params.get('cnf_mat_overlay_text', None)
        if cnf_mat_overlay_text is None:
            cnf_mat_overlay_text = False

        prediction_weights = inf_conf_params.get('prediction_weights', None)
        if isinstance(prediction_weights, str) and prediction_weights.strip() == '':
            prediction_weights = None
        if isinstance(prediction_weights, str):
            prediction_weights = [float(weights) for weights in prediction_weights.split(',')]

        input_predict_keys = inf_conf_params.get('input_predict_keys', None)
        if input_predict_keys is None or input_predict_keys.strip() == '':
            input_predict_keys = []
        if isinstance(input_predict_keys, str):
            input_predict_keys = [key.strip() for key in input_predict_keys.split(',')]

        feature_keys = [element for element in input_predict_keys if element.strip().startswith('features')]
        label_keys = {element for element in input_predict_keys if element.strip().startswith('labels')}
        label_keys.add(label_key)
        label_keys = list(label_keys)

        predict_keys = inf_conf_params.get('predict_keys', None)
        if isinstance(predict_keys, str) and predict_keys.strip() == '':
            predict_keys = None
        if isinstance(predict_keys, str):
            predict_keys = [key.strip() for key in predict_keys.split(',')]
        if isinstance(predict_keys, list):
            predict_keys = set(predict_keys)
            predict_keys.add(probability_key)
            predict_keys = list(predict_keys)

        output_overwrite = inf_conf_params.get('output_overwrite', False)

        input_fn_code = WRAPPED_INPUT_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION.substitute(test_input_spec=input_fn_spec)
        output_fn_code = SIMULATION_ROC_OUTPUT_FUNCTION_CODE_TEMPLATE.substitute(label_key=label_key,
                                                                                 probability_key=probability_key,
                                                                                 html_path=html_path, fig_size=fig_size,
                                                                                 output_path=output_path,
                                                                                 outjson=outjson,
                                                                                 pos_labels=pos_labels,
                                                                                 cnf_mat_overlay_text=cnf_mat_overlay_text,
                                                                                 prediction_weights=prediction_weights,
                                                                                 encoding=encoding,
                                                                                 serializer=serializer,
                                                                                 output_overwrite=output_overwrite)

        logger.info('label_keys: {}'.format(label_keys))
        logger.info('feature_keys: {}'.format(feature_keys))
        logger.info('prediction_keys: {}'.format(predict_keys))
        model_fn_code = WRAPPED_MODEL_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION.substitute(
            label_keys=label_keys, feature_keys=feature_keys, prediction_keys=predict_keys,
            model_code=add_indent_to_code(model_fn_code), model_function_name=model_function_name)

        return input_fn_code, output_fn_code, model_fn_code, html_path

    def _get_function_codes_for_simulation_grad_cam(self, output_path, input_fn_spec, encoding, serializer,
                                                    model_fn_code, model_function_name, inf_conf_params):
        html_path = inf_conf_params.get('html_path', None)
        if html_path is None or html_path.strip() == '':
            file, _ = os.path.splitext(output_path)
            html_path = file + '.html'

        assert html_path != output_path, 'html_path and output_path are the same. output_path: {}, html_path: {}'.format(
            output_path, html_path)

        self._check_parameter_required('output_image_shape', inf_conf_params)
        self._check_parameter_required('image_key', inf_conf_params)

        output_overwrite = inf_conf_params.get('output_overwrite', False)

        gradcam_output_image_shape = inf_conf_params.get('output_image_shape')
        gradcam_sampling_ratio = float(inf_conf_params.get('sampling_ratio', 0.01))
        image_key = inf_conf_params.get('image_key', None)

        target_tensor_name = inf_conf_params.get('target_tensor_name', None)
        target_operation_name = inf_conf_params.get('target_operation_name', None)
        if not target_tensor_name and not target_operation_name:
            raise RuntimeError('Either target_tensor_name or target_operation_name must be assigned.')

        logit_tensor_name = inf_conf_params.get('logit_tensor_name', None)
        logit_operation_name = inf_conf_params.get('logit_operation_name', None)
        if not logit_tensor_name and not logit_operation_name:
            raise RuntimeError('Either target_tensor_name or target_operation_name must be assigned.')

        input_fn_code = WRAPPED_INPUT_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION.substitute(test_input_spec=input_fn_spec)
        output_fn_code = SIMULATION_GRADCAM_OUTPUT_FUNCTION_CODE_TEMPLATE.substitute(output_path=output_path,
                                                                                     output_overwrite=output_overwrite,
                                                                                     html_path=html_path,
                                                                                     encoding=encoding,
                                                                                     serializer=serializer,
                                                                                     sampling_ratio=gradcam_sampling_ratio)

        wrapped_model_fn_code = WRAPPED_MODEL_FUNCTION_CODE_TEMPLATE_FOR_SIMULATION_GRAD_CAM.substitute(
            model_code=add_indent_to_code(model_fn_code),
            model_function_name=model_function_name,
            image_key=image_key,
            output_image_shape=gradcam_output_image_shape,
            target_tensor_name=target_tensor_name if target_tensor_name is not None else '',
            target_operation_name=target_operation_name if target_operation_name is not None else '',
            logit_tensor_name=logit_tensor_name if logit_tensor_name is not None else '',
            logit_operation_name=logit_operation_name if logit_operation_name is not None else ''
        )

        return input_fn_code, output_fn_code, wrapped_model_fn_code, html_path

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
        inference_dir = os.path.join(self.job_dir, experiment_name)
        pid_file_path = os.path.join(inference_dir, job_pid)

        try:
            if os.path.isfile(pid_file_path):
                with open(pid_file_path, 'r') as f:
                    pid = f.read()
                ps = psutil.Process(int(pid))
                logger.debug('Inference Process running pid : %s', pid)
                return True if PYTHON_PROCESS_NAME in ps.name() and ps.status() is not 'zombie' else False
            else:
                return False
        except:
            logger.info('No process')
            return False


def on_terminate(proc, logger_=None):
    if logger_ is None:
        logger_ = logger
    logger_.info('process {} terminated with exit code {}'.format(proc, proc.returncode))
