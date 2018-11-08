package com.samsung.sds.brightics.server.common.network.receiver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.NetworkContext;
import com.samsung.sds.brightics.common.network.proto.ClientReadyMessage;
import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc;
import com.samsung.sds.brightics.common.network.proto.HeartbeatMessage;

import io.grpc.stub.StreamObserver;

public class CommonReceiver extends CommonServiceGrpc.CommonServiceImplBase {

    private static final Logger logger = LoggerFactory.getLogger(CommonReceiver.class);

    private NetworkContext context;

    public CommonReceiver(NetworkContext context) {
        this.context = context;
    }

    @Override
    public void receiveHeartbeat(HeartbeatMessage request, StreamObserver<HeartbeatMessage> responseObserver) {
        responseObserver.onNext(request);
        responseObserver.onCompleted();
    }

    @Override
    public void receiveClientReady(ClientReadyMessage request, StreamObserver<ClientReadyMessage> responseObserver) {
        String clientId = request.getClientId();
        String clienthost = request.getClientHost();
        int clientPort = request.getClientPort();
        logger.info(String.format("Success to connect message service. client ID : %s", clientId));

        context.registerMultiSender(clientId, clienthost, clientPort);
        responseObserver.onNext(ClientReadyMessage.newBuilder().build());
        responseObserver.onCompleted();
    }

}
