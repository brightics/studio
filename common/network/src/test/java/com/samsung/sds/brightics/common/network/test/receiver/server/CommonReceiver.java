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
