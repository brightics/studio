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

package com.samsung.sds.brightics.agent.network.receiver;

import java.util.UUID;

import org.apache.commons.lang3.exception.ExceptionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.network.listener.ReceiveMessageListener;
import com.samsung.sds.brightics.agent.service.StreamService;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.network.proto.stream.ByteStreamMessage;
import com.samsung.sds.brightics.common.network.proto.stream.ReadMessage;
import com.samsung.sds.brightics.common.network.proto.stream.StreamServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.stream.WriteMessage;

import io.grpc.stub.StreamObserver;

public class StreamReceiver extends StreamServiceGrpc.StreamServiceImplBase {

	private static final Logger logger = LoggerFactory.getLogger(StreamReceiver.class);

	private final ReceiveMessageListener listener;

	public StreamReceiver(ReceiveMessageListener listener) {
		this.listener = listener;
	}
	
	@Override
	public void readStreamDone(ReadMessage message, StreamObserver<ReadMessage> responseObserver) {
		String key = listener.receive(message);
		try {
			StreamService.readStreamDone(message);
			responseObserver.onNext(ReadMessage.newBuilder().build());
			responseObserver.onCompleted();
		} catch (Exception e) {
			logger.error("Cannot read file", e);
			responseObserver.onError(e);
		}
		listener.onCompleted(key);
	}
	
	@Override
	public void readStream(ReadMessage message, StreamObserver<ByteStreamMessage> responseObserver) {
		String key = listener.receive(message);
		ThreadLocalContext.put("user", message.getUser());
		logger.info("[Common network] receive read file : " + message.toString() + ", user : " + message.getUser());

		StreamService.readFile(message, responseObserver);

		listener.onCompleted(key);
	}
	


	@Override
	public void writeStreaminitializer(WriteMessage message, StreamObserver<WriteMessage> responseObserver) {
		logger.info("[Common network] write read steam : " + message.toString() + ", user : " + message.getUser());
		String key = UUID.randomUUID().toString();
		listener.receiveWithKey(key, message);
		ThreadLocalContext.put("user", message.getUser());

		try {
			StreamService.initWriteData(key, message);
			responseObserver.onNext(WriteMessage.newBuilder().setTempKey(key).build());
			responseObserver.onCompleted();
		} catch (Exception e) {
			logger.error("Cannot write file", e);
			responseObserver.onNext(WriteMessage.newBuilder().setErrorMessage(ExceptionUtils.getStackTrace(e)).build());
			responseObserver.onError(e);
		}
	}

	@Override
	public StreamObserver<ByteStreamMessage> writeStream(StreamObserver<WriteMessage> responseObserver) {
		return new StreamObserver<ByteStreamMessage>() {
			String tempKey;
			boolean isClear = true;
			@Override
			public void onNext(ByteStreamMessage value) {
				tempKey = value.getTempKey();
				try {
					StreamService.writeData(tempKey, value.getData());
	                responseObserver.onNext(WriteMessage.newBuilder().setParameters("done").build());
				} catch (Throwable e) {
					logger.error("Cannot write file", e);
					responseObserver.onNext(WriteMessage.newBuilder().setErrorMessage(ExceptionUtils.getStackTrace(e)).build());
					isClear = false;
				}
			}

			@Override
			public void onError(Throwable t) {
				try {
					logger.error("[Common network] fail to write file stream.", t);
					StreamService.writeClose(tempKey, false);
				} finally {
					listener.onCompleted(tempKey);
				}
			}

			@Override
			public void onCompleted() {
				try {
					logger.info("[Common network] complete to write file stream.");
					StreamService.writeClose(tempKey, isClear);
					if(isClear) {
						responseObserver.onCompleted();
					}
				} finally {
					listener.onCompleted(tempKey);
				}
			}
		};
	}

}
