package com.samsung.sds.brightics.agent.network.receiver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.agent.network.listener.ReceiveMessageListener;
import com.samsung.sds.brightics.agent.service.DatabaseService;
import com.samsung.sds.brightics.common.core.exception.AbsBrighticsException;
import com.samsung.sds.brightics.common.core.thread.ThreadLocalContext;
import com.samsung.sds.brightics.common.network.proto.MessageStatus;
import com.samsung.sds.brightics.common.network.proto.database.DatabaseServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.database.ExecuteDBMessage;
import com.samsung.sds.brightics.common.network.proto.database.ResultDBMessage;

import io.grpc.stub.StreamObserver;

public class DatabaseReceiver extends DatabaseServiceGrpc.DatabaseServiceImplBase {
	
	private static final Logger logger = LoggerFactory.getLogger(DatabaseReceiver.class);
	private final ReceiveMessageListener listener;
	
	public DatabaseReceiver(ReceiveMessageListener listener) {
		this.listener = listener;
	}
	
	@Override
	public void receiveDatabaseInfo(ExecuteDBMessage request, StreamObserver<ResultDBMessage> responseObserver) {
		String key = listener.receive(request);
		ThreadLocalContext.put("user", request.getUser());
		logger.info("[Database receiver] receive database info : " + request.toString() + ", user : " + request.getUser());
		try {
			String result = DatabaseService.getDatabaseInfo(request);
			responseObserver.onNext(ResultDBMessage.newBuilder().setMessageStatus(MessageStatus.SUCCESS).setResult(result).build());
		} catch (AbsBrighticsException e) {
			logger.error("[Database receiver] Cannot get database info.", e);
			responseObserver.onNext(ResultDBMessage.newBuilder().setMessageStatus(MessageStatus.FAIL)
					.setMessage(e.getMessage()).setMessage(e.detailedCause).build());
		} finally {
			responseObserver.onCompleted();
			listener.onCompleted(key);
		}
	}

}
