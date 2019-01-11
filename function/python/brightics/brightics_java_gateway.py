# -*- coding:utf-8 -*-

import os
import py4j
from py4j.java_gateway import DEFAULT_PORT
from py4j.java_gateway import JavaGateway, GatewayParameters


class BrighticsJavaGateway(object):
    def __init__(self):
        self.default_fs_path = ''
        self.data_root = ''

    def start(self, gateway_port):
        if not gateway_port:
            gateway_port = DEFAULT_PORT

        gateway_params = GatewayParameters(port=gateway_port, auto_convert=True)

        try:
            self._gateway = JavaGateway(gateway_parameters=gateway_params)

            self.logger = self._gateway.entry_point.getLogger()
            self._gateway.entry_point.setUserToThreadLocalContext()

            self.default_fs_path = self._gateway.entry_point.getDefaultFsPath()
            self.data_root = self._gateway.entry_point.getDataRoot()

            self.DataStatus = self._gateway.jvm.com.samsung.sds.brightics.common.data.DataStatus
            self.ContextType = self._gateway.jvm.com.samsung.sds.brightics.common.network.proto.ContextType
        except:
            self._gateway.shutdown()
            raise Exception('Failed to start java gateway')

    @property
    def gateway(self):
        return self._gateway

    def shutdown(self):
        try:
            self._gateway.entry_point.notifyPythonProcessShutdown()
        finally:
            self._gateway.shutdown()

    def init_spark_context(self):
        from py4j.java_gateway import java_import
        from pyspark import SparkContext
        from pyspark.sql import SparkSession

        java_import(self._gateway.jvm, "org.apache.spark.SparkEnv")
        java_import(self._gateway.jvm, "org.apache.spark.SparkConf")
        java_import(self._gateway.jvm, "org.apache.spark.api.java.*")
        java_import(self._gateway.jvm, "org.apache.spark.api.python.*")
        java_import(self._gateway.jvm, "org.apache.spark.ml.python.*")
        java_import(self._gateway.jvm, "org.apache.spark.mllib.api.python.*")
        java_import(self._gateway.jvm, "org.apache.spark.sql.*")
        java_import(self._gateway.jvm, "org.apache.spark.sql.api.python.*")
        java_import(self._gateway.jvm, "org.apache.spark.sql.hive.*")
        java_import(self._gateway.jvm, "scala.Tuple2")

        java_import(self._gateway.jvm, "com.samsung.sds.brightics.common.spark.BrighticsSparkContext")

        ssc = self._gateway.jvm.BrighticsSparkContext.getSparkContext()
        jsqlContext = self._gateway.jvm.BrighticsSparkContext.getSqlContext()

        jsc = self._gateway.jvm.JavaSparkContext(ssc)

        sc = SparkContext(jsc=jsc, gateway=self._gateway)
        sparkSession = SparkSession(sc, jsqlContext.sparkSession())
        sqlContext = sparkSession._wrapped

        return sc, sparkSession, sqlContext

    def get_script(self):
        return self._gateway.entry_point.getScript()

    def data_status(self, key, data_type, label):
        status = self.DataStatus(data_type, self.get_context_type('python'))
        py4j.java_gateway.set_field(status, 'key', key)
        py4j.java_gateway.set_field(status, 'label', label)
        return status

    def update_context_type(self, status, path, ct='filesystem'):
        py4j.java_gateway.set_field(status, 'contextType', self.get_context_type(ct))
        py4j.java_gateway.set_field(status, 'path', path)

        return status

    def get_context_type(self, ct):
        ct_dict = {'scala': self.ContextType.SCALA,
                   'python': self.ContextType.PYTHON,
                   'filesystem': self.ContextType.FILESYSTEM,
                   'kv_store': self.ContextType.KV_STORE}

        return ct_dict.get(ct, self.ContextType.UNRECOGNIZED)

    def notify_python_process_started(self):
        self._gateway.entry_point.setPid(os.getpid())

    def notify_python_process_finished(self, result, is_exception, exception_cause):
        self._gateway.entry_point.notifyPythonProcessFinished(result, is_exception, exception_cause)

    def notify_brightics_core_exception(self, result, code, message):
        self._gateway.entry_point.notifyBrighticsCoreException(result, code, message)

    def notify_brightics_function_exception(self, result, errors):
        self._gateway.entry_point.notifyBrighticsFunctionException(result, errors)

    def notify_data_updated(self, key, status):
        self._gateway.entry_point.notifyDataUpdated(key, status)

    def notify_data_deleted(self, key):
        self._gateway.entry_point.notifyDataDeleted(key)

    def put_kv_data(self, key, data):
        self._gateway.entry_point.putToKVStore(key, data)

    def get_kv_data(self, key):
        return self._gateway.entry_point.getFromKVStore(key)


brtc_java_gateway = BrighticsJavaGateway()
