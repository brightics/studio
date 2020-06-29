package com.samsung.sds.brightics.common.network.proto.database;

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
    comments = "Source: database.proto")
public final class DatabaseServiceGrpc {

  private DatabaseServiceGrpc() {}

  public static final String SERVICE_NAME = "com.samsung.sds.brightics.common.network.proto.database.DatabaseService";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReceiveDatabaseInfoMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage,
      com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> METHOD_RECEIVE_DATABASE_INFO = getReceiveDatabaseInfoMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage,
      com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> getReceiveDatabaseInfoMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage,
      com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> getReceiveDatabaseInfoMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage, com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> getReceiveDatabaseInfoMethod;
    if ((getReceiveDatabaseInfoMethod = DatabaseServiceGrpc.getReceiveDatabaseInfoMethod) == null) {
      synchronized (DatabaseServiceGrpc.class) {
        if ((getReceiveDatabaseInfoMethod = DatabaseServiceGrpc.getReceiveDatabaseInfoMethod) == null) {
          DatabaseServiceGrpc.getReceiveDatabaseInfoMethod = getReceiveDatabaseInfoMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage, com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.database.DatabaseService", "receiveDatabaseInfo"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new DatabaseServiceMethodDescriptorSupplier("receiveDatabaseInfo"))
                  .build();
          }
        }
     }
     return getReceiveDatabaseInfoMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static DatabaseServiceStub newStub(io.grpc.Channel channel) {
    return new DatabaseServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static DatabaseServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new DatabaseServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static DatabaseServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new DatabaseServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class DatabaseServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void receiveDatabaseInfo(com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReceiveDatabaseInfoMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getReceiveDatabaseInfoMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage,
                com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage>(
                  this, METHODID_RECEIVE_DATABASE_INFO)))
          .build();
    }
  }

  /**
   */
  public static final class DatabaseServiceStub extends io.grpc.stub.AbstractStub<DatabaseServiceStub> {
    private DatabaseServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private DatabaseServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DatabaseServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new DatabaseServiceStub(channel, callOptions);
    }

    /**
     */
    public void receiveDatabaseInfo(com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReceiveDatabaseInfoMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class DatabaseServiceBlockingStub extends io.grpc.stub.AbstractStub<DatabaseServiceBlockingStub> {
    private DatabaseServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private DatabaseServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DatabaseServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new DatabaseServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage receiveDatabaseInfo(com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage request) {
      return blockingUnaryCall(
          getChannel(), getReceiveDatabaseInfoMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class DatabaseServiceFutureStub extends io.grpc.stub.AbstractStub<DatabaseServiceFutureStub> {
    private DatabaseServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private DatabaseServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected DatabaseServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new DatabaseServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage> receiveDatabaseInfo(
        com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReceiveDatabaseInfoMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_RECEIVE_DATABASE_INFO = 0;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final DatabaseServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(DatabaseServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_RECEIVE_DATABASE_INFO:
          serviceImpl.receiveDatabaseInfo((com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage>) responseObserver);
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

  private static abstract class DatabaseServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    DatabaseServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.samsung.sds.brightics.common.network.proto.database.DataBaseProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("DatabaseService");
    }
  }

  private static final class DatabaseServiceFileDescriptorSupplier
      extends DatabaseServiceBaseDescriptorSupplier {
    DatabaseServiceFileDescriptorSupplier() {}
  }

  private static final class DatabaseServiceMethodDescriptorSupplier
      extends DatabaseServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    DatabaseServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (DatabaseServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new DatabaseServiceFileDescriptorSupplier())
              .addMethod(getReceiveDatabaseInfoMethod())
              .build();
        }
      }
    }
    return result;
  }
}
