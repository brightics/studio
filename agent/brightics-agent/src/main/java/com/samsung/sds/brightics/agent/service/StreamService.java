package com.samsung.sds.brightics.agent.service;

import java.io.IOException;
import java.util.Map;
import java.util.StringJoiner;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.parquet.hadoop.ParquetReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.ByteString;
import com.samsung.sds.brightics.agent.context.ContextManager;
import com.samsung.sds.brightics.agent.util.DataKeyUtil;
import com.samsung.sds.brightics.agent.util.ThreadUtil;
import com.samsung.sds.brightics.common.core.exception.BrighticsCoreException;
import com.samsung.sds.brightics.common.core.util.JsonUtil;
import com.samsung.sds.brightics.common.core.util.JsonUtil.JsonParam;
import com.samsung.sds.brightics.common.data.DataStatus;
import com.samsung.sds.brightics.common.data.client.FileClient;
import com.samsung.sds.brightics.common.data.parquet.reader.DefaultRecord;
import com.samsung.sds.brightics.common.data.parquet.reader.info.ParquetInformation;
import com.samsung.sds.brightics.common.data.parquet.reader.util.BrighticsParquetUtils;
import com.samsung.sds.brightics.common.data.util.AppendableParquetWriter;
import com.samsung.sds.brightics.common.data.view.Column;
import com.samsung.sds.brightics.common.network.proto.ContextType;
import com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage;
import com.samsung.sds.brightics.common.network.proto.stream.ReadMessage;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;
import com.samsung.sds.brightics.common.network.util.ByteStreamSender;

import io.grpc.stub.StreamObserver;

public class StreamService {

    private static final Logger logger = LoggerFactory.getLogger(StreamService.class);

    public static void readFile(ReadMessage message, StreamObserver<ByteStreamMessage> responseObserver) {
        try {
            String dataKey = message.getKey();
            String delimiter = message.getDelimiter();

            String user = ThreadUtil.getCurrentUser();
            DataStatus dataStatus = ContextManager.getCurrentUserContextSession().getDataStatus(dataKey);
            if (dataStatus.contextType == ContextType.SCALA) {
                ContextManager.getRunnerAsContext(ContextType.SCALA, user)
                        .writeData(dataKey, DataKeyUtil.getAbsolutePathByDataKey(dataKey));
            }

            if (dataStatus.contextType != ContextType.FILESYSTEM) {
                throw new BrighticsCoreException("3002", "file");
            }

            ByteStreamSender byteStreamSender = new ByteStreamSender(responseObserver, "");
            String path = dataStatus.path;

            ParquetInformation info = BrighticsParquetUtils.getParquetInformation(new Path(path), new Configuration());
            StringJoiner sj = new StringJoiner(delimiter, "", "\n");
            for (Column field : info.getSchema()) {
                sj.add(field.getColumnName());
            }
            byteStreamSender.addLineToBuffer(sj.toString());

            ParquetReader<DefaultRecord> reader = BrighticsParquetUtils.getReader(new Path(path));
            DefaultRecord record;
            while ((record = reader.read()) != null) {
                sj = new StringJoiner(delimiter, "", "\n");
                for (Object column : record.getValues()) {
                    sj.add(String.valueOf(column));
                }
                byteStreamSender.addLineToBuffer(sj.toString());
            }
            byteStreamSender.close();
            responseObserver.onCompleted();
        } catch (Exception e) {
            logger.error("[Common network] fail to send file stream.", e);
            responseObserver.onError(e);
        } finally {
            logger.info("[Common network] complete to send file stream.");
        }
    }

    /**
     * init data write
     */
    private static Map<String, AppendableParquetWriter> writers = new ConcurrentHashMap<>();

    public static void initWriteData(String tempKey, WriteMessage message) throws Exception {
        String key = message.getPath();
        String path = DataKeyUtil.getAbsolutePathByDataKey(key);

        logger.info("upload key : " + key);
        logger.info("upload path : " + path);

        JsonParam jsonToParam = JsonUtil.jsonToParam(message.getParameters());
        writers.put(tempKey,
                new AppendableParquetWriter(message.getUser(), jsonToParam.getOrDefault("delimiter", ","), jsonToParam.getOrDefault("columnname", "")
                        , jsonToParam.getOrDefault("columntype", ""), path, true, key));
    }

    public static void writeData(String tempKey, ByteString data) throws Throwable {
        logger.info("writeData, temp key : " + tempKey + "data size : " + data.toByteArray().length);
        AppendableParquetWriter dataWriter = writers.get(tempKey);
        dataWriter.append(data.toByteArray());
    }

    public static void writeClose(String tempKey, boolean isCompleted) {
        AppendableParquetWriter dataWriter = writers.get(tempKey);
        String user = dataWriter.user;
        String key = dataWriter.key;

        String outputDirectory = dataWriter.outputDirectory;

        logger.info("upload  close key : " + key);
        logger.info("upload close path : " + outputDirectory);

        if (isCompleted) {
            logger.info("put new file data status.");
            ContextManager.updateUserDataStatus(user, key, DataKeyUtil.getFirstWriteDataStatus(key, outputDirectory));
        }
        try {
            logger.info("close AppendableParquetWriter.");
            dataWriter.close();
            if (!isCompleted) {
				logger.info("remove abnormal uploaded file data.");
				try {
					if (FileClient.getFileSystem().exists(new Path(outputDirectory))) {
						FileClient.delete(outputDirectory);
					}
				} catch (IOException e) {
					logger.error("cannot remove abnormal uploaded file data.", e);
				}
			}
        } catch (IOException e) {
            logger.error("Cannot close DataWriter", e);
        }
    }

}
