package com.samsung.sds.brightics.common.network.sender;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.CountDownLatch;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.ByteString;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.network.config.NetworkConfig;
import com.samsung.sds.brightics.common.network.proto.ClientReadyMessage;
import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc.CommonServiceBlockingStub;
import com.samsung.sds.brightics.common.network.proto.HeartbeatMessage;
import com.samsung.sds.brightics.common.network.proto.database.DatabaseServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.database.DatabaseServiceGrpc.DatabaseServiceBlockingStub;
import com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage;
import com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage;
import com.samsung.sds.brightics.common.network.proto.deeplearning.DeeplearningServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.deeplearning.DeeplearningServiceGrpc.DeeplearningServiceBlockingStub;
import com.samsung.sds.brightics.common.network.proto.deeplearning.ExecuteDLMessage;
import com.samsung.sds.brightics.common.network.proto.deeplearning.ResultDLMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasByDataKeyMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataAliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataPermissionMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.DataStatusListMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ExecuteSqlMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ImportDataMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.MetaDataServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.metadata.MetaDataServiceGrpc.MetaDataServiceBlockingStub;
import com.samsung.sds.brightics.common.network.proto.metadata.RemoveDataAliasMessage;
import com.samsung.sds.brightics.common.network.proto.metadata.ResultDataMessage;
import com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage;
import com.samsung.sds.brightics.common.network.proto.stream.ReadMessage;
import com.samsung.sds.brightics.common.network.proto.stream.StreamServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.StopTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.TaskServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.task.TaskServiceGrpc.TaskServiceBlockingStub;
import com.samsung.sds.brightics.common.network.util.ByteStreamSender;

import io.grpc.ManagedChannel;
import io.grpc.stub.StreamObserver;

/**
 * This class is java specific gRPC message sender class
 * that initialize client channel and send gRPC message to client.
 *
 * if network configuration contain heart beat check process,
 * start to check connection of client.
 *
 * @author hk.im
 */
public class MessageSender {

    private static final Logger logger = LoggerFactory.getLogger(MessageSender.class);

    private CommonServiceBlockingStub commonBlockingStub;
    private TaskServiceBlockingStub taskBlockingStub;
    private MetaDataServiceBlockingStub metaDataBlockingStub;
    private DatabaseServiceBlockingStub databaseBlockingStub;
    private DeeplearningServiceBlockingStub deeplearningBlockingStub;

    private ManagedChannel channel;
    private NetworkConfig config;
    private String clientId = "Client_" + UUID.randomUUID();
    private boolean isTerminate = false;


    public MessageSender(String clientId, ManagedChannel channel, NetworkConfig config) {
        this(channel, config);
        this.clientId = clientId;
    }

    public MessageSender(ManagedChannel channel, NetworkConfig config) {
        this.channel = channel;
        this.config = config;

        this.commonBlockingStub = CommonServiceGrpc.newBlockingStub(channel);
        this.taskBlockingStub = TaskServiceGrpc.newBlockingStub(channel);
        this.metaDataBlockingStub = MetaDataServiceGrpc.newBlockingStub(channel);
        this.databaseBlockingStub = DatabaseServiceGrpc.newBlockingStub(channel);
        this.deeplearningBlockingStub = DeeplearningServiceGrpc.newBlockingStub(channel);

        if (config.getIsCheckHeartbeat()) {
            Thread thread = new Thread(heartbeatRunnable());
            thread.start();
        }
    }

    public boolean isTerminated() {
        return isTerminate;
    }

    public void sendClientReady(ClientReadyMessage message) {
        commonBlockingStub.receiveClientReady(message);
    }

    public void sendAsyncTask(ExecuteTaskMessage message) {
        taskBlockingStub.receiveAsyncTask(message);
    }

    public ResultTaskMessage sendSyncTask(ExecuteTaskMessage message) {
        return taskBlockingStub.receiveSyncTask(message);
    }

    public void sendStopTask(StopTaskMessage message) {
        taskBlockingStub.stopTask(message);
    }

    public void sendTaskResult(ResultTaskMessage message) {
        taskBlockingStub.receiveTaskResult(message);
    }

    public ResultDBMessage sendDatabaseInfo(ExecuteDBMessage message) {
        return databaseBlockingStub.receiveDatabaseInfo(message);
    }

    public void sendMetaInfo(ResultTaskMessage message) {
        taskBlockingStub.receiveTaskResult(message);
    }

    public ResultDataMessage sendManipulateData(ExecuteDataMessage message) {
        return metaDataBlockingStub.manipulateData(message);
    }

    public ResultDataMessage sendManipulateImportData(ImportDataMessage message) {
        return metaDataBlockingStub.manipulateImportData(message);
    }

    public ResultDataMessage sendSqlData(ExecuteSqlMessage message) {
        return metaDataBlockingStub.sqlData(message);
    }

    public void addDataAlias(DataAliasMessage message) {
        metaDataBlockingStub.addDataAlias(message);
    }

