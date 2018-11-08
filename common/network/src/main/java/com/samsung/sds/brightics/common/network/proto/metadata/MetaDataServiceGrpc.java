package com.samsung.sds.brightics.common.network.proto.metadata;

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
    comments = "Source: metadata.proto")
public final class MetaDataServiceGrpc {

  private MetaDataServiceGrpc() {}

  public static final String SERVICE_NAME = "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService";

  // Static method descriptors that strictly reflect the proto.
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getDataStatusListMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_DATA_STATUS_LIST = getDataStatusListMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getDataStatusListMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getDataStatusListMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getDataStatusListMethod;
    if ((getDataStatusListMethod = MetaDataServiceGrpc.getDataStatusListMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getDataStatusListMethod = MetaDataServiceGrpc.getDataStatusListMethod) == null) {
          MetaDataServiceGrpc.getDataStatusListMethod = getDataStatusListMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "dataStatusList"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("dataStatusList"))
                  .build();
          }
        }
     }
     return getDataStatusListMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getChangeDataPermissionMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_CHANGE_DATA_PERMISSION = getChangeDataPermissionMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getChangeDataPermissionMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getChangeDataPermissionMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getChangeDataPermissionMethod;
    if ((getChangeDataPermissionMethod = MetaDataServiceGrpc.getChangeDataPermissionMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getChangeDataPermissionMethod = MetaDataServiceGrpc.getChangeDataPermissionMethod) == null) {
          MetaDataServiceGrpc.getChangeDataPermissionMethod = getChangeDataPermissionMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "changeDataPermission"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("changeDataPermission"))
                  .build();
          }
        }
     }
     return getChangeDataPermissionMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getSqlDataMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_SQL_DATA = getSqlDataMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getSqlDataMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getSqlDataMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getSqlDataMethod;
    if ((getSqlDataMethod = MetaDataServiceGrpc.getSqlDataMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getSqlDataMethod = MetaDataServiceGrpc.getSqlDataMethod) == null) {
          MetaDataServiceGrpc.getSqlDataMethod = getSqlDataMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "sqlData"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("sqlData"))
                  .build();
          }
        }
     }
     return getSqlDataMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getManipulateDataMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_MANIPULATE_DATA = getManipulateDataMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getManipulateDataMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getManipulateDataMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getManipulateDataMethod;
    if ((getManipulateDataMethod = MetaDataServiceGrpc.getManipulateDataMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getManipulateDataMethod = MetaDataServiceGrpc.getManipulateDataMethod) == null) {
          MetaDataServiceGrpc.getManipulateDataMethod = getManipulateDataMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "manipulateData"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("manipulateData"))
                  .build();
          }
        }
     }
     return getManipulateDataMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getManipulateImportDataMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_MANIPULATE_IMPORT_DATA = getManipulateImportDataMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getManipulateImportDataMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getManipulateImportDataMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getManipulateImportDataMethod;
    if ((getManipulateImportDataMethod = MetaDataServiceGrpc.getManipulateImportDataMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getManipulateImportDataMethod = MetaDataServiceGrpc.getManipulateImportDataMethod) == null) {
          MetaDataServiceGrpc.getManipulateImportDataMethod = getManipulateImportDataMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "manipulateImportData"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("manipulateImportData"))
                  .build();
          }
        }
     }
     return getManipulateImportDataMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getAddDataAliasMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_ADD_DATA_ALIAS = getAddDataAliasMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getAddDataAliasMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getAddDataAliasMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getAddDataAliasMethod;
    if ((getAddDataAliasMethod = MetaDataServiceGrpc.getAddDataAliasMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getAddDataAliasMethod = MetaDataServiceGrpc.getAddDataAliasMethod) == null) {
          MetaDataServiceGrpc.getAddDataAliasMethod = getAddDataAliasMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "addDataAlias"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("addDataAlias"))
                  .build();
          }
        }
     }
     return getAddDataAliasMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getAddDataAliasByDataKeyMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_ADD_DATA_ALIAS_BY_DATA_KEY = getAddDataAliasByDataKeyMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getAddDataAliasByDataKeyMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getAddDataAliasByDataKeyMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getAddDataAliasByDataKeyMethod;
    if ((getAddDataAliasByDataKeyMethod = MetaDataServiceGrpc.getAddDataAliasByDataKeyMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getAddDataAliasByDataKeyMethod = MetaDataServiceGrpc.getAddDataAliasByDataKeyMethod) == null) {
          MetaDataServiceGrpc.getAddDataAliasByDataKeyMethod = getAddDataAliasByDataKeyMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "addDataAliasByDataKey"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("addDataAliasByDataKey"))
                  .build();
          }
        }
     }
     return getAddDataAliasByDataKeyMethod;
  }
  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  @java.lang.Deprecated // Use {@link #getRemoveDataAliasMethod()} instead. 
  public static final io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> METHOD_REMOVE_DATA_ALIAS = getRemoveDataAliasMethod();

  private static volatile io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getRemoveDataAliasMethod;

  @io.grpc.ExperimentalApi("https://github.com/grpc/grpc-java/issues/1901")
  public static io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage,
      com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getRemoveDataAliasMethod() {
    io.grpc.MethodDescriptor<com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> getRemoveDataAliasMethod;
    if ((getRemoveDataAliasMethod = MetaDataServiceGrpc.getRemoveDataAliasMethod) == null) {
      synchronized (MetaDataServiceGrpc.class) {
        if ((getRemoveDataAliasMethod = MetaDataServiceGrpc.getRemoveDataAliasMethod) == null) {
          MetaDataServiceGrpc.getRemoveDataAliasMethod = getRemoveDataAliasMethod = 
              io.grpc.MethodDescriptor.<com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage, com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>newBuilder()
              .setType(io.grpc.MethodDescriptor.MethodType.UNARY)
              .setFullMethodName(generateFullMethodName(
                  "com.samsung.sds.brightics.common.network.proto.metadata.MetaDataService", "removeDataAlias"))
              .setSampledToLocalTracing(true)
              .setRequestMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage.getDefaultInstance()))
              .setResponseMarshaller(io.grpc.protobuf.ProtoUtils.marshaller(
                  com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage.getDefaultInstance()))
                  .setSchemaDescriptor(new MetaDataServiceMethodDescriptorSupplier("removeDataAlias"))
                  .build();
          }
        }
     }
     return getRemoveDataAliasMethod;
  }

  /**
   * Creates a new async stub that supports all call types for the service
   */
  public static MetaDataServiceStub newStub(io.grpc.Channel channel) {
    return new MetaDataServiceStub(channel);
  }

  /**
   * Creates a new blocking-style stub that supports unary and streaming output calls on the service
   */
  public static MetaDataServiceBlockingStub newBlockingStub(
      io.grpc.Channel channel) {
    return new MetaDataServiceBlockingStub(channel);
  }

  /**
   * Creates a new ListenableFuture-style stub that supports unary calls on the service
   */
  public static MetaDataServiceFutureStub newFutureStub(
      io.grpc.Channel channel) {
    return new MetaDataServiceFutureStub(channel);
  }

  /**
   */
  public static abstract class MetaDataServiceImplBase implements io.grpc.BindableService {

    /**
     */
    public void dataStatusList(com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getDataStatusListMethod(), responseObserver);
    }

    /**
     */
    public void changeDataPermission(com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getChangeDataPermissionMethod(), responseObserver);
    }

    /**
     */
    public void sqlData(com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getSqlDataMethod(), responseObserver);
    }

    /**
     */
    public void manipulateData(com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getManipulateDataMethod(), responseObserver);
    }

    /**
     */
    public void manipulateImportData(com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getManipulateImportDataMethod(), responseObserver);
    }

    /**
     */
    public void addDataAlias(com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getAddDataAliasMethod(), responseObserver);
    }

    /**
     */
    public void addDataAliasByDataKey(com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getAddDataAliasByDataKeyMethod(), responseObserver);
    }

    /**
     */
    public void removeDataAlias(com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnimplementedUnaryCall(getRemoveDataAliasMethod(), responseObserver);
    }

    @java.lang.Override public final io.grpc.ServerServiceDefinition bindService() {
      return io.grpc.ServerServiceDefinition.builder(getServiceDescriptor())
          .addMethod(
            getDataStatusListMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_DATA_STATUS_LIST)))
          .addMethod(
            getChangeDataPermissionMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_CHANGE_DATA_PERMISSION)))
          .addMethod(
            getSqlDataMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_SQL_DATA)))
          .addMethod(
            getManipulateDataMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_MANIPULATE_DATA)))
          .addMethod(
            getManipulateImportDataMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_MANIPULATE_IMPORT_DATA)))
          .addMethod(
            getAddDataAliasMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_ADD_DATA_ALIAS)))
          .addMethod(
            getAddDataAliasByDataKeyMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_ADD_DATA_ALIAS_BY_DATA_KEY)))
          .addMethod(
            getRemoveDataAliasMethod(),
            asyncUnaryCall(
              new MethodHandlers<
                com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage,
                com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>(
                  this, METHODID_REMOVE_DATA_ALIAS)))
          .build();
    }
  }

  /**
   */
  public static final class MetaDataServiceStub extends io.grpc.stub.AbstractStub<MetaDataServiceStub> {
    private MetaDataServiceStub(io.grpc.Channel channel) {
      super(channel);
    }

    private MetaDataServiceStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MetaDataServiceStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new MetaDataServiceStub(channel, callOptions);
    }

    /**
     */
    public void dataStatusList(com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getDataStatusListMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void changeDataPermission(com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getChangeDataPermissionMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void sqlData(com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getSqlDataMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void manipulateData(com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getManipulateDataMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void manipulateImportData(com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getManipulateImportDataMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void addDataAlias(com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getAddDataAliasMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void addDataAliasByDataKey(com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getAddDataAliasByDataKeyMethod(), getCallOptions()), request, responseObserver);
    }

    /**
     */
    public void removeDataAlias(com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage request,
        io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> responseObserver) {
      asyncUnaryCall(
          getChannel().newCall(getRemoveDataAliasMethod(), getCallOptions()), request, responseObserver);
    }
  }

  /**
   */
  public static final class MetaDataServiceBlockingStub extends io.grpc.stub.AbstractStub<MetaDataServiceBlockingStub> {
    private MetaDataServiceBlockingStub(io.grpc.Channel channel) {
      super(channel);
    }

    private MetaDataServiceBlockingStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MetaDataServiceBlockingStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new MetaDataServiceBlockingStub(channel, callOptions);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage dataStatusList(com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage request) {
      return blockingUnaryCall(
          getChannel(), getDataStatusListMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage changeDataPermission(com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage request) {
      return blockingUnaryCall(
          getChannel(), getChangeDataPermissionMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage sqlData(com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage request) {
      return blockingUnaryCall(
          getChannel(), getSqlDataMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage manipulateData(com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage request) {
      return blockingUnaryCall(
          getChannel(), getManipulateDataMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage manipulateImportData(com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage request) {
      return blockingUnaryCall(
          getChannel(), getManipulateImportDataMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage addDataAlias(com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage request) {
      return blockingUnaryCall(
          getChannel(), getAddDataAliasMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage addDataAliasByDataKey(com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage request) {
      return blockingUnaryCall(
          getChannel(), getAddDataAliasByDataKeyMethod(), getCallOptions(), request);
    }

    /**
     */
    public com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage removeDataAlias(com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage request) {
      return blockingUnaryCall(
          getChannel(), getRemoveDataAliasMethod(), getCallOptions(), request);
    }
  }

  /**
   */
  public static final class MetaDataServiceFutureStub extends io.grpc.stub.AbstractStub<MetaDataServiceFutureStub> {
    private MetaDataServiceFutureStub(io.grpc.Channel channel) {
      super(channel);
    }

    private MetaDataServiceFutureStub(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      super(channel, callOptions);
    }

    @java.lang.Override
    protected MetaDataServiceFutureStub build(io.grpc.Channel channel,
        io.grpc.CallOptions callOptions) {
      return new MetaDataServiceFutureStub(channel, callOptions);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> dataStatusList(
        com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getDataStatusListMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> changeDataPermission(
        com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getChangeDataPermissionMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> sqlData(
        com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getSqlDataMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> manipulateData(
        com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getManipulateDataMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> manipulateImportData(
        com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getManipulateImportDataMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> addDataAlias(
        com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getAddDataAliasMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> addDataAliasByDataKey(
        com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getAddDataAliasByDataKeyMethod(), getCallOptions()), request);
    }

    /**
     */
    public com.google.common.util.concurrent.ListenableFuture<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage> removeDataAlias(
        com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage request) {
      return futureUnaryCall(
          getChannel().newCall(getRemoveDataAliasMethod(), getCallOptions()), request);
    }
  }

  private static final int METHODID_DATA_STATUS_LIST = 0;
  private static final int METHODID_CHANGE_DATA_PERMISSION = 1;
  private static final int METHODID_SQL_DATA = 2;
  private static final int METHODID_MANIPULATE_DATA = 3;
  private static final int METHODID_MANIPULATE_IMPORT_DATA = 4;
  private static final int METHODID_ADD_DATA_ALIAS = 5;
  private static final int METHODID_ADD_DATA_ALIAS_BY_DATA_KEY = 6;
  private static final int METHODID_REMOVE_DATA_ALIAS = 7;

  private static final class MethodHandlers<Req, Resp> implements
      io.grpc.stub.ServerCalls.UnaryMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ServerStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.ClientStreamingMethod<Req, Resp>,
      io.grpc.stub.ServerCalls.BidiStreamingMethod<Req, Resp> {
    private final MetaDataServiceImplBase serviceImpl;
    private final int methodId;

    MethodHandlers(MetaDataServiceImplBase serviceImpl, int methodId) {
      this.serviceImpl = serviceImpl;
      this.methodId = methodId;
    }

    @java.lang.Override
    @java.lang.SuppressWarnings("unchecked")
    public void invoke(Req request, io.grpc.stub.StreamObserver<Resp> responseObserver) {
      switch (methodId) {
        case METHODID_DATA_STATUS_LIST:
          serviceImpl.dataStatusList((com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_CHANGE_DATA_PERMISSION:
          serviceImpl.changeDataPermission((com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_SQL_DATA:
          serviceImpl.sqlData((com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_MANIPULATE_DATA:
          serviceImpl.manipulateData((com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_MANIPULATE_IMPORT_DATA:
          serviceImpl.manipulateImportData((com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_ADD_DATA_ALIAS:
          serviceImpl.addDataAlias((com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_ADD_DATA_ALIAS_BY_DATA_KEY:
          serviceImpl.addDataAliasByDataKey((com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
          break;
        case METHODID_REMOVE_DATA_ALIAS:
          serviceImpl.removeDataAlias((com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage) request,
              (io.grpc.stub.StreamObserver<com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage>) responseObserver);
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

  private static abstract class MetaDataServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoFileDescriptorSupplier, io.grpc.protobuf.ProtoServiceDescriptorSupplier {
    MetaDataServiceBaseDescriptorSupplier() {}

    @java.lang.Override
    public com.google.protobuf.Descriptors.FileDescriptor getFileDescriptor() {
      return com.samsung.sds.brightics.common.network.proto.metadata.MetaDataProto.getDescriptor();
    }

    @java.lang.Override
    public com.google.protobuf.Descriptors.ServiceDescriptor getServiceDescriptor() {
      return getFileDescriptor().findServiceByName("MetaDataService");
    }
  }

  private static final class MetaDataServiceFileDescriptorSupplier
      extends MetaDataServiceBaseDescriptorSupplier {
    MetaDataServiceFileDescriptorSupplier() {}
  }

  private static final class MetaDataServiceMethodDescriptorSupplier
      extends MetaDataServiceBaseDescriptorSupplier
      implements io.grpc.protobuf.ProtoMethodDescriptorSupplier {
    private final String methodName;

    MetaDataServiceMethodDescriptorSupplier(String methodName) {
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
      synchronized (MetaDataServiceGrpc.class) {
        result = serviceDescriptor;
        if (result == null) {
          serviceDescriptor = result = io.grpc.ServiceDescriptor.newBuilder(SERVICE_NAME)
              .setSchemaDescriptor(new MetaDataServiceFileDescriptorSupplier())
              .addMethod(getDataStatusListMethod())
              .addMethod(getChangeDataPermissionMethod())
              .addMethod(getSqlDataMethod())
              .addMethod(getManipulateDataMethod())
              .addMethod(getManipulateImportDataMethod())
              .addMethod(getAddDataAliasMethod())
              .addMethod(getAddDataAliasByDataKeyMethod())
              .addMethod(getRemoveDataAliasMethod())
              .build();
        }
      }
    }
    return result;
  }
}
