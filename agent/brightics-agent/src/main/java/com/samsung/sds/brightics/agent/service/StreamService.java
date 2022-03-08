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

package com.samsung.sds.brightics.agent.service;

import java.io.*;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import com.google.protobuf.Any;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.util.SystemEnvUtil;
import com.samsung.sds.brightics.common.network.proto.FailResult;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.stream.*;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.exception.ExceptionUtils;
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
import com.samsung.sds.brightics.common.network.util.ByteStreamSender;

import io.grpc.stub.StreamObserver;

public class StreamService {

    private static final Logger logger = LoggerFactory.getLogger(StreamService.class);
    /**
     * store ArrayBlockingQueue for control data stream speed between server and client.
     */
    private static Map<String, ArrayBlockingQueue<Boolean>> blockingQueueMap = new ConcurrentHashMap<>();


    public static void readStreamDone(ReadMessage message) {
        if(blockingQueueMap.containsKey(message.getTempKey())){
            logger.debug("Read stream done from server.");
            blockingQueueMap.get(message.getTempKey()).poll();
        }
    }

    public static void readFile(ReadMessage message, StreamObserver<ByteStreamMessage> responseObserver) {
        String tempKey = UUID.randomUUID().toString();
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

            // Make it configurable. Max gRPC message size(32Mb) X this num. = max direct memory consumption for the client.
            final int MAX_UPLOAD_BUFFERS = Integer.parseInt(SystemEnvUtil.getEnvOrPropOrElse(
                    "GRPC_STREAM_MAX_UPLOAD_BUFFERS", "grpc.stream.maxbuffer", Integer.toString(8)));
            ArrayBlockingQueue<Boolean> writeQueue = new ArrayBlockingQueue<>(MAX_UPLOAD_BUFFERS);
            blockingQueueMap.put(tempKey, writeQueue);

            ByteStreamSender byteStreamSender = new ByteStreamSender(responseObserver, tempKey, writeQueue);
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
            blockingQueueMap.remove(tempKey);
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

    //add on function for deep learning.

    private static Collection<? extends File> listCheckpointData(java.nio.file.Path mutablePath) {
        // Representative path is not actual and it denotes basename and stem num
        String nameToken = mutablePath.getFileName().toString();
        java.nio.file.Path parentPath = mutablePath.getParent();
        File parent = parentPath.toFile();
        String[] files = parent.list(new FilenameFilter() {
            @Override
            public boolean accept(File dir, String name) {
                return name.startsWith(nameToken+".");
            }
        });
        List<File> result = new ArrayList<>();
        if(files != null) {
            for (String fName : files) {
                result.add(parentPath.resolve(fName).toFile());
            }
        }
        return result;
    }

    public static ResultMessage download(DownloadMessage message) {
        try {
            List<File> target = StreamService.getTargetCheckpointFiles(message.getPath());
            if(target.size() > 0){
                List<String> result = target.stream().map(f -> f.getName()).collect(Collectors.toList());
                return getSuccessResult(result);
            }else {
                return getFailResult(new BrighticsCoreException("3102","Failed to test downloading checkpoints."));
            }
        } catch (Exception e) {
            logger.error("Cannot check model files to download.", e);
            return getFailResult(new BrighticsCoreException("3102","Failed to test downloading checkpoints.").addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    public static void readCheckpoint(ReadCheckpointMessage message, StreamObserver<ByteStreamMessage> responseObserver) {
        try {
            List<File> target = getTargetCheckpointFiles(message.getPath());

            if(target.size() > 0) {
                ByteStreamSender byteStreamSender = new ByteStreamSender(responseObserver, "");

                int bufferSize = 65535;
                ByteArrayOutputStream bos = new ByteArrayOutputStream(bufferSize);
                ZipOutputStream zipOut = new ZipOutputStream(bos);
                for (File fileToZip : target) {
                    try (FileInputStream fis = new FileInputStream(fileToZip)) {
                        ZipEntry zipEntry = new ZipEntry(fileToZip.getName());
                        zipOut.putNextEntry(zipEntry);

                        byte[] bytes = new byte[bufferSize];
                        int length;
                        while ((length = fis.read(bytes)) >= 0) {
                            zipOut.write(bytes, 0, length);
                            zipOut.flush();
                            byteStreamSender.send(bos.toByteArray());
                            bos.reset();
                        }
                    } catch (Exception e) {
                        zipOut.close();
                        byteStreamSender.send(bos.toByteArray());
                        bos.close();
                        byteStreamSender.close();
                        throw e;
                    }
                }
                zipOut.close();
                // Write footer after ZipOutputStream closed
                byteStreamSender.send(bos.toByteArray());
                bos.close();

                byteStreamSender.close();
                responseObserver.onCompleted();
            } else {
                throw new BrighticsCoreException("There are no checkpoints.");
            }
        } catch (Exception e) {
            logger.error("[Common network] fail to send file stream.", e);
            responseObserver.onError(e);
        } finally {
            logger.info("[Common network] complete to send file stream.");
        }
    }

    public static List<File> getTargetCheckpointFiles(String path) throws IOException {
        List<File> target = new ArrayList<>();
        java.nio.file.Path mutablePath = Paths.get(FilenameUtils.normalize(path));
        if(!mutablePath.isAbsolute()){
            // to AbsolutePath
            // For pre-traind model download
            mutablePath = Paths.get(SystemEnvUtil.BRTC_DL_WORKSPACE, FilenameUtils.normalize(path));
        }
        File modelHint = mutablePath.toFile();
        if(modelHint.exists()){
            if(modelHint.isDirectory()){
                // First find checkpoint file
                File checkpoint = mutablePath.resolve("checkpoint").toFile();
                if(checkpoint.exists() && checkpoint.isFile()){
                    //processing checkpoint file
                    BufferedReader reader = new BufferedReader(new FileReader(checkpoint));
                    try {
                        String modelCheckpointPath = reader.readLine();
                        String baseNameWithStepNum = modelCheckpointPath.substring(modelCheckpointPath.indexOf("\"") + 1, modelCheckpointPath.lastIndexOf("\""));
                        target.addAll(listCheckpointData(mutablePath.resolve(baseNameWithStepNum)));
                    }catch (Exception e){
                        throw e;
                    } finally {
                        reader.close();
                    }
                } else {
                    // find last step number when the checkpoint index is not found.
                    throw new BrighticsCoreException("The file which name is 'checkpoint' is not found.");
                }
            } else {
                // There is the checkpoint file without meta and index.
                target.add(modelHint);
            }
        } else {
            target.addAll(listCheckpointData(mutablePath));
            // /path/to/model.ckpt-500.* actually it does not exists.
        }
        return target;
    }

    private static ResultMessage getSuccessResult(Object result) {
        try {
            SuccessResult build = SuccessResult.newBuilder().setResult(JsonUtil.toJson(result)).build();
            return ResultMessage.newBuilder().setMessageStatus(MessageStatus.SUCCESS).setResult(Any.pack(build)).build();
        } catch (Exception e) {
            return getFailResult(new BrighticsCoreException("3102", "error in processing json")
                    .addDetailMessage(ExceptionUtils.getStackTrace(e)));
        }
    }

    private static ResultMessage getFailResult(AbsBrighticsException e) {
        logger.error("[Meta data detail error message]", e);
        FailResult.Builder failResult = FailResult.newBuilder().setMessage(e.getMessage());
        if (StringUtils.isNoneBlank(e.detailedCause)) {
            failResult.setDetailMessage(e.detailedCause);
        }
        return ResultMessage.newBuilder().setMessageStatus(MessageStatus.FAIL).setResult(Any.pack(failResult.build()))
                .build();
    }
}
