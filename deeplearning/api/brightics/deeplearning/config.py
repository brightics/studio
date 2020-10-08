#
# Indicates this is a DL fix for Studio.
#
import configparser
import os
import pathlib

DEFAULT_WORKSPACE_PATH = os.path.abspath(os.getenv('BRTC_DL_WORKSPACE', os.path.expanduser('~/.brighticsdeeplearning/')))
DEFAULT_CONFIG_FILENAME = os.path.abspath(os.path.join(os.path.realpath(os.path.dirname(__file__)), 'python_config.ini'))

config = configparser.ConfigParser(interpolation=configparser.ExtendedInterpolation())
if os.path.exists(DEFAULT_CONFIG_FILENAME):
    config.read_file(open(DEFAULT_CONFIG_FILENAME, encoding='UTF-8'))


def get_section(section_name):
    if section_name in config:
        return config[section_name]
    else:
        return {}


def get(section, key, default_value=None):
    section = get_section(section)
    if key in section:
        return section[key]
    else:
        return default_value


def get_workspace_path():
    workspace_path = get('Path', 'Workspace', DEFAULT_WORKSPACE_PATH)
    if not os.path.exists(workspace_path):
        # If workspace_path not exist, make it.
        pathlib.Path(workspace_path).mkdir(parents=True, exist_ok=True)

    return workspace_path


def get_model_base_path(section='Path', default_base=os.path.join(get_workspace_path(), 'models')):
    model_base_path = get(section, 'ModelBase', default_base)
    if not os.path.exists(model_base_path):
        # If model_base_path not exist, make it.
        pathlib.Path(model_base_path).mkdir(parents=True, exist_ok=True)

    return model_base_path


def get_inference_base_path(section='Path', default_base=os.path.join(get_workspace_path(), 'inference')):
    model_base_path = get(section, 'InferenceBase', default_base)
    if not os.path.exists(model_base_path):
        # If model_base_path not exist, make it.
        pathlib.Path(model_base_path).mkdir(parents=True, exist_ok=True)

    return model_base_path

    
