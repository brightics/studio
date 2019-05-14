package com.samsung.sds.brightics.common.network.proto.stream;

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
    comments = "Source: stream.proto")
public final class StreamServiceGrpc {

  private StreamServiceGrpc() {}

  public static final String SERVICE_NAME = "com.samsung.sds.brightics.common.network.proto.stream.StreamService";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getWriteStreaminitializerMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage,
      com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> METHOD_WRITE_STREAMINITIALIZER = getWriteStreaminitializerMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage,
      com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> getWriteStreaminitializerMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage,
      com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> getWriteStreaminitializerMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage, com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> getWriteStreaminitializerMethod;
    if ((getWriteStreaminitializerMethod = StreamServiceGrpc.getWriteStreaminitializerMethod) == null) {
      synchronized (StreamServiceGrpc.class) {
        if ((getWriteStreaminitializerMethod = StreamServiceGrpc.getWriteStreaminitializerMethod) == null) {
          StreamServiceGrpc.getWriteStreaminitializerMethod = getWriteStreaminitializerMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage, com.samsung.sds.brightics.common.network.proto.stream.WriteMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.stream.StreamService", "writeStreaminitializer"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.WriteMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.WriteMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new StreamServiceMethodDescriptorSupplier("writeStreaminitializer"))
                  .build();
          }
        }
     }
     return getWriteStreaminitializerMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getWriteStreamMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage,
      com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> METHOD_WRITE_STREAM = getWriteStreamMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage,
      com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> getWriteStreamMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage,
      com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> getWriteStreamMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage, com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> getWriteStreamMethod;
    if ((getWriteStreamMethod = StreamServiceGrpc.getWriteStreamMethod) == null) {
      synchronized (StreamServiceGrpc.class) {
        if ((getWriteStreamMethod = StreamServiceGrpc.getWriteStreamMethod) == null) {
          StreamServiceGrpc.getWriteStreamMethod = getWriteStreamMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage, com.samsung.sds.brightics.common.network.proto.stream.WriteMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.BIDI_STREAMING)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.stream.StreamService", "writeStream"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.WriteMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new StreamServiceMethodDescriptorSupplier("writeStream"))
                  .build();
          }
        }
     }
     return getWriteStreamMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReadStreamMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
      com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> METHOD_READ_STREAM = getReadStreamMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
      com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> getReadStreamMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
      com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> getReadStreamMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage, com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> getReadStreamMethod;
    if ((getReadStreamMethod = StreamServiceGrpc.getReadStreamMethod) == null) {
      synchronized (StreamServiceGrpc.class) {
        if ((getReadStreamMethod = StreamServiceGrpc.getReadStreamMethod) == null) {
          StreamServiceGrpc.getReadStreamMethod = getReadStreamMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage, com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.SERVER_STREAMING)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.stream.StreamService", "readStream"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.ReadMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new StreamServiceMethodDescriptorSupplier("readStream"))
                  .build();
          }
        }
     }
     return getReadStreamMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getReadStreamDoneMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
      com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> METHOD_READ_STREAM_DONE = getReadStreamDoneMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
      com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> getReadStreamDoneMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
      com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> getReadStreamDoneMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage, com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> getReadStreamDoneMethod;
    if ((getReadStreamDoneMethod = StreamServiceGrpc.getReadStreamDoneMethod) == null) {
      synchronized (StreamServiceGrpc.class) {
        if ((getReadStreamDoneMethod = StreamServiceGrpc.getReadStreamDoneMethod) == null) {
          StreamServiceGrpc.getReadStreamDoneMethod = getReadStreamDoneMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage, com.samsung.sds.brightics.common.network.proto.stream.ReadMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.stream.StreamService", "readStreamDone"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.ReadMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.stream.ReadMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new StreamServiceMethodDescriptorSupplier("readStreamDone"))
                  .build();
          }
        }
     }
     return getReadStreamDoneMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static StreamServiceStub newStub(io.grpc.Channel channel) {
    return new StreamServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static StreamServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new StreamServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static StreamServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new StreamServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class StreamServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void writeStreaminitializer(com.samsung.sds.brightics.common.network.proto.stream.WriteMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getWriteStreaminitializerMethod(), responseObserver);
    }

    /**
     */
    public io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> writeStream(
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> responseObserver) {
      return asyncUnimplementedStreamingCall(getWriteStreamMethod(), responseObserver);
    }

    /**
     */
    public void readStream(com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReadStreamMethod(), responseObserver);
    }

    /**
     */
    public void readStreamDone(com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getReadStreamDoneMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getWriteStreaminitializerMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.stream.WriteMessage,
                com.samsung.sds.brightics.common.network.proto.stream.WriteMessage>(
                  this, METHODID_WRITE_STREAMINITIALIZER)))
          .addMethod(
            getWriteStreamMethod(),
            asyncBidiStreamingCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage,
                com.samsung.sds.brightics.common.network.proto.stream.WriteMessage>(
                  this, METHODID_WRITE_STREAM)))
          .addMethod(
            getReadStreamMethod(),
            asyncServerStreamingCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
                com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage>(
                  this, METHODID_READ_STREAM)))
          .addMethod(
            getReadStreamDoneMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.stream.ReadMessage,
                com.samsung.sds.brightics.common.network.proto.stream.ReadMessage>(
                  this, METHODID_READ_STREAM_DONE)))
          .build();
    }
  }

  /**
   */
  public static final class StreamServiceStub extends io.grpc.stub.AbstractStub<StreamServiceStub> {
    private StreamServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private StreamServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected StreamServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new StreamServiceStub(channel, callOptions);
    }

    /**
     */
    public void writeStreaminitializer(com.samsung.sds.brightics.common.network.proto.stream.WriteMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getWriteStreaminitializerMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> writeStream(
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> responseObserver) {
      return asyncBidiStreamingCall(
          getChannel().newCall(getWriteStreamMethod(), getCallOptions()), responseObserver);
    }

    /**
     */
    public void readStream(com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> responseObserver) {
      asyncServerStreamingCall(
          getChannel().newCall(getReadStreamMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void readStreamDone(com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getReadStreamDoneMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class StreamServiceBlockingStub extends io.grpc.stub.AbstractStub<StreamServiceBlockingStub> {
    private StreamServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private StreamServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected StreamServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new StreamServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.stream.WriteMessage writeStreaminitializer(com.samsung.sds.brightics.common.network.proto.stream.WriteMessage request) {
      return blockingUnaryCall(
          getChannel(), getWriteStreaminitializerMethod(), getCallOptions(), request);
    }

    /**
     */
    public java.util.Iterator<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage> readStream(
        com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request) {
      return blockingServerStreamingCall(
          getChannel(), getReadStreamMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.stream.ReadMessage readStreamDone(com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request) {
      return blockingUnaryCall(
          getChannel(), getReadStreamDoneMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class StreamServiceFutureStub extends io.grpc.stub.AbstractStub<StreamServiceFutureStub> {
    private StreamServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private StreamServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected StreamServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new StreamServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage> writeStreaminitializer(
        com.samsung.sds.brightics.common.network.proto.stream.WriteMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getWriteStreaminitializerMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage> readStreamDone(
        com.samsung.sds.brightics.common.network.proto.stream.ReadMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getReadStreamDoneMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_WRITE_STREAMINITIALIZER = 0;
  private static final int METHODID_READ_STREAM = 1;
  private static final int METHODID_READ_STREAM_DONE = 2;
  private static final int METHODID_WRITE_STREAM = 3;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final StreamServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(StreamServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_WRITE_STREAMINITIALIZER:
          serviceImpl.writeStreaminitializer((com.samsung.sds.brightics.common.network.proto.stream.WriteMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage>) responseObserver);
          break;
        case METHODID_READ_STREAM:
          serviceImpl.readStream((com.samsung.sds.brightics.common.network.proto.stream.ReadMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage>) responseObserver);
          break;
        case METHODID_READ_STREAM_DONE:
          serviceImpl.readStreamDone((com.samsung.sds.brightics.common.network.proto.stream.ReadMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.ReadMessage>) responseObserver);
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
        case METHODID_WRITE_STREAM:
          return (io.grpc.stub.StreamObserver<Req>) serviceImpl.writeStream(
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.stream.WriteMessage>) responseObserver);
        default:
          throw new AssertionError();
      }
    }
  }

  private static abstract class StreamServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    StreamServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.samsung.sds.brightics.common.network.proto.stream.StreamProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("StreamService");
    }
  }

  private static final class StreamServiceFileDescriptorSupplier
      extends StreamServiceBaseDescriptorSupplier {
    StreamServiceFileDescriptorSupplier() {}
  }

  private static final class StreamServiceMethodDescriptorSupplier
      extends StreamServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    StreamServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (StreamServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new StreamServiceFileDescriptorSupplier())
              .addMethod(getWriteStreaminitializerMethod())
              .addMethod(getWriteStreamMethod())
              .addMethod(getReadStreamMethod())
              .addMethod(getReadStreamDoneMethod())
              .build();
        }
      }
    }
    return result;
  }
}
