import json
import glob
import re
import os


def json_to_md(in_file_name):
    
    INDENT = '''   '''
    MESSAGE_NOINPUT = 'This function has no input data.'
    MESSAGE_NOOUTPUT = 'This function has no output data.'

    in_file_json = json.loads(open(in_file_name, 'r').read())
    
    if('disableMDGenerator' in in_file_json and in_file_json['disableMDGenerator'] == True):
        print('Skip {} : disableMDGenerator is true.'.format(in_file_name))
        return ''
    
    func_jsonspec = in_file_json['specJson']
    
    mdformat_doc = open('md_format/help_format_doc.md', 'r').read()
    mdformat_param = open('md_format/help_format_param.md', 'r').read()
    mdformat_param_mandatory = open('md_format/help_format_param_mandatory.md', 'r').read()
    
    # Descripttion
    func_description = func_jsonspec['description'].strip()
    
    # Inputs
    if 'inputs' in func_jsonspec:
        func_inputs = []
        for idx, func_input_name in enumerate(func_jsonspec['inputs'], start=1):
            if 'description' in func_jsonspec['meta'][func_input_name]:
                description_key = 'description'
            else:
                description_key = 'type'
            func_input_description = func_jsonspec['meta'][func_input_name][description_key]
            input_str = mdformat_param.format(index=idx, name=func_input_name, description=func_input_description) 
            func_inputs.append(input_str)
        func_vainputs_str = '\n'.join(func_inputs)
        func_pythoninputs_str = '\n'.join(func_inputs)
    else:
        func_vainputs_str = MESSAGE_NOINPUT
        func_pythoninputs_str = MESSAGE_NOINPUT
        
    # Outputs
    if 'outputs' in func_jsonspec:
        func_outputs = []
        for idx, func_output_name in enumerate(func_jsonspec['outputs'], start=1):
            if 'description' in func_jsonspec['meta'][func_output_name]:
                description_key = 'description'
            else:
                description_key = 'type'
            func_output_description = func_jsonspec['meta'][func_output_name][description_key]
            input_str = mdformat_param.format(index=idx, name=func_output_name, description=func_output_description) 
            func_outputs.append(input_str)
        func_vaoutputs_str = '\n'.join(func_outputs)
        func_pythonoutputs_str = '\n'.join(func_outputs)
    else:
        func_vaoutputs_str = MESSAGE_NOOUTPUT
        func_pythonoutputs_str = MESSAGE_NOOUTPUT
    
    # Parameters
    func_vaparams = []
    func_pythonparams = []
    for idx, func_param in enumerate(func_jsonspec['params'], start=1):
        
        LEFT_INDENT = ('' if idx < 10 else ' ') + INDENT
        
        if func_param['mandatory'] is True:
            mdformat = mdformat_param_mandatory
        else:
            mdformat = mdformat_param
        vaparam_md = mdformat.format(index=idx, name=func_param['label'], description=func_param['description'])
        pythonparam_md = mdformat.format(index=idx, name=func_param['id'], description=func_param['description'])
        
        vaparam_additionals = []
        pythonparam_additionals = []
        
        # Additional Info : ColumnSelector
        if func_param['control'] == 'ColumnSelector':
            # Type
            if len(func_param['columnType']) > 0:
                additional_type_column = LEFT_INDENT + '- Allowed column type : {0}'.format(', '.join(func_param['columnType']))
                vaparam_additionals.append(additional_type_column)
                pythonparam_additionals.append(additional_type_column)
        # Additional Info : InputBox
        elif func_param['control'] == 'InputBox':
            # Type
            additional_type = LEFT_INDENT + '- Value type : {0}'.format(func_param['type'])
            vaparam_additionals.append(additional_type)
            pythonparam_additionals.append(additional_type)
            # Default Value
            if 'placeHolder' in func_param and len(func_param['placeHolder']) > 0:
                additional_default = LEFT_INDENT + '- Default : {0}'.format(func_param['placeHolder'])
                vaparam_additionals.append(additional_default)
                pythonparam_additionals.append(additional_default)
        # Additional Info : RadioButton
        elif func_param['control'] == 'RadioButton':
            # Items
            va_available_items = []
            python_available_items = []
            for item in func_param['items']:
                if item['default']:
                    md_defaultitem = ' (default)'
                else:
                    md_defaultitem = ''
                if 'description' in item:
                    md_item_description = ' ' + item['description']
                else:
                    md_item_description = ''
                va_available_items.append(LEFT_INDENT + INDENT + '- ' + item['label'] + md_defaultitem + md_item_description)
                python_available_items.append(LEFT_INDENT + INDENT + '- ' + item['value'] + md_defaultitem + md_item_description)
            vaparam_additionals.append(LEFT_INDENT + '- Available items\n' + '\n'.join(va_available_items))
            pythonparam_additionals.append(LEFT_INDENT + '- Available items\n' + '\n'.join(python_available_items))
        
        if len(vaparam_additionals) > 0:
            vaparam_md += '\n' + '\n'.join(vaparam_additionals)
        
        if len(pythonparam_additionals) > 0:
            pythonparam_md += '\n' + '\n'.join(pythonparam_additionals)
            
        func_vaparams.append(vaparam_md)
        func_pythonparams.append(pythonparam_md)
        
        
    func_vaparams_str = '\n'.join(func_vaparams)
    func_pythonparams_str = '\n'.join(func_pythonparams)
    
    # Script
    format_usage_script = '''```python
from {function_package} import {function_name}
{function_call_statement}
{function_output}
```'''
    script_output_var_name = 'res'
    script_function_package_name = func_jsonspec['name'].split('$')
    script_function_params = ','.join([x['id'] + ' = ' for x in func_jsonspec['params']])
    script_function_call = '''{var} = {function_name}({parameters})'''.format(var = script_output_var_name, 
                                                                              function_name = script_function_package_name[1], 
                                                                              parameters = script_function_params)
    script_function_outs = ''
    if 'outputs' in func_jsonspec: 
        script_function_outs = '\n'.join(['''res['{outputs}']'''.format(outputs=k) for k, v in func_jsonspec['outputs'].items()])
    func_usage_script = format_usage_script.format(function_package=script_function_package_name[0], 
                                                   function_name=script_function_package_name[1], 
                                                   function_call_statement=script_function_call, 
                                                   function_output=script_function_outs)
    
    # Example
    func_example = ''
    
    return mdformat_doc.format(
        usage_script = func_usage_script,
        description=func_description,
        va_inputs=func_vainputs_str, 
        va_params=func_vaparams_str,
        va_outputs=func_vaoutputs_str,
        python_inputs=func_pythoninputs_str, 
        python_params=func_pythonparams_str,
        python_outputs=func_pythonoutputs_str,
        example=func_example)


