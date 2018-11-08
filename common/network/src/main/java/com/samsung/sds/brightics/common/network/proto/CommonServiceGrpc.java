package com.samsung.sds.brightics.common.network.proto;

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
    comments = "Source: common.proto")
public final class CommonServiceGrpc {

  private CommonServiceGrpc() {}

  public static final String SERVICE_NAME = "com.samsung.sds.brightics.common.network.proto.CommonService";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveClientReadyMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage,
      com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> METHOD_RECEIVE_CLIENT_READY = getReceiveClientReadyMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage,
      com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> getReceiveClientReadyMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage,
      com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> getReceiveClientReadyMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage, com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> getReceiveClientReadyMethod;
    if ((getReceiveClientReadyMethod = CommonServiceGrpc.getReceiveClientReadyMethod) == null) {
      synchronized (CommonServiceGrpc.class) {
        if ((getReceiveClientReadyMethod = CommonServiceGrpc.getReceiveClientReadyMethod) == null) {
          CommonServiceGrpc.getReceiveClientReadyMethod = getReceiveClientReadyMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage, com.samsung.sds.brightics.common.network.proto.ClientReadyMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.CommonService", "receiveClientReady"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.ClientReadyMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.ClientReadyMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new CommonServiceMethodDescriptorSupplier("receiveClientReady"))
                  .build();
          }
        }
     }
     return getReceiveClientReadyMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveHeartbeatMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage,
      com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> METHOD_RECEIVE_HEARTBEAT = getReceiveHeartbeatMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage,
      com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> getReceiveHeartbeatMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage,
      com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> getReceiveHeartbeatMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage, com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> getReceiveHeartbeatMethod;
    if ((getReceiveHeartbeatMethod = CommonServiceGrpc.getReceiveHeartbeatMethod) == null) {
      synchronized (CommonServiceGrpc.class) {
        if ((getReceiveHeartbeatMethod = CommonServiceGrpc.getReceiveHeartbeatMethod) == null) {
          CommonServiceGrpc.getReceiveHeartbeatMethod = getReceiveHeartbeatMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage, com.samsung.sds.brightics.common.network.proto.HeartbeatMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.CommonService", "receiveHeartbeat"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.HeartbeatMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.HeartbeatMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new CommonServiceMethodDescriptorSupplier("receiveHeartbeat"))
                  .build();
          }
        }
     }
     return getReceiveHeartbeatMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static CommonServiceStub newStub(io.grpc.Channel channel) {
    return new CommonServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static CommonServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new CommonServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static CommonServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new CommonServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class CommonServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void receiveClientReady(com.samsung.sds.brightics.common.network.proto.ClientReadyMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveClientReadyMethod(), responseObserver);
    }

    /**
     */
    public void receiveHeartbeat(com.samsung.sds.brightics.common.network.proto.HeartbeatMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveHeartbeatMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getReceiveClientReadyMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.ClientReadyMessage,
                com.samsung.sds.brightics.common.network.proto.ClientReadyMessage>(
                  this, METHODID_RECEIVE_CLIENT_READY)))
          .addMethod(
            getReceiveHeartbeatMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.HeartbeatMessage,
                com.samsung.sds.brightics.common.network.proto.HeartbeatMessage>(
                  this, METHODID_RECEIVE_HEARTBEAT)))
          .build();
    }
  }

  /**
   */
  public static final class CommonServiceStub extends io.grpc.stub.AbstractStub<CommonServiceStub> {
    private CommonServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private CommonServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected CommonServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new CommonServiceStub(channel, callOptions);
    }

    /**
     */
    public void receiveClientReady(com.samsung.sds.brightics.common.network.proto.ClientReadyMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveClientReadyMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void receiveHeartbeat(com.samsung.sds.brightics.common.network.proto.HeartbeatMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveHeartbeatMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class CommonServiceBlockingStub extends io.grpc.stub.AbstractStub<CommonServiceBlockingStub> {
    private CommonServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private CommonServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected CommonServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new CommonServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.ClientReadyMessage receiveClientReady(com.samsung.sds.brightics.common.network.proto.ClientReadyMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveClientReadyMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.HeartbeatMessage receiveHeartbeat(com.samsung.sds.brightics.common.network.proto.HeartbeatMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveHeartbeatMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class CommonServiceFutureStub extends io.grpc.stub.AbstractStub<CommonServiceFutureStub> {
    private CommonServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private CommonServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected CommonServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new CommonServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage> receiveClientReady(
        com.samsung.sds.brightics.common.network.proto.ClientReadyMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveClientReadyMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage> receiveHeartbeat(
        com.samsung.sds.brightics.common.network.proto.HeartbeatMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveHeartbeatMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_RECEIVE_CLIENT_READY = 0;
  private static final int METHODID_RECEIVE_HEARTBEAT = 1;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final CommonServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(CommonServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_RECEIVE_CLIENT_READY:
          serviceImpl.receiveClientReady((com.samsung.sds.brightics.common.network.proto.ClientReadyMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.ClientReadyMessage>) responseObserver);
          break;
        case METHODID_RECEIVE_HEARTBEAT:
          serviceImpl.receiveHeartbeat((com.samsung.sds.brightics.common.network.proto.HeartbeatMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.HeartbeatMessage>) responseObserver);
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

  private static abstract class CommonServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    CommonServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.samsung.sds.brightics.common.network.proto.CommonProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("CommonService");
    }
  }

  private static final class CommonServiceFileDescriptorSupplier
      extends CommonServiceBaseDescriptorSupplier {
    CommonServiceFileDescriptorSupplier() {}
  }

  private static final class CommonServiceMethodDescriptorSupplier
      extends CommonServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    CommonServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (CommonServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new CommonServiceFileDescriptorSupplier())
              .addMethod(getReceiveClientReadyMethod())
              .addMethod(getReceiveHeartbeatMethod())
              .build();
        }
      }
    }
    return result;
  }
}
