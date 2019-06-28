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

package com.samsung.sds.brightics.common.network.proto.deeplearning;

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
    comments = "Source: deeplearning.proto")
public final class DeeplearningServiceGrpc {

  private DeeplearningServiceGrpc() {}

  public static final String SERVICE_NAME = "com.samsung.sds.brightics.common.network.proto.deeplearning.DeeplearningService";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveDeeplearningInfoMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage,
      com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> METHOD_RECEIVE_DEEPLEARNING_INFO = getReceiveDeeplearningInfoMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage,
      com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> getReceiveDeeplearningInfoMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage,
      com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> getReceiveDeeplearningInfoMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage, com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> getReceiveDeeplearningInfoMethod;
    if ((getReceiveDeeplearningInfoMethod = DeeplearningServiceGrpc.getReceiveDeeplearningInfoMethod) == null) {
      synchronized (DeeplearningServiceGrpc.class) {
        if ((getReceiveDeeplearningInfoMethod = DeeplearningServiceGrpc.getReceiveDeeplearningInfoMethod) == null) {
          DeeplearningServiceGrpc.getReceiveDeeplearningInfoMethod = getReceiveDeeplearningInfoMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage, com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.deeplearning.DeeplearningService", "receiveDeeplearningInfo"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new DeeplearningServiceMethodDescriptorSupplier("receiveDeeplearningInfo"))
                  .build();
          }
        }
     }
     return getReceiveDeeplearningInfoMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static DeeplearningServiceStub newStub(io.grpc.Channel channel) {
    return new DeeplearningServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static DeeplearningServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new DeeplearningServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static DeeplearningServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new DeeplearningServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class DeeplearningServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void receiveDeeplearningInfo(com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveDeeplearningInfoMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getReceiveDeeplearningInfoMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage,
                com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage>(
                  this, METHODID_RECEIVE_DEEPLEARNING_INFO)))
          .build();
    }
  }

  /**
   */
  public static final class DeeplearningServiceStub extends io.grpc.stub.AbstractStub<DeeplearningServiceStub> {
    private DeeplearningServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private DeeplearningServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DeeplearningServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new DeeplearningServiceStub(channel, callOptions);
    }

    /**
     */
    public void receiveDeeplearningInfo(com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveDeeplearningInfoMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class DeeplearningServiceBlockingStub extends io.grpc.stub.AbstractStub<DeeplearningServiceBlockingStub> {
    private DeeplearningServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private DeeplearningServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DeeplearningServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new DeeplearningServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage receiveDeeplearningInfo(com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveDeeplearningInfoMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class DeeplearningServiceFutureStub extends io.grpc.stub.AbstractStub<DeeplearningServiceFutureStub> {
    private DeeplearningServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private DeeplearningServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DeeplearningServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new DeeplearningServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage> receiveDeeplearningInfo(
        com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveDeeplearningInfoMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_RECEIVE_DEEPLEARNING_INFO = 0;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final DeeplearningServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(DeeplearningServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_RECEIVE_DEEPLEARNING_INFO:
          serviceImpl.receiveDeeplearningInfo((com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage>) responseObserver);
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

  private static abstract class DeeplearningServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    DeeplearningServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.samsung.sds.brightics.common.network.proto.deeplearning.DeeplearningProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("DeeplearningService");
    }
  }

  private static final class DeeplearningServiceFileDescriptorSupplier
      extends DeeplearningServiceBaseDescriptorSupplier {
    DeeplearningServiceFileDescriptorSupplier() {}
  }

  private static final class DeeplearningServiceMethodDescriptorSupplier
      extends DeeplearningServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    DeeplearningServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (DeeplearningServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new DeeplearningServiceFileDescriptorSupplier())
              .addMethod(getReceiveDeeplearningInfoMethod())
              .build();
        }
      }
    }
    return result;
  }
}
