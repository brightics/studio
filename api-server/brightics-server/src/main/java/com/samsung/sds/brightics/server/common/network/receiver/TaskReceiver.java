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
		logger.info("receive task result : " + request.toString());
		
		TaskMessageRepository.saveMessageResult(taskId, request);
		
		responseObserver.onNext(ExecuteTaskMessage.newBuilder().build());
		responseObserver.onCompleted();
	}

}
