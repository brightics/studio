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

package com.samsung.sds.brightics.server.common.network.receiver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.proto.task.ExecuteTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.ResultTaskMessage;
import com.samsung.sds.brightics.common.network.proto.task.TaskServiceGrpc;
import com.samsung.sds.brightics.server.common.message.task.TaskMessageRepository;

import io.grpc.stub.StreamObserver;

public class TaskReceiver extends TaskServiceGrpc.TaskServiceImplBase {

	private static final Logger logger = LoggerFactory.getLogger(TaskReceiver.class);

	@Override
	public void receiveTaskResult(ResultTaskMessage request, StreamObserver<ExecuteTaskMessage> responseObserver) {
		logger.info(Thread.currentThread().getName());
		String taskId = request.getTaskId();
		logger.info("Finished task ID : "+taskId);
		if(logger.isDebugEnabled()) {
			logger.debug("Received task result : " + request.toString());
		}
		
		TaskMessageRepository.saveMessageResult(taskId, request);
		
		responseObserver.onNext(ExecuteTaskMessage.newBuilder().build());
		responseObserver.onCompleted();
	}

}
