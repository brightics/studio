/*
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
*/

package com.samsung.sds.brightics.common.network.proto.task;

import static io.grpc.MethodDescriptor.generateFullMethodName;
import static io.grpc.stub.ClientCalls.asyncBidiStreamingCall;
import static io.grpc.stub.ClientCalls.asyncClientStreamingCall;
import static io.grpc.stub.ClientCalls.asyncServerStreamingCall;
import static io.grpc.stub.ClientCalls.asyncUnaryCall;
import static io.grpc.stub.ClientCalls.blockingServerStreamingCall;
import static io.grpc.stub.ClientCalls.blockingUnaryCall;
import static io.grpc.stub.ClientCalls.futureUnaryCall;
import static io.grpc.stub.ServerCalls.asyncBidiStreamingCall;
import static io.grpc.stub.ServerCalls.asyncClientStreamingCall;
import static io.grpc.stub.ServerCalls.asyncServerStreamingCall;
import static io.grpc.stub.ServerCalls.asyncUnaryCall;
import static io.grpc.stub.ServerCalls.asyncUnimplementedStreamingCall;
import static io.grpc.stub.ServerCalls.asyncUnimplementedUnaryCall;

/**
 */
@javax.annotation.Generated(
    value = "by gRPC proto compiler (version 1.8.0)",
    comments = "Source: task.proto")
public final class TaskServiceGrpc {

  private TaskServiceGrpc() {}

  public static final String SERVICE_NAME = "com.samsung.sds.brightics.common.network.proto.task.TaskService";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveAsyncTaskMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> METHOD_RECEIVE_ASYNC_TASK = getReceiveAsyncTaskMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> getReceiveAsyncTaskMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> getReceiveAsyncTaskMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> getReceiveAsyncTaskMethod;
    if ((getReceiveAsyncTaskMethod = TaskServiceGrpc.getReceiveAsyncTaskMethod) == null) {
      synchronized (TaskServiceGrpc.class) {
        if ((getReceiveAsyncTaskMethod = TaskServiceGrpc.getReceiveAsyncTaskMethod) == null) {
          TaskServiceGrpc.getReceiveAsyncTaskMethod = getReceiveAsyncTaskMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.task.TaskService", "receiveAsyncTask"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new TaskServiceMethodDescriptorSupplier("receiveAsyncTask"))
                  .build();
          }
        }
     }
     return getReceiveAsyncTaskMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveSyncTaskMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> METHOD_RECEIVE_SYNC_TASK = getReceiveSyncTaskMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> getReceiveSyncTaskMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> getReceiveSyncTaskMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> getReceiveSyncTaskMethod;
    if ((getReceiveSyncTaskMethod = TaskServiceGrpc.getReceiveSyncTaskMethod) == null) {
      synchronized (TaskServiceGrpc.class) {
        if ((getReceiveSyncTaskMethod = TaskServiceGrpc.getReceiveSyncTaskMethod) == null) {
          TaskServiceGrpc.getReceiveSyncTaskMethod = getReceiveSyncTaskMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.task.TaskService", "receiveSyncTask"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new TaskServiceMethodDescriptorSupplier("receiveSyncTask"))
                  .build();
          }
        }
     }
     return getReceiveSyncTaskMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getStopTaskMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> METHOD_STOP_TASK = getStopTaskMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> getStopTaskMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> getStopTaskMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> getStopTaskMethod;
    if ((getStopTaskMethod = TaskServiceGrpc.getStopTaskMethod) == null) {
      synchronized (TaskServiceGrpc.class) {
        if ((getStopTaskMethod = TaskServiceGrpc.getStopTaskMethod) == null) {
          TaskServiceGrpc.getStopTaskMethod = getStopTaskMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.task.TaskService", "stopTask"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new TaskServiceMethodDescriptorSupplier("stopTask"))
                  .build();
          }
        }
     }
     return getStopTaskMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveTaskResultMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> METHOD_RECEIVE_TASK_RESULT = getReceiveTaskResultMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> getReceiveTaskResultMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage,
      com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> getReceiveTaskResultMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> getReceiveTaskResultMethod;
    if ((getReceiveTaskResultMethod = TaskServiceGrpc.getReceiveTaskResultMethod) == null) {
      synchronized (TaskServiceGrpc.class) {
        if ((getReceiveTaskResultMethod = TaskServiceGrpc.getReceiveTaskResultMethod) == null) {
          TaskServiceGrpc.getReceiveTaskResultMethod = getReceiveTaskResultMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage, com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.task.TaskService", "receiveTaskResult"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new TaskServiceMethodDescriptorSupplier("receiveTaskResult"))
                  .build();
          }
        }
     }
     return getReceiveTaskResultMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static TaskServiceStub newStub(io.grpc.Channel channel) {
    return new TaskServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static TaskServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new TaskServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static TaskServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new TaskServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class TaskServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void receiveAsyncTask(com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveAsyncTaskMethod(), responseObserver);
    }

