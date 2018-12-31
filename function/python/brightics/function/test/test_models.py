import re
import argparse
import os
import json
import requests
import time
import datetime

TIME_LIMIT = 3600

HEADERS = {'Authorization':'Bearer ACCESS_TOKEN',
            'cache-control':'no-cache',
            'content-type':'application/json'
            # ,'postman-token':'56e9d3bb-0ca7-1dd7-9e5a-823a8c3e1aa5'
            }


def strip_margin(text):
    return re.sub('\n[ \t]*\|', '\n', text)


def _convert_to_runnable(model_dict):
    mid = model_dict['data'][0]['data']['id']
    functions = model_dict['data'][0]['data']['contents']['functions']
    links = model_dict['data'][0]['data']['contents']['links']
    
    for function in functions:  # todo
        function['label'] = function['display']['label']
        # function['persist'] = True
        # function['skip'] = False
        normalized_param = dict()
        for key, value in function['param'].items():
            if value:
                normalized_param[key] = value
        function['param'] = normalized_param
    
    model_runnable = {
        'main': mid,
        'models': {
            mid: {
                'type': 'data',
                'functions': functions,
                'mid': mid,
                'links': links
                # ,'persist-mode': 'auto'
            }
        },
        'version': '3.5'
    }
    print(json.dumps(model_runnable))
    return model_runnable
    

def _run_model(model_str):
    response_post = requests.post('http://localhost:9097/api/core/v2/analytics/jobs/execute', data=model_str, headers=HEADERS).json()
    print(response_post)
    jobid = response_post['result']
    
    start = time.time()
    while True:
        time.sleep(1)
        response_get = requests.get('http://localhost:9097/api/core/v2/analytics/jobs/{}'.format(jobid), headers=HEADERS).json()
        print(response_get)
        status = response_get['status']
        if status == 'SUCCESS':
            break
        elif status == 'FAIL':
            raise Exception(response_get['errorInfo'])
            break
        elif status == 'PROCESSING' and time.time() - start > TIME_LIMIT:
            function_processing = response_get['processes'][0]['functions'][-1]
            label = function_processing['label']
            minutes, seconds = divmod(time.time() - function_processing['begin'] / 1000, 60)
            raise Exception('{} is running. ( {:02d} m {:02d} s )'.format(label, int(minutes), int(seconds)))
            break


def _run_model_file(filename, out_f):
    with open(filename, 'r') as json_f:
        model = json.load(json_f)
        model_runnable = json.dumps(_convert_to_runnable(model))
    
        _run_model(model_runnable)


def _is_model_json(testfolder, filename):
    filename = os.path.join(testfolder, filename) 
    return os.path.isfile(filename) and filename.endswith('.json')    

    
def _print_write(message, out_f):
    print(message)
    if out_f is not None:
        out_f.write(message)


def _print_write_test_start(out_f):
    start_message = '@@@@@@@@@@@@@@@@@@@@@@@@@ TEST STARTS @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@\n'
    _print_write(start_message, out_f)


def _print_write_project_start(project_label, out_f):
    project_start_message = '------------------------- {} -----------------------------------\n\n'.format(project_label) 
    _print_write(project_start_message, out_f)


def _print_write_project_result(project_label, failed_models, out_f, failed_projects):
    project_SUCCEEDED = len(failed_models) == 0
    if project_SUCCEEDED:
        project_end_message = '\n------------------------- {} : SUCCEEDED -------------------------\n\n'.format(project_label,
                            ', '.join(failed_models))
    else:
        project_end_message = strip_margin("""
        |------------------------- {} : FAILED ----------------------------
        |{}
        |""".format(project_label, ', '.join(failed_models)))
        failed_projects.append(project_label)
     
    _print_write(project_end_message, out_f)


def _print_write_test_result(failed_projects, out_f):
    test_SUCCEEDED = len(failed_projects) == 0
    if test_SUCCEEDED:
        finish_message = '@@@@@@@@@@@@@@@@@@@@@@@@@ TEST FINISHED : SUCCEEDED @@@@@@@@@@@@@@@@@@@@@@'
    else:       
        finish_message = strip_margin("""@@@@@@@@@@@@@@@@@@@@@@@@@ TEST FINISHED : FAILED @@@@@@@@@@@@@@@@@@@@@@@@@
        |{}
        |@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@""".format(', '.join(failed_projects)))
    _print_write(finish_message, out_f)


def _parse_arguments():
    parser = argparse.ArgumentParser(description='Function Tests. Assuming that brightics is running')
    parser.add_argument('-c', '--categories', nargs='*', required=False, help='Categories to test', default=None)
    parser.add_argument('-l', '--logs', required=False, help='Logging', action='store_const', const=True, default=False)
    
    categories = parser.parse_args().categories
    if categories is None:
        suffix = 'full'
        categories = [_.name for _ in os.scandir('../') if _.is_dir() and os.path.isdir(os.path.join(_.path, 'test'))]
        dirs = [_.path for _ in os.scandir('../') if _.is_dir() and os.path.isdir(os.path.join(_.path, 'test'))]
    else:
        categories = dirs = [_ for _ in categories if os.path.isdir(os.path.join('../', _)) and os.path.isdir(os.path.join(os.path.join('../', _), 'test'))]
        suffix = '_'.join(categories)
        dirs = [os.path.join('../', _) for _ in categories if os.path.isdir(os.path.join('../', _)) and os.path.isdir(os.path.join(os.path.join('../', _), 'test'))]
    
    logging = parser.parse_args().logs

    return suffix, dirs, categories, logging


def _test(dirs, categories):
    failed_projects = []
    for dir_, project_label in zip(dirs, categories):
        project_label = project_label.upper()
        testfolder = os.path.join(dir_, 'test')
        
        model_label_list = [filename for filename in os.listdir(testfolder) if _is_model_json(testfolder, filename)]
        model_json_list = [os.path.join(testfolder, filename) for filename in os.listdir(testfolder) if _is_model_json(testfolder, filename)]
        
        if model_json_list:
            _print_write_project_start(project_label, out_f)
            
            failed_models = []
            for filename, model_label in zip(model_json_list, model_label_list):
                try:
                    _run_model_file(filename, out_f)
                    message = '{}_{}: SUCCEEDED\n'.format(project_label, model_label)
                    _print_write(message, out_f)
                    
                except Exception as e:
                    message = message = '{}_{}: FAILED\n{}\n'.format(project_label, model_label, e)
                    _print_write(message, out_f)
                    failed_models.append(model_label)
            
            _print_write_project_result(project_label, failed_models, out_f, failed_projects)
            
    return failed_projects

def _delete_current_job():
    response_get = requests.get('http://localhost:9097/api/core/v2/analytics/jobs', headers=HEADERS).json()
    for job in response_get:
        jobid = job['jobId'] 
        response_delete = requests.delete('http://localhost:9097/api/core/v2/analytics/jobs/{}'.format(jobid), headers=HEADERS).json()
        print(response_delete)
    

if __name__ == '__main__':
    suffix, dirs, categories, logging = _parse_arguments()
    
    outfilename = datetime.datetime.now().strftime('%Y%m%d_%H%M%S_{}.log'.format(suffix))
    
    if logging:
        out_f = open(outfilename,'w')
    else:
        out_f = None
    
    try:
        _print_write_test_start(out_f)
        
        failed_projects = _test(dirs, categories)
         
        _print_write_test_result(failed_projects, out_f)
    finally: # todo delete current running job
        if out_f is not None:
            out_f.close()
        _delete_current_job()
        
