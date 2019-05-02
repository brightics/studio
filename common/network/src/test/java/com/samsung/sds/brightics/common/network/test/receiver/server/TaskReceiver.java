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

package com.samsung.sds.brightics.common.network.test.receiver.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.protobuf.Any;
import com.google.protobuf.InvalidProtocolBufferException;
import com.samsung.sds.brightics.common.network.proto.SuccessResult;
import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.TaskServiceGrpc;

import io.grpc.stub.StreamObserver;

public class TaskReceiver extends TaskServiceGrpc.TaskServiceImplBase {

	private static final Logger logger = LoggerFactory.getLogger(TaskReceiver.class);

	@Override
	public void receiveTaskResult(ResultTaskMessage request, StreamObserver<ExecuteTaskMessage> responseObserver) {
		logger.info(Thread.currentThread().getName());
		Any result = request.getResult();
		try {
			SuccessResult unpack = result.unpack(SuccessResult.class);
			logger.info("receive task unpacked result : " + unpack.toString());
		} catch (InvalidProtocolBufferException e) {
			e.printStackTrace();
		}
		
		logger.info("receive task result : " + request.toString());
		responseObserver.onNext(ExecuteTaskMessage.newBuilder().build());
		responseObserver.onCompleted();
	}
	
}
