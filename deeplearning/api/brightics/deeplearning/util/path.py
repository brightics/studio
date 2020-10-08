import os
import re
import platform

from brightics.deeplearning import config


def path_type_chk(dir):
    osname = platform.system()
    p = re.compile(r'^[a-zA-Z]:\\|^[a-zA-Z]:/')
    m = p.match(dir)

    if dir is not None and dir[0] is not '/' and osname not in 'Windows':
        env_path = config.get_workspace_path()
        dir = os.path.join(env_path, dir)

    elif dir is not None and m is None:
        env_path = config.get_workspace_path()
        dir = os.path.normpath(os.path.join(env_path, dir))

    return dir
