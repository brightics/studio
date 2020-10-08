#
# Indicates this is a DL fix for Studio.
#
import os
import socket
import subprocess
import time
import threading
import psutil
import platform

from brightics.deeplearning.util import common_logging, common_config

logger = common_logging.get_logger(__name__)
board_config = common_config.get_section('Tensorboard')
try_max_sec = int(board_config.get("StartupTimeoutSec", "10"))
PROC_NAME = 'tensorboard.main'
hostname_open='0.0.0.0'

def run(log_dir):
    hostname = socket.gethostname()
    port, executed_proc = excuted_proc_check(log_dir)

    if executed_proc is None:
        port = get_open_port(hostname)
        child_env = os.environ.copy()
        python_path = child_env['BRIGHTICS_DL_PYTHON_PATH']

        logger.info(f'tensorboard_exec_command : {python_path} -m {PROC_NAME} --logdir={log_dir} --port={port} --host={hostname}')
        p = psutil.Popen([python_path,'-m', PROC_NAME, f'--logdir={log_dir}', f'--port={port}', f'--host={hostname_open}'],
                        env=child_env, stdout=open(os.devnull, 'w'), stderr=open(os.devnull, 'w'))
        
        # port check 
        try_cnt = 0
        while try_cnt < try_max_sec:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            if sock.connect_ex((hostname, port)) == 0:
                logger.info(f'Port {port} is closed.')
                sock.close()
                break

            sock.close()
            try_cnt = try_cnt + 1
            time.sleep(1)

            logger.info(f'Port {port} is still opened.')
            if try_cnt == try_max_sec:
                raise Exception('Tensorboard is not excuted.')
        
        threading.Thread(target=process_stopper, args=(p.pid,)).start()

        return result_by_ostype(hostname, port)

    else:
        if port is not None:
            return result_by_ostype(hostname, port)
        else:
            raise Exception('Process count is Exceeded')


# Get available port
def get_open_port(hostname):
    low_p = 6006
    max_p = 6100
    result = low_p
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    for port in range(low_p, max_p):
        try:
            s.bind((hostname, port))
            s.listen(1)
            result = s.getsockname()[1]
            s.close()
            break
        except:
            pass
    return result

# Get tensorboard process list(pid)
def find_tensorboard_procs():
    ls = []
    name_list = ['tensorboard','tensorboard.exe', 'python', 'python.exe']
    for p in psutil.process_iter(attrs=['name', 'status', 'pid', 'cmdline']):
        if p.info['name'] in name_list and p.info['status'] is not 'zombie' and PROC_NAME in p.info['cmdline']:
            ls.append(p.info['pid'])
    return ls

# Check logdir that has running process.
def excuted_proc_check(log_dir):
    proc_limit = int(board_config.get('LimitCount'))
    proc = find_tensorboard_procs()
    port = None
    executed_proc = None
    if len(proc) > proc_limit:
        executed_proc = True
        return port, executed_proc
    for pid in proc:
        cmdline = psutil.Process(pid).cmdline()
        cmd_log_dir = ''
        cmd_port = ''
        for cmd in cmdline:
            if cmd.startswith('--logdir='):
                cmd_log_dir = cmd.split('=')[-1]
            if cmd.startswith('--port='):
                cmd_port = cmd.split('=')[-1]
        if log_dir == cmd_log_dir:
            port = cmd_port
            executed_proc = True
            break
    return port, executed_proc


def process_stopper(pid):
    expire_minute = int(board_config.get('ExpireMin'))
    max_time_end = time.time() + (60 * expire_minute)
    while True:
        time.sleep(20)
        if time.time() > max_time_end:
            p = psutil.Process(pid)
            p.terminate()
            logger.info('Tensorboard process is expired.')
            break

def result_by_ostype(hostname, port):
    osname = platform.system()
    if osname == 'Windows':
        return {'url' : 'http://{}:{}'.format(hostname, port)}
    else:
        return {'url': 'http://{}:{}'.format(hostname, port)}