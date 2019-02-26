import json
import glob
import re
import os
import argparse


def json_to_md(in_file_name):

    INDENT = '''   '''
    MESSAGE_NOINPUT = 'This function has no input data.'
    MESSAGE_NOOUTPUT = 'This function has no output data.'

    in_file_json = json.loads(open(in_file_name, 'r', encoding='UTF-8').read())

    if('disableMDGenerator' in in_file_json and in_file_json['disableMDGenerator'] == True):
        print('Skip {} : disableMDGenerator is true.'.format(in_file_name))
        return ''

    func_jsonspec = in_file_json['specJson']

    mdformat_doc = open('md_format/help_format_doc.md', 'r', encoding='UTF-8').read()
    mdformat_param = open('md_format/help_format_param.md', 'r', encoding='UTF-8').read()
    mdformat_param_mandatory = open('md_format/help_format_param_mandatory.md', 'r', encoding='UTF-8').read()

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
#            input_str = mdformat_param.format(index=idx, name=func_input_name, description=func_input_description)
            if 'table' in func_input_name:
                func_input_name = 'table'
            elif 'model' in func_input_name:
                func_input_name = 'model'
            func_inputs.append(func_input_name)
        func_vainputs_str = ', '.join(func_inputs)
        func_pythoninputs_str = ', '.join(func_inputs)
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
#            input_str = mdformat_param.format(index=idx, name=func_output_name, description=func_output_description)
            if 'table' in func_output_name:
                func_output_name = 'table'
            elif 'model' in func_output_name:
                func_output_name = 'model'
            func_outputs.append(func_output_name)
        func_vaoutputs_str = ', '.join(func_outputs)
        func_pythonoutputs_str = ', '.join(func_outputs)
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

        description = ''
        if func_param['label'] == 'Feature Columns' or func_param['id'] == 'feature_cols':
            description = 'Columns to select as features'
        elif func_param['label'] == 'Label Column' or func_param['id'] == 'label_col':
            description = 'Columns to select as label'
        elif func_param['label'] == 'Input Column' or func_param['id'] == 'input_col':
            description = 'Column to select as input'
        elif func_param['label'] == 'Input Columns' or func_param['id'] == 'input_cols':
            description = 'Columns to select as input'
        elif func_param['label'] == 'Response Columns' or func_param['id'] == 'response_cols':
            description = 'Columns to select as response'
        elif func_param['label'] == 'Factor Column' or func_param['id'] == 'factor_col':
            description = 'Column to select as factor'
        elif func_param['label'] == 'Group By' or func_param['id'] == 'group_by':
            description = 'Columns to group by'
        elif func_param['label'] == 'Prediction Column Name' or func_param['id'] == 'prediction_col':
            description = 'Column name for prediction'
        elif func_param['label'] == 'Probability Column Prefix' or func_param['id'] == 'prob_col_prefix':
            description = 'Prefix for column name of probability'
        else:
            description = func_param['description']

        vaparam_md = mdformat.format(index=idx, name=func_param['label'], description=description)
        pythonparam_md = mdformat.format(index=idx, name=func_param['id'], description=description)

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
                md_defaultitem = ' (default)' if item['default'] else ''
                md_item_description = ' ' + item['description'] if 'description' in item else ''

                va_available_items.append(LEFT_INDENT + INDENT + '- ' + item['label'] + md_defaultitem + md_item_description)
                python_available_items.append(LEFT_INDENT + INDENT + '- ' + item['value'] + md_defaultitem + md_item_description)
            vaparam_additionals.append(LEFT_INDENT + '- Available items\n' + '\n'.join(va_available_items))
            pythonparam_additionals.append(LEFT_INDENT + '- Available items\n' + '\n'.join(python_available_items))
        # Additional Info : Checkbox
        elif func_param['control'] == 'CheckBox':
            # Items
            va_available_items = []
            python_available_items = []
            for item in func_param['items']:
                md_defaultitem = ' (default)' if item['default'] else ''
                md_item_description = ' ' + item['description'] if 'description' in item else ''

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
    script_function_params = ','.join(
        [x['id'] + ' = ' for x in func_jsonspec['params']])
    script_function_call = \
        '''{var} = {function_name}({parameters})'''.format(
            var=script_output_var_name,
            function_name=script_function_package_name[1],
            parameters=script_function_params)

    script_function_outs = ''
    if 'outputs' in func_jsonspec:
        script_function_outs = '\n'.join(
            ['''res['{outputs}']'''.format(outputs=k)
             for k, _ in func_jsonspec['outputs'].items()])
    func_usage_script = format_usage_script.format(
        function_package=script_function_package_name[0],
        function_name=script_function_package_name[1],
        function_call_statement=script_function_call,
        function_output=script_function_outs)

    # Example
    func_example = ''

    return mdformat_doc.format(
        usage_script=func_usage_script,
        description=func_description,
        va_inputs=func_vainputs_str,
        va_params=func_vaparams_str,
        va_outputs=func_vaoutputs_str,
        python_inputs=func_pythoninputs_str,
        python_params=func_pythonparams_str,
        python_outputs=func_pythonoutputs_str,
        example=func_example)


'''
With adding run argument
'-o "../../../../../va-server/visual-analytics/public/static/help/python/"',
md_generator makes help file to visual-analytics help directory.
'''
if __name__ == "__main__":

    python_visual_files = glob.glob('''../**/meta/*.json''')

    arg_parser = argparse.ArgumentParser(
        description='Brightics Help Document Generator')
    arg_parser.add_argument('--output-path', '-o',
                            help='Path for output help documents.')
    args = arg_parser.parse_args()

    for in_file_name in python_visual_files:

        in_file_path = os.path.abspath(in_file_name)

        mdstr = ''
        error_occur = False
        try:
            mdstr = json_to_md(in_file_path)
        except Exception as e:
            print("Error occurs in json : " + in_file_path)
            print("Exception Message : {e}".format(e=e))
            error_occur = True

        if not error_occur and mdstr:
            out_file_dir = (os.path.abspath(args.output_path)
                            or (os.path.dirname(
                                os.path.dirname(in_file_path)
                                ) + os.sep + 'help'))
            in_json_str = json.loads(
                open(in_file_name, 'r', encoding='UTF-8').read()
                )
            out_file_header = in_json_str['specJson']['name']
            out_file_path = out_file_dir + os.sep + out_file_header + '.md'

            if not os.path.exists(out_file_dir):
                os.makedirs(out_file_dir)
            wf = open(out_file_path, 'w', encoding='UTF-8')
            wf.write(mdstr)
            wf.close()
            print("MD is generated in {0}".format(out_file_path))
