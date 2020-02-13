from brightics.deeplearning.runner.local_inference_job_runner import LocalInferenceJobRunner
from brightics.deeplearning.runner.local_job_runner import LocalJobRunner
from brightics.deeplearning.util import common_logging, tensorboard
import json

logger = common_logging.get_logger(__name__)


class JobRunner:

    def __init__(self):
        pass

    def run(self, job_spec_jsonstr, execution_type):
        logger.debug('job_spec_jsonstr : {}, execution_type : {}'.format(job_spec_jsonstr, execution_type))

        if execution_type == 'default':
            results = LocalJobRunner().run(job_spec_jsonstr)
        else:
            from brightics.deeplearning.runner import sbrain_job_runner
            results = sbrain_job_runner.run(job_spec_jsonstr)

        return json.dumps(results)

    def stop_job(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalJobRunner().stop_job(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_job_runner
            results = sbrain_job_runner.stop_job(experiment_name)

        return json.dumps(results)

    def inference_stop_job(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalInferenceJobRunner().stop_job(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_inference_job_runner
            results = sbrain_inference_job_runner.stop_job(experiment_name)

        return json.dumps(results)

    def get_job_status(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalJobRunner().get_job_status(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_job_runner
            results = sbrain_job_runner.get_job_status(experiment_name)

        return json.dumps(results)

    def get_job_text(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalJobRunner().get_job_text(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_job_runner
            results = sbrain_job_runner.get_job_text(experiment_name)

        return json.dumps(results)

    def get_job_log(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalJobRunner().get_job_log(experiment_name)
        else:
            # TODO: Show sbrain training job log.
            results = {'text': ''}

        return json.dumps(results)

    def get_job_inference_log(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalInferenceJobRunner().get_job_log(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_inference_job_runner
            results = sbrain_inference_job_runner.get_job_text(experiment_name)

        return json.dumps(results)

    def inference_job_run(self, job_spec_jsonstr, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(job_spec_jsonstr, execution_type))

        if execution_type == 'default':
            results = LocalInferenceJobRunner().run(job_spec_jsonstr)
        else:
            from brightics.deeplearning.runner import sbrain_inference_job_runner
            results = sbrain_inference_job_runner.run(job_spec_jsonstr)

        return json.dumps(results)

    def get_inference_job_status(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalInferenceJobRunner().get_job_status(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_inference_job_runner
            results = sbrain_inference_job_runner.get_job_status(experiment_name)

        return json.dumps(results)

    def get_inference_job_text(self, experiment_name, execution_type):
        logger.debug('experiment_name : {}, execution_type : {}'.format(experiment_name, execution_type))

        if execution_type == 'default':
            results = LocalInferenceJobRunner().get_job_text(experiment_name)
        else:
            from brightics.deeplearning.runner import sbrain_inference_job_runner
            results = sbrain_inference_job_runner.get_job_text(experiment_name)

        return json.dumps(results)

    def get_job_html(self, htmlfile):
        logger.debug('htmlfile : {}'.format(htmlfile))

        with open(htmlfile, 'r') as f:
            html = f.read()
        response = {'html': html}

        return json.dumps(response)

    def get_tensorboard_url(self, log_dir):
        return json.dumps(tensorboard.run(log_dir))
