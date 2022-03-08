import logging
import os
import pathlib
from logging.handlers import TimedRotatingFileHandler

from brightics.deeplearning import config

DEFAULT_LOG_FILENAME = 'brightics-deeplearning.log'

LOG_FILEPATH = config.get('Logging', 'FilePath', os.path.join(os.getenv('BRIGHTICS_DEEPLEARNING_HOME', config.get_workspace_path()), 'logs'))
LOG_FILENAME = config.get('Logging', 'FileName', DEFAULT_LOG_FILENAME)
LOG_LEVEL = config.get('Logging', 'Level', 'INFO')
LOG_BACKUP_COUNT = int(config.get('Logging', 'Count', 10))

LOG_FORMATTER = logging.Formatter('[%(asctime)s] %(levelname)s %(name)s: %(message)s')


def _get_log_path():
    if not os.path.exists(LOG_FILEPATH):
        pathlib.Path(LOG_FILEPATH).mkdir(parents=True, exist_ok=True)

    return os.path.join(LOG_FILEPATH, LOG_FILENAME)


def get_logger(name, level=LOG_LEVEL):

    root_logger = logging.getLogger()

    if len(root_logger.handlers) == 0:
        log_handler = TimedRotatingFileHandler(_get_log_path(), when='midnight', interval=1, backupCount=LOG_BACKUP_COUNT,
                                            encoding='UTF-8')
        log_handler.setFormatter(LOG_FORMATTER)
        log_handler.setLevel(level)
        root_logger.setLevel(level)
        root_logger.addHandler(log_handler)

    logger = logging.getLogger(name)
    if len(logger.handlers) == 0:
        log_handler = logging.StreamHandler()
        log_handler.setFormatter(LOG_FORMATTER)
        log_handler.setLevel(level)
        logger.setLevel(level)
        logger.addHandler(log_handler)

    return logger
