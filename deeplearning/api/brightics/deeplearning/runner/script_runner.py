#
# Indicates this is a DL fix for Studio.
#
from string import Template
import psutil, subprocess
import os
import sys
import time
import platform
from brightics.deeplearning.util import common_logging
from brightics.deeplearning.dataflow.utils.dataflow_parser import parse
from brightics.deeplearning import config
import json
import threading

logger = common_logging.get_logger(__name__)
workspace_path = config.get_workspace_path()
script_config = config.get_section('ScriptRunner')

RUN_TEMP_FILE_NAME = 'test_run.py'
STATUS_PREFIX = 'STATUS.'

def create_script(script_id, json_spec):
    
    function_code = parse(json.loads(json_spec))['code']
    temp_dir = os.path.join(workspace_path, 'temp', script_id)

    try:
        if not (os.path.isdir(temp_dir)):
            os.makedirs(os.path.join(temp_dir))
    except OSError as e:
        logger.info("Failed to create directory from %s : %s", temp_dir, e)
        raise
    
    start_time = time.time()
    with open(os.path.join(temp_dir,'time'), 'w') as f:
        f.write(str(start_time))

    child_env = os.environ.copy()
    child_env['CUDA_VISIBLE_DEVICES'] = ''

    python_exec = os.getenv('BRIGHTICS_DL_PYTHON_PATH', 'python')

    script_file = os.path.join(temp_dir, RUN_TEMP_FILE_NAME)
    _change_status(temp_dir, 'Running')
	
    with open(script_file, 'w', encoding='utf-8') as f:
        f.write(function_code)
        
    try:
        p = psutil.Popen([python_exec, script_file], cwd=temp_dir, env=child_env, 
                                stdout=open(os.path.join(temp_dir, 'stdout'), 'w'), stderr=subprocess.STDOUT, bufsize=0)

        threading.Thread(target=script_stopper, args=(temp_dir, start_time, p.pid,)).start()

        with open(os.path.join(temp_dir,'proc.pid'), 'w') as pid_file:
            pid_file.write(str(p.pid))

    except Exception as e:
        _change_status(temp_dir, 'Failed')

        if p is not None and psutil.pid_exists(p):
            proc = psutil.Process(p)
            proc.terminate()

def get_result(script_id):

    osname = platform.system()
    temp_dir = os.path.join(workspace_path, 'temp', script_id)
    
    with open(os.path.join(temp_dir,'time'), 'w') as f:
        f.write(str(time.time()))

    with open(os.path.join(temp_dir,'proc.pid'), 'r') as f:
        pid = f.readline()
        pid = int(pid)

    if osname == ['Linux','Darwin'] and psutil.pid_exists(pid):
        proc = psutil.Process(pid)
        if len(proc.cmdline()) == 0:
            _change_status(temp_dir, 'Success')
    elif osname in 'Windows' and psutil.pid_exists(pid) is False:
        _change_status(temp_dir, 'Success')

    status = _get_status(temp_dir)

    message = ""
    with open(os.path.join(temp_dir,'stdout'),'r') as stdout:
        message = stdout.read()

    return json.dumps({"message": message, "status": status})

def delete_script(script_id):
    temp_dir = os.path.join(workspace_path, 'temp', script_id)
    pid_file = os.path.join(temp_dir,'proc.pid')
    status = None
    try:
        with open(pid_file, 'r') as file:
            pid= file.readline()
            pid = int(pid)
            proc = psutil.Process(pid)
            proc.terminate()

    except Exception as e:
        logger.info("Delete Script Error : %s", e)
        status = "Failed"

    return json.dumps({"status": status})

def _get_status(temp_dir):
    status = "Running"
    if os.path.isdir(temp_dir):
        for file in os.listdir(temp_dir):
            if file.startswith(STATUS_PREFIX):
                status = file.split(".")[-1]
    else:
        status = "Unidentified"
    
    return status

def _change_status(temp_dir, status_text):
    try:
        status_files = [f for f in os.listdir(temp_dir) if f.startswith(STATUS_PREFIX)]
        if len(status_files) > 0:
            filepath = os.path.join(temp_dir, status_files[0])
            os.rename(filepath, filepath.replace(filepath.split(".")[-1], status_text))
        else:
            with open(os.path.join(temp_dir, STATUS_PREFIX + status_text), 'w') as filepath:
                logger.info("Create Status File : %s", temp_dir)        
                
    except OSError as e:
        logger.error("Can not change the status from %s : %s", temp_dir, e)

def script_stopper(temp_dir, start_time, pid):

    expire_minute = int(script_config.get('ExpireMin', '1'))
    request_wait_seconds = int(script_config.get('RequestWaitSec', '30'))
    max_time_end = start_time + (60 * expire_minute)    
    
    while True:
        time.sleep(5)
        with open(os.path.join(temp_dir,'time'), 'r') as f:
            t = f.readline()

        reset_time = time.time() - float(t)

        if reset_time > request_wait_seconds:
            p = psutil.Process(pid)
            p.terminate()
            logger.info('There is no request for script runner') 
            break

        if time.time() > max_time_end:
            p = psutil.Process(pid)
            p.terminate()
            logger.info('Script runner process is expired.') 
            break

