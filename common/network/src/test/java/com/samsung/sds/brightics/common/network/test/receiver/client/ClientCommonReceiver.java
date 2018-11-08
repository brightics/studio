package com.samsung.sds.brightics.common.network.test.receiver.client;

import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.HeartbeatMessage;

import io.grpc.stub.StreamObserver;

public class ClientCommonReceiver extends CommonServiceGrpc.CommonServiceImplBase {

	@Override
	public void receiveHeartbeat(HeartbeatMessage request, StreamObserver<HeartbeatMessage> responseObserver) {
	    responseObserver.onNext(request);
	    responseObserver.onCompleted();
	}
}
