package com.samsung.sds.brightics.common.network.test.receiver.server;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.samsung.sds.brightics.common.network.NetworkContext;
import com.samsung.sds.brightics.common.network.proto.ClientReadyMessage;
import com.samsung.sds.brightics.common.network.proto.CommonServiceGrpc;

import io.grpc.stub.StreamObserver;

public class CommonReceiver extends CommonServiceGrpc.CommonServiceImplBase {

    private static final Logger logger = LoggerFactory.getLogger(CommonReceiver.class);

    NetworkContext context;

    public CommonReceiver(NetworkContext context) {
        this.context = context;
    }

    @Override
    public void receiveClientReady(ClientReadyMessage request, StreamObserver<ClientReadyMessage> responseObserver) {
        String clientId = request.getClientId();
        String clienthost = request.getClientHost();
        int clientPort = request.getClientPort();
        context.registerMultiSender(clientId, clienthost, clientPort);
        logger.info(String.format("Succes to connect message service. client ID : %s", clientId));
        responseObserver.onNext(ClientReadyMessage.newBuilder().build());
        responseObserver.onCompleted();
    }
}
