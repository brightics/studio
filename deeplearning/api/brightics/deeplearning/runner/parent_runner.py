import json
import os

from brightics.deeplearning.dataflow.utils.dataflow_parser import get_python_object_from_spec_obj
from brightics.deeplearning.dataflow.utils.dataflow_parser import parse
from brightics.deeplearning.runner.templates import TEMPLATE_SBRAIN_MODEL_FN_CODE
from brightics.deeplearning.runner.utils import filter_none_values_in_dict, add_indent_to_code
from brightics.deeplearning.runner.utils import get_input_function
from brightics.deeplearning.runner.utils import get_input_functions_code
from brightics.deeplearning.runner.warm_start import AbstractWarmStart
from brightics.deeplearning.util import common_logging, common_config
from brightics.deeplearning.config import get_model_base_path

logger = common_logging.get_logger(__name__)


class ParentJobRunner:

    def __init__(self,
                 experiment_name,
                 millis,
                 job_dir,
                 use_gpu=False
                 ):
        # Init Param
        self.experiment_name = experiment_name
        self.millis = millis
        self.job_dir = job_dir
        self.use_gpu = use_gpu

    def init_training_default_param(self):
        # Input Param
        self.validation_channel_exists = False
        self.test_channel_exists = False
        self.data_params = {}
        self.train_input_fn = None
        self.eval_input_fn = None
        self.test_input_fn = None
        self.brightics_input_function_code = None
        self.brightics_input_function = None

        # Model Param  
        self.model_hparams = None
        self.best_weights = False
        self.best_metric = 'loss'
        self.best_condition = 'lowest'
        self.brightics_model_function = None

        # Config Param
        self.iterations = None
        self.no_of_ps = 1
        self.no_of_workers = 1
        self.summary_save_frequency = 10
        self.checkpoint_frequency_in_steps = 100
        self.warm_start_setting = None
        self.early_stopping_code = None
        self.intra_op_parallelism_threads = 0
        self.inter_op_parallelism_threads  = 0

    def init_inference_default_param(self):
        # Inference Param
        self.config = None
        self.model_dir = None
        self.input_fn_spec = None
        self.output_path = None
        self.output_overwrite = None
        self.model_function_name = None
        self.model_function_params = None
        self.model_fn_code = None
        self.inf_conf_params = None
        self.encoding = 'utf-8'
        self.serializer = 'json'
        self.intra_op_parallelism_threads = 0
        self.inter_op_parallelism_threads  = 0

    def make_run_param(self, job_spec_jsonstr):
        # Training Job - Default Value Setting
        self.init_training_default_param()

        ## Json Param Setting
        # Input Function
        logger.debug("Training Job Spec : %s", job_spec_jsonstr)
        job_spec = parse(json.loads(job_spec_jsonstr))['params']
        job_spec = filter_none_values_in_dict(job_spec)

        preprocessors_spec = job_spec.get('preprocessors', [])
        input_function_spec = job_spec['input_functions']
        model_function_spec = job_spec['model_function']

        for preprocess_func_spec in preprocessors_spec:
            get_python_object_from_spec_obj(preprocess_func_spec)

        """
        sbrain_input_function
        """
        assert 'train' in input_function_spec, 'train channel is required.'
        if 'validation' in input_function_spec and input_function_spec['validation'] is not None:
            self.validation_channel_exists = True
            self.eval_input_fn = get_input_function(parse(input_function_spec['validation']))

        if 'test' in input_function_spec and input_function_spec['test'] is not None:
            self.test_channel_exists = True
            self.test_input_fn = get_input_function(parse(input_function_spec['test']))

        self.data_params['evaluate'] = self.validation_channel_exists
        brightics_input_function_code = get_input_functions_code(input_function_spec)
        self.brightics_input_function_code = brightics_input_function_code
        self.brightics_input_function = json.dumps(
            {'name': 'brightics_input_fn', 'code': brightics_input_function_code})
        self.train_input_fn = get_input_function(parse(input_function_spec['train']))

        logger.debug("\n[Input Function Code]\n{}\n".format(brightics_input_function_code.replace('\\n', '\n')))

        run_configuration = job_spec['run_configuration']['params']

        self.iterations = run_configuration['iteration']
        self.no_of_ps = run_configuration.get('no_of_ps', 1)
        self.no_of_workers = run_configuration.get('no_of_workers', 1)
        self.summary_save_frequency = run_configuration.get('summary_save_frequency', 10)
        self.use_gpu = run_configuration.get('use_gpu', False)
        self.intra_op_parallelism_threads = run_configuration.get('intra_op_parallelism_threads', 0)
        self.inter_op_parallelism_threads  = run_configuration.get('inter_op_parallelism_threads', 0)
        self.checkpoint_frequency_in_steps = run_configuration.get('checkpoint_frequency_in_steps', 100)

        self.warm_start_setting = get_python_object_from_spec_obj(run_configuration.get('warm_start_setting', None))
        logger.debug('warm_start_setting = {}'.format(self.warm_start_setting))
        self.early_stopping_code = run_configuration.get('early_stopping_setting', None)

        # Model Function
        model_function = get_python_object_from_spec_obj({
            'module': model_function_spec['module'],
            'name': model_function_spec['name']
        })(model_function_spec['params'])

        model_function_code = model_function.model_code()
        self.model_hparams = model_function.sbrain_hparams()

        # Best model settings
        best_weights_setting = json.loads(job_spec_jsonstr)['params']['run_configuration']['params'][
            'best_weights_setting']
        self.best_weights = best_weights_setting['best_weights'].get('_value', False)
        self.best_metric = best_weights_setting['metric'].get('_value', 'loss')
        self.best_condition = best_weights_setting['condition'].get('_value', 'lowest')

        if self.best_weights and not self.validation_channel_exists:
            self.best_weights = False  # log

        self.brightics_model_function = TEMPLATE_SBRAIN_MODEL_FN_CODE.substitute(
            model_code=add_indent_to_code(model_function_code),
            experiment_name=self.experiment_name,
            model_home=self.job_dir,
            early_stopping_hook=None,
            save_summaries_steps=self.summary_save_frequency,
            input_code=add_indent_to_code(brightics_input_function_code),
            evaluation_steps=self.checkpoint_frequency_in_steps,
            best_weights=self.best_weights,
            best_metric=self.best_metric,
            best_condition=self.best_condition,
            last_step=self.iterations)

    def make_inf_run_param(self, job_spec_jsonstr):
        self.init_inference_default_param()

        inf_config = common_config.get_section('Inference')

        OUTPUT_FILE_FORMAT = 'inference_out_{millis}.txt'
        DEFAULT_ENCODING = inf_config.get('Encoding', 'utf-8')
        DEFAULT_SERIALIZER = inf_config.get('Serializer', 'json')

        logger.debug("Inference Job Spec : %s", job_spec_jsonstr)
        job_spec = parse(json.loads(job_spec_jsonstr))['params']
        job_spec = filter_none_values_in_dict(job_spec)

        preprocessors_spec = job_spec.get('preprocessors', [])
        input_fn_spec = job_spec['input_function']

        config = job_spec['inference_configuration']
        assert config['module'] == 'brightics.deeplearning.inference_configuration', config
        inf_conf_params = config['params']

        trained_model = get_python_object_from_spec_obj(inf_conf_params['model'])
        assert trained_model is not None, 'No Model to inference is assigned.'
        assert isinstance(trained_model, AbstractWarmStart), 'The type of trained model is wrong : {}'.format(type(trained_model))
        trained_model_path = trained_model.model_path

        model_fn_spec = job_spec.get('model_function', None)
        if not model_fn_spec:
            # model function spec from trained model
            def _get_model_spec(spec):
                with open(spec, 'r') as f:
                    return parse(f.read())['params']['model_function']

            def _is_spec_contained_in(dir_):
                try:
                    spec_file = os.path.join(dir_, 'resources', 'spec.json')
                    _get_model_spec(spec_file)
                    return True
                except:
                    return False

            if os.path.isdir(trained_model_path):
                if _is_spec_contained_in(trained_model_path):
                    training_spec = os.path.join(trained_model_path, 'resources', 'spec.json')
                else:
                    job_name = os.path.basename(trained_model_path)
                    if _is_spec_contained_in(os.path.join(get_model_base_path(), job_name)):
                        training_spec = os.path.join(get_model_base_path(), job_name, 'resources', 'spec.json')
                    else:
                        raise Exception('Fail to find model function. Please specify the model function.')
            else:
                training_spec = os.path.join(os.path.dirname(trained_model_path), 'resources', 'spec.json')
                if not os.path.exists(training_spec):
                    raise Exception('Fail to find model function. Please specify the model function.')

            model_fn_spec = _get_model_spec(training_spec)

        output_path = inf_conf_params.get('output_path', None)
        output_dir = os.path.join(self.job_dir, self.experiment_name)
        if not output_path:
            output_path = os.path.join(output_dir, OUTPUT_FILE_FORMAT.format(millis=self.millis))

        output_overwrite = inf_conf_params.get('output_overwrite', False)

        # preprocessing
        for preprocess_func_spec in preprocessors_spec:
            get_python_object_from_spec_obj(preprocess_func_spec)

        # model_fn_spec 값 필수로 변경
        model_fn_obj = get_python_object_from_spec_obj({
            'module': model_fn_spec['module'],
            'name': model_fn_spec['name']
        })(model_fn_spec['params'])
        model_function_name = 'model_function'
        model_fn_code = model_fn_obj.model_code()
        model_fn_params = model_fn_obj.sbrain_hparams()

        inf_params = model_fn_params
        logger.debug('inference job params : %s', inf_params)

        self.config = config
        self.use_gpu = inf_conf_params['use_gpu']
        self.intra_op_parallelism_threads = inf_conf_params.get('intra_op_parallelism_threads', 0)
        self.inter_op_parallelism_threads  = inf_conf_params.get('inter_op_parallelism_threads', 0)
        self.yield_single_examples = inf_conf_params.get('yield_single_examples', False)
        self.model_dir = output_dir
        self.model_path = trained_model_path
        self.model_warm_start = trained_model
        self.input_fn_spec = input_fn_spec
        self.output_path = output_path
        self.output_overwrite = output_overwrite
        self.model_fn_spec = model_fn_spec
        self.model_function_name = model_function_name
        self.model_function_params = model_fn_params
        self.model_fn_code = model_fn_code
        self.inf_conf_params = inf_conf_params
        self.encoding = DEFAULT_ENCODING
        self.serializer = DEFAULT_SERIALIZER
