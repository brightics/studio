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
