# -*- coding:utf-8 -*-

from __future__ import absolute_import

import sys
import os
import signal
import traceback
import ast
from contextlib import contextmanager
import json

try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO

current_dir_path = os.path.dirname(os.path.realpath(__file__))
brightics_python_root_dir = os.path.abspath(os.path.join(current_dir_path, os.pardir))
sys.path.append(brightics_python_root_dir)
os.chdir(brightics_python_root_dir)

from brightics.brightics_java_gateway import brtc_java_gateway
from brightics.common.exception import BrighticsCoreException
from brightics.common.exception import BrighticsFunctionException


@contextmanager
def redirect_stderr():
    redirect_to = open(os.devnull, 'w')
    old_stderr, sys.stderr = sys.stderr, redirect_to
    try:
        yield None
    finally:
        sys.stderr = old_stderr


class BrighticsPythonRunner(object):
    NO_EXCEPTION = (False, "")

    def __init__(self, use_spark=False):
        self._stdout = StringIO()
        self._is_exception = self.NO_EXCEPTION
        self._init_executer()

        import brightics.brightics_data_api as data_api
        import brightics.common.data.utils as data_util
        from brightics.common.utils import check_required_parameters

        self._globals = {
            'make_data_path_from_key': data_util.make_data_path_from_key,
            'get_data_info': data_api.get_data_info,
            'get_data_status': data_api.get_data_status,
            'get_data': data_api.get_data,
            'list_status': data_api.list_status,
            'view_data': data_api.view_data,
            'view_schema': data_api.view_schema,
            'write_data': data_api.write_data,
            'delete_data': data_api.delete_data,
            'put_data': data_api.put_data,
            'read_parquet': data_api.read_parquet,
            'read_redis': data_api.read_redis,
            'check_required_parameters': check_required_parameters
        }

        if use_spark:
            sc, sparkSession, sqlContext = brtc_java_gateway.init_spark_context()

            self._globals['sc'] = sc
            self._globals['spark'] = sparkSession
            self._globals['sqlContext'] = sqlContext

        signal.signal(signal.SIGINT, self._interrupt_handler)

    def __del__(self):
        self._reset_stdout()
        self._stdout.close()
        self._exec.close()

    def run(self, code):
        try:
            self._switch_stdout()
            return self._exec.send(code), self._is_exception
        except StopIteration:
            self._init_executer()
            return self._exec.send(code), self._is_exception
        finally:
            self._reset_stdout()

    def _init_executer(self):
        self._exec = self._executer()
        next(self._exec)

    def _executer(self):
        while True:
            code = (yield self._stdout.getvalue())
            self._is_exception = self.NO_EXCEPTION

            try:
                code_tree = ast.parse(code)

                exec_code = code_tree.body[:-1]
                single_code = code_tree.body[-1:]  # last node of code

                exec_code_object = compile(ast.Module(exec_code), '<string>', 'exec')
                interactive_code_object = compile(ast.Interactive(single_code), '<string>', 'single')

                with redirect_stderr():
                    exec(exec_code_object, self._globals)
                    exec(interactive_code_object, self._globals)
            except BrighticsCoreException as bce:
                raise bce
            except BrighticsFunctionException as bfe:
                raise bfe
            except Exception as e:
                self._stdout.write(traceback.format_exc())
                self._is_exception = (True, traceback.format_exception_only(type(e), e)[-1])

    def _switch_stdout(self):
        self._stdout.truncate(0)
        self._stdout.seek(0)

        self.old_stdout = sys.stdout
        sys.stdout = self._stdout

    def _reset_stdout(self):
        try:
            sys.stdout = self.old_stdout
        except:
            sys.stdout = sys.__stdout__

    def _interrupt_handler(self, signum, frame):
        """
        signum: the signal number
        frame: current stack frame (None or a frame object)
        """
        raise Exception("User Interrupt")


if __name__ == '__main__':
    """
    argv[1] : use spark context
    argv[2] : gateway server port
    """
    use_spark_context = True if sys.argv[1] == 'true' else False
    gateway_port = int(sys.argv[2]) if len(sys.argv) > 2 else None

    try:
        brtc_java_gateway.start(gateway_port)

        brtc_java_gateway.logger.info("[Python] Start to initialize BrighticsPythonRunner")

        runner = BrighticsPythonRunner(use_spark_context)
        runner.run("from brightics.common import *")
        runner.run("from brightics.function import *")

        brtc_java_gateway.logger.info("[Python] Finished to initialize BrighticsPythonRunner")

        brtc_java_gateway.notify_python_process_started()
    except Exception as err:
        try:
            brtc_java_gateway.logger.error("[Python] {0}".format(err))
        finally:
            sys.exit(1)

    try:
        s = brtc_java_gateway.get_script()
        while s and s.rstrip() not in ['exit()', 'quit']:
            try:
                brtc_java_gateway.logger.info("[Python] Start run script\n" + s)

                result, is_exception = runner.run(s)

                brtc_java_gateway.logger.info("[Python] Python process finished. " +
                                              "Exception occurred [" + str(is_exception[0]) + "]" +
                                              (" Cause: " + is_exception[1] if is_exception[0] else is_exception[1]))
                brtc_java_gateway.logger.info("[Python] Result: " + result + "\n")

                brtc_java_gateway.notify_python_process_finished(result, is_exception[0], is_exception[1])
            except BrighticsFunctionException as bfe:
                brtc_java_gateway.notify_brightics_function_exception(traceback.format_exc(), json.dumps(bfe.errors))
                brtc_java_gateway.logger.info("[Python] " + traceback.format_exc())
            except BrighticsCoreException as bce:
                brtc_java_gateway.notify_brightics_core_exception(traceback.format_exc(), str(bce.code), bce.message)
                brtc_java_gateway.logger.info("[Python] " + traceback.format_exc())
            except Exception as e:
                brtc_java_gateway.notify_python_process_finished(traceback.format_exc(), True, traceback.format_exception_only(type(e), e)[-1])
                brtc_java_gateway.logger.info("[Python] " + traceback.format_exc())
            finally:
                s = brtc_java_gateway.get_script()
    except Exception as e:
        brtc_java_gateway.notify_python_process_finished(traceback.format_exc(), True, traceback.format_exception_only(type(e), e)[-1])
        brtc_java_gateway.logger.info("[Python] " + traceback.format_exc())
    finally:
        try:
            brtc_java_gateway.logger.info("[Python] Python process shutdown")
        except:
            pass

        brtc_java_gateway.shutdown()
        sys.exit(0)