    public void sendFile(WriteMessage writeMessage, InputStream inputstream, boolean isSchemaRemove) throws Exception {
        WriteMessage writeStreamInitializer = StreamServiceGrpc.newBlockingStub(channel)
                .writeStreaminitializer(writeMessage);
        String tempKey = writeStreamInitializer.getTempKey();

		// TODO Make it configurable. Max gRPC message size(32Mb) X this num. = max direct memory consumption for the client.
		final int MAX_UPLOAD_BUFFERS=8;
        CountDownLatch doneSignal = new CountDownLatch(1);
		ArrayBlockingQueue<Boolean> writeQueue = new ArrayBlockingQueue<>(MAX_UPLOAD_BUFFERS);
        List<String> errorSignal = new ArrayList<>();

        StreamObserver<ByteStreamMessage> writeObserver = StreamServiceGrpc.newStub(channel)
                .writeStream(new StreamObserver<WriteMessage>() {
                    @Override
                    public void onNext(WriteMessage value) {
                        if (StringUtils.isNoneBlank(value.getErrorMessage())) { //receive error
                        	doneSignal.countDown();
                            errorSignal.add(value.getErrorMessage());
                          } else if("done".equals(value.getParameters())){
                              logger.debug("Partial data written complete.");
                              writeQueue.poll();
                        }
                    }

                    @Override
                    public void onError(Throwable e) {
                        logger.error("[Common network] fail to send data stream.", e);
                        doneSignal.countDown();
                        errorSignal.add(e.getMessage());
                    }

                    @Override
                    public void onCompleted() {
                        logger.info("[Common network] success to send data stream");
                        doneSignal.countDown();
                    }
                });
        ByteStreamSender byteStreamSender = new ByteStreamSender(writeObserver, tempKey, writeQueue);
        try {
            BufferedReader lineBuffer = new BufferedReader(new InputStreamReader(inputstream, "UTF-8"));
            String line;
            if (isSchemaRemove) { //remove first schemaLine
                lineBuffer.readLine();
            }
            while ((line = lineBuffer.readLine()) != null
                    && doneSignal.getCount() > 0) {
                byteStreamSender.addLineToBuffer(line + "\n");
            }
            byteStreamSender.close();
            writeObserver.onCompleted();
        } catch (Exception e) {
            logger.error("[Common network] fail to send data stream.", e);
            writeObserver.onError(e);
            throw e;
        } finally {
            doneSignal.await();
            inputstream.close();
        }

        if (errorSignal.size() > 0) {
            throw new BrighticsCoreException("3401").addDetailMessage(errorSignal.get(0));
        }
    }

    public void receiveFile(ReadMessage request, OutputStream outputstream) {
        String key = request.getKey();
        CountDownLatch doneSignal = new CountDownLatch(1);
        List<String> errorSignal = new ArrayList<>();

        StreamServiceGrpc.newStub(channel).readStream(request, new StreamObserver<ByteStreamMessage>() {
            @Override
            public void onNext(ByteStreamMessage value) {
                try {
                    ByteString data = value.getData();
                    data.writeTo(outputstream);
                } catch (Exception e) {
                    logger.error("[Common network] fail to write data stream.", e);
                }
            }

            @Override
            public void onError(Throwable e) {
                logger.error(String.format("[Common network] fail to receive file. key : %s", key), e);
                errorSignal.add(key);
                doneSignal.countDown();
            }

            @Override
            public void onCompleted() {
                logger.info(String.format("[Common network] complete to receive file. key : %s", key));
                doneSignal.countDown();
            }
        });

        try {
            doneSignal.await(); //wait for the count = 0
        } catch (InterruptedException e) {
            logger.error("[Common network] Interrupted to receive file.", e);
        }
        if (errorSignal.size() > 0) {
            throw new BrighticsCoreException("3402", "file key is " + errorSignal.get(0));
        }
    }

    private Runnable heartbeatRunnable() {
        return () -> {
            try {
                while (!isTerminate) {
                    Thread.sleep(config.getHeartbeatTime());
                    commonBlockingStub.receiveHeartbeat(HeartbeatMessage.newBuilder().build());
                }
            } catch (Exception e) {
                logger.error("Client is terminated");
                if (config.getTerminateListener() != null) {
                    config.getTerminateListener().terminate(clientId);
                }
                isTerminate = true;
            }
        };
    }

    public ResultDataMessage sendDataStatusList(DataStatusListMessage message) {
        return metaDataBlockingStub.dataStatusList(message);
    }

    public ResultDataMessage sendChangeDataPermission(DataPermissionMessage message) {
        return metaDataBlockingStub.changeDataPermission(message);
    }

    public ResultDataMessage addDataAliasByDataKey(DataAliasByDataKeyMessage message) {
        return metaDataBlockingStub.addDataAliasByDataKey(message);
    }

    public ResultDataMessage removeDataAlias(RemoveDataAliasMessage message) {
        return metaDataBlockingStub.removeDataAlias(message);
    }

    public ResultDLMessage sendDeeplearningInfo(ExecuteDLMessage message) {
        return deeplearningBlockingStub.receiveDeeplearningInfo(message);
    }
}
