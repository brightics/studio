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

package com.samsung.sds.brightics.common.network.test.receiver.client;

import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.ByteString;
import com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage;
import com.samsung.sds.brightics.common.network.proto.stream.ReadMessage;
import com.samsung.sds.brightics.common.network.proto.stream.StreamServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;

import io.grpc.stub.StreamObserver;

public class StreamReceiver extends StreamServiceGrpc.StreamServiceImplBase {

    private static final Logger logger = LoggerFactory.getLogger(StreamReceiver.class);

    @Override
    public void readStream(ReadMessage request, StreamObserver<ByteStreamMessage> responseObserver) {
        logger.info(Thread.currentThread().getName());
        try {
            // request to input stream
        	String fileName = request.getKey();
        	
            InputStream inputStream = new FileInputStream(fileName +".txt");
            byte[] buffer = new byte[4096];
            int bytesRead = -1;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                responseObserver.onNext(
                        ByteStreamMessage.newBuilder().setData(ByteString.copyFrom(buffer, 0, bytesRead)).build());
            }
            inputStream.close();
        } catch (Exception e) {
            logger.error("[Common network] fail to send input stream.", e);
            responseObserver.onError(e);
        } finally {
        	logger.info("[Common network] complete to send input stream.");
            responseObserver.onCompleted();
        }
    }

    public Map<String, OutputStream> writers = new ConcurrentHashMap<>();

    @Override
    public void writeStreaminitializer(WriteMessage request, StreamObserver<WriteMessage> responseObserver) {
        // how to stream build
        String key = UUID.randomUUID().toString();
        try {
        	String filename = request.getPath();
            writers.put(key, new BufferedOutputStream(new FileOutputStream(filename)));
            responseObserver.onNext(WriteMessage.newBuilder().setTempKey(key).build());
            responseObserver.onCompleted();
        } catch (FileNotFoundException e) {
            responseObserver.onError(e);
        }
    }

    @Override
    public StreamObserver<ByteStreamMessage> writeStream(StreamObserver<WriteMessage> responseObserver) {
        // how to stream build
        return new StreamObserver<ByteStreamMessage>() {
            String key;
            OutputStream outputStream;

            @Override
            public void onNext(ByteStreamMessage value) {
                key = value.getTempKey();
                outputStream = writers.get(key);
                try {
                    ByteString data = value.getData();
                    data.writeTo(outputStream);
                } catch (IOException e) {
                    responseObserver.onNext(WriteMessage.newBuilder().build());
                    responseObserver.onError(e);
                }
            }

            @Override
            public void onError(Throwable t) {
                writers.remove(key);
                responseObserver.onNext(WriteMessage.newBuilder().build());
                responseObserver.onError(t);
            }

            @Override
            public void onCompleted() {
                try {
                    outputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
                writers.remove(key);
                responseObserver.onNext(WriteMessage.newBuilder().build());
                responseObserver.onCompleted();
            }
        };
    }
}
