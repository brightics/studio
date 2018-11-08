# -*- coding:utf-8 -*-

import os
import sys
import unittest
from unittest.mock import patch, MagicMock

import py4j.java_gateway as status_gateway

from brightics.brightics_python_runner import BrighticsPythonRunner

NO_EXCEPTION = BrighticsPythonRunner.NO_EXCEPTION


class BrighticsPythonRunnerTest(unittest.TestCase):

    maxDiff = None

    @classmethod
    def setUpClass(cls):
        cls.patcher = patch('brightics.brightics_data_api.gateway')
        cls.mock_gateway = cls.patcher.start()
        cls.mock_gateway.data_status = MagicMock()

    @classmethod
    def tearDownClass(cls):
        cls.patcher.stop()

    def setUp(self):
        self.brightics_runner = BrighticsPythonRunner(False)

        self.assertEqual(self.brightics_runner.run("from brightics.test.data_api_test import SampleFunction"),
                         ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("import pandas as pd\nimport numpy as np"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run(
            "from collections import OrderedDict\n"
            "df = pd.DataFrame(OrderedDict({'one': [-1, 0, 2.5], 'two': ['foo', 'bar', 'baz'], 'three': [True, False, True]}))"),
            ('', NO_EXCEPTION))

        self.module_path = sys.modules[BrighticsPythonRunner.__module__].__file__
        if self.module_path[-1] == 'c':
            self.module_path = self.module_path[:-1]

        self.python_version = sys.version_info.major

        self.traceback_format = ('Traceback (most recent call last):\n'
                                 '  File "' + self.module_path + '", line 102, in _executer\n'
                                 '    exec(interactive_code_object, self._globals)\n'
                                 '  File "<string>", line 1, in <module>\n'
                                 '{error}\n')

    def test_single_statements_run(self):
        self.assertEqual(self.brightics_runner.run("print('Hello, World!')"), ('Hello, World!\n', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("print(1 + 2)"), ('3\n', NO_EXCEPTION))

    def test_multi_line_statements_run(self):
        code = """
i = [0, 1, 2]
for j in i:
    print(j)"""

        self.assertEqual(self.brightics_runner.run(code), ('0\n1\n2\n', NO_EXCEPTION))

    def test_last_line_of_code_executed_in_interactive_mode(self):
        self.assertEqual(self.brightics_runner.run('1'), ('1\n', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run('i = [0, 1, 2]'), ('', NO_EXCEPTION))

        code = """
i = [0, 1, 2]
i"""
        self.assertEqual(self.brightics_runner.run(code), ('[0, 1, 2]\n', NO_EXCEPTION))

    def test_exception_message_returned_as_a_string(self):
        error_msg = 'ZeroDivisionError: integer division or modulo by zero' if self.python_version == 2 else 'ZeroDivisionError: division by zero'

        error_traceback, is_exception = self.brightics_runner.run('1/0')

        self.assertMultiLineEqual(error_traceback,
                                  self.traceback_format.format(error=error_msg))
        self.assertTrue(is_exception[0])
        self.assertEqual(error_msg, is_exception[1].rstrip())

    def test_same_runner_and_multiple_script_share_variables(self):
        self.assertEqual(self.brightics_runner.run('a = 2'), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run('b = 3'), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run('a + b'), ('5\n', NO_EXCEPTION))

    def test_new_runner_variables_clean(self):
        error_traceback, is_exception = self.brightics_runner.run('print(i)')

        self.assertMultiLineEqual(error_traceback,
                                  self.traceback_format.format(error="NameError: name 'i' is not defined"))
        self.assertTrue(is_exception)

    def test_runner_have_own_scope_per_user(self):
        brightics_runner1 = BrighticsPythonRunner()
        brightics_runner2 = BrighticsPythonRunner()

        self.assertEqual(brightics_runner1.run("test_name = 'user1'"), ('', NO_EXCEPTION))
        self.assertEqual(brightics_runner1.run("runner = 'runner1'"), ('', NO_EXCEPTION))

        self.assertEqual(brightics_runner2.run("test_name = 'user2'"), ('', NO_EXCEPTION))
        self.assertEqual(brightics_runner2.run("runner2 = 'runner2'"), ('', NO_EXCEPTION))

        self.assertEqual(brightics_runner1.run('print(test_name)'), ('user1\n', NO_EXCEPTION))
        self.assertEqual(brightics_runner1.run('print(runner)'), ('runner1\n', NO_EXCEPTION))

        self.assertEqual(brightics_runner2.run('print(test_name)'), ('user2\n', NO_EXCEPTION))

        error_traceback, is_exception = brightics_runner2.run('print(runner)')
        self.assertMultiLineEqual(error_traceback,
                                  self.traceback_format.format(error="NameError: name 'runner' is not defined"))
        self.assertTrue(is_exception)

        self.assertEqual(brightics_runner2.run('print(runner2)'), ('runner2\n', NO_EXCEPTION))

    @unittest.skip("Pandas use os module")
    def test_import_os_module_should_not_be_allowed(self):
        error_msg = 'ImportError: No module named os' if self.python_version == 2 else 'ModuleNotFoundError: import of os halted; None in sys.modules'

        self.assertMultiLineEqual(self.brightics_runner.run('import os'),
                                  self.traceback_format.format(error=error_msg))

    def test_korean(self):
        code = """
greet = '안녕하세요'
print(greet)"""

        self.assertEqual(self.brightics_runner.run(code), ('안녕하세요\n', NO_EXCEPTION))

    def test_runner_have_datas_in_dict(self):
        self.mock_gateway.notify_data_updated = MagicMock()

        self.mock_gateway.data_status.return_value = int.__name__
        self.assertEqual(self.brightics_runner.run("put_data('test', 123, 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('test')"),
                         ("{'data': 123, 'status': 'int'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('test', 'int', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('test', 'int')

        self.mock_gateway.data_status.return_value = str.__name__
        self.assertEqual(self.brightics_runner.run("put_data('test', 'string data', 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('test')"),
                         ("{'data': 'string data', 'status': 'str'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('test', 'text', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('test', 'str')

        self.mock_gateway.data_status.return_value = bool.__name__
        self.assertEqual(self.brightics_runner.run("put_data('test', True, 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('test')"),
                         ("{'data': True, 'status': 'bool'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('test', 'bool', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('test', 'bool')

        self.mock_gateway.data_status.return_value = list.__name__
        self.assertEqual(self.brightics_runner.run("put_data('test', [1, 2, 3], 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('test')"),
                         ("{'data': [1, 2, 3], 'status': 'list'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('test', 'list', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('test', 'list')

        self.mock_gateway.data_status.return_value = tuple.__name__
        self.assertEqual(self.brightics_runner.run("put_data('test', (1, 2, 3), 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('test')"),
                         ("{'data': (1, 2, 3), 'status': 'tuple'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('test', 'tuple', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('test', 'tuple')

        self.mock_gateway.data_status.return_value = dict.__name__
        self.assertEqual(self.brightics_runner.run("put_data('test', {'key': 123, 'value': 'data'}, 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('test')"),
                         ("{'data': {'key': 123, 'value': 'data'}, 'status': 'dict'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('test', 'dict', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('test', 'dict')

    def test_could_use_data_dict_in_defined_function(self):
        self.mock_gateway.data_status.return_value = 'list'

        self.assertEqual(self.brightics_runner.run("func = SampleFunction()"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("func.test_add_data('my_key', [1, 2, 3, 4, 5], 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("func.test_get_status('my_key')"),
                         ("{'data': [1, 2, 3, 4, 5], 'status': 'list'}\n", NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('my_key')"),
                         ("{'data': [1, 2, 3, 4, 5], 'status': 'list'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('my_key', 'list', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('my_key', 'list')

    def test_could_use_data_dict_in_script(self):
        self.mock_gateway.data_status.return_value = 'str'

        self.assertEqual(self.brightics_runner.run("put_data('mm', 'str', 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('mm')"),
                         ("{'data': 'str', 'status': 'str'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('mm', 'text', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('mm', 'str')

    def test_multiple_defined_functions_share_data_through_data_dict(self):
        self.mock_gateway.data_status.return_value = 'list'

        self.assertEqual(self.brightics_runner.run("func = SampleFunction()"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("func.test_add_data('my_key', [1, 2, 3, 4, 5], 'label')"), ('', NO_EXCEPTION))

        self.assertEqual(self.brightics_runner.run("func2 = SampleFunction()"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("func2.test_get_status('my_key')"),
                         ("{'data': [1, 2, 3, 4, 5], 'status': 'list'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called_with('my_key', 'list', 'label')
        self.mock_gateway.notify_data_updated.assert_called_with('my_key', 'list')

    def test_not_exist_data_key_passed_data_container_return_empty_str(self):
        self.assertEqual(self.brightics_runner.run("get_data_info('not_key')"), ('', NO_EXCEPTION))

        self.assertEqual(self.brightics_runner.run("func = SampleFunction()"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("func.test_get_status('not_key')"), ('', NO_EXCEPTION))

    def test_store_pandas_data_frame_in_dict(self):
        self.mock_gateway.data_status.return_value = 'DataFrame'

        self.assertEqual(self.brightics_runner.run("put_data('dataframe_data', df, 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("get_data_info('dataframe_data')"),
                         ("{'data':    one  two  three\n0 -1.0  foo   True\n1  0.0  bar  False\n2  2.5  baz   True, "
                         "'status': 'DataFrame'}\n", NO_EXCEPTION))

        self.mock_gateway.data_status.assert_called()
        self.mock_gateway.notify_data_updated.assert_called_with('dataframe_data', 'DataFrame')

    def test_read_parquet(self):
        self.assertEqual(self.brightics_runner.run("df.to_parquet('test.parquet')"), ('', NO_EXCEPTION))

        self.assertEqual(self.brightics_runner.run("read_df = read_parquet('test.parquet')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("len(read_df.columns.tolist())"), ('3\n', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("read_df = read_df[['one', 'two', 'three']]\nread_df"),
                         ('   one  two  three\n0 -1.0  foo   True\n1  0.0  bar  False\n2  2.5  baz   True\n', NO_EXCEPTION))

        os.remove('test.parquet')

    @patch('brightics.brightics_data_api.status_gateway')
    def test_view_data_when_data_type_is_dataframe(self, mock_status):
        mock_status.get_field.return_value = 'table'
        mock_status.side_effect = lambda *args, **kw: status_gateway

        self.assertEqual(self.brightics_runner.run("put_data('dataframe', df, 'label')"), ('', NO_EXCEPTION))
        self.assertEqual(self.brightics_runner.run("view_data('dataframe')"),
                         ('\'{"type": "table", '
                          '"data": {"count": 3, "bytes": -1, '
                          '"schema": [{"column-name": "one", "column-type": "float64"}, '
                          '{"column-name": "two", "column-type": "object"}, '
                          '{"column-name": "three", "column-type": "bool"}], '
                          '"data": [[-1.0, "foo", true], [0.0, "bar", false], [2.5, "baz", true]]}}\'\n',
                          (False, '')))

    def test_view_data_when_data_type_is_text(self):
        text = 'This is a text data for test'

        self.assertEqual(self.brightics_runner.run("put_data('text', '{}', 'label')".format(text)), ('', NO_EXCEPTION))

        with patch('brightics.brightics_data_api.status_gateway') as mock_status:
            mock_status.get_field.return_value = 'text'
            mock_status.side_effect = lambda *args, **kw: status_gateway
            self.assertEqual(self.brightics_runner.run("view_data('text')"),
                             ('\'{"type": "text", "data": "{}"}\'\n'.format(text), NO_EXCEPTION))


if __name__ == '__main__':
    suite = unittest.TestLoader().loadTestsFromTestCase(BrighticsPythonRunnerTest)
    unittest.TextTestRunner(verbosity=2).run(suite)
