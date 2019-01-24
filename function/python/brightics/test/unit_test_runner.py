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
