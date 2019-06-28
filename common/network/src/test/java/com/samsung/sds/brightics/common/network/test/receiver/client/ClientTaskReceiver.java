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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.Any;
import com.google.protobuf.InvalidProtocolBufferException;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.TaskServiceGrpc;
import com.samsung.sds.brightics.common.network.sender.MessageSender;

import io.grpc.stub.StreamObserver;

public class ClientTaskReceiver extends TaskServiceGrpc.TaskServiceImplBase {

	private static final Logger logger = LoggerFactory.getLogger(ClientTaskReceiver.class);

	private MessageSender sender;

	public ClientTaskReceiver(MessageSender sender) {
		this.sender = sender;
	}

	@Override
	public void receiveAsyncTask(ExecuteTaskMessage request, StreamObserver<ExecuteTaskMessage> responseObserver) {
		logger.info("[Common network] receive async task : " + request.toString());
		String taskId = request.getTaskId();
		try {
			logger.info(request.toString());
			responseObserver.onNext(ExecuteTaskMessage.newBuilder().build());
			responseObserver.onCompleted();

			sender.sendTaskResult(
					ResultTaskMessage.newBuilder().setTaskId(taskId).setMessageStatus(MessageStatus.SUCCESS)
							.setResult(Any.pack(SuccessResult.newBuilder().setResult("SUCCESS").build())).build());

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void receiveSyncTask(ExecuteTaskMessage request, StreamObserver<ResultTaskMessage> responseObserver) {
		logger.info("[Common network] receive sync task : " + request.toString());
		try {
			Thread.sleep(1000);
			logger.info(request.toString());
			responseObserver.onNext(ResultTaskMessage.newBuilder().setMessageStatus(MessageStatus.SUCCESS)
					.setResult(Any.pack(SuccessResult.newBuilder().setResult("SUCCESS").build())).build());
			responseObserver.onCompleted();
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

	}

}