    /**
     */
    public void receiveSyncTask(com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveSyncTaskMethod(), responseObserver);
    }

    /**
     */
    public void stopTask(com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getStopTaskMethod(), responseObserver);
    }

    /**
     */
    public void receiveTaskResult(com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveTaskResultMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getReceiveAsyncTaskMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
                com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage>(
                  this, METHODID_RECEIVE_ASYNC_TASK)))
          .addMethod(
            getReceiveSyncTaskMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage,
                com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage>(
                  this, METHODID_RECEIVE_SYNC_TASK)))
          .addMethod(
            getStopTaskMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage,
                com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage>(
                  this, METHODID_STOP_TASK)))
          .addMethod(
            getReceiveTaskResultMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage,
                com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage>(
                  this, METHODID_RECEIVE_TASK_RESULT)))
          .build();
    }
  }

  /**
   */
  public static final class TaskServiceStub extends io.grpc.stub.AbstractStub<TaskServiceStub> {
    private TaskServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private TaskServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected TaskServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new TaskServiceStub(channel, callOptions);
    }

    /**
     */
    public void receiveAsyncTask(com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveAsyncTaskMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void receiveSyncTask(com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveSyncTaskMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void stopTask(com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getStopTaskMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void receiveTaskResult(com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveTaskResultMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class TaskServiceBlockingStub extends io.grpc.stub.AbstractStub<TaskServiceBlockingStub> {
    private TaskServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private TaskServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected TaskServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new TaskServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage receiveAsyncTask(com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveAsyncTaskMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage receiveSyncTask(com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveSyncTaskMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage stopTask(com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage request) {
      return blockingUnaryCall(
          getChannel(), getStopTaskMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage receiveTaskResult(com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveTaskResultMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class TaskServiceFutureStub extends io.grpc.stub.AbstractStub<TaskServiceFutureStub> {
    private TaskServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private TaskServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected TaskServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new TaskServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> receiveAsyncTask(
        com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveAsyncTaskMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> receiveSyncTask(
        com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveSyncTaskMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage> stopTask(
        com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getStopTaskMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage> receiveTaskResult(
        com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveTaskResultMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_RECEIVE_ASYNC_TASK = 0;
  private static final int METHODID_RECEIVE_SYNC_TASK = 1;
  private static final int METHODID_STOP_TASK = 2;
  private static final int METHODID_RECEIVE_TASK_RESULT = 3;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final TaskServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(TaskServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_RECEIVE_ASYNC_TASK:
          serviceImpl.receiveAsyncTask((com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage>) responseObserver);
          break;
        case METHODID_RECEIVE_SYNC_TASK:
          serviceImpl.receiveSyncTask((com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage>) responseObserver);
          break;
        case METHODID_STOP_TASK:
          serviceImpl.stopTask((com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage>) responseObserver);
          break;
        case METHODID_RECEIVE_TASK_RESULT:
          serviceImpl.receiveTaskResult((com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage>) responseObserver);
          break;
        default:
          throw new AssertionError();
      }
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public io.grpc.stub.StreamObserver<Req> invoke(
        io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class TaskServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    TaskServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.samsung.sds.brightics.common.network.proto.task.TaskProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("TaskService");
    }
  }

  private static final class TaskServiceFileDescriptorSupplier
      extends TaskServiceBaseDescriptorSupplier {
    TaskServiceFileDescriptorSupplier() {}
  }

  private static final class TaskServiceMethodDescriptorSupplier
      extends TaskServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    TaskServiceMethodDescriptorSupplier(String methodName) {
      this.methodName = methodName;
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.MethodDescriptor getMethodDescriptor() {
      return getServiceDescriptor().findMethodByName(methodName);
    }
  }

  private static volatile io.grpc.ServiceDescriptor serviceDescriptor;

  public static io.grpc.ServiceDescriptor getServiceDescriptor() {
    io.grpc.ServiceDescriptor result = serviceDescriptor;
    if (result == null) {
      synchronized (TaskServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new TaskServiceFileDescriptorSupplier())
              .addMethod(getReceiveAsyncTaskMethod())
              .addMethod(getReceiveSyncTaskMethod())
              .addMethod(getStopTaskMethod())
              .addMethod(getReceiveTaskResultMethod())
              .build();
        }
      }
    }
    return result;
  }
}
