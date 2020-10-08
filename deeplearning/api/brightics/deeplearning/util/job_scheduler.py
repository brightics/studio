from multiprocessing.connection import Listener, Client
from collections import deque
import os
import GPUtil

port = int(os.getenv('BRTC_DL_GPU_MGMT_PORT', '3278'))
address = ('127.0.0.1', port)

def listener():
    gpus = deque([str(gpu.id) for gpu in GPUtil.getGPUs()])

    if len(gpus) == 0:
        gpus.append('no_gpu') 

    jobs = deque([])
    listener = Listener(address, authkey=b'brightics')
    while True:
        conn = listener.accept()  # waits next here
        try:
            msg = conn.recv()
            if msg == 'get_gpu':
                try:
                    gpu_id = gpus[0]
                except IndexError as e:
                    gpu_id = ''
                conn.send(gpu_id)

            elif msg == 'pop_gpu':
                try:
                    gpu_id = gpus.popleft()
                except IndexError as e:
                    gpu_id = ''
                conn.send(gpu_id)

            elif msg.startswith('set_gpu'):
                returned_gpu_id = msg.replace('set_gpu', '').strip()
                if returned_gpu_id not in gpus:
                    gpus.append(returned_gpu_id)

            elif msg == 'get_job':
                try:
                    job = jobs[0]
                except IndexError as e:
                    job = ''
                conn.send(job)

            elif msg == 'pop_job':
                try:
                    job = jobs.popleft()
                except IndexError as e:
                    job = ''
                conn.send(job)

            elif msg.startswith('set_job'):
                job = msg.replace('set_job','').strip()
                if job not in jobs:
                    jobs.append(job)
 
            elif msg.startswith('remove_job'):
                try: 
                    job = msg.replace('remove_job', '').strip()
                    if job in jobs:
                        jobs.remove(job)
                except IndexError as e:
                    job = ''
                conn.send(job)
            elif msg =='close_listener':
                listener.close()
                break
        finally:
            conn.close()


def connect_client():
	return Client(address, authkey=b'brightics')  # waits here if the others try to connect prior to this.


def get_gpu():
	conn = None
	try:
		conn = connect_client()
		conn.send('get_gpu')
		return conn.recv()
	finally:
		if conn is not None:
			conn.close()

def pop_gpu():
    conn = None
    try:
        conn = connect_client()
        conn.send('pop_gpu')
        return conn.recv()
    finally:
        if conn is not None:
            conn.close()


def set_gpu(gpu_id):
	conn = None
	try:
		conn = connect_client()
		conn.send('set_gpu'+gpu_id)
	finally:
		if conn is not None:
			conn.close()

def get_job():
	conn = None
	try:
		conn = connect_client()
		conn.send('get_job')
		return conn.recv()
	finally:
		if conn is not None:
			conn.close()

def set_job(job):
	conn = None
	try:
		conn = connect_client()
		conn.send('set_job'+job)
	finally:
		if conn is not None:
			conn.close()

def pop_job():
	conn = None
	try:
		conn = connect_client()
		conn.send('pop_job')
		return conn.recv()
	finally:
		if conn is not None:
			conn.close()

def remove_job(job):
	conn = None
	try:
		conn = connect_client()
		conn.send('remove_job'+job)
		return conn.recv()
	finally:
		if conn is not None:
			conn.close()

def close_listener():
    conn = None
    try:
        conn = connect_client()
        conn.send('close_listener')
    finally:
        if conn is not None:
            conn.close()
