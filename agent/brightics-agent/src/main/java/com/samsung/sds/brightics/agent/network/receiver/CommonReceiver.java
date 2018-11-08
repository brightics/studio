package com.samsung.sds.brightics.agent.network.receiver;

import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.HeartbeatMessage;

import io.grpc.stub.StreamObserver;

public class CommonReceiver extends CommonServiceGrpc.CommonServiceImplBase {

	@Override
	public void receiveHeartbeat(HeartbeatMessage request, StreamObserver<HeartbeatMessage> responseObserver) {
		responseObserver.onNext(request);
		responseObserver.onCompleted();
	}
	
}