if __name__ == "__main__":
    
    python_visual_files = glob.glob('''../**/meta/*.json''')
    
    for in_file_name in python_visual_files:
        
        in_file_path = os.path.abspath(in_file_name)
        
#         out_file_dir = os.path.dirname(os.path.dirname(in_file_path)) + os.sep + 'help'
#         in_json_str = json.loads(open(in_file_name, 'r').read())
#         out_file_header = in_json_str['specJson']['name']
#         out_file_path = out_file_dir + os.sep + re.sub(r'\.json$', '.md', os.path.basename(in_file_path))
        out_file_dir = os.path.abspath('../../../../../va-server/visual-analytics/public/static/help/python/')
        in_json_str = json.loads(open(in_file_name, 'r').read())
        out_file_header = in_json_str['specJson']['name']
        out_file_path = out_file_dir + os.sep + out_file_header + '.md'
        
        mdstr = ''
        error_occur = False
        try:
            mdstr = json_to_md(in_file_path)
        except Exception as e:
            print("Error occurs in json : " + in_file_path)
            print("Exception Message : {e}".format(e=e))
            error_occur = True
            
        if not error_occur and mdstr:
            
            if not os.path.exists(out_file_dir):
                os.makedirs(out_file_dir)
            wf = open(out_file_path, 'w')
            wf.write(mdstr)
            wf.close()
            print("MD is generated in {0}".format(out_file_path))
            
