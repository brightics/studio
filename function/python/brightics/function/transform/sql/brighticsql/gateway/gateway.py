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

import grpc
from brighticsql.gateway.grpc import calcitepython_pb2
from brighticsql.gateway.grpc import calcitepython_pb2_grpc

# from py4j.java_gateway import JavaGateway


__all__ = ['get_connection']


class GrpcConn:
    def __init__(self):
        self.port = None
        self.channel = None
        self.stub = None
        self.host = None

    def connect(self, host='localhost', port=50051):
        self.port = port
        self.host = host
        self.channel = grpc.insecure_channel(f'{self.host}:{self.port}')
        self.stub = calcitepython_pb2_grpc.CalcitePythonServiceStub(
            self.channel)

    def query_planner(self, schema_model):
        msg = calcitepython_pb2.IncomingMsg(msg=schema_model)
        reply = self.stub.setSchemaModel(msg)
        if reply.status == 'exception':
            exception_handler(reply)

    def sql_to_pdplan_json(self, stmt):
        msg = calcitepython_pb2.IncomingMsg(msg=stmt)
        reply = self.stub.parseSql(msg)
        if reply.status == 'exception':
            exception_handler(reply)

        return reply.msg


def exception_handler(reply):
    stacktrace = '\n'.join(reply.stackTrace[1:-1].split(','))
    detail_message = reply.detailMessage
    raise Exception(detail_message + '\n' + stacktrace)


#
# class Py4jConn:
#     def connect(self, port):
#         gateway = JavaGateway()
#         self.sql2pd = gateway.entry_point.get()
#
#     def queryPlanner(self, schema_model):
#         self.sql2pd.queryPlanner(schema_model)
#
#     def sqlToPdPlanJson(self, stmt):
#         return self.sql2pd.sqlToPdPlanJson(stmt)


def get_connection(connection_type='grpc'):
    if connection_type == 'grpc':
        return GrpcConn()
    # elif connection_type == 'py4j':
    #     return Py4jConn()
    else:
        raise NotImplementedError('Code should not be reached.')
