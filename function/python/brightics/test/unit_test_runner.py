"""
    Copyright 2019 Samsung SDS
    
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at
    
        http://www.apache.org/licenses/LICENSE-2.0
    
    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
"""

import unittest
import argparse
import datetime

def run_unittest(log_stream_path, test_package):

    tests = unittest.TestLoader().discover(start_dir=test_package,
                                           pattern='*.py')
    logfile = open(log_stream_path, 'w', encoding='UTF-8')

    result = unittest.TextTestRunner(stream=logfile, verbosity=2).run(tests)

    out_code = 0 if result.wasSuccessful() else 1
    logfile.close()
    return out_code


if __name__ == '__main__':
    
    parser = argparse.ArgumentParser(
        description='Brightics Function Unit Test Runner')
    parser.add_argument('--package', default='brightics', 
                        metavar='<Package for unittest>')
    parser.add_argument('--report-file-name', metavar='<Filename of saved report file>')
    
    args = parser.parse_args()

    rfn_default = './{package}-{datetime}.txt'.format(
        package=args.package.replace('.', '_'), 
        datetime=datetime.datetime.today().strftime('%Y%m%d-%H%M%S'))
    
    rfn = args.report_file_name or rfn_default 
    
    out_code = run_unittest(rfn, args.package)
    
    exit(out_code)
